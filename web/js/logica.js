/*
 * AI BOSS — lógica del juego (sin interfaz).
 *
 * Inspirado en la mecánica de Logic Boss Game (As-Yung/Logic-Boss-Game, MIT):
 * respondes bien y atacas al jefe; respondes mal y el jefe te ataca.
 *
 * Regla de la práctica: el jefe tiene tantos puntos de resistencia como
 * preguntas tenga el módulo, y cada pregunta respondida bien por primera vez
 * en la batalla le quita uno. Las que se fallan vuelven al final de la fila.
 * Así, vencer al jefe significa haber respondido bien TODAS las preguntas del
 * módulo (100 % aprendido). La racha de aciertos da un golpe crítico, que
 * devuelve un punto de credibilidad y da experiencia extra.
 */
(function (global) {
  "use strict";

  // area: agrupa los personajes para adaptar los ejemplos de la conceptualización.
  var AREAS = {
    juridico: "Jurídica",
    tecnologia: "Tecnología y datos",
    administrativo: "Administrativa",
    multidisciplinar: "Multidisciplinar (validación de patentes)",
    finanzas: "Finanzas"
  };

  var PERFILES = {
    socio: {
      id: "socio", nombre: "Socio(a) estratega", area: "juridico",
      corazones: 4, racha: 3, comodines: 1,
      ventaja: "Un punto de credibilidad extra en cada AI."
    },
    asociado: {
      id: "asociado", nombre: "Asociado(a) ágil", area: "juridico",
      corazones: 3, racha: 2, comodines: 1,
      ventaja: "Golpe crítico con solo 2 aciertos seguidos."
    },
    paralegal: {
      id: "paralegal", nombre: "Paralegal meticuloso(a)", area: "juridico",
      corazones: 3, racha: 3, comodines: 1, escudo: true,
      ventaja: "Su primer error ante cada AI no le quita credibilidad."
    },
    analista: {
      id: "analista", nombre: "Analista de datos", area: "tecnologia",
      corazones: 3, racha: 3, comodines: 2,
      ventaja: "Dos consultas al expediente (descartan dos opciones) por AI."
    },
    it: {
      id: "it", nombre: "IT & Big Data", area: "tecnologia",
      corazones: 2, racha: 3, comodines: 3,
      ventaja: "Tres consultas al expediente por AI, pero solo 2 de credibilidad."
    },
    administrativo: {
      id: "administrativo", nombre: "Administrativo(a) organizado(a)", area: "administrativo",
      corazones: 3, racha: 3, comodines: 1, comodinPorCritico: true,
      ventaja: "Cada golpe crítico le devuelve una consulta al expediente."
    },
    multidisciplinar: {
      id: "multidisciplinar", nombre: "Experto(a) multidisciplinar", area: "multidisciplinar",
      corazones: 2, racha: 2, comodines: 1, escudo: true,
      ventaja: "Crítico con 2 aciertos y escudo para el primer error, pero solo 2 de credibilidad."
    },
    finanzas: {
      id: "finanzas", nombre: "Analista de finanzas", area: "finanzas",
      corazones: 3, racha: 3, comodines: 1, bonoXP: 1.5,
      ventaja: "Rentabilidad: gana 50 % más de experiencia."
    }
  };

  var XP_ACIERTO = 10;
  var XP_CRITICO = 5;
  var XP_VICTORIA = 40;
  var XP_VICTORIA_FINAL = 100;
  var XP_POR_NIVEL = 120;

  var TITULOS = [
    "Aprendiz digital",
    "Explorador(a) de IA",
    "Practicante en IA",
    "Usuario(a) avanzado(a) de IA",
    "Referente de IA",
    "Mentor(a) de IA",
    "Leyenda de la IA"
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
    return { version: 2, perfil: null, xp: 0, preguntas: {}, modulos: {}, conceptos: {}, partidas: 0 };
  }

  function normalizarProgreso(p) {
    var base = progresoVacio();
    if (!p || typeof p !== "object") return base;
    base.perfil = PERFILES[p.perfil] ? p.perfil : null;
    base.xp = Number(p.xp) > 0 ? Math.floor(Number(p.xp)) : 0;
    base.preguntas = p.preguntas && typeof p.preguntas === "object" ? p.preguntas : {};
    base.modulos = p.modulos && typeof p.modulos === "object" ? p.modulos : {};
    base.conceptos = p.conceptos && typeof p.conceptos === "object" ? p.conceptos : {};
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
    res.porcentaje = res.total ? Math.round((100 * res.aprendidas) / res.total) : 0;
    var m = prog.modulos[modulo.id] || {};
    res.superado = !!m.superado;
    res.victorias = m.victorias || 0;
    res.derrotas = m.derrotas || 0;
    res.concepto = !!(prog.conceptos && prog.conceptos[modulo.id]);
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

  // Una pregunta al azar de cada módulo: la evaluación general.
  function preguntasEvaluacion(modulos, rnd) {
    rnd = rnd || Math.random;
    return modulos.map(function (m) {
      var q = m.preguntas[Math.floor(rnd() * m.preguntas.length)];
      return Object.assign({}, q, { modulo: m.id, tema: m.tema });
    });
  }

  /* ---------------- Batalla ---------------- */

  // opciones: { modulo, perfil, progreso, rnd, repaso }
  function Batalla(opciones) {
    this.modulo = opciones.modulo;
    this.perfil = PERFILES[opciones.perfil] || PERFILES.socio;
    this.progreso = opciones.progreso;
    this.rnd = opciones.rnd || Math.random;
    this.repaso = !!opciones.repaso;

    this.vidaJefeMax = this.modulo.preguntas.length;
    this.vidaJefe = this.vidaJefeMax;
    this.corazonesMax = this.perfil.corazones + (this.modulo.corazonesExtra || 0);
    this.corazones = this.corazonesMax;
    this.comodines = this.perfil.comodines;
    this.escudo = !!this.perfil.escudo;
    this.racha = 0;
    this.mejorRacha = 0;
    this.aciertos = 0;
    this.errores = 0;
    this.xpGanada = 0;
    this.fin = false;
    this.gano = false;
    this.actual = null;
    this.resueltas = {};  // id -> true cuando ya se respondió bien en esta batalla
    this.historial = [];  // cada respuesta de esta batalla, para la constancia en PDF
    this.inicio = new Date().toISOString();
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

  Batalla.prototype.pendientes = function () {
    return this.vidaJefe;
  };

  Batalla.prototype.siguiente = function () {
    if (this.fin) return null;
    var self = this;
    // Saltar las que ya se resolvieron (por si quedaron duplicadas en la fila).
    while (this.cola.length && this.resueltas[this.cola[0].id]) this.cola.shift();
    if (!this.cola.length) {
      this.cola = barajar(this.rnd, this.modulo.preguntas.filter(function (q) { return !self.resueltas[q.id]; }));
    }
    var q = this.cola.shift();
    var opciones = barajar(this.rnd, [q.ok].concat(q.no));
    this.actual = {
      pregunta: q,
      opciones: opciones,
      correcta: opciones.indexOf(q.ok),
      ocultas: []
    };
    return { id: q.id, concepto: q.concepto, texto: q.p, opciones: opciones.slice(), tema: q.tema || null };
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
    var q = a.pregunta;
    var acierto = indice === a.correcta;
    var bono = this.perfil.bonoXP || 1;
    var ev = {
      acierto: acierto,
      correcta: a.correcta,
      explicacion: q.e,
      concepto: q.concepto,
      critico: false,
      danio: 0,
      curacion: 0,
      comodinGanado: false,
      escudoUsado: false,
      xp: 0
    };
    registrarRespuesta(this.progreso, q.id, acierto, fecha);
    this.historial.push({
      id: q.id,
      concepto: q.concepto,
      pregunta: q.p,
      elegida: a.opciones[indice] !== undefined ? a.opciones[indice] : "",
      correcta: q.ok,
      acierto: acierto,
      explicacion: q.e,
      modulo: q.modulo || this.modulo.id,
      tema: q.tema || this.modulo.tema
    });

    if (acierto) {
      this.aciertos++;
      this.racha++;
      this.mejorRacha = Math.max(this.mejorRacha, this.racha);
      if (!this.resueltas[q.id]) {
        this.resueltas[q.id] = true;
        ev.danio = 1;
        this.vidaJefe = Math.max(0, this.vidaJefe - 1);
      }
      ev.critico = this.racha >= this.perfil.racha;
      ev.xp = XP_ACIERTO;
      if (ev.critico) {
        this.racha = 0;
        ev.xp += XP_CRITICO;
        if (this.corazones < this.corazonesMax) { this.corazones++; ev.curacion = 1; }
        if (this.perfil.comodinPorCritico) { this.comodines++; ev.comodinGanado = true; }
      }
    } else {
      this.errores++;
      this.racha = 0;
      this.cola.push(q); // vuelve al final de la fila
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
      ev.xp += this.modulo.final || this.modulo.evaluacion ? XP_VICTORIA_FINAL : XP_VICTORIA;
    } else if (this.corazones <= 0) {
      this.fin = true;
      this.gano = false;
    }

    ev.xp = Math.round(ev.xp * bono);
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
    this.retirado = true;
    this._cerrar(fecha);
  };

  Batalla.prototype._cerrar = function (fecha) {
    this.terminada = fecha || new Date().toISOString();
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
    AREAS: AREAS,
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
    preguntasEvaluacion: preguntasEvaluacion,
    barajar: barajar,
    Batalla: Batalla
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.AIBoss = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
