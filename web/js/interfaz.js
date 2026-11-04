/*
 * Lex Boss — interfaz.
 * La mecánica está en logica.js, el guardado en almacen.js, el contenido en
 * contenido.js y los dibujos en dibujos.js. Aquí solo se pinta y se reacciona.
 */
(function () {
  "use strict";

  var C = window.Contenido;
  var L = window.LexBoss;
  var D = window.Dibujos;
  var $ = function (id) { return document.getElementById(id); };
  var NUM = new Intl.NumberFormat("es");
  var FECHA = new Intl.DateTimeFormat("es-CO", { dateStyle: "long" });

  var almacen = null;
  var usuario = null;
  var claveSesion = null; // solo en memoria, para generar el código de continuación
  var batalla = null;
  var moduloActual = null;
  var repasoActual = false;
  var esperandoSiguiente = false;

  try {
    almacen = window.Almacen.crearAlmacen({
      storage: (function () { try { return window.localStorage; } catch (e) { return null; } })(),
      config: window.LEXBOSS_CONFIG || {}
    });
  } catch (e) {
    $("mensaje-acceso").textContent = e.message;
    $("boton-entrar").disabled = true;
  }

  /* ---------------- Utilidades ---------------- */

  function mostrar(nombre) {
    ["acceso", "perfil", "mapa", "leccion", "batalla", "avance"].forEach(function (p) {
      $("pantalla-" + p).hidden = p !== nombre;
    });
    $("barra-usuario").hidden = !usuario || nombre === "acceso";
    window.scrollTo(0, 0);
    if (nombre === "mapa") pintarMapa();
    if (nombre === "avance") pintarAvance();
  }

  function abrir(id) { $(id).hidden = false; var b = $(id).querySelector("button, input, textarea"); if (b) b.focus(); }
  function cerrar(id) { $(id).hidden = true; }

  function el(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto !== undefined && texto !== null) e.textContent = texto;
    return e;
  }

  var relojAviso = null;
  function avisar(texto) {
    var a = $("aviso-guardado");
    a.textContent = texto;
    a.classList.add("visible");
    clearTimeout(relojAviso);
    relojAviso = setTimeout(function () { a.classList.remove("visible"); }, 2600);
  }

  function guardar(silencioso) {
    if (!usuario) return Promise.resolve();
    return almacen.guardar(usuario).then(function (r) {
      if (silencioso) return;
      if (r.central === false) avisar("Guardado en este navegador (el registro central no respondió).");
      else if (r.central === true) avisar("Avance guardado.");
      else avisar("Avance guardado en este navegador.");
    });
  }

  function descargar(nombre, texto, tipo) {
    var blob = new Blob(["﻿" + texto], { type: tipo || "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function csv(filas) {
    return filas.map(function (f) {
      return f.map(function (v) {
        var s = v === null || v === undefined ? "" : String(v);
        if (/^[=+\-@]/.test(s)) s = "'" + s; // evita fórmulas al abrir en Excel
        return '"' + s.replace(/"/g, '""') + '"';
      }).join(";");
    }).join("\r\n");
  }

  function fechaCorta(iso) {
    if (!iso) return "";
    try { return FECHA.format(new Date(iso)); } catch (e) { return iso; }
  }

  /* ---------------- Barra de usuario ---------------- */

  function pintarUsuario() {
    if (!usuario) return;
    var n = L.nivelDe(usuario.progreso.xp);
    $("usuario-nombre").textContent = usuario.nombre;
    $("usuario-titulo").textContent = n.titulo;
    $("usuario-nivel").textContent = n.nivel;
    var barra = $("barra-exp");
    barra.querySelector("span").style.width = (100 * n.actual / n.necesaria) + "%";
    barra.setAttribute("aria-valuemax", n.necesaria);
    barra.setAttribute("aria-valuenow", n.actual);
    barra.title = NUM.format(n.actual) + " de " + NUM.format(n.necesaria) + " puntos para el siguiente nivel";
  }

  /* ---------------- Acceso ---------------- */

  if (almacen && almacen.centralActivo()) {
    $("aviso-donde").innerHTML = "<b>Dónde se guardan:</b> en este navegador y en el registro central de la capacitación que administra la firma. Tu clave no se guarda: solo un valor derivado que permite comprobarla.";
  }

  $("ver-clave").addEventListener("click", function () {
    var c = $("acceso-clave");
    var ver = c.type === "password";
    c.type = ver ? "text" : "password";
    this.textContent = ver ? "Ocultar" : "Ver";
    this.setAttribute("aria-pressed", String(ver));
  });

  $("form-acceso").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var msg = $("mensaje-acceso");
    msg.textContent = "Verificando…";
    msg.className = "mensaje";
    $("boton-entrar").disabled = true;
    var clave = $("acceso-clave").value;
    almacen.entrar({
      nombre: $("acceso-nombre").value,
      correo: $("acceso-correo").value,
      clave: clave,
      consentimiento: $("acceso-consentimiento").checked
    }).then(function (r) {
      usuario = r.usuario;
      claveSesion = clave;
      usuario.progreso = L.normalizarProgreso(usuario.progreso);
      $("acceso-clave").value = "";
      msg.textContent = "";
      pintarUsuario();
      return guardar(true).then(function () {
        if (r.nuevo) avisar("¡Bienvenido(a)! Tu registro quedó creado.");
        else avisar("¡Hola de nuevo! Seguimos donde ibas.");
        if (!usuario.progreso.perfil) { pintarPerfiles(); mostrar("perfil"); }
        else mostrar("mapa");
      });
    }).catch(function (e) {
      msg.textContent = e.message || "No se pudo entrar.";
      msg.className = "mensaje error";
      if (e.codigo === "consentimiento") $("campo-consentimiento").classList.add("resaltar");
    }).then(function () {
      $("boton-entrar").disabled = false;
    });
  });

  $("form-importar").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var msg = $("mensaje-importar");
    msg.textContent = "Abriendo el código…";
    msg.className = "mensaje";
    almacen.importarCodigo($("importar-codigo").value, $("importar-clave").value).then(function (r) {
      $("acceso-nombre").value = r.usuario.nombre;
      $("acceso-correo").value = r.usuario.correo;
      $("acceso-clave").value = $("importar-clave").value;
      $("importar-clave").value = "";
      $("importar-codigo").value = "";
      msg.textContent = r.reemplazado
        ? "Avance recuperado. Entrando…"
        : "Este navegador ya tenía un avance más reciente; se conserva. Entrando…";
      $("form-acceso").requestSubmit();
    }).catch(function (e) {
      msg.textContent = e.message;
      msg.className = "mensaje error";
    });
  });

  $("boton-salir").addEventListener("click", function () {
    guardar(true).then(function () {
      usuario = null;
      claveSesion = null;
      batalla = null;
      $("acceso-consentimiento").checked = false;
      mostrar("acceso");
    });
  });

  /* ---------------- Perfiles ---------------- */

  function pintarPerfiles() {
    var lista = $("lista-perfiles");
    lista.innerHTML = "";
    Object.keys(L.PERFILES).forEach(function (id) {
      var pf = L.PERFILES[id];
      var b = el("button", "personaje");
      b.type = "button";
      if (usuario.progreso.perfil === id) b.classList.add("elegido");
      var s = el("div", "sprite");
      s.innerHTML = D.personaje(id, pf.nombre);
      b.appendChild(s);
      b.appendChild(el("p", "personaje-nombre", pf.nombre));
      b.appendChild(el("p", "nota", pf.ventaja));
      b.appendChild(el("p", "cifras", pf.corazones + " de credibilidad · " + pf.comodines + " consulta(s)"));
      b.addEventListener("click", function () {
        usuario.progreso.perfil = id;
        guardar(true);
        mostrar("mapa");
      });
      lista.appendChild(b);
    });
  }

  $("boton-cambiar-perfil").addEventListener("click", function () { pintarPerfiles(); mostrar("perfil"); });

  /* ---------------- Mapa ---------------- */

  function moduloRepaso() {
    var lista = L.preguntasPorRepasar(usuario.progreso, C.TODOS);
    return {
      id: "repaso",
      tema: "Repaso de lo que has fallado",
      jefe: "El Espectro del Repaso",
      forma: "fantasma",
      color: "amarilla",
      frase: "Vuelvo con todo lo que se te escapó...",
      leccion: ["Aquí vuelven las preguntas que respondiste mal la última vez. Acertarlas las marca como aprendidas."],
      preguntas: lista
    };
  }

  function pintarMapa() {
    pintarUsuario();
    var prog = usuario.progreso;
    var g = L.resumenGeneral(prog, C.TODOS);
    var r = $("resumen-mapa");
    r.innerHTML = "";
    [
      [g.superados + " / " + C.TODOS.length, "jefes vencidos"],
      [g.porcentaje + " %", "conceptos aprendidos"],
      [g.repasar, "por repasar"],
      [g.noVistas, "sin ver todavía"]
    ].forEach(function (d) {
      var t = el("div", "dato");
      t.appendChild(el("p", "dato-valor", String(d[0])));
      t.appendChild(el("p", "dato-etiqueta", d[1]));
      r.appendChild(t);
    });

    var mapa = $("mapa");
    mapa.innerHTML = "";
    var finalAbierto = L.finalDesbloqueado(prog, C.MODULOS);
    C.TODOS.forEach(function (m, i) {
      var res = L.resumenModulo(prog, m);
      var bloqueado = m.final && !finalAbierto;
      var li = el("li", "casilla" + (res.superado ? " superado" : "") + (bloqueado ? " bloqueado" : "") + (m.final ? " casilla-final" : ""));
      var b = el("button", "casilla-boton");
      b.type = "button";
      b.disabled = bloqueado;
      var s = el("div", "sprite sprite-mapa");
      s.innerHTML = D.jefe(m);
      b.appendChild(s);
      b.appendChild(el("p", "etiqueta", m.final ? "Jefe final" : "Jefe " + (i + 1)));
      b.appendChild(el("p", "casilla-tema", m.tema));
      b.appendChild(el("p", "casilla-jefe", m.jefe));
      var estado = el("p", "casilla-estado");
      if (bloqueado) estado.textContent = "Se abre al vencer a los 12 jefes";
      else if (res.superado) estado.textContent = "Vencido · " + res.porcentaje + " % aprendido";
      else if (res.noVistas === res.total) estado.textContent = "Sin empezar";
      else estado.textContent = res.porcentaje + " % aprendido · " + res.repasar + " por repasar";
      b.appendChild(estado);
      var barra = el("div", "barra barra-mini");
      var relleno = el("span");
      relleno.style.width = res.porcentaje + "%";
      barra.appendChild(relleno);
      b.appendChild(barra);
      b.setAttribute("aria-label", m.jefe + ". " + m.tema + ". " + estado.textContent);
      b.addEventListener("click", function () { abrirLeccion(m, false); });
      li.appendChild(b);
      mapa.appendChild(li);
    });

    var rep = moduloRepaso();
    if (rep.preguntas.length) {
      var li = el("li", "casilla casilla-repaso");
      var b = el("button", "casilla-boton");
      b.type = "button";
      var s = el("div", "sprite sprite-mapa");
      s.innerHTML = D.jefe(rep);
      b.appendChild(s);
      b.appendChild(el("p", "etiqueta", "Jefe de repaso"));
      b.appendChild(el("p", "casilla-tema", rep.tema));
      b.appendChild(el("p", "casilla-estado", rep.preguntas.length + " pregunta(s) por repasar"));
      b.addEventListener("click", function () { abrirLeccion(rep, true); });
      li.appendChild(b);
      mapa.insertBefore(li, mapa.firstChild);
    }
  }

  document.querySelectorAll("[data-ir]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (batalla && !batalla.fin && !$("pantalla-batalla").hidden) {
        abrir("capa-rendirse");
        return;
      }
      mostrar(b.getAttribute("data-ir"));
    });
  });

  /* ---------------- Lección ---------------- */

  function abrirLeccion(modulo, repaso) {
    moduloActual = modulo;
    repasoActual = repaso;
    $("leccion-sprite").innerHTML = D.jefe(modulo);
    $("leccion-frase").textContent = "«" + modulo.frase + "»";
    $("leccion-etiqueta").textContent = repaso ? "Repaso" : (modulo.final ? "Jefe final" : "Lección rápida");
    $("leccion-titulo").textContent = modulo.tema;
    $("leccion-jefe").textContent = "Te enfrentas a: " + modulo.jefe + " · " + modulo.preguntas.length + " preguntas posibles";
    var ul = $("leccion-lista");
    ul.innerHTML = "";
    modulo.leccion.forEach(function (t) { ul.appendChild(el("li", null, t)); });
    mostrar("leccion");
    $("boton-batalla").focus();
  }

  $("boton-batalla").addEventListener("click", function () { iniciarBatalla(); });

  /* ---------------- Batalla ---------------- */

  function iniciarBatalla() {
    batalla = new L.Batalla({
      modulo: moduloActual,
      perfil: usuario.progreso.perfil,
      progreso: usuario.progreso,
      repaso: repasoActual
    });
    var pf = L.PERFILES[usuario.progreso.perfil] || L.PERFILES.socio;
    $("sprite-jugador").innerHTML = D.personaje(pf.id, pf.nombre);
    $("sprite-jefe").innerHTML = D.jefe(moduloActual);
    $("nombre-jugador").textContent = usuario.nombre.split(" ")[0] + " · " + pf.nombre;
    $("nombre-jefe").textContent = moduloActual.jefe;
    $("tema-pregunta").textContent = moduloActual.tema;
    $("anuncio").textContent = "";
    pintarEstadoBatalla();
    mostrar("batalla");
    siguientePregunta();
  }

  function pintarEstadoBatalla() {
    var b = batalla;
    var cz = $("corazones");
    cz.innerHTML = "";
    for (var i = 0; i < b.corazonesMax; i++) cz.insertAdjacentHTML("beforeend", D.corazon(i < b.corazones));
    cz.setAttribute("aria-label", "Credibilidad: " + b.corazones + " de " + b.corazonesMax);
    $("estado-jugador").textContent = b.escudo ? "Escudo listo" : (b.perfil.escudo ? "Escudo usado" : "");
    var barra = $("barra-jefe");
    barra.querySelector("span").style.width = (100 * b.vidaJefe / b.vidaJefeMax) + "%";
    barra.setAttribute("aria-valuemax", b.vidaJefeMax);
    barra.setAttribute("aria-valuenow", b.vidaJefe);
    $("vida-jefe").textContent = "Resistencia " + b.vidaJefe + " / " + b.vidaJefeMax;
    var falta = b.perfil.racha - b.racha;
    $("racha").textContent = b.racha > 0 ? "Racha " + b.racha + " · crítico en " + falta : "";
    var comodin = $("boton-comodin");
    comodin.textContent = "Consultar el expediente (" + b.comodines + ")";
    comodin.disabled = b.comodines <= 0 || esperandoSiguiente;
  }

  function siguientePregunta() {
    var q = batalla.siguiente();
    if (!q) return;
    esperandoSiguiente = false;
    $("retro").hidden = true;
    $("texto-pregunta").textContent = q.texto;
    var cont = $("opciones");
    cont.innerHTML = "";
    q.opciones.forEach(function (texto, i) {
      var b = el("button", "opcion");
      b.type = "button";
      b.appendChild(el("span", "opcion-tecla", String(i + 1)));
      b.appendChild(el("span", "opcion-texto", texto));
      b.addEventListener("click", function () { responder(i); });
      cont.appendChild(b);
    });
    pintarEstadoBatalla();
    var primera = cont.querySelector("button");
    if (primera) primera.focus({ preventScroll: true });
  }

  function sacudir(id) {
    var e = $(id);
    e.classList.remove("golpe");
    void e.offsetWidth;
    e.classList.add("golpe");
  }

  function responder(i) {
    if (esperandoSiguiente || !batalla || batalla.fin) return;
    var ev = batalla.responder(i);
    if (!ev) return;
    esperandoSiguiente = true;
    var botones = $("opciones").querySelectorAll(".opcion");
    botones.forEach(function (b, j) {
      b.disabled = true;
      if (j === ev.correcta) b.classList.add("correcta");
      else if (j === i) b.classList.add("incorrecta");
    });

    var anuncio;
    if (ev.acierto) {
      sacudir("sprite-jefe");
      anuncio = ev.critico ? "¡Golpe crítico! −2" : "¡Correcto! −1";
      $("retro-titulo").textContent = ev.critico ? "¡Golpe crítico!" : "¡Correcto!";
      $("retro").className = "retro acierto";
    } else {
      sacudir("sprite-jugador");
      anuncio = ev.escudoUsado ? "Tu escudo absorbió el error" : "El jefe te golpea: −1 credibilidad";
      $("retro-titulo").textContent = ev.escudoUsado ? "Incorrecto, pero tu escudo te protegió" : "Incorrecto";
      $("retro").className = "retro error";
    }
    $("anuncio").textContent = anuncio;
    $("anuncio").classList.remove("visible");
    void $("anuncio").offsetWidth;
    $("anuncio").classList.add("visible");
    $("retro-correcta").textContent = ev.acierto ? "" : "Respuesta correcta: " + botones[ev.correcta].querySelector(".opcion-texto").textContent;
    $("retro-explicacion").textContent = ev.explicacion;
    $("retro").hidden = false;
    $("boton-siguiente").textContent = ev.fin ? "Ver resultado" : "Siguiente";
    pintarEstadoBatalla();
    pintarUsuario();
    guardar(true);
    $("boton-siguiente").focus({ preventScroll: true });
    $("retro").scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  $("boton-siguiente").addEventListener("click", function () {
    if (batalla.fin) finBatalla();
    else siguientePregunta();
  });

  $("boton-comodin").addEventListener("click", function () {
    var ocultas = batalla.usarComodin();
    var botones = $("opciones").querySelectorAll(".opcion");
    ocultas.forEach(function (i) { botones[i].disabled = true; botones[i].classList.add("descartada"); });
    pintarEstadoBatalla();
  });

  $("boton-rendirse").addEventListener("click", function () { abrir("capa-rendirse"); });
  $("boton-confirmar-rendirse").addEventListener("click", function () {
    cerrar("capa-rendirse");
    batalla.rendirse();
    guardar(true);
    mostrar("mapa");
  });

  function finBatalla() {
    var b = batalla;
    var m = moduloActual;
    $("sprite-fin").innerHTML = b.gano ? D.personaje(b.perfil.id, b.perfil.nombre) : D.jefe(m);
    if (b.gano) {
      $("titulo-fin").textContent = repasoActual ? "¡Repaso superado!" : (m.final ? "¡Venciste al Comité de Riesgo Supremo!" : "¡Venciste a " + m.jefe + "!");
      $("texto-fin").textContent = m.final
        ? "Completaste toda la capacitación. Desde «Mi avance» puedes ver tu constancia."
        : "Lo que acertaste quedó como aprendido. Revisa en «Mi avance» lo que te falta.";
    } else {
      $("titulo-fin").textContent = "Esta vez ganó el jefe";
      $("texto-fin").textContent = "No pasa nada: lo que fallaste quedó marcado para repasar. Lee de nuevo la lección e inténtalo otra vez.";
    }
    var dl = $("resumen-fin");
    dl.innerHTML = "";
    [["Aciertos", b.aciertos], ["Errores", b.errores], ["Mejor racha", b.mejorRacha], ["Experiencia ganada", "+" + b.xpGanada]].forEach(function (d) {
      var div = el("div");
      div.appendChild(el("dt", null, d[0]));
      div.appendChild(el("dd", null, String(d[1])));
      dl.appendChild(div);
    });
    $("boton-fin-reintentar").hidden = b.gano && !repasoActual;
    abrir("capa-fin");
    guardar(false);
  }

  $("boton-fin-mapa").addEventListener("click", function () { cerrar("capa-fin"); batalla = null; mostrar("mapa"); });
  $("boton-fin-reintentar").addEventListener("click", function () {
    cerrar("capa-fin");
    if (repasoActual) {
      var rep = moduloRepaso();
      if (!rep.preguntas.length) { mostrar("mapa"); return; }
      moduloActual = rep;
    }
    abrirLeccion(moduloActual, repasoActual);
  });

  /* ---------------- Avance ---------------- */

  function pintarAvance() {
    pintarUsuario();
    var prog = usuario.progreso;
    var g = L.resumenGeneral(prog, C.TODOS);
    var n = L.nivelDe(prog.xp);
    var r = $("avance-resumen");
    r.innerHTML = "";
    var p = el("p");
    p.textContent = usuario.nombre + " (" + usuario.correo + ") · " + n.titulo + ", nivel " + n.nivel + " · " +
      NUM.format(prog.xp) + " puntos · registro desde " + fechaCorta(usuario.creado) + ".";
    r.appendChild(p);
    var p2 = el("p");
    p2.textContent = "Aprendiste " + g.aprendidas + " de " + g.total + " conceptos (" + g.porcentaje + " %), tienes " +
      g.repasar + " por repasar y " + g.noVistas + " sin ver. Jefes vencidos: " + g.superados + " de " + C.TODOS.length + ".";
    r.appendChild(p2);
    $("boton-certificado").hidden = !(prog.modulos.final && prog.modulos.final.superado);

    var cont = $("avance-modulos");
    cont.innerHTML = "";
    C.TODOS.forEach(function (m) {
      var res = L.resumenModulo(prog, m);
      var d = el("details", "bloque modulo-avance" + (res.superado ? " superado" : ""));
      var s = el("summary");
      s.appendChild(el("span", "modulo-nombre", m.tema));
      s.appendChild(el("span", "modulo-cifra", (res.superado ? "Vencido · " : "") + res.porcentaje + " %"));
      var barra = el("div", "barra barra-mini");
      var rel = el("span"); rel.style.width = res.porcentaje + "%"; barra.appendChild(rel);
      s.appendChild(barra);
      d.appendChild(s);

      var grupos = { aprendida: [], repasar: [], "no-vista": [] };
      m.preguntas.forEach(function (q) { grupos[L.estadoPregunta(prog, q.id)].push(q); });

      [["aprendida", "Aprendido"], ["repasar", "Por repasar"], ["no-vista", "Aún no visto"]].forEach(function (par) {
        var lista = grupos[par[0]];
        if (!lista.length) return;
        var sec = el("div", "grupo-avance grupo-" + par[0]);
        sec.appendChild(el("p", "etiqueta", par[1] + " (" + lista.length + ")"));
        var ul = el("ul");
        lista.forEach(function (q) {
          var li = el("li");
          li.appendChild(el("span", "concepto", q.concepto));
          if (par[0] !== "no-vista") {
            var det = el("details", "detalle-concepto");
            det.appendChild(el("summary", null, "Ver la clave"));
            det.appendChild(el("p", null, "Respuesta: " + q.ok));
            det.appendChild(el("p", "nota", q.e));
            li.appendChild(det);
          }
          ul.appendChild(li);
        });
        sec.appendChild(ul);
        d.appendChild(sec);
      });
      cont.appendChild(d);
    });
  }

  $("boton-csv").addEventListener("click", function () {
    var prog = usuario.progreso;
    var filas = [["Nombre", "Correo", "Tema", "Concepto", "Estado", "Intentos", "Aciertos", "Fallos", "Última respuesta"]];
    C.TODOS.forEach(function (m) {
      m.preguntas.forEach(function (q) {
        var r = prog.preguntas[q.id] || {};
        var e = L.estadoPregunta(prog, q.id);
        filas.push([usuario.nombre, usuario.correo, m.tema, q.concepto,
          e === "aprendida" ? "Aprendido" : e === "repasar" ? "Por repasar" : "No visto",
          r.intentos || 0, r.aciertos || 0, r.fallos || 0, r.fecha || ""]);
      });
    });
    descargar("lexboss-avance-" + usuario.correo.split("@")[0] + ".csv", csv(filas));
  });

  /* ---------------- Código de continuación ---------------- */

  $("boton-codigo").addEventListener("click", function () {
    $("codigo-texto").value = "Generando…";
    $("mensaje-codigo").textContent = "";
    abrir("capa-codigo");
    guardar(true).then(function () {
      return almacen.exportarCodigo(usuario, claveSesion);
    }).then(function (codigo) {
      $("codigo-texto").value = codigo;
      $("codigo-texto").select();
    }).catch(function () {
      $("codigo-texto").value = "";
      $("mensaje-codigo").textContent = "No se pudo generar el código.";
    });
  });

  $("boton-copiar").addEventListener("click", function () {
    var t = $("codigo-texto");
    var hecho = function () { $("mensaje-codigo").textContent = "Copiado."; };
    if (navigator.clipboard) navigator.clipboard.writeText(t.value).then(hecho, function () { t.select(); document.execCommand("copy"); hecho(); });
    else { t.select(); document.execCommand("copy"); hecho(); }
  });

  /* ---------------- Participantes ---------------- */

  function filasParticipantes() {
    return almacen.listar().map(function (u) {
      var prog = L.normalizarProgreso(u.progreso);
      var g = L.resumenGeneral(prog, C.TODOS);
      return {
        nombre: u.nombre, correo: u.correo, creado: u.creado, ultima: u.ultimaVisita,
        nivel: L.nivelDe(prog.xp).nivel, xp: prog.xp, superados: g.superados,
        aprendidas: g.aprendidas, repasar: g.repasar, noVistas: g.noVistas, porcentaje: g.porcentaje
      };
    });
  }

  $("boton-participantes").addEventListener("click", function () {
    var filas = filasParticipantes();
    $("nota-participantes").textContent = almacen.centralActivo()
      ? "Personas que han entrado desde este navegador. El consolidado de toda la firma está en el registro central."
      : "Personas que han entrado desde este navegador. Para un consolidado de toda la firma, se activa el registro central (ver documentación del repositorio).";
    var t = $("tabla-participantes");
    t.innerHTML = "";
    var cab = el("tr");
    ["Nombre", "Correo", "Nivel", "Jefes", "Aprendido", "Por repasar", "Sin ver", "Última visita"].forEach(function (h) { cab.appendChild(el("th", null, h)); });
    var thead = el("thead"); thead.appendChild(cab); t.appendChild(thead);
    var tb = el("tbody");
    filas.forEach(function (f) {
      var tr = el("tr");
      [f.nombre, f.correo, f.nivel, f.superados + "/" + C.TODOS.length, f.porcentaje + " %", f.repasar, f.noVistas, fechaCorta(f.ultima)]
        .forEach(function (v) { tr.appendChild(el("td", null, String(v))); });
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    abrir("capa-participantes");
  });

  $("boton-csv-participantes").addEventListener("click", function () {
    var filas = [["Nombre", "Correo", "Registro", "Última visita", "Nivel", "Puntos", "Jefes vencidos", "Conceptos aprendidos", "Por repasar", "Sin ver", "% aprendido"]];
    filasParticipantes().forEach(function (f) {
      filas.push([f.nombre, f.correo, f.creado, f.ultima, f.nivel, f.xp, f.superados, f.aprendidas, f.repasar, f.noVistas, f.porcentaje]);
    });
    descargar("lexboss-participantes.csv", csv(filas));
  });

  /* ---------------- Borrar ---------------- */

  $("boton-borrar").addEventListener("click", function () {
    $("borrar-central").textContent = almacen.centralActivo() ? " y del registro central" : "";
    $("mensaje-borrar").textContent = "";
    abrir("capa-borrar");
  });

  $("form-borrar").addEventListener("submit", function (ev) {
    ev.preventDefault();
    almacen.borrar(usuario.correo, $("borrar-clave").value).then(function () {
      $("borrar-clave").value = "";
      cerrar("capa-borrar");
      usuario = null;
      claveSesion = null;
      mostrar("acceso");
      $("mensaje-acceso").textContent = "Tus datos fueron borrados.";
    }).catch(function (e) {
      $("mensaje-borrar").textContent = e.message;
      $("mensaje-borrar").className = "mensaje error";
    });
  });

  /* ---------------- Constancia ---------------- */

  $("boton-certificado").addEventListener("click", function () {
    var fin = usuario.progreso.modulos.final;
    var g = L.resumenGeneral(usuario.progreso, C.TODOS);
    $("certificado-texto").textContent = usuario.nombre + " (" + usuario.correo + ") completó la capacitación y venció a los " +
      C.TODOS.length + " jefes el " + fechaCorta(fin && fin.fecha) + ", con " + g.porcentaje + " % de los conceptos aprendidos.";
    var ul = $("certificado-temas");
    ul.innerHTML = "";
    C.TODOS.forEach(function (m) { ul.appendChild(el("li", null, m.tema)); });
    abrir("capa-certificado");
  });

  $("boton-imprimir").addEventListener("click", function () {
    document.body.classList.add("imprimiendo");
    window.print();
    setTimeout(function () { document.body.classList.remove("imprimiendo"); }, 500);
  });

  /* ---------------- Ventanas y teclado ---------------- */

  document.querySelectorAll("[data-cerrar]").forEach(function (b) {
    b.addEventListener("click", function () { b.closest(".capa").hidden = true; });
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") {
      document.querySelectorAll(".capa").forEach(function (c) { if (c.id !== "capa-fin") c.hidden = true; });
      return;
    }
    if ($("pantalla-batalla").hidden || document.querySelector(".capa:not([hidden])")) return;
    var tag = (ev.target && ev.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (/^[1-4]$/.test(ev.key) && !esperandoSiguiente) {
      var b = $("opciones").querySelectorAll(".opcion")[Number(ev.key) - 1];
      if (b && !b.disabled) b.click();
    } else if (ev.key === "Enter" && esperandoSiguiente && document.activeElement !== $("boton-siguiente")) {
      $("boton-siguiente").click();
    }
  });

  window.addEventListener("beforeunload", function () { if (usuario) guardar(true); });

  mostrar("acceso");
})();
