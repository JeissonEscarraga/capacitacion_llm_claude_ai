/*
 * AI BOSS — responsiva de uso de IA generativa (Claude, ChatGPT y similares).
 *
 * La persona lee las cláusulas, completa sus datos, firma en pantalla y
 * descarga un PDF firmado que envía a TI. Como la constancia, todo se genera
 * en el navegador con jsPDF: no se envía nada a ningún servidor.
 *
 * IMPORTANTE: el texto es un modelo. Antes de usarlo como documento vinculante
 * debe revisarlo y aprobarlo el área jurídica y de talento humano de la firma.
 * Si se cambia el texto, sube VERSION para que TI sepa qué versión se firmó.
 */
(function (global) {
  "use strict";

  var VERSION = "1.0 · noviembre de 2026";

  var TITULO = "Responsiva de uso de herramientas de inteligencia artificial generativa";
  var SUBTITULO = "Claude, ChatGPT y herramientas similares";

  // {nombre}, {documento}, {cargo} y {area} se reemplazan con los datos del firmante.
  var DECLARACION = "Yo, {nombre}, identificado(a) con {documento}, en mi calidad de {cargo} del área {area}, declaro que leí y entendí esta responsiva y acepto libremente lo siguiente:";

  var CLAUSULAS = [
    {
      titulo: "Objeto y alcance",
      texto: [
        "Esta responsiva regula mi uso de Claude (Anthropic), ChatGPT (OpenAI) y cualquier otra herramienta de inteligencia artificial generativa, incluidos sus chats, Proyectos, aplicaciones de escritorio o móviles, extensiones, conectores, agentes y API, siempre que la use para asuntos de la firma o con información de la firma, de sus clientes o de terceros, desde equipos de la firma o propios."
      ]
    },
    {
      titulo: "Capacitación y políticas",
      texto: [
        "Declaro que recibí la capacitación sobre el uso de inteligencia artificial en la firma y que conozco sus políticas de seguridad de la información, protección de datos personales y confidencialidad. Ante cualquier duda, consultaré a TI antes de actuar."
      ]
    },
    {
      titulo: "Herramientas y cuentas autorizadas",
      texto: [
        "Solo usaré las herramientas, cuentas corporativas, conectores y extensiones aprobados por TI. No usaré cuentas personales ni herramientas no aprobadas para trabajo de la firma, ni compartiré mis credenciales de acceso."
      ]
    },
    {
      titulo: "Información que no entregaré a la IA",
      texto: [
        "No subiré ni adjuntaré archivos de clientes o de la firma a chats o Proyectos de IA. No escribiré ni pegaré en un prompt: datos personales o sensibles (Ley 1581 de 2012), información amparada por el secreto profesional, secretos empresariales, información de invenciones o marcas no radicadas, contraseñas, tokens o claves de acceso, ni información de NetSuite u otros sistemas de la firma.",
        "Cuando deba trabajar con documentos, usaré el procedimiento aprobado por la firma (Claude Code sobre la carpeta de la firma, sin subir archivos) y, cuando sea posible, copias seudonimizadas con la mínima información necesaria."
      ]
    },
    {
      titulo: "NetSuite y sistemas de la firma",
      texto: [
        "No subiré archivos de NetSuite (exportaciones, reportes, facturas, estados de cuenta ni capturas de pantalla) ni suministraré su información de forma directa a ningún modelo de lenguaje. La IA solo podrá ayudarme a diseñar soluciones con datos ficticios; toda la información se creará y se obtendrá desde el propio sistema, con mi usuario y rol, y con autorización previa y por escrito de mi jefe inmediato."
      ]
    },
    {
      titulo: "Verificación y uso de los resultados",
      texto: [
        "Verificaré en las fuentes oficiales las citas, normas, cifras, fechas y derechos de terceros antes de usar cualquier resultado de la IA, y lo asumiré como trabajo propio. No permitiré que una IA ejecute acciones con efectos externos (enviar, radicar, publicar, pagar o borrar) sin mi revisión y aprobación."
      ]
    },
    {
      titulo: "Responsabilidad de quien ejecuta el prompt",
      clave: true,
      texto: [
        "Entiendo y acepto que la persona que ejecuta el prompt es responsable del uso que hace de la IA. En consecuencia, asumo personalmente la responsabilidad por la pérdida, filtración, divulgación, robo, acceso indebido u obtención por parte de otras firmas, clientes, contrapartes o terceros de la información que yo suministre a una herramienta de IA, y por los incumplimientos legales, contractuales o regulatorios derivados de mi mal uso.",
        "Esto incluye, entre otras, las normas sobre protección de datos personales (Ley 1581 de 2012 y sus decretos reglamentarios), secreto profesional (Ley 1123 de 2007), delitos informáticos (Ley 1273 de 2009), secretos empresariales y competencia desleal (Decisión Andina 486 de 2000 y Ley 256 de 1996), derecho de autor (Ley 23 de 1982 y Decisión Andina 351 de 1993) y las obligaciones de confidencialidad pactadas con los clientes y con la firma.",
        "Excepción: cuando un uso específico haya sido autorizado previamente y por escrito por mi jefe inmediato, la responsabilidad por ese uso autorizado corresponde a quien lo autorizó, siempre que yo haya actuado dentro de los límites de la autorización y de esta responsiva. Si me aparto de lo autorizado, la responsabilidad vuelve a ser mía."
      ]
    },
    {
      titulo: "Consecuencias del incumplimiento",
      texto: [
        "Según el caso, y con respeto del debido proceso, el incumplimiento podrá dar lugar a: medidas disciplinarias conforme al reglamento interno y a mi contrato, incluida la terminación del vínculo con justa causa cuando la ley lo permita (Código Sustantivo del Trabajo, art. 58 y 62); acciones para reparar los daños y perjuicios causados a la firma, a sus clientes o a terceros; investigaciones disciplinarias profesionales; sanciones administrativas; y denuncias penales cuando la conducta constituya delito."
      ]
    },
    {
      titulo: "Reporte de incidentes",
      texto: [
        "Reportaré a TI de inmediato, y a más tardar dentro de las 24 horas siguientes a conocerlo, cualquier incidente: información entregada por error a una IA, una clave expuesta, un acceso indebido o un comportamiento sospechoso de una herramienta. Colaboraré con la contención y no ocultaré información. Reportar a tiempo no me exime de responsabilidad, pero ayuda a reducir el daño."
      ]
    },
    {
      titulo: "Supervisión",
      texto: [
        "Acepto que TI revise los registros de uso de las cuentas y herramientas corporativas de IA con fines de seguridad, auditoría y cumplimiento, conforme a las políticas de la firma y a la ley."
      ]
    },
    {
      titulo: "Vigencia",
      texto: [
        "Esta responsiva rige desde su firma y mientras tenga vínculo con la firma. Las obligaciones de confidencialidad y de reserva continúan después de terminado el vínculo."
      ]
    },
    {
      titulo: "Firma electrónica y tratamiento de mis datos",
      texto: [
        "Acepto firmar este documento por medios electrónicos, con plenos efectos (Ley 527 de 1999 y Decreto 2364 de 2012, compilado en el Decreto 1074 de 2015). Autorizo el tratamiento de mis datos (nombre, documento, cargo, área, jefe inmediato, correo y firma) para el control de esta responsiva, conforme a la política de tratamiento de datos de la firma."
      ]
    }
  ];

  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
    "septiembre", "octubre", "noviembre", "diciembre"];

  function dos(n) { return (n < 10 ? "0" : "") + n; }
  function fechaBonita(iso) {
    var d = new Date(iso);
    return d.getDate() + " de " + MESES[d.getMonth()] + " de " + d.getFullYear() + ", " + dos(d.getHours()) + ":" + dos(d.getMinutes());
  }

  function declaracion(f) {
    return DECLARACION
      .replace("{nombre}", f.nombre)
      .replace("{documento}", f.documento)
      .replace("{cargo}", f.cargo)
      .replace("{area}", f.area);
  }

  // Texto que se firma: con él se calcula la huella SHA-256 que aparece en el PDF.
  function textoCanonico(f, fecha) {
    var partes = [TITULO + " (" + VERSION + ")", declaracion(f)];
    CLAUSULAS.forEach(function (c, i) { partes.push((i + 1) + ". " + c.titulo + ": " + c.texto.join(" ")); });
    partes.push("Firmante: " + f.nombre + " | " + f.documento + " | " + f.cargo + " | " + f.area +
      " | Jefe inmediato: " + f.jefe + " | " + f.correo + " | " + f.ciudad + " | " + fecha);
    return partes.join("\n");
  }

  function nombreArchivo(f, iso) {
    var d = new Date(iso);
    var usuario = String(f.correo || "participante").split("@")[0].replace(/[^a-z0-9._-]/gi, "").slice(0, 40) || "participante";
    return "AIBoss_responsiva_IA_" + usuario + "_" + d.getFullYear() + dos(d.getMonth() + 1) + dos(d.getDate()) + "-" + dos(d.getHours()) + dos(d.getMinutes()) + ".pdf";
  }

  function asunto(f) { return "Responsiva de uso de IA firmada - " + f.nombre; }

  function cuerpo(f, archivo, conAdjunto) {
    return [
      "Hola, equipo de TI:",
      "",
      "Adjunto mi responsiva de uso de herramientas de inteligencia artificial generativa (Claude, ChatGPT y similares), firmada.",
      "",
      "Firmante: " + f.nombre + " (" + f.correo + ")",
      "Cargo y área: " + f.cargo + " · " + f.area,
      "Jefe inmediato: " + f.jefe,
      "Versión del documento: " + VERSION,
      "Archivo: " + archivo
    ].concat(conAdjunto ? [] : ["", "(Recuerda adjuntar el PDF firmado antes de enviar.)"]).join("\r\n");
  }

  /* ---------------- PDF ---------------- */

  // opciones: { firmante, firma (dataURL PNG), medio, fecha (ISO), huella (hex), correoTI, limpiar }
  function generar(opciones) {
    var jsPDF = global.jspdf && global.jspdf.jsPDF;
    if (!jsPDF) throw new Error("No se pudo cargar el generador de PDF.");
    var limpiar = opciones.limpiar || function (t) { return String(t); };
    var f = opciones.firmante;
    var fecha = opciones.fecha;

    var ANCHO = 210, ALTO = 297, M = 18, W = ANCHO - 2 * M, LIMITE = ALTO - 24, FACTOR = 0.43;
    var C = {
      azul: [39, 72, 201], azulClaro: [232, 237, 252], gris: [74, 77, 82], grisClaro: [244, 245, 246],
      texto: [33, 37, 41], tenue: [108, 112, 118], linea: [214, 217, 222], blanco: [255, 255, 255], rojo: [176, 42, 55]
    };
    var doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setProperties({ title: limpiar(TITULO), subject: "Responsiva de uso de IA", creator: "AI BOSS" });
    var y = 0;

    function relleno(c) { doc.setFillColor(c[0], c[1], c[2]); }
    function trazo(c) { doc.setDrawColor(c[0], c[1], c[2]); }
    function tinta(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function fuente(t, e) { doc.setFont("helvetica", e || "normal"); doc.setFontSize(t); }
    function lineas(t, tam, est, ancho) { fuente(tam, est); return doc.splitTextToSize(limpiar(t), ancho || W); }
    function alto(n, tam) { return n * tam * FACTOR; }
    function escribir(ls, x, yy, tam, est, col) {
      fuente(tam, est); tinta(col);
      ls.forEach(function (l, i) { doc.text(l, x, yy + i * tam * FACTOR); });
      return yy + alto(ls.length, tam);
    }
    function nuevaPagina() {
      doc.addPage();
      fuente(8, "normal"); tinta(C.tenue);
      doc.text(doc.splitTextToSize(limpiar("Responsiva de uso de IA · " + f.nombre + " · " + f.documento), W)[0], M, 12);
      trazo(C.linea); doc.setLineWidth(0.3); doc.line(M, 14.5, ANCHO - M, 14.5);
      y = 22;
    }
    function asegurar(h) { if (y + h > LIMITE) nuevaPagina(); }
    function parrafo(t, tam, est, col, sangria) {
      var ls = lineas(t, tam, est, W - (sangria || 0));
      for (var i = 0; i < ls.length; i++) {
        asegurar(alto(1, tam) + 1);
        y = escribir([ls[i]], M + (sangria || 0), y, tam, est, col);
      }
    }

    // Encabezado
    relleno(C.azul); doc.rect(0, 0, ANCHO, 38, "F");
    relleno(C.gris); doc.rect(0, 38, ANCHO, 1.6, "F");
    fuente(8, "bold"); tinta([200, 212, 255]);
    doc.text("AI BOSS · CLAUDE E IA PARA ABOGADOS", M, 11, { charSpace: 0.5 });
    var lsT = lineas(TITULO, 16, "bold", W);
    escribir(lsT, M, 19, 16, "bold", C.blanco);
    fuente(9.5, "normal"); tinta([220, 228, 255]);
    doc.text(limpiar(SUBTITULO + " · Versión " + VERSION), M, 34);
    y = 50;

    // Datos del firmante
    var filas = [
      ["Nombre", f.nombre], ["Documento", f.documento], ["Cargo", f.cargo], ["Área", f.area],
      ["Jefe inmediato", f.jefe], ["Correo", f.correo], ["Ciudad", f.ciudad], ["Fecha de firma", fechaBonita(fecha)]
    ];
    var hDatos = 10 + Math.ceil(filas.length / 2) * 10;
    relleno(C.grisClaro); doc.roundedRect(M, y - 6, W, hDatos, 3, 3, "F");
    filas.forEach(function (fila, i) {
      var col = i % 2, fil = Math.floor(i / 2);
      var x = M + 6 + col * (W / 2);
      var yy = y + fil * 10;
      fuente(7, "bold"); tinta(C.tenue); doc.text(limpiar(fila[0]).toUpperCase(), x, yy, { charSpace: 0.3 });
      escribir([lineas(fila[1], 10, "bold", W / 2 - 10)[0]], x, yy + 4.6, 10, "bold", C.texto);
    });
    y += hDatos + 2;

    parrafo(declaracion(f), 10.5, "bold", C.texto);
    y += 4;

    CLAUSULAS.forEach(function (c, i) {
      asegurar(alto(2, 11) + alto(3, 9.6));
      if (c.clave) {
        relleno(C.azul); doc.rect(M - 3, y - 4, 1.2, 6, "F");
      }
      y = escribir(lineas((i + 1) + ". " + c.titulo, 11, "bold", W), M, y, 11, "bold", c.clave ? C.azul : C.gris) + 1;
      c.texto.forEach(function (t) { parrafo(t, 9.6, "normal", C.texto); y += 1.6; });
      y += 2.4;
    });

    // Bloque de firma
    asegurar(70);
    y += 2;
    trazo(C.azul); doc.setLineWidth(0.5); doc.line(M, y, ANCHO - M, y);
    y += 7;
    escribir(["Firma del responsable"], M, y, 11, "bold", C.azul);
    y += 3;
    var wFirma = 80, hFirma = 32;
    relleno(C.blanco); trazo(C.linea); doc.setLineWidth(0.3); doc.roundedRect(M, y, wFirma, hFirma, 2, 2, "FD");
    if (opciones.firma) doc.addImage(opciones.firma, "PNG", M + 2, y + 2, wFirma - 4, hFirma - 4);
    var xD = M + wFirma + 8;
    var yD = y + 5;
    [["Firmado por", f.nombre], ["Documento", f.documento], ["Fecha y hora", fechaBonita(fecha)], ["Medio", opciones.medio || "Firma electrónica manuscrita en pantalla"]].forEach(function (d) {
      fuente(7, "bold"); tinta(C.tenue); doc.text(limpiar(d[0]).toUpperCase(), xD, yD, { charSpace: 0.3 });
      escribir([lineas(d[1], 9.5, "normal", ANCHO - M - xD)[0]], xD, yD + 4.2, 9.5, "normal", C.texto);
      yD += 8.2;
    });
    y += hFirma + 8;
    if (opciones.huella) {
      parrafo("Huella de integridad (SHA-256) del texto firmado y los datos del firmante: " + opciones.huella, 7.6, "normal", C.tenue);
      y += 2;
    }
    parrafo("Envía este PDF a " + (opciones.correoTI || "TI") + " desde tu correo de la firma. TI lo conserva como soporte de tu compromiso.", 8.6, "italic", C.tenue);

    // Pie
    var paginas = doc.getNumberOfPages();
    for (var n = 1; n <= paginas; n++) {
      doc.setPage(n);
      trazo(C.linea); doc.setLineWidth(0.3); doc.line(M, ALTO - 17, ANCHO - M, ALTO - 17);
      escribir(lineas("Documento con datos personales del firmante, tratados solo para el control de esta responsiva conforme a la política de tratamiento de datos de la firma.", 7.2, "normal", W - 28), M, ALTO - 12.5, 7.2, "normal", C.tenue);
      fuente(7.5, "bold"); tinta(C.tenue);
      doc.text("Página " + n + " de " + paginas, ANCHO - M, ALTO - 12.5, { align: "right" });
    }

    return { doc: doc, nombre: nombreArchivo(f, fecha) };
  }

  /* ---------------- Firma cargada: quitar el fondo ---------------- */

  // Recibe los píxeles RGBA de una imagen (se modifican en el sitio) y vuelve
  // transparente el fondo: estima su color con los bordes de la imagen y borra
  // lo que se le parezca, con un borde suave para que el trazo no quede dentado.
  // Devuelve el recuadro donde quedó la tinta ({ x, y, w, h }) o null si no hay.
  function quitarFondo(px, ancho, alto) {
    var muestras = [];
    function tomar(x, y) {
      var i = (y * ancho + x) * 4;
      if (px[i + 3] > 200) muestras.push([px[i], px[i + 1], px[i + 2]]);
    }
    var paso = Math.max(1, Math.floor(Math.min(ancho, alto) / 60));
    for (var x = 0; x < ancho; x += paso) { tomar(x, 0); tomar(x, alto - 1); }
    for (var y = 0; y < alto; y += paso) { tomar(0, y); tomar(ancho - 1, y); }
    var fondo = null;
    if (muestras.length) {
      fondo = [0, 1, 2].map(function (c) {
        var v = muestras.map(function (m) { return m[c]; }).sort(function (a, b) { return a - b; });
        return v[Math.floor(v.length / 2)];
      });
    }
    var luzFondo = fondo ? (fondo[0] + fondo[1] + fondo[2]) / 3 : 255;
    var cerca = 40, lejos = 90; // distancia al color del fondo: transparente hasta 40, opaco desde 90
    var minX = ancho, minY = alto, maxX = -1, maxY = -1;
    for (var yy = 0; yy < alto; yy++) {
      for (var xx = 0; xx < ancho; xx++) {
        var i = (yy * ancho + xx) * 4;
        var a = px[i + 3];
        if (fondo && a > 0) {
          var dr = px[i] - fondo[0], dg = px[i + 1] - fondo[1], db = px[i + 2] - fondo[2];
          var d = Math.sqrt(dr * dr + dg * dg + db * db);
          // La tinta debe ser más oscura que el fondo (papel claro); si el fondo es oscuro, basta la distancia.
          var luz = (px[i] + px[i + 1] + px[i + 2]) / 3;
          if (luzFondo > 128 && luz >= luzFondo - 10) d = Math.min(d, cerca);
          var factor = d <= cerca ? 0 : (d >= lejos ? 1 : (d - cerca) / (lejos - cerca));
          a = Math.round(a * factor);
          px[i + 3] = a;
        }
        if (a > 24) {
          if (xx < minX) minX = xx;
          if (xx > maxX) maxX = xx;
          if (yy < minY) minY = yy;
          if (yy > maxY) maxY = yy;
        }
      }
    }
    if (maxX < 0) return null;
    return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  }

  var api = {
    VERSION: VERSION,
    TITULO: TITULO,
    SUBTITULO: SUBTITULO,
    CLAUSULAS: CLAUSULAS,
    declaracion: declaracion,
    textoCanonico: textoCanonico,
    nombreArchivo: nombreArchivo,
    asunto: asunto,
    cuerpo: cuerpo,
    generar: generar,
    quitarFondo: quitarFondo
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else global.Responsiva = api;
})(typeof window !== "undefined" ? window : globalThis);
