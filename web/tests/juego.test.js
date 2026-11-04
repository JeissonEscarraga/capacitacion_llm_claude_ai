// Pruebas de contenido, lógica y almacenamiento. Ejecutar con: npm test
const test = require("node:test");
const assert = require("node:assert");
const C = require("../js/contenido.js");
const L = require("../js/logica.js");

function rndFijo(semilla) {
  let s = semilla;
  return () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
}

test("el contenido está completo y bien formado", () => {
  const ids = new Set();
  assert.strictEqual(C.MODULOS.length, 13, "deben ser 13 jefes antes del final");
  C.TODOS.forEach((m) => {
    assert.ok(m.id && m.tema && m.jefe && m.forma && m.frase, m.id);
    assert.ok(m.leccion.length >= 3, "lección corta en " + m.id);
    assert.ok(m.preguntas.length >= 6, "mínimo 6 preguntas en " + m.id);
    m.preguntas.forEach((q) => {
      assert.ok(!ids.has(q.id), "id repetido " + q.id);
      ids.add(q.id);
      assert.ok(q.concepto && q.p && q.ok && q.e, q.id);
      assert.strictEqual(q.no.length, 3, "3 distractores en " + q.id);
      assert.strictEqual(new Set([q.ok].concat(q.no)).size, 4, "opciones repetidas en " + q.id);
    });
  });
});

test("una batalla perfecta vence al jefe y marca lo aprendido", () => {
  const prog = L.progresoVacio();
  const m = C.MODULOS[0];
  const b = new L.Batalla({ modulo: m, perfil: "socio", progreso: prog, rnd: rndFijo(7) });
  let vueltas = 0;
  while (!b.fin && vueltas++ < 50) {
    b.siguiente();
    b.responder(b.actual.correcta);
  }
  assert.ok(b.gano);
  assert.ok(prog.modulos[m.id].superado);
  assert.ok(prog.xp > 0);
  const r = L.resumenModulo(prog, m);
  assert.strictEqual(r.repasar, 0);
  assert.strictEqual(r.porcentaje, 100);
});

test("los errores quitan credibilidad, quedan por repasar y el escudo del paralegal funciona", () => {
  const prog = L.progresoVacio();
  const m = C.MODULOS[3];
  const b = new L.Batalla({ modulo: m, perfil: "paralegal", progreso: prog, rnd: rndFijo(3) });
  let vueltas = 0;
  while (!b.fin && vueltas++ < 50) {
    b.siguiente();
    b.responder((b.actual.correcta + 1) % 4);
  }
  assert.strictEqual(b.gano, false);
  assert.strictEqual(b.errores, 4, "3 corazones + 1 escudo");
  assert.strictEqual(prog.modulos[m.id].superado, false);
  assert.strictEqual(L.preguntasPorRepasar(prog, C.TODOS).length, 4);
});

test("el comodín descarta exactamente dos opciones incorrectas", () => {
  const b = new L.Batalla({ modulo: C.MODULOS[1], perfil: "analista", progreso: L.progresoVacio(), rnd: rndFijo(11) });
  b.siguiente();
  const ocultas = b.usarComodin();
  assert.strictEqual(ocultas.length, 2);
  assert.ok(!ocultas.includes(b.actual.correcta));
  assert.strictEqual(b.comodines, 1);
});

test("las preguntas no vistas salen primero", () => {
  const prog = L.progresoVacio();
  const m = C.MODULOS[2];
  L.registrarRespuesta(prog, m.preguntas[0].id, true);
  const b = new L.Batalla({ modulo: m, perfil: "socio", progreso: prog, rnd: rndFijo(5) });
  assert.strictEqual(b.cola[b.cola.length - 1].id, m.preguntas[0].id);
});

test("el final se desbloquea al vencer a los 12 jefes", () => {
  const prog = L.progresoVacio();
  assert.strictEqual(L.finalDesbloqueado(prog, C.MODULOS), false);
  C.MODULOS.forEach((m) => { prog.modulos[m.id] = { superado: true }; });
  assert.strictEqual(L.finalDesbloqueado(prog, C.MODULOS), true);
});

test("la batalla registra cada respuesta para la constancia", () => {
  const prog = L.progresoVacio();
  const m = C.MODULOS[4];
  const b = new L.Batalla({ modulo: m, perfil: "socio", progreso: prog, rnd: rndFijo(9) });
  b.siguiente();
  b.responder(b.actual.correcta);
  b.siguiente();
  const mala = (b.actual.correcta + 1) % 4;
  const elegida = b.actual.opciones[mala];
  b.responder(mala);
  b.rendirse();
  assert.strictEqual(b.historial.length, 2);
  assert.strictEqual(b.historial[0].acierto, true);
  assert.strictEqual(b.historial[1].acierto, false);
  assert.strictEqual(b.historial[1].elegida, elegida);
  assert.ok(b.historial[1].correcta && b.historial[1].explicacion && b.historial[1].pregunta);
  assert.ok(b.terminada, "fecha de cierre para el PDF");
  assert.strictEqual(prog.modulos[m.id].superado, false);
});

test("cada módulo tiene conceptualización completa y bien formada", () => {
  const K = require("../js/conceptos.js").CONCEPTOS;
  const VISUALES = ["flujo", "tarjetas", "comparar", "chat"];
  C.TODOS.forEach((m) => {
    const c = K[m.id];
    assert.ok(c, "falta conceptualización de " + m.id);
    assert.ok(c.intro && c.intro.length > 20, "intro en " + m.id);
    const conceptos = c.pasos.filter((p) => p.tipo === "concepto");
    const practicas = c.pasos.filter((p) => p.tipo === "elige" || p.tipo === "clasifica");
    assert.ok(conceptos.length >= 3, "al menos 3 conceptos en " + m.id);
    assert.ok(practicas.length >= 2, "al menos 2 prácticas en " + m.id);
    c.pasos.forEach((p, i) => {
      const donde = m.id + " paso " + (i + 1);
      assert.ok(p.titulo, "título en " + donde);
      if (p.tipo === "concepto") {
        assert.ok(Array.isArray(p.texto) && p.texto.length, "texto en " + donde);
        assert.ok(p.visual && VISUALES.includes(p.visual.tipo), "visual válido en " + donde);
        assert.ok(p.simple && p.ejemplo, "analogía y ejemplo en " + donde);
      } else if (p.tipo === "elige") {
        assert.ok(p.situacion, donde);
        assert.strictEqual(p.opciones.filter((o) => o.ok).length, 1, "una sola correcta en " + donde);
        assert.ok(p.opciones.every((o) => o.t && o.r), "retroalimentación en " + donde);
      } else if (p.tipo === "clasifica") {
        assert.strictEqual(p.categorias.length, 2, donde);
        assert.ok(p.items.length >= 4, "al menos 4 elementos en " + donde);
        assert.ok(p.items.every((it) => it.c === 0 || it.c === 1), "categoría válida en " + donde);
        assert.ok(p.items.some((it) => it.c === 0) && p.items.some((it) => it.c === 1), "ambas categorías usadas en " + donde);
      } else {
        assert.fail("tipo desconocido en " + donde);
      }
    });
  });
});

test("vencer al jefe exige responder bien todas las preguntas (100 % aprendido)", () => {
  for (const perfil of Object.keys(L.PERFILES)) {
    const prog = L.progresoVacio();
    const m = C.MODULOS[5];
    const b = new L.Batalla({ modulo: m, perfil, progreso: prog, rnd: rndFijo(13) });
    let n = 0;
    while (!b.fin && n++ < 100) {
      b.siguiente();
      // Falla la primera pregunta una vez y luego acierta todo.
      b.responder(n === 1 ? (b.actual.correcta + 1) % 4 : b.actual.correcta);
    }
    assert.ok(b.gano, perfil + " debe ganar");
    const r = L.resumenModulo(prog, m);
    assert.strictEqual(r.porcentaje, 100, perfil + ": vencido debe ser 100 % aprendido");
    assert.strictEqual(r.superado, true);
  }
});

test("el golpe crítico devuelve credibilidad y las ventajas nuevas funcionan", () => {
  const prog = L.progresoVacio();
  const b = new L.Batalla({ modulo: C.MODULOS[0], perfil: "administrativo", progreso: prog, rnd: rndFijo(2) });
  b.siguiente(); b.responder((b.actual.correcta + 1) % 4); // pierde 1
  assert.strictEqual(b.corazones, 2);
  let ev;
  for (let i = 0; i < 3; i++) { b.siguiente(); ev = b.responder(b.actual.correcta); }
  assert.ok(ev.critico);
  assert.strictEqual(b.corazones, 3, "crítico cura 1");
  assert.ok(ev.comodinGanado, "administrativo gana una consulta");
  const f = new L.Batalla({ modulo: C.MODULOS[0], perfil: "finanzas", progreso: L.progresoVacio(), rnd: rndFijo(2) });
  f.siguiente();
  assert.strictEqual(f.responder(f.actual.correcta).xp, 15, "finanzas: +50 % de experiencia");
  assert.strictEqual(new L.Batalla({ modulo: C.MODULOS[0], perfil: "it", progreso: L.progresoVacio() }).comodines, 3);
});

test("los 8 personajes tienen área y hay ejemplos adaptados para cada paso", () => {
  const E = require("../js/ejemplos-areas.js");
  const K = require("../js/conceptos.js").CONCEPTOS;
  const ids = Object.keys(L.PERFILES);
  ["it", "administrativo", "multidisciplinar", "finanzas"].forEach((id) => assert.ok(ids.includes(id), id));
  ids.forEach((id) => assert.ok(L.AREAS[L.PERFILES[id].area], "área de " + id));
  const modulos = C.TODOS.concat([C.EVALUACION]);
  ["tecnologia", "administrativo", "multidisciplinar", "finanzas"].forEach((area) => {
    modulos.forEach((m) => {
      const a = E[area][m.id];
      assert.ok(a && a.intro, area + " intro " + m.id);
      K[m.id].pasos.filter((p) => p.tipo === "concepto").forEach((p) => {
        assert.ok(a.ejemplos[p.titulo], area + " sin ejemplo: " + m.id + " / " + p.titulo);
      });
    });
  });
});

test("la evaluación general toma una pregunta de cada módulo y tiene resumen de todos", () => {
  const qs = L.preguntasEvaluacion(C.TODOS, rndFijo(4));
  assert.strictEqual(qs.length, C.TODOS.length);
  assert.strictEqual(new Set(qs.map((q) => q.modulo)).size, C.TODOS.length);
  C.TODOS.forEach((m) => assert.ok(C.CLAVES[m.id], "idea clave de " + m.id));
  const prog = L.progresoVacio();
  const mod = Object.assign({}, C.EVALUACION, { preguntas: qs });
  const b = new L.Batalla({ modulo: mod, perfil: "socio", progreso: prog, rnd: rndFijo(4) });
  assert.strictEqual(b.corazonesMax, 6, "evaluación da 2 de credibilidad extra");
  while (!b.fin) { b.siguiente(); b.responder(b.actual.correcta); }
  assert.ok(b.gano && prog.modulos["resumen-general"].superado);
  assert.ok(b.historial.every((h) => h.tema), "cada respuesta trae su tema");
});

test("el correo para TI lleva el PDF adjunto y se abre como borrador", () => {
  const K = require("../js/constancia.js");
  const pdf = Buffer.from("%PDF-1.3 prueba").toString("base64");
  const opciones = {
    participante: { nombre: "María Prueba", correo: "maria@ejemplo.test" },
    modulo: C.MODULOS[0],
    batalla: { historial: [{ acierto: true }, { acierto: false }], gano: true, corazones: 2 },
    correoTI: "admon_sistemas@cavelier.com"
  };
  const eml = K.correoEml(opciones, "AIBoss_fundamentos_maria_20261104-1200.pdf", pdf);
  assert.ok(eml.startsWith("To: admon_sistemas@cavelier.com\r\n"));
  assert.ok(eml.includes("\r\nX-Unsent: 1\r\n"), "Outlook lo abre como borrador");
  assert.ok(eml.includes('Content-Disposition: attachment; filename="AIBoss_fundamentos_maria_20261104-1200.pdf"'));
  assert.ok(eml.includes(pdf), "el PDF va dentro del correo");
  const asunto = eml.match(/Subject: =\?UTF-8\?B\?(.+)\?=/)[1];
  assert.ok(Buffer.from(asunto, "base64").toString("utf8").startsWith("Constancia AI BOSS - Fundamentos"));
  assert.ok(eml.trimEnd().endsWith("--"), "cierre del multipart");
  assert.ok(K.enlaceCorreo(opciones, "x.pdf").startsWith("mailto:admon_sistemas@cavelier.com?subject="));
});
