/*
 * AI BOSS — interfaz.
 * La mecánica está en logica.js, el contenido en contenido.js, los dibujos en
 * dibujos.js y la constancia en PDF en constancia.js. Aquí solo se pinta y se
 * reacciona. No se guarda nada: el avance vive en memoria mientras la página
 * está abierta.
 */
(function () {
  "use strict";

  var C = window.Contenido;
  var L = window.AIBoss;
  var D = window.Dibujos;
  var K = window.Constancia;
  var CONFIG = window.AIBOSS_CONFIG || {};
  var CORREO_TI = String(CONFIG.correoTI || "").trim();
  var $ = function (id) { return document.getElementById(id); };

  var usuario = null; // { nombre, correo, progreso } solo en memoria
  var batalla = null;
  var moduloActual = null;
  var repasoActual = false;
  var esperandoSiguiente = false;
  var ultimaConstancia = null;
  var abriendoCorreo = false;

  /* ---------------- Utilidades ---------------- */

  function mostrar(nombre) {
    ["acceso", "perfil", "mapa", "leccion", "batalla"].forEach(function (p) {
      $("pantalla-" + p).hidden = p !== nombre;
    });
    $("barra-usuario").hidden = !usuario || nombre === "acceso";
    window.scrollTo(0, 0);
    if (nombre === "mapa") pintarMapa();
  }

  function abrir(id) { $(id).hidden = false; var b = $(id).querySelector("button"); if (b) b.focus(); }
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
    relojAviso = setTimeout(function () { a.classList.remove("visible"); }, 3200);
  }

  function correoValido(correo) {
    return correo.length <= 120 && /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(correo);
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
  }

  /* ---------------- Acceso ---------------- */

  $("form-acceso").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var msg = $("mensaje-acceso");
    msg.className = "mensaje error";
    var nombre = $("acceso-nombre").value.trim().replace(/\s+/g, " ").slice(0, 80);
    var correo = $("acceso-correo").value.trim().toLowerCase();
    if (nombre.length < 2) { msg.textContent = "Escribe tu nombre."; return; }
    if (!correoValido(correo)) { msg.textContent = "Escribe un correo válido."; return; }
    if (!$("acceso-consentimiento").checked) {
      msg.textContent = "Para continuar debes aceptar el aviso de privacidad.";
      $("campo-consentimiento").classList.add("resaltar");
      return;
    }
    msg.textContent = "";
    usuario = { nombre: nombre, correo: correo, progreso: L.progresoVacio() };
    pintarUsuario();
    pintarPerfiles();
    mostrar("perfil");
  });

  $("boton-salir").addEventListener("click", function () { abrir("capa-salir"); });
  $("boton-confirmar-salir").addEventListener("click", function () {
    cerrar("capa-salir");
    usuario = null;
    batalla = null;
    ultimaConstancia = null;
    $("acceso-consentimiento").checked = false;
    mostrar("acceso");
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
      b.appendChild(el("p", "etiqueta", "Área: " + L.AREAS[pf.area]));
      b.appendChild(el("p", "personaje-nombre", pf.nombre));
      b.appendChild(el("p", "nota", pf.ventaja));
      b.appendChild(el("p", "cifras", pf.corazones + " de credibilidad · " + pf.comodines + " consulta(s)"));
      b.addEventListener("click", function () {
        usuario.progreso.perfil = id;
        mostrar("mapa");
      });
      lista.appendChild(b);
    });
  }

  $("boton-personaje").addEventListener("click", function () {
    if (batalla && !batalla.fin && !$("pantalla-batalla").hidden) { abrir("capa-rendirse"); return; }
    pintarPerfiles();
    mostrar("perfil");
  });

  /* ---------------- Mapa ---------------- */

  function moduloRepaso() {
    return {
      id: "repaso",
      tema: "Repaso de lo que has fallado",
      jefe: "El Espectro del Repaso",
      forma: "fantasma",
      color: "amarilla",
      frase: "Vuelvo con todo lo que se te escapó...",
      leccion: ["Aquí vuelven las preguntas que respondiste mal en esta sesión. Acertarlas las marca como aprendidas."],
      preguntas: L.preguntasPorRepasar(usuario.progreso, C.TODOS)
    };
  }

  function moduloEvaluacion() {
    return C.EVALUACION;
  }

  // Contenido adaptado al personaje elegido (introducción y ejemplo de cada paso).
  var ICONO_AREA = { juridico: "⚖️", tecnologia: "🖥️", administrativo: "🗂️", multidisciplinar: "🔬", finanzas: "💰" };
  var ICONO_PERFIL = { socio: "🧭", asociado: "⚡", paralegal: "🔎", analista: "📊", it: "🖥️", administrativo: "🗂️", multidisciplinar: "🔬", finanzas: "💰" };
  function perfilActual() {
    return L.PERFILES[usuario.progreso.perfil] || null;
  }
  function adaptado(moduloId) {
    var pf = perfilActual();
    var P = window.EjemplosPerfil || {};
    return pf && P[pf.id] && P[pf.id][moduloId] ? P[pf.id][moduloId] : null;
  }

  function pasosModulo(m, prog) {
    var hecho = { concepto: !!(prog.conceptos && prog.conceptos[m.id]),
      practica: !!(prog.modulos[m.id] && (prog.modulos[m.id].superado || prog.modulos[m.id].derrotas)),
      pdf: !!(prog.constancias && prog.constancias[m.id]) };
    var cont = el("p", "casilla-pasos");
    [["📘", "Aprende", hecho.concepto], ["⚔️", "Practica", hecho.practica], ["📄", "PDF", hecho.pdf]].forEach(function (x) {
      cont.appendChild(el("span", "paso-chip" + (x[2] ? " hecho" : ""), x[0] + " " + x[1] + (x[2] ? " ✓" : "")));
    });
    return cont;
  }

  function pintarMapa() {
    pintarUsuario();
    var prog = usuario.progreso;
    var g = L.resumenGeneral(prog, C.TODOS);
    var r = $("resumen-mapa");
    r.innerHTML = "";
    [
      [g.superados + " / " + C.TODOS.length, "jefes vencidos hoy"],
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
    C.TODOS.forEach(function (m, i) {
      var res = L.resumenModulo(prog, m);
      var li = el("li", "casilla" + (res.superado ? " superado" : "") + (m.final ? " casilla-final" : ""));
      var b = el("button", "casilla-boton");
      b.type = "button";
      var s = el("div", "sprite sprite-mapa");
      s.innerHTML = D.jefe(m);
      b.appendChild(s);
      b.appendChild(el("p", "etiqueta", m.final ? "Jefe final" : "Jefe " + (i + 1)));
      b.appendChild(el("p", "casilla-tema", m.tema));
      b.appendChild(el("p", "casilla-jefe", m.jefe));
      var estado = el("p", "casilla-estado");
      if (res.superado) estado.textContent = "Vencido · " + res.porcentaje + " % aprendido";
      else if (res.noVistas === res.total && conceptoCompleto(m)) estado.textContent = "Conceptualización lista · falta la práctica";
      else if (res.noVistas === res.total) estado.textContent = m.final ? "Casos que mezclan todos los temas" : "Sin empezar";
      else estado.textContent = res.porcentaje + " % aprendido · " + res.repasar + " por repasar";
      b.appendChild(estado);
      var barra = el("div", "barra barra-mini");
      var relleno = el("span");
      relleno.style.width = res.porcentaje + "%";
      barra.appendChild(relleno);
      b.appendChild(barra);
      b.appendChild(pasosModulo(m, prog));
      b.setAttribute("aria-label", m.jefe + ". " + m.tema + ". " + estado.textContent);
      b.addEventListener("click", function () { abrirLeccion(m, false); });
      li.appendChild(b);
      mapa.appendChild(li);
    });

    // Lección de cierre: resumen general y evaluación.
    var ev = moduloEvaluacion();
    var mEv = prog.modulos[ev.id] || {};
    var liEv = el("li", "casilla casilla-final casilla-evaluacion" + (mEv.superado ? " superado" : ""));
    var bEv = el("button", "casilla-boton");
    bEv.type = "button";
    var sEv = el("div", "sprite sprite-mapa");
    sEv.innerHTML = D.jefe(ev);
    bEv.appendChild(sEv);
    bEv.appendChild(el("p", "etiqueta", "Lección final · Evaluación"));
    bEv.appendChild(el("p", "casilla-tema", ev.tema));
    bEv.appendChild(el("p", "casilla-jefe", ev.jefe));
    bEv.appendChild(el("p", "casilla-estado", mEv.superado ? "Aprobada" : (mEv.derrotas ? "Intentada · vuelve a intentarlo" : "Una pregunta de cada tema")));
    bEv.appendChild(pasosModulo(ev, prog));
    bEv.addEventListener("click", function () { abrirLeccion(ev, false); });
    liEv.appendChild(bEv);
    mapa.appendChild(liEv);

    // Taller final: construir paso a paso (sin batalla).
    var tl = C.TALLER;
    var hechoT = conceptoCompleto(tl);
    var liT = el("li", "casilla casilla-final casilla-taller" + (hechoT ? " superado" : ""));
    var bT = el("button", "casilla-boton");
    bT.type = "button";
    var sT = el("div", "sprite sprite-mapa");
    sT.innerHTML = D.jefe(tl);
    bT.appendChild(sT);
    bT.appendChild(el("p", "etiqueta", "Taller final · Sin batalla"));
    bT.appendChild(el("p", "casilla-tema", tl.tema));
    bT.appendChild(el("p", "casilla-jefe", tl.jefe));
    bT.appendChild(el("p", "casilla-estado", hechoT ? "Completado" : "Aprende a construir, paso a paso"));
    var chipT = el("p", "casilla-pasos");
    chipT.appendChild(el("span", "paso-chip" + (hechoT ? " hecho" : ""), "🛠️ Taller" + (hechoT ? " ✓" : "")));
    bT.appendChild(chipT);
    bT.addEventListener("click", function () { abrirLeccion(tl, false); });
    liT.appendChild(bT);
    mapa.appendChild(liT);

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
      if (batalla && !batalla.fin && !$("pantalla-batalla").hidden) { abrir("capa-rendirse"); return; }
      mostrar(b.getAttribute("data-ir"));
    });
  });

  /* ---------------- Conceptualización ---------------- */

  var pasos = [];        // pasos del módulo actual (incluye el resumen final)
  var pasoActual = 0;
  var pasoResuelto = []; // por paso: true si se puede avanzar

  function pasosDe(modulo, repaso) {
    var resumen = { tipo: "resumen", titulo: "Lo que te llevas", puntos: modulo.leccion };
    if (repaso) return [resumen];
    var c = window.Conceptos.CONCEPTOS[modulo.id];
    var lista = c ? c.pasos.slice() : [];
    var ad = adaptado(modulo.id);
    var intro = (ad && ad.intro) || (c && c.intro);
    if (intro) lista.unshift({ tipo: "intro", titulo: "Antes de empezar", texto: intro, modulo: modulo });
    return lista.concat([resumen]);
  }

  function conceptoCompleto(modulo) {
    return !!(usuario.progreso.conceptos && usuario.progreso.conceptos[modulo.id]);
  }

  function abrirLeccion(modulo, repaso) {
    moduloActual = modulo;
    repasoActual = repaso;
    pasos = pasosDe(modulo, repaso);
    var completo = repaso || conceptoCompleto(modulo);
    pasoResuelto = pasos.map(function (p) { return completo || (p.tipo !== "elige" && p.tipo !== "clasifica"); });
    pasoActual = 0;
    $("leccion-sprite").innerHTML = D.jefe(modulo);
    $("leccion-etiqueta").textContent = repaso ? "Repaso" : modulo.taller ? "Taller final · Paso a paso" : (modulo.evaluacion ? "Lección final · Conceptualización" : (modulo.final ? "Jefe final · Conceptualización" : "Conceptualización"));
    $("leccion-titulo").textContent = modulo.tema;
    $("leccion-jefe").textContent = repaso
      ? "Vuelven las preguntas que fallaste en esta sesión."
      : modulo.taller ? "Sin batalla: aprende construyendo, a tu ritmo. Marca cada paso a medida que lo hagas."
      : "Aprende paso a paso. Al terminar te enfrentas a " + modulo.jefe + ".";
    $("concepto-saltar").hidden = !(completo && !repaso) || !!modulo.taller;
    mostrar("leccion");
    pintarPaso();
  }

  function pintarPaso() {
    var p = pasos[pasoActual];
    var total = pasos.length;
    $("concepto-contador").textContent = "Paso " + (pasoActual + 1) + " de " + total;
    var puntos = $("concepto-puntos");
    puntos.innerHTML = "";
    for (var i = 0; i < total; i++) {
      var tipo = pasos[i].tipo;
      puntos.appendChild(el("li", "punto" + (i < pasoActual ? " hecho" : "") + (i === pasoActual ? " actual" : "") +
        (tipo === "elige" || tipo === "clasifica" ? " practica" : "")));
    }
    var art = $("concepto");
    art.innerHTML = "";
    art.className = "concepto concepto-" + p.tipo;
    if (p.tipo === "intro") pintarIntro(art, p);
    else if (p.tipo === "concepto") pintarConcepto(art, p);
    else if (p.tipo === "elige") pintarElige(art, p);
    else if (p.tipo === "clasifica") pintarClasifica(art, p);
    else if (p.tipo === "receta") pintarReceta(art, p);
    else if (p.tipo === "constructor") pintarConstructor(art, p);
    else pintarResumen(art, p);
    actualizarNav();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function actualizarNav() {
    var ultimo = pasoActual === pasos.length - 1;
    $("concepto-anterior").disabled = pasoActual === 0;
    $("concepto-siguiente").hidden = ultimo;
    $("concepto-siguiente").disabled = !pasoResuelto[pasoActual];
    $("boton-batalla").hidden = !ultimo || !!moduloActual.taller;
    var tipo = pasos[pasoActual].tipo;
    $("concepto-aviso").textContent = !pasoResuelto[pasoActual] && (tipo === "elige" || tipo === "clasifica")
      ? "Resuelve el ejercicio para continuar."
      : "";
  }

  function titulo(art, texto, etiquetaTexto) {
    if (etiquetaTexto) art.appendChild(el("p", "etiqueta concepto-tipo", etiquetaTexto));
    art.appendChild(el("h3", "concepto-titulo", texto));
  }

  function pintarIntro(art, p) {
    var caja = el("div", "intro-caja");
    var s = el("div", "sprite sprite-grande");
    s.innerHTML = D.jefe(p.modulo);
    caja.appendChild(s);
    var txt = el("div");
    txt.appendChild(el("p", "bocadillo", "«" + p.modulo.frase + "»"));
    txt.appendChild(el("h3", "concepto-titulo", p.titulo));
    txt.appendChild(el("p", "concepto-parrafo", p.texto));
    var pf = L.PERFILES[usuario.progreso.perfil];
    if (pf) txt.appendChild(el("p", "nota nota-area", ICONO_PERFIL[pf.id] + " Los ejemplos están pensados para tu personaje: " + pf.nombre + " (" + L.AREAS[pf.area] + "). Si cambias de personaje, cambian los ejemplos."));
    txt.appendChild(el("p", "nota", "Avanza con «Siguiente». En los pasos marcados como práctica tendrás que resolver un ejercicio para continuar. No se califican: son para aprender."));
    caja.appendChild(txt);
    art.appendChild(caja);
  }

  function pintarVisual(v) {
    var cont = el("div", "visual visual-" + v.tipo);
    if (v.tipo === "flujo") {
      v.pasos.forEach(function (paso, i) {
        if (i > 0) cont.appendChild(el("span", "flecha", "➜"));
        var caja = el("div", "flujo-paso");
        caja.appendChild(el("span", "icono", paso.i));
        caja.appendChild(el("span", "flujo-texto", paso.t));
        cont.appendChild(caja);
      });
    } else if (v.tipo === "tarjetas") {
      v.items.forEach(function (it) {
        var t = el("div", "tarjeta");
        t.appendChild(el("span", "icono", it.i));
        t.appendChild(el("p", "tarjeta-titulo", it.t));
        t.appendChild(el("p", "tarjeta-texto", it.d));
        cont.appendChild(t);
      });
    } else if (v.tipo === "comparar") {
      [v.izq, v.der].forEach(function (lado, i) {
        var col = el("div", "columna " + (i === 0 ? "columna-a" : "columna-b"));
        col.appendChild(el("p", "columna-titulo", lado.titulo));
        var ul = el("ul");
        lado.items.forEach(function (x) { ul.appendChild(el("li", null, x)); });
        col.appendChild(ul);
        cont.appendChild(col);
      });
    } else if (v.tipo === "chat") {
      v.mensajes.forEach(function (m) {
        var b = el("div", "burbuja burbuja-" + m.de);
        b.appendChild(el("span", "burbuja-quien", m.de === "tu" ? "Tú" : (m.de === "claude" ? "Claude" : "Documento")));
        b.appendChild(el("span", "burbuja-texto", m.t));
        cont.appendChild(b);
      });
    }
    return cont;
  }

  function pintarConcepto(art, p) {
    titulo(art, p.titulo, "Concepto");
    p.texto.forEach(function (t) { art.appendChild(el("p", "concepto-parrafo", t)); });
    if (p.visual) art.appendChild(pintarVisual(p.visual));
    var notas = el("div", "notas");
    if (p.simple) {
      var s = el("div", "nota-caja nota-simple");
      s.appendChild(el("p", "nota-caja-titulo", "💡 En palabras simples"));
      s.appendChild(el("p", null, p.simple));
      notas.appendChild(s);
    }
    var ad = adaptado(moduloActual.id);
    var ejemplo = (ad && ad.ejemplos && ad.ejemplos[p.titulo]) || p.ejemplo;
    if (ejemplo) {
      var pfE = perfilActual();
      var e = el("div", "nota-caja nota-ejemplo");
      e.appendChild(el("p", "nota-caja-titulo", pfE && ad && ad.ejemplos && ad.ejemplos[p.titulo]
        ? ICONO_PERFIL[pfE.id] + " Para ti, " + pfE.nombre
        : "⚖️ En la firma"));
      e.appendChild(el("p", null, ejemplo));
      notas.appendChild(e);
    }
    art.appendChild(notas);
  }

  function pintarElige(art, p) {
    var indice = pasoActual;
    titulo(art, p.titulo, "Práctica");
    art.appendChild(el("p", "situacion", p.situacion));
    var lista = el("div", "practica-opciones");
    var retro = el("p", "practica-retro");
    retro.setAttribute("role", "status");
    p.opciones.forEach(function (o) {
      var b = el("button", "opcion opcion-practica");
      b.type = "button";
      b.appendChild(el("span", "opcion-texto", o.t));
      b.addEventListener("click", function () {
        if (pasoResuelto[indice] && !o.ok) return;
        b.classList.add(o.ok ? "correcta" : "incorrecta");
        retro.className = "practica-retro " + (o.ok ? "bien" : "mal");
        retro.textContent = (o.ok ? "✔ ¡Bien! " : "✘ Intenta de nuevo. ") + o.r;
        if (o.ok) {
          pasoResuelto[indice] = true;
          lista.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
          actualizarNav();
          $("concepto-siguiente").focus({ preventScroll: true });
        } else {
          b.disabled = true;
        }
      });
      lista.appendChild(b);
    });
    art.appendChild(lista);
    art.appendChild(retro);
  }

  function pintarClasifica(art, p) {
    var indice = pasoActual;
    titulo(art, p.titulo, "Práctica");
    art.appendChild(el("p", "situacion", p.instruccion));
    var elegidas = p.items.map(function () { return null; });
    var tabla = el("div", "clasifica");
    var filas = [];
    p.items.forEach(function (it, i) {
      var fila = el("div", "clasifica-fila");
      fila.appendChild(el("p", "clasifica-item", it.t));
      var grupo = el("div", "clasifica-botones");
      grupo.setAttribute("role", "group");
      grupo.setAttribute("aria-label", it.t);
      p.categorias.forEach(function (cat, c) {
        var b = el("button", "boton-cat", cat);
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", function () {
          if (pasoResuelto[indice]) return;
          elegidas[i] = c;
          grupo.querySelectorAll("button").forEach(function (x, k) {
            x.setAttribute("aria-pressed", String(k === c));
            x.classList.toggle("elegida", k === c);
          });
          fila.classList.remove("mal", "bien");
          fila.querySelector(".clasifica-nota").textContent = "";
        });
        grupo.appendChild(b);
      });
      fila.appendChild(grupo);
      fila.appendChild(el("p", "clasifica-nota"));
      tabla.appendChild(fila);
      filas.push(fila);
    });
    art.appendChild(tabla);
    var revisar = el("button", "boton", "Revisar mis respuestas");
    revisar.type = "button";
    var retro = el("p", "practica-retro");
    retro.setAttribute("role", "status");
    revisar.addEventListener("click", function () {
      if (elegidas.some(function (x) { return x === null; })) {
        retro.className = "practica-retro mal";
        retro.textContent = "Clasifica todas las opciones antes de revisar.";
        return;
      }
      var errores = 0;
      p.items.forEach(function (it, i) {
        var ok = elegidas[i] === it.c;
        if (!ok) errores++;
        filas[i].classList.toggle("bien", ok);
        filas[i].classList.toggle("mal", !ok);
        filas[i].querySelector(".clasifica-nota").textContent = ok
          ? (it.r ? "✔ " + it.r : "")
          : "✘ Revisa esta" + (it.r ? ": " + it.r : ".");
      });
      if (!errores) {
        pasoResuelto[indice] = true;
        revisar.disabled = true;
        retro.className = "practica-retro bien";
        retro.textContent = "✔ ¡Todo correcto! Puedes continuar.";
        actualizarNav();
        $("concepto-siguiente").focus({ preventScroll: true });
      } else {
        retro.className = "practica-retro mal";
        retro.textContent = "Tienes " + errores + " por corregir. Cambia las marcadas en rojo y revisa de nuevo.";
      }
    });
    var pie = el("div", "acciones");
    pie.appendChild(revisar);
    art.appendChild(pie);
    art.appendChild(retro);
  }

  /* ---------- Taller: recetas paso a paso ---------- */

  function botonCopiar(texto) {
    var b = el("button", "boton-copiar", "Copiar");
    b.type = "button";
    b.addEventListener("click", function () {
      var hecho = function () { b.textContent = "¡Copiado!"; setTimeout(function () { b.textContent = "Copiar"; }, 1500); };
      var valor = typeof texto === "function" ? texto() : texto;
      if (navigator.clipboard) navigator.clipboard.writeText(valor).then(hecho, hecho);
      else hecho();
    });
    return b;
  }

  // bloque: { tipo: "terminal" | "archivo" | "clic" | "chat", titulo, contenido | mensajes }
  function pintarBloque(bl) {
    if (bl.tipo === "chat") return pintarVisual({ tipo: "chat", mensajes: bl.mensajes });
    if (bl.tipo === "clic") {
      var ruta = el("div", "ruta-clic");
      bl.contenido.split(" › ").forEach(function (x, i) {
        if (i > 0) ruta.appendChild(el("span", "ruta-flecha", "›"));
        ruta.appendChild(el("span", "ruta-boton", x));
      });
      return ruta;
    }
    var caja = el("div", bl.tipo === "terminal" ? "terminal" : "archivo");
    var cab = el("div", "bloque-cabecera");
    cab.appendChild(el("span", "bloque-titulo", bl.tipo === "terminal" ? "⌨️ " + (bl.titulo || "Terminal") : "📄 " + (bl.titulo || "archivo")));
    cab.appendChild(botonCopiar(bl.contenido));
    caja.appendChild(cab);
    var pre = el("pre", "bloque-codigo");
    if (bl.tipo === "terminal") {
      bl.contenido.split("\n").forEach(function (l) {
        var linea = el("span", "linea");
        if (l.indexOf("#") === 0) { linea.className = "linea comentario"; linea.textContent = l; }
        else { linea.appendChild(el("span", "prompt", "> ")); linea.appendChild(document.createTextNode(l)); }
        pre.appendChild(linea);
      });
    } else {
      pre.textContent = bl.contenido;
    }
    caja.appendChild(pre);
    return caja;
  }

  function pintarReceta(art, p) {
    var cab = el("div", "receta-cabecera");
    cab.appendChild(el("span", "receta-icono", p.icono || "🛠️"));
    var ct = el("div");
    ct.appendChild(el("p", "etiqueta concepto-tipo", "Receta"));
    ct.appendChild(el("h3", "concepto-titulo", p.titulo));
    cab.appendChild(ct);
    art.appendChild(cab);
    var chips = el("div", "receta-chips");
    [["🎚️", p.nivel], ["👤", p.quien], ["⏱️", p.tiempo]].forEach(function (c) {
      if (c[1]) chips.appendChild(el("span", "receta-chip", c[0] + " " + c[1]));
    });
    art.appendChild(chips);
    var meta = el("div", "nota-caja nota-meta");
    meta.appendChild(el("p", "nota-caja-titulo", "🎯 Vas a construir"));
    meta.appendChild(el("p", null, p.construyes));
    art.appendChild(meta);
    if (p.simple) {
      var s = el("div", "nota-caja nota-simple");
      s.appendChild(el("p", "nota-caja-titulo", "💡 En palabras simples"));
      s.appendChild(el("p", null, p.simple));
      art.appendChild(s);
    }
    var avance = el("p", "receta-avance");
    var barra = el("div", "barra barra-mini");
    var relleno = el("span");
    barra.appendChild(relleno);
    var ol = el("ol", "receta-pasos");
    var marcados = 0;
    function actualizar() {
      avance.textContent = marcados === p.pasos.length
        ? "🎉 ¡Hiciste todos los pasos de esta receta!"
        : "Pasos hechos: " + marcados + " de " + p.pasos.length;
      relleno.style.width = (100 * marcados / p.pasos.length) + "%";
    }
    p.pasos.forEach(function (paso, i) {
      var li = el("li", "receta-paso");
      li.appendChild(el("span", "receta-numero", String(i + 1)));
      var cuerpo = el("div", "receta-cuerpo");
      cuerpo.appendChild(el("p", null, paso.t));
      if (paso.bloque) cuerpo.appendChild(pintarBloque(paso.bloque));
      var chk = el("label", "receta-check");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.addEventListener("change", function () {
        marcados += input.checked ? 1 : -1;
        li.classList.toggle("hecho", input.checked);
        actualizar();
      });
      chk.appendChild(input);
      chk.appendChild(document.createTextNode(" Hecho"));
      cuerpo.appendChild(chk);
      li.appendChild(cuerpo);
      ol.appendChild(li);
    });
    art.appendChild(ol);
    art.appendChild(barra);
    art.appendChild(avance);
    actualizar();
    var notas = el("div", "notas");
    if (p.resultado) {
      var r = el("div", "nota-caja nota-resultado");
      r.appendChild(el("p", "nota-caja-titulo", "✅ Lo que vas a ver"));
      r.appendChild(el("p", null, p.resultado));
      notas.appendChild(r);
    }
    if (p.cuidado) {
      var c = el("div", "nota-caja nota-cuidado");
      c.appendChild(el("p", "nota-caja-titulo", "⚠️ Cuidado"));
      c.appendChild(el("p", null, p.cuidado));
      notas.appendChild(c);
    }
    art.appendChild(notas);
  }

  // Constructor interactivo de pedidos: eliges piezas y se arma el texto.
  function pintarConstructor(art, p) {
    titulo(art, p.titulo, "Juega a construir");
    art.appendChild(el("p", "concepto-parrafo", p.texto));
    var form = el("div", "constructor");
    var elegidos = {};
    var vista = el("pre", "bloque-codigo constructor-vista");
    function armar() {
      var t = p.plantilla;
      Object.keys(elegidos).forEach(function (k) { t = t.replace("{" + k + "}", elegidos[k]); });
      vista.textContent = t;
    }
    p.piezas.forEach(function (pz) {
      var fila = el("div", "constructor-fila");
      fila.appendChild(el("p", "etiqueta", pz.icono + " " + pz.nombre));
      var grupo = el("div", "clasifica-botones constructor-opciones");
      pz.opciones.forEach(function (op, i) {
        var b = el("button", "boton-cat" + (i === 0 ? " elegida" : ""), op);
        b.type = "button";
        b.addEventListener("click", function () {
          grupo.querySelectorAll("button").forEach(function (x) { x.classList.remove("elegida"); });
          b.classList.add("elegida");
          elegidos[pz.campo] = op;
          armar();
        });
        grupo.appendChild(b);
      });
      elegidos[pz.campo] = pz.opciones[0];
      fila.appendChild(grupo);
      form.appendChild(fila);
    });
    art.appendChild(form);
    var caja = el("div", "archivo");
    var cab = el("div", "bloque-cabecera");
    cab.appendChild(el("span", "bloque-titulo", "📝 Tu pedido, listo para usar en Claude Code"));
    cab.appendChild(botonCopiar(function () { return vista.textContent; }));
    caja.appendChild(cab);
    caja.appendChild(vista);
    art.appendChild(caja);
    armar();
    if (p.nota) art.appendChild(el("p", "nota", p.nota));
  }

  function pintarResumen(art, p) {
    titulo(art, p.titulo, repasoActual ? "Repaso" : "Resumen");
    var ul = el("ul", "lista-leccion");
    p.puntos.forEach(function (t) { ul.appendChild(el("li", null, t)); });
    art.appendChild(ul);
    if (!repasoActual) {
      if (!conceptoCompleto(moduloActual)) {
        usuario.progreso.conceptos = usuario.progreso.conceptos || {};
        usuario.progreso.conceptos[moduloActual.id] = new Date().toISOString();
      }
      art.appendChild(el("p", "practica-retro bien", moduloActual.taller
        ? "✔ ¡Completaste el taller! Ya sabes cómo se construye cada cosa. Vuelve a cualquier receta cuando la necesites."
        : "✔ Completaste la conceptualización. Ahora, la práctica: enfrenta a " + moduloActual.jefe + "."));
    }
  }

  $("concepto-anterior").addEventListener("click", function () {
    if (pasoActual > 0) { pasoActual--; pintarPaso(); }
  });
  $("concepto-siguiente").addEventListener("click", function () {
    if (pasoResuelto[pasoActual] && pasoActual < pasos.length - 1) { pasoActual++; pintarPaso(); }
  });
  $("concepto-saltar").addEventListener("click", function () { iniciarBatalla(); });
  $("boton-batalla").addEventListener("click", function () { iniciarBatalla(); });

  /* ---------------- Batalla ---------------- */

  function iniciarBatalla() {
    // La evaluación toma una pregunta al azar de cada módulo en cada intento.
    var moduloBatalla = moduloActual.evaluacion
      ? Object.assign({}, moduloActual, { preguntas: L.preguntasEvaluacion(C.TODOS) })
      : moduloActual;
    batalla = new L.Batalla({
      modulo: moduloBatalla,
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
    $("vida-jefe").textContent = "Preguntas por resolver: " + b.vidaJefe + " de " + b.vidaJefeMax;
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
    $("tema-pregunta").textContent = q.tema || moduloActual.tema;
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
      anuncio = ev.danio ? "¡Correcto! −1" : "¡Correcto!";
      if (ev.critico) anuncio = "¡Golpe crítico!" + (ev.curacion ? " +1 credibilidad" : "") + (ev.comodinGanado ? " +1 consulta" : "");
      $("retro-titulo").textContent = ev.critico
        ? "¡Golpe crítico!" + (ev.curacion ? " Recuperas 1 de credibilidad." : "") + (ev.comodinGanado ? " Ganas una consulta al expediente." : "")
        : "¡Correcto!";
      $("retro").className = "retro acierto";
    } else {
      sacudir("sprite-jugador");
      anuncio = ev.escudoUsado ? "Tu escudo absorbió el error" : "El jefe te golpea: −1 credibilidad";
      $("retro-titulo").textContent = (ev.escudoUsado ? "Incorrecto, pero tu escudo te protegió" : "Incorrecto") + ". Esta pregunta volverá más adelante.";
      $("retro").className = "retro error";
    }
    $("anuncio").textContent = anuncio;
    $("anuncio").classList.remove("visible");
    void $("anuncio").offsetWidth;
    $("anuncio").classList.add("visible");
    $("retro-correcta").textContent = ev.acierto ? "" : "Respuesta correcta: " + botones[ev.correcta].querySelector(".opcion-texto").textContent;
    $("retro-explicacion").textContent = ev.explicacion;
    $("retro").hidden = false;
    $("boton-siguiente").textContent = ev.fin ? "Ver resultado y constancia" : "Siguiente";
    pintarEstadoBatalla();
    pintarUsuario();
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
    finBatalla();
  });

  /* ---------------- Fin de módulo y constancia ---------------- */

  function datosConstancia() {
    return {
      participante: { nombre: usuario.nombre, correo: usuario.correo },
      perfil: (function () { var pf = L.PERFILES[usuario.progreso.perfil] || L.PERFILES.socio; return { nombre: pf.nombre, area: L.AREAS[pf.area] }; })(),
      claves: C.CLAVES,
      modulos: C.TODOS,
      modulo: moduloActual,
      batalla: batalla,
      correoTI: CORREO_TI,
      conceptoFecha: usuario.progreso.conceptos ? usuario.progreso.conceptos[moduloActual.id] : null
    };
  }

  // La constancia exige conceptualización completa y práctica terminada (ganada o
  // perdida, no abandonada). El repaso no genera constancia.
  function constanciaPermitida() {
    var practicaTerminada = batalla && (batalla.gano || batalla.corazones <= 0);
    return !repasoActual && conceptoCompleto(moduloActual) && practicaTerminada && batalla.historial.length > 0;
  }

  function descargarConstancia() {
    if (!constanciaPermitida()) return;
    try {
      var c = K.generar(datosConstancia());
      c.doc.save(c.nombre);
      ultimaConstancia = c;
      usuario.progreso.constancias = usuario.progreso.constancias || {};
      usuario.progreso.constancias[moduloActual.id] = new Date().toISOString();
      $("texto-constancia").textContent = "Se descargó «" + c.nombre + "». Revisa tu carpeta de descargas.";
      avisar("Constancia descargada.");
    } catch (e) {
      $("texto-constancia").textContent = "No se pudo generar el PDF: " + e.message + " Recarga la página e inténtalo de nuevo.";
    }
  }

  function finBatalla() {
    var b = batalla;
    var m = moduloActual;
    $("sprite-fin").innerHTML = b.gano ? D.personaje(b.perfil.id, b.perfil.nombre) : D.jefe(m);
    if (b.gano) {
      $("titulo-fin").textContent = repasoActual ? "¡Repaso superado!" : (m.evaluacion ? "¡Aprobaste la evaluación general!" : "¡Venciste a " + m.jefe + "!");
      $("texto-fin").textContent = m.evaluacion
        ? "Respondiste bien una pregunta de cada tema. Tu constancia incluye el resumen de todas las lecciones."
        : "Respondiste bien todas las preguntas del módulo: 100 % aprendido.";
    } else {
      $("titulo-fin").textContent = b.corazones <= 0 ? "Esta vez ganó el jefe" : "Te retiraste de la batalla";
      $("texto-fin").textContent = "Lo que fallaste aparece en el jefe de repaso. Repasa la conceptualización e inténtalo otra vez.";
    }
    var r = K.resumen(b);
    var dl = $("resumen-fin");
    dl.innerHTML = "";
    [["Correctas", r.buenas], ["Incorrectas", r.malas], ["Puntaje", r.porcentaje + " %"], ["Experiencia", "+" + b.xpGanada]].forEach(function (d) {
      var div = el("div");
      div.appendChild(el("dt", null, d[0]));
      div.appendChild(el("dd", null, String(d[1])));
      dl.appendChild(div);
    });
    var permitida = constanciaPermitida();
    $("bloque-constancia").hidden = !permitida;
    $("nota-enviar").textContent = "Se descarga un correo para " + (CORREO_TI || "TI") +
      " que ya trae el PDF adjunto. Ábrelo con doble clic: Outlook lo muestra como borrador. Revisa y pulsa «Enviar».";
    if (!permitida && !repasoActual) {
      $("texto-fin").textContent += " No se generó constancia: para obtenerla hay que terminar la práctica sin retirarse.";
    }
    $("boton-fin-reintentar").hidden = b.gano && !repasoActual;
    abrir("capa-fin");
    if (permitida) descargarConstancia();
    else $("texto-constancia").textContent = "";
  }

  $("boton-pdf").addEventListener("click", descargarConstancia);

  // Correo listo con el PDF adjunto (.eml). Una página web no puede enviar
  // correos ni adjuntar archivos a un mailto: por eso se descarga el borrador.
  $("boton-enviar-ti").addEventListener("click", function () {
    if (!ultimaConstancia) descargarConstancia();
    if (!ultimaConstancia) return;
    var pdf64 = ultimaConstancia.doc.output("datauristring").split(",")[1];
    var eml = K.correoEml(datosConstancia(), ultimaConstancia.nombre, pdf64);
    var nombreEml = ultimaConstancia.nombre.replace(/\.pdf$/, "") + "_correo_TI.eml";
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([eml], { type: "message/rfc822" }));
    a.download = nombreEml;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    $("texto-constancia").textContent = "Se descargaron «" + ultimaConstancia.nombre + "» y «" + nombreEml +
      "». Abre el correo con doble clic, revisa y pulsa «Enviar».";
    avisar("Correo para TI listo, con el PDF adjunto.");
  });

  $("boton-correo-simple").addEventListener("click", function () {
    var nombre = ultimaConstancia ? ultimaConstancia.nombre : "(constancia en PDF)";
    abriendoCorreo = true; // abrir el correo no es salir de la página
    setTimeout(function () { abriendoCorreo = false; }, 1500);
    window.location.href = K.enlaceCorreo(datosConstancia(), nombre);
  });

  $("boton-fin-mapa").addEventListener("click", function () { cerrar("capa-fin"); batalla = null; mostrar("mapa"); });
  $("boton-fin-reintentar").addEventListener("click", function () {
    cerrar("capa-fin");
    if (repasoActual) {
      var rep = moduloRepaso();
      if (!rep.preguntas.length) { batalla = null; mostrar("mapa"); return; }
      moduloActual = rep;
    }
    batalla = null;
    abrirLeccion(moduloActual, repasoActual);
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
    if (document.querySelector(".capa:not([hidden])")) return;
    var tag = (ev.target && ev.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (!$("pantalla-leccion").hidden) {
      if (ev.key === "ArrowRight" && !$("concepto-siguiente").hidden && !$("concepto-siguiente").disabled) $("concepto-siguiente").click();
      if (ev.key === "ArrowLeft" && !$("concepto-anterior").disabled) $("concepto-anterior").click();
      return;
    }
    if ($("pantalla-batalla").hidden) return;
    if (/^[1-4]$/.test(ev.key) && !esperandoSiguiente) {
      var b = $("opciones").querySelectorAll(".opcion")[Number(ev.key) - 1];
      if (b && !b.disabled) b.click();
    } else if (ev.key === "Enter" && esperandoSiguiente && document.activeElement !== $("boton-siguiente")) {
      $("boton-siguiente").click();
    }
  });

  // Avisa antes de cerrar si hay una sesión en curso (el avance no se guarda).
  window.addEventListener("beforeunload", function (ev) {
    if (usuario && !abriendoCorreo) { ev.preventDefault(); ev.returnValue = ""; }
  });

  mostrar("acceso");
})();
