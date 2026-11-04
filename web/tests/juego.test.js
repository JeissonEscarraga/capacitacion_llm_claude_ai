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
  assert.strictEqual(C.MODULOS.length, 12, "deben ser 12 jefes antes del final");
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
  assert.ok(r.aprendidas >= 3);
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
