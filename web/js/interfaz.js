/*
 * Lex Boss — interfaz.
 * La mecánica está en logica.js, el contenido en contenido.js, los dibujos en
 * dibujos.js y la constancia en PDF en constancia.js. Aquí solo se pinta y se
 * reacciona. No se guarda nada: el avance vive en memoria mientras la página
 * está abierta.
 */
(function () {
  "use strict";

  var C = window.Contenido;
  var L = window.LexBoss;
  var D = window.Dibujos;
  var K = window.Constancia;
  var CONFIG = window.LEXBOSS_CONFIG || {};
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
      else if (res.noVistas === res.total) estado.textContent = m.final ? "Casos que mezclan todos los temas" : "Sin empezar";
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
      if (batalla && !batalla.fin && !$("pantalla-batalla").hidden) { abrir("capa-rendirse"); return; }
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
      modulo: moduloActual,
      batalla: batalla,
      correoTI: CORREO_TI
    };
  }

  function descargarConstancia() {
    try {
      var c = K.generar(datosConstancia());
      c.doc.save(c.nombre);
      ultimaConstancia = c;
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
      $("titulo-fin").textContent = repasoActual ? "¡Repaso superado!" : (m.final ? "¡Venciste al Comité de Riesgo Supremo!" : "¡Venciste a " + m.jefe + "!");
      $("texto-fin").textContent = "Lo que acertaste quedó como aprendido en esta sesión.";
    } else {
      $("titulo-fin").textContent = b.corazones <= 0 ? "Esta vez ganó el jefe" : "Te retiraste de la batalla";
      $("texto-fin").textContent = "Lo que fallaste aparece en el jefe de repaso. Lee de nuevo la lección e inténtalo otra vez.";
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
    $("bloque-constancia").hidden = r.total === 0;
    $("nota-enviar").textContent = CORREO_TI
      ? "Se abre un correo a " + CORREO_TI + ": adjunta el PDF y envíalo."
      : "Se abre un correo ya redactado: escribe la dirección de TI, adjunta el PDF y envíalo.";
    $("boton-fin-reintentar").hidden = b.gano && !repasoActual;
    abrir("capa-fin");
    if (r.total > 0) descargarConstancia();
    else $("texto-constancia").textContent = "";
  }

  $("boton-pdf").addEventListener("click", descargarConstancia);

  $("boton-enviar-ti").addEventListener("click", function () {
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

  // Avisa antes de cerrar si hay una sesión en curso (el avance no se guarda).
  window.addEventListener("beforeunload", function (ev) {
    if (usuario && !abriendoCorreo) { ev.preventDefault(); ev.returnValue = ""; }
  });

  mostrar("acceso");
})();
