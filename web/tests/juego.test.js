// Pruebas de contenido, lógica y almacenamiento. Ejecutar con: npm test
const test = require("node:test");
const assert = require("node:assert");
const C = require("../js/contenido.js");
const L = require("../js/logica.js");
const A = require("../js/almacen.js");

function rndFijo(semilla) {
  let s = semilla;
  return () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
}

// Claves de prueba generadas al azar en cada corrida (no hay claves fijas en el código).
function claveAzar() {
  return "k" + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
}

function almacenEnMemoria(opciones) {
  const datos = {};
  const storage = {
    getItem: (k) => (k in datos ? datos[k] : null),
    setItem: (k, v) => { datos[k] = String(v); }
  };
  return A.crearAlmacen(Object.assign({ storage, crypto: globalThis.crypto }, opciones || {}));
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

test("registro, clave incorrecta y continuación en el mismo navegador", async () => {
  const K1 = claveAzar();
  const al = almacenEnMemoria();
  await assert.rejects(al.entrar({ nombre: "Ana", correo: "ana@firma.com", clave: K1 }), (e) => e.codigo === "consentimiento");
  const r = await al.entrar({ nombre: "Ana Pérez", correo: " Ana@Firma.com ", clave: K1, consentimiento: true });
  assert.ok(r.nuevo);
  assert.strictEqual(r.usuario.correo, "ana@firma.com");
  assert.ok(!JSON.stringify(r.usuario).includes(K1), "la clave no se guarda");
  r.usuario.progreso = L.progresoVacio();
  r.usuario.progreso.xp = 50;
  await al.guardar(r.usuario);
  await assert.rejects(al.entrar({ nombre: "Ana", correo: "ana@firma.com", clave: K1 + "x" }), (e) => e.codigo === "clave");
  const r2 = await al.entrar({ nombre: "Ana Pérez", correo: "ana@firma.com", clave: K1 });
  assert.strictEqual(r2.nuevo, false);
  assert.strictEqual(r2.usuario.progreso.xp, 50);
  assert.strictEqual(al.listar().length, 1);
});

test("el código de continuación lleva el avance a otro navegador y exige la clave", async () => {
  const K2 = claveAzar();
  const pc1 = almacenEnMemoria();
  const r = await pc1.entrar({ nombre: "Luis", correo: "luis@firma.com", clave: K2, consentimiento: true });
  r.usuario.progreso = L.progresoVacio();
  L.registrarRespuesta(r.usuario.progreso, "fun-1", true);
  await pc1.guardar(r.usuario);
  const codigo = await pc1.exportarCodigo(r.usuario, K2);
  assert.ok(codigo.startsWith("LEXBOSS1."));
  assert.ok(!codigo.includes("luis@firma.com"), "el código va cifrado");

  const pc2 = almacenEnMemoria();
  await assert.rejects(pc2.importarCodigo(codigo, K2 + "x"), (e) => e.codigo === "clave");
  await pc2.importarCodigo(codigo, K2);
  const r2 = await pc2.entrar({ nombre: "Luis", correo: "luis@firma.com", clave: K2 });
  assert.strictEqual(r2.nuevo, false);
  assert.strictEqual(L.estadoPregunta(r2.usuario.progreso, "fun-1"), "aprendida");
});

test("borrar exige la clave", async () => {
  const K3 = claveAzar();
  const al = almacenEnMemoria();
  await al.entrar({ nombre: "Eva", correo: "eva@firma.com", clave: K3, consentimiento: true });
  await assert.rejects(al.borrar("eva@firma.com", K3 + "x"));
  await al.borrar("eva@firma.com", K3);
  assert.strictEqual(al.listar().length, 0);
});

test("con registro central, recupera el avance más reciente y no envía la clave", async () => {
  const K4 = claveAzar();
  const servidor = {};
  const enviados = [];
  const fetchFalso = async (url, op) => {
    const c = JSON.parse(op.body);
    enviados.push(op.body);
    const fila = servidor[c.correo];
    if (fila && fila.verificador !== c.verificador) return { ok: true, json: async () => ({ ok: false, error: "clave" }) };
    if (c.accion === "guardar") servidor[c.correo] = { verificador: c.verificador, registro: c.registro };
    if (c.accion === "cargar") return { ok: true, json: async () => ({ ok: true, registro: fila ? fila.registro : null }) };
    return { ok: true, json: async () => ({ ok: true }) };
  };
  const config = { registroCentral: { url: "https://ejemplo.invalid/flujo" } };
  const pc1 = almacenEnMemoria({ fetch: fetchFalso, config });
  const r = await pc1.entrar({ nombre: "Sol", correo: "sol@firma.com", clave: K4, consentimiento: true });
  r.usuario.progreso = L.progresoVacio();
  r.usuario.progreso.xp = 99;
  await pc1.guardar(r.usuario);

  const pc2 = almacenEnMemoria({ fetch: fetchFalso, config });
  const r2 = await pc2.entrar({ nombre: "Sol", correo: "sol@firma.com", clave: K4 });
  assert.strictEqual(r2.origen, "central");
  assert.strictEqual(r2.usuario.progreso.xp, 99);
  await assert.rejects(pc2.entrar({ nombre: "Sol", correo: "sol@firma.com", clave: K4 + "x" }));
  assert.ok(enviados.every((b) => !b.includes(K4)), "la clave nunca viaja");
});

test("las claves nuevas exigen 10 caracteres y los correos raros se rechazan", async () => {
  const al = almacenEnMemoria();
  await assert.rejects(al.entrar({ nombre: "Ana", correo: "ana@firma.com", clave: claveAzar().slice(0, 8), consentimiento: true }), (e) => e.codigo === "clave");
  await assert.rejects(al.entrar({ nombre: "Ana", correo: "x' or Title ne '@firma.com", clave: claveAzar(), consentimiento: true }), (e) => e.codigo === "correo");
  assert.strictEqual(A.correoValido("ana.perez+ia@firma.com.co"), true);
  assert.strictEqual(A.correoValido("ana'@firma.com"), false);
});

test("el bloqueo del registro central se informa a la persona", async () => {
  const fetchBloqueado = async () => ({ ok: true, json: async () => ({ ok: false, error: "bloqueado" }) });
  const al = almacenEnMemoria({ fetch: fetchBloqueado, config: { registroCentral: { url: "https://ejemplo.invalid/flujo" } } });
  await assert.rejects(al.entrar({ nombre: "Leo", correo: "leo@firma.com", clave: claveAzar(), consentimiento: true }), (e) => e.codigo === "bloqueado");
});
