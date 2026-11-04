/*
 * Lex Boss — almacenamiento del progreso.
 *
 * Cada participante entra con nombre, correo y una clave personal.
 * - La clave nunca se guarda: solo un verificador derivado con PBKDF2-SHA-256
 *   (150.000 iteraciones, sal = correo), que sirve para comprobarla.
 * - Por defecto todo queda en este navegador (localStorage).
 * - "Código de continuación": el progreso cifrado con AES-GCM usando la clave,
 *   para seguir en otro equipo o navegador sin servidor.
 * - Registro central opcional: si config.js trae una URL, el progreso también
 *   se envía allá (ver docs/registro-central.md). Sin URL no sale nada del navegador.
 */
(function (global) {
  "use strict";

  var CLAVE_STORAGE = "lexboss:v1:usuarios";
  var ITERACIONES = 150000;
  var PREFIJO_CODIGO = "LEXBOSS1.";
  var VERSION_AVISO = "2026-11";

  function ErrorAcceso(codigo, mensaje) {
    var e = new Error(mensaje);
    e.codigo = codigo;
    return e;
  }

  function normalizarCorreo(correo) {
    return String(correo || "").trim().toLowerCase();
  }

  function correoValido(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo);
  }

  /* ---------- Codificación ---------- */

  function aBytes(texto) { return new TextEncoder().encode(texto); }
  function deBytes(bytes) { return new TextDecoder().decode(bytes); }

  function aHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), function (b) {
      return ("0" + b.toString(16)).slice(-2);
    }).join("");
  }

  function aBase64(bytes) {
    var s = "";
    var arr = new Uint8Array(bytes);
    for (var i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function deBase64(texto) {
    var t = String(texto).replace(/-/g, "+").replace(/_/g, "/");
    while (t.length % 4) t += "=";
    var s = atob(t);
    var out = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }

  function crearAlmacen(opciones) {
    opciones = opciones || {};
    var storage = opciones.storage || null;
    var cripto = opciones.crypto || (typeof crypto !== "undefined" ? crypto : null);
    var subtle = cripto && cripto.subtle;
    var buscar = opciones.fetch || (typeof fetch !== "undefined" ? fetch.bind(global) : null);
    var config = opciones.config || {};
    var urlCentral = config.registroCentral && config.registroCentral.url ? String(config.registroCentral.url) : "";
    var ahora = opciones.ahora || function () { return new Date().toISOString(); };
    var memoria = {};

    if (!subtle) throw new Error("Este navegador no permite cifrado (Web Crypto). Usa un navegador actualizado y una dirección https o localhost.");

    /* ---------- Lectura y escritura local ---------- */

    function leerTodos() {
      try {
        var crudo = storage ? storage.getItem(CLAVE_STORAGE) : memoria[CLAVE_STORAGE];
        var datos = crudo ? JSON.parse(crudo) : {};
        return datos && typeof datos === "object" ? datos : {};
      } catch (e) {
        return {};
      }
    }

    function escribirTodos(datos) {
      var texto = JSON.stringify(datos);
      try {
        if (storage) storage.setItem(CLAVE_STORAGE, texto);
        else memoria[CLAVE_STORAGE] = texto;
        return true;
      } catch (e) {
        memoria[CLAVE_STORAGE] = texto;
        return false;
      }
    }

    /* ---------- Criptografía ---------- */

    function derivarBits(clave, sal) {
      return subtle.importKey("raw", aBytes(clave), "PBKDF2", false, ["deriveBits", "deriveKey"])
        .then(function (base) {
          return subtle.deriveBits({ name: "PBKDF2", salt: sal, iterations: ITERACIONES, hash: "SHA-256" }, base, 256);
        });
    }

    function verificador(correo, clave) {
      return derivarBits(clave, aBytes("lexboss:v1:" + correo)).then(aHex);
    }

    function llaveCifrado(clave, sal) {
      return subtle.importKey("raw", aBytes(clave), "PBKDF2", false, ["deriveKey"]).then(function (base) {
        return subtle.deriveKey(
          { name: "PBKDF2", salt: sal, iterations: ITERACIONES, hash: "SHA-256" },
          base,
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt", "decrypt"]
        );
      });
    }

    /* ---------- Registro central opcional ---------- */

    function remoto(cuerpo) {
      if (!urlCentral || !buscar) return Promise.resolve(null);
      var control = typeof AbortController !== "undefined" ? new AbortController() : null;
      var reloj = control ? setTimeout(function () { control.abort(); }, 8000) : null;
      return buscar(urlCentral, {
        method: "POST",
        // text/plain evita la consulta previa CORS (OPTIONS), que Power Automate no atiende.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(cuerpo),
        signal: control ? control.signal : undefined
      }).then(function (r) {
        if (reloj) clearTimeout(reloj);
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      }).catch(function () {
        if (reloj) clearTimeout(reloj);
        return { ok: false, sinConexion: true };
      });
    }

    function sinSecretos(usuario) {
      return {
        nombre: usuario.nombre,
        correo: usuario.correo,
        creado: usuario.creado,
        actualizado: usuario.actualizado,
        ultimaVisita: usuario.ultimaVisita,
        consentimiento: usuario.consentimiento,
        progreso: usuario.progreso
      };
    }

    /* ---------- Operaciones públicas ---------- */

    function entrar(datos) {
      var nombre = String(datos.nombre || "").trim().replace(/\s+/g, " ");
      var correo = normalizarCorreo(datos.correo);
      var clave = String(datos.clave || "");
      if (nombre.length < 2) return Promise.reject(ErrorAcceso("nombre", "Escribe tu nombre."));
      if (!correoValido(correo)) return Promise.reject(ErrorAcceso("correo", "Escribe un correo válido."));
      if (clave.length < 6) return Promise.reject(ErrorAcceso("clave", "La clave debe tener al menos 6 caracteres."));

      return verificador(correo, clave).then(function (verif) {
        var todos = leerTodos();
        var local = todos[correo] || null;
        if (local && local.verificador !== verif) {
          throw ErrorAcceso("clave", "La clave no coincide con la registrada para este correo en este navegador.");
        }
        return remoto({ accion: "cargar", correo: correo, verificador: verif }).then(function (resp) {
          if (resp && resp.ok === false && resp.error === "clave") {
            throw ErrorAcceso("clave", "La clave no coincide con la registrada en el registro central.");
          }
          var central = resp && resp.ok && resp.registro ? resp.registro : null;
          var usuario = local;
          var origen = local ? "local" : null;
          if (central && (!local || String(central.actualizado || "") > String(local.actualizado || ""))) {
            usuario = Object.assign({}, central, { verificador: verif });
            origen = "central";
          }
          var nuevo = !usuario;
          if (nuevo) {
            if (!datos.consentimiento) {
              throw ErrorAcceso("consentimiento", "Para crear tu registro debes aceptar el aviso de privacidad.");
            }
            usuario = {
              nombre: nombre,
              correo: correo,
              verificador: verif,
              creado: ahora(),
              actualizado: ahora(),
              consentimiento: { fecha: ahora(), version: VERSION_AVISO },
              progreso: null
            };
            origen = "nuevo";
          }
          usuario.ultimaVisita = ahora();
          if (nombre && nombre !== usuario.nombre) usuario.nombre = nombre;
          todos[correo] = usuario;
          escribirTodos(todos);
          return {
            usuario: usuario,
            nuevo: nuevo,
            origen: origen,
            centralActivo: !!urlCentral,
            centralDisponible: !!(resp && resp.ok)
          };
        });
      });
    }

    function guardar(usuario) {
      usuario.actualizado = ahora();
      var todos = leerTodos();
      todos[usuario.correo] = usuario;
      var local = escribirTodos(todos);
      return remoto({
        accion: "guardar",
        correo: usuario.correo,
        verificador: usuario.verificador,
        registro: sinSecretos(usuario)
      }).then(function (resp) {
        return { local: local, central: resp ? !!resp.ok : null };
      });
    }

    function listar() {
      var todos = leerTodos();
      return Object.keys(todos).map(function (c) { return sinSecretos(todos[c]); });
    }

    function borrar(correo, clave) {
      correo = normalizarCorreo(correo);
      return verificador(correo, String(clave || "")).then(function (verif) {
        var todos = leerTodos();
        if (!todos[correo]) throw ErrorAcceso("correo", "No hay registro de ese correo en este navegador.");
        if (todos[correo].verificador !== verif) throw ErrorAcceso("clave", "La clave no coincide.");
        delete todos[correo];
        escribirTodos(todos);
        return remoto({ accion: "borrar", correo: correo, verificador: verif }).then(function () { return true; });
      });
    }

    function exportarCodigo(usuario, clave) {
      var sal = cripto.getRandomValues(new Uint8Array(16));
      var iv = cripto.getRandomValues(new Uint8Array(12));
      var datos = aBytes(JSON.stringify(sinSecretos(usuario)));
      return llaveCifrado(clave, sal).then(function (llave) {
        return subtle.encrypt({ name: "AES-GCM", iv: iv }, llave, datos);
      }).then(function (cifrado) {
        var paquete = { s: aBase64(sal), i: aBase64(iv), c: aBase64(cifrado) };
        return PREFIJO_CODIGO + aBase64(aBytes(JSON.stringify(paquete)));
      });
    }

    function importarCodigo(codigo, clave) {
      codigo = String(codigo || "").trim();
      if (codigo.indexOf(PREFIJO_CODIGO) !== 0) {
        return Promise.reject(ErrorAcceso("codigo", "Ese no parece un código de continuación de Lex Boss."));
      }
      var paquete;
      try {
        paquete = JSON.parse(deBytes(deBase64(codigo.slice(PREFIJO_CODIGO.length))));
      } catch (e) {
        return Promise.reject(ErrorAcceso("codigo", "El código está incompleto o dañado. Cópialo de nuevo completo."));
      }
      return llaveCifrado(String(clave || ""), deBase64(paquete.s)).then(function (llave) {
        return subtle.decrypt({ name: "AES-GCM", iv: deBase64(paquete.i) }, llave, deBase64(paquete.c));
      }).catch(function () {
        throw ErrorAcceso("clave", "No se pudo abrir el código: la clave no coincide.");
      }).then(function (plano) {
        var registro = JSON.parse(deBytes(new Uint8Array(plano)));
        return verificador(registro.correo, String(clave)).then(function (verif) {
          var todos = leerTodos();
          var local = todos[registro.correo];
          if (local && String(local.actualizado || "") > String(registro.actualizado || "") && local.verificador === verif) {
            return { usuario: local, reemplazado: false };
          }
          var usuario = Object.assign({}, registro, { verificador: verif });
          todos[registro.correo] = usuario;
          escribirTodos(todos);
          return { usuario: usuario, reemplazado: true };
        });
      });
    }

    return {
      entrar: entrar,
      guardar: guardar,
      listar: listar,
      borrar: borrar,
      exportarCodigo: exportarCodigo,
      importarCodigo: importarCodigo,
      centralActivo: function () { return !!urlCentral; },
      VERSION_AVISO: VERSION_AVISO
    };
  }

  var api = { crearAlmacen: crearAlmacen, normalizarCorreo: normalizarCorreo, correoValido: correoValido };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.Almacen = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
