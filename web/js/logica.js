/*
 * Lex Boss — lógica del juego (sin interfaz).
 *
 * Inspirado en la mecánica de Logic Boss Game (As-Yung/Logic-Boss-Game, MIT):
 * respondes bien y atacas al jefe; respondes mal y el jefe te ataca; con una
 * racha de aciertos haces golpe crítico. Aquí cada jefe es un tema de la
 * capacitación y cada respuesta queda registrada como aprendida o por repasar.
 */
(function (global) {
  "use strict";

  var PERFILES = {
    socio: {
      id: "socio", nombre: "Socio(a) estratega", color: "azul",
      corazones: 4, racha: 3, comodines: 1, escudo: false,
      ventaja: "Un punto de credibilidad extra en cada jefe."
    },
    asociado: {
      id: "asociado", nombre: "Asociado(a) ágil", color: "verde",
      corazones: 3, racha: 2, comodines: 1, escudo: false,
      ventaja: "Golpe crítico con solo 2 aciertos seguidos."
    },
    analista: {
      id: "analista", nombre: "Analista de datos", color: "naranja",
      corazones: 3, racha: 3, comodines: 2, escudo: false,
      ventaja: "Dos consultas al expediente (descartan dos opciones) por jefe."
    },
    paralegal: {
      id: "paralegal", nombre: "Paralegal meticuloso(a)", color: "morada",
      corazones: 3, racha: 3, comodines: 1, escudo: true,
      ventaja: "Su primer error ante cada jefe no le quita credibilidad."
    }
  };

  var XP_ACIERTO = 10;
  var XP_CRITICO = 5;
  var XP_VICTORIA = 40;
  var XP_VICTORIA_FINAL = 100;
  var XP_POR_NIVEL = 120;

  var TITULOS = [
    "Practicante digital",
    "Abogado(a) junior en IA",
    "Asociado(a) en IA",
    "Asociado(a) senior en IA",
    "Socio(a) en IA",
    "Socio(a) director(a) en IA",
    "Leyenda de la IA legal"
  ];

  function nivelDe(xp) {
    var nivel = 1 + Math.floor((xp || 0) / XP_POR_NIVEL);
    return {
      nivel: nivel,
      titulo: TITULOS[Math.min(nivel, TITULOS.length) - 1],
      actual: (xp || 0) % XP_POR_NIVEL,
      necesaria: XP_POR_NIVEL
    };
  }

  /* ---------------- Progreso ---------------- */

  function progresoVacio() {
    return { version: 1, perfil: null, xp: 0, preguntas: {}, modulos: {}, partidas: 0 };
  }

  function normalizarProgreso(p) {
    var base = progresoVacio();
    if (!p || typeof p !== "object") return base;
    base.perfil = PERFILES[p.perfil] ? p.perfil : null;
    base.xp = Number(p.xp) > 0 ? Math.floor(Number(p.xp)) : 0;
    base.preguntas = p.preguntas && typeof p.preguntas === "object" ? p.preguntas : {};
    base.modulos = p.modulos && typeof p.modulos === "object" ? p.modulos : {};
    base.partidas = Number(p.partidas) > 0 ? Math.floor(Number(p.partidas)) : 0;
    return base;
  }

  function registrarRespuesta(prog, preguntaId, acierto, fecha) {
    var r = prog.preguntas[preguntaId] || { intentos: 0, aciertos: 0, fallos: 0 };
    r.intentos += 1;
    if (acierto) r.aciertos += 1; else r.fallos += 1;
    r.ultima = acierto ? "ok" : "error";
    r.fecha = fecha || new Date().toISOString();
    prog.preguntas[preguntaId] = r;
    return r;
  }

  // aprendida: la última vez la respondió bien; repasar: la última vez falló.
  function estadoPregunta(prog, preguntaId) {
    var r = prog.preguntas[preguntaId];
    if (!r) return "no-vista";
    return r.ultima === "ok" ? "aprendida" : "repasar";
  }

  function resumenModulo(prog, modulo) {
    var res = { total: modulo.preguntas.length, aprendidas: 0, repasar: 0, noVistas: 0 };
    modulo.preguntas.forEach(function (q) {
      var e = estadoPregunta(prog, q.id);
      if (e === "aprendida") res.aprendidas++;
      else if (e === "repasar") res.repasar++;
      else res.noVistas++;
    });
    res.porcentaje = Math.round((100 * res.aprendidas) / res.total);
    var m = prog.modulos[modulo.id] || {};
    res.superado = !!m.superado;
    res.victorias = m.victorias || 0;
    res.derrotas = m.derrotas || 0;
    return res;
  }

  function resumenGeneral(prog, modulos) {
    var res = { total: 0, aprendidas: 0, repasar: 0, noVistas: 0, superados: 0, modulos: modulos.length };
    modulos.forEach(function (m) {
      var r = resumenModulo(prog, m);
      res.total += r.total;
      res.aprendidas += r.aprendidas;
      res.repasar += r.repasar;
      res.noVistas += r.noVistas;
      if (r.superado) res.superados++;
    });
    res.porcentaje = res.total ? Math.round((100 * res.aprendidas) / res.total) : 0;
    return res;
  }

  function finalDesbloqueado(prog, modulos) {
    return modulos.every(function (m) { return prog.modulos[m.id] && prog.modulos[m.id].superado; });
  }

  function preguntasPorRepasar(prog, modulos) {
    var lista = [];
    modulos.forEach(function (m) {
      m.preguntas.forEach(function (q) {
        if (estadoPregunta(prog, q.id) === "repasar") lista.push(q);
      });
    });
    return lista;
  }

  /* ---------------- Utilidades ---------------- */

  function barajar(rnd, lista) {
    var copia = lista.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = copia[i]; copia[i] = copia[j]; copia[j] = t;
    }
    return copia;
  }

  /* ---------------- Batalla ---------------- */

  // opciones: { modulo, perfil, progreso, rnd, repaso }
  function Batalla(opciones) {
    this.modulo = opciones.modulo;
    this.perfil = PERFILES[opciones.perfil] || PERFILES.socio;
    this.progreso = opciones.progreso;
    this.rnd = opciones.rnd || Math.random;
    this.repaso = !!opciones.repaso;

    var n = this.modulo.preguntas.length;
    this.vidaJefeMax = this.modulo.final ? 6 : Math.max(1, Math.min(n - 1, 8));
    this.vidaJefe = this.vidaJefeMax;
    this.corazonesMax = this.perfil.corazones;
    this.corazones = this.corazonesMax;
    this.comodines = this.perfil.comodines;
    this.escudo = this.perfil.escudo;
    this.racha = 0;
    this.mejorRacha = 0;
    this.aciertos = 0;
    this.errores = 0;
    this.xpGanada = 0;
    this.fin = false;
    this.gano = false;
    this.actual = null;
    this.falladasAqui = [];
    this.cola = this._ordenar(this.modulo.preguntas);
  }

  // Primero las no vistas, luego las que hay que repasar y al final las aprendidas.
  Batalla.prototype._ordenar = function (preguntas) {
    var prog = this.progreso;
    var grupos = { "no-vista": [], repasar: [], aprendida: [] };
    preguntas.forEach(function (q) { grupos[estadoPregunta(prog, q.id)].push(q); });
    return barajar(this.rnd, grupos["no-vista"])
      .concat(barajar(this.rnd, grupos.repasar))
      .concat(barajar(this.rnd, grupos.aprendida));
  };

  Batalla.prototype.siguiente = function () {
    if (this.fin) return null;
    if (!this.cola.length) {
      // Se acabaron: vuelven primero las falladas en esta batalla.
      var base = this.falladasAqui.length ? this.falladasAqui : this.modulo.preguntas;
      this.cola = barajar(this.rnd, base);
      this.falladasAqui = [];
    }
    var q = this.cola.shift();
    var opciones = barajar(this.rnd, [q.ok].concat(q.no));
    this.actual = {
      pregunta: q,
      opciones: opciones,
      correcta: opciones.indexOf(q.ok),
      ocultas: []
    };
    return { id: q.id, concepto: q.concepto, texto: q.p, opciones: opciones.slice() };
  };

  // Descarta dos opciones incorrectas de la pregunta actual.
  Batalla.prototype.usarComodin = function () {
    if (!this.actual || this.comodines <= 0 || this.actual.ocultas.length) return [];
    this.comodines -= 1;
    var correcta = this.actual.correcta;
    var malas = [];
    for (var i = 0; i < this.actual.opciones.length; i++) if (i !== correcta) malas.push(i);
    this.actual.ocultas = barajar(this.rnd, malas).slice(0, 2);
    return this.actual.ocultas.slice();
  };

  Batalla.prototype.responder = function (indice, fecha) {
    if (this.fin || !this.actual) return null;
    var a = this.actual;
    var acierto = indice === a.correcta;
    var ev = {
      acierto: acierto,
      correcta: a.correcta,
      explicacion: a.pregunta.e,
      concepto: a.pregunta.concepto,
      critico: false,
      danio: 0,
      escudoUsado: false,
      xp: 0
    };
    registrarRespuesta(this.progreso, a.pregunta.id, acierto, fecha);

    if (acierto) {
      this.aciertos++;
      this.racha++;
      this.mejorRacha = Math.max(this.mejorRacha, this.racha);
      ev.critico = this.racha >= this.perfil.racha;
      ev.danio = ev.critico ? 2 : 1;
      if (ev.critico) this.racha = 0;
      this.vidaJefe = Math.max(0, this.vidaJefe - ev.danio);
      ev.xp = XP_ACIERTO + (ev.critico ? XP_CRITICO : 0);
    } else {
      this.errores++;
      this.racha = 0;
      this.falladasAqui.push(a.pregunta);
      if (this.escudo) {
        this.escudo = false;
        ev.escudoUsado = true;
      } else {
        this.corazones = Math.max(0, this.corazones - 1);
      }
    }

    if (this.vidaJefe <= 0) {
      this.fin = true;
      this.gano = true;
      ev.xp += this.modulo.final ? XP_VICTORIA_FINAL : XP_VICTORIA;
    } else if (this.corazones <= 0) {
      this.fin = true;
      this.gano = false;
    }

    this.xpGanada += ev.xp;
    this.progreso.xp = (this.progreso.xp || 0) + ev.xp;
    if (this.fin) this._cerrar(fecha);

    ev.vidaJefe = this.vidaJefe;
    ev.corazones = this.corazones;
    ev.racha = this.racha;
    ev.fin = this.fin;
    ev.gano = this.gano;
    this.actual = null;
    return ev;
  };

  Batalla.prototype.rendirse = function (fecha) {
    if (this.fin) return;
    this.fin = true;
    this.gano = false;
    this._cerrar(fecha);
  };

  Batalla.prototype._cerrar = function (fecha) {
    this.progreso.partidas = (this.progreso.partidas || 0) + 1;
    if (this.repaso) return;
    var m = this.progreso.modulos[this.modulo.id] || { superado: false, victorias: 0, derrotas: 0, mejorRacha: 0 };
    if (this.gano) {
      m.superado = true;
      m.victorias = (m.victorias || 0) + 1;
      if (!m.fecha) m.fecha = fecha || new Date().toISOString();
    } else {
      m.derrotas = (m.derrotas || 0) + 1;
    }
    m.mejorRacha = Math.max(m.mejorRacha || 0, this.mejorRacha);
    this.progreso.modulos[this.modulo.id] = m;
  };

  var api = {
    PERFILES: PERFILES,
    TITULOS: TITULOS,
    XP_POR_NIVEL: XP_POR_NIVEL,
    nivelDe: nivelDe,
    progresoVacio: progresoVacio,
    normalizarProgreso: normalizarProgreso,
    registrarRespuesta: registrarRespuesta,
    estadoPregunta: estadoPregunta,
    resumenModulo: resumenModulo,
    resumenGeneral: resumenGeneral,
    finalDesbloqueado: finalDesbloqueado,
    preguntasPorRepasar: preguntasPorRepasar,
    barajar: barajar,
    Batalla: Batalla
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.LexBoss = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
