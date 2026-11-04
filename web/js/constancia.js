/*
 * Lex Boss — constancia en PDF de cada módulo.
 *
 * Se genera en el navegador con jsPDF (web/vendor, licencia MIT): no se envía
 * nada a ningún servidor. La persona descarga el PDF y lo envía a TI.
 *
 * Orden del documento:
 *   1. Encabezado con el módulo y la fecha.
 *   2. Tarjetas: participante y resultado (porcentaje, aciertos, barra).
 *   3. Siguiente paso: a quién enviarlo.
 *   4. Para repasar: las falladas, con la respuesta correcta y el porqué.
 *   5. Respondiste bien: lista compacta.
 */
(function (global) {
  "use strict";

  var ANCHO = 210;
  var ALTO = 297;
  var M = 16;                 // margen lateral (mm)
  var W = ANCHO - 2 * M;      // ancho útil
  var LIMITE = ALTO - 22;     // por debajo empieza el pie de página
  var FACTOR = 0.43;          // alto de línea en mm por punto de fuente

  var C = {
    pizarra: [29, 42, 37],
    marco: [122, 84, 52],
    amarillo: [244, 212, 124],
    texto: [33, 37, 41],
    tenue: [108, 117, 125],
    linea: [222, 226, 230],
    fondo: [247, 246, 242],
    verde: [25, 120, 60],
    verdeClaro: [232, 245, 236],
    rojo: [176, 42, 55],
    rojoClaro: [251, 234, 236],
    ambar: [154, 103, 0],
    ambarClaro: [253, 246, 227],
    blanco: [255, 255, 255]
  };

  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
    "septiembre", "octubre", "noviembre", "diciembre"];

  // Caracteres de Windows-1252 por encima de 0xFF que las fuentes estándar del PDF sí muestran.
  var EXTRA_1252 = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ";

  function limpiar(texto) {
    var s = String(texto == null ? "" : texto)
      .replace(/[‐-‒−]/g, "-")
      .replace(/ /g, " ");
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      var code = s.charCodeAt(i);
      if (code === 10 || (code >= 32 && code <= 126) || (code >= 160 && code <= 255) || EXTRA_1252.indexOf(ch) >= 0) out += ch;
      else if (code >= 0xd800 && code <= 0xdbff) i++; // emoji u otro par sustituto: se omite
    }
    return out;
  }

  function dosDigitos(n) { return (n < 10 ? "0" : "") + n; }

  function fechaBonita(iso) {
    var d = new Date(iso);
    return d.getDate() + " de " + MESES[d.getMonth()] + " de " + d.getFullYear() +
      ", " + dosDigitos(d.getHours()) + ":" + dosDigitos(d.getMinutes());
  }

  function nombreArchivo(modulo, correo, iso) {
    var d = new Date(iso);
    var usuario = String(correo || "participante").split("@")[0].replace(/[^a-z0-9._-]/gi, "").slice(0, 40) || "participante";
    var sello = d.getFullYear() + dosDigitos(d.getMonth() + 1) + dosDigitos(d.getDate()) + "-" + dosDigitos(d.getHours()) + dosDigitos(d.getMinutes());
    return "LexBoss_" + modulo.id + "_" + usuario + "_" + sello + ".pdf";
  }

  function resultadoTexto(batalla) {
    if (batalla.gano) return "Superado";
    if (batalla.corazones <= 0) return "No superado";
    return "Retirado antes de terminar";
  }

  function resumen(batalla) {
    var total = batalla.historial.length;
    var buenas = batalla.historial.filter(function (h) { return h.acierto; }).length;
    return { total: total, buenas: buenas, malas: total - buenas, porcentaje: total ? Math.round((100 * buenas) / total) : 0 };
  }

  function asuntoCorreo(modulo, nombre) {
    return "Constancia Lex Boss - " + modulo.tema + " - " + nombre;
  }

  function generar(opciones) {
    var jsPDF = global.jspdf && global.jspdf.jsPDF;
    if (!jsPDF) throw new Error("No se pudo cargar el generador de PDF.");
    var p = opciones.participante;
    var modulo = opciones.modulo;
    var b = opciones.batalla;
    var correoTI = opciones.correoTI || "";
    var generada = new Date().toISOString();        // cuándo se crea este PDF
    var fecha = b.terminada || generada;             // cuándo terminó la práctica
    var conceptoFecha = opciones.conceptoFecha || null;
    var r = resumen(b);
    var resultado = resultadoTexto(b);
    var tono = b.gano
      ? { fuerte: C.verde, claro: C.verdeClaro }
      : (b.corazones <= 0 ? { fuerte: C.rojo, claro: C.rojoClaro } : { fuerte: C.ambar, claro: C.ambarClaro });

    var doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setProperties({ title: limpiar("Constancia Lex Boss - " + modulo.tema), subject: "Constancia de módulo", creator: "Lex Boss" });
    var y = 0;

    /* ---------- utilidades de dibujo ---------- */

    function relleno(c) { doc.setFillColor(c[0], c[1], c[2]); }
    function trazo(c) { doc.setDrawColor(c[0], c[1], c[2]); }
    function tinta(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function fuente(tam, estilo) { doc.setFont("helvetica", estilo || "normal"); doc.setFontSize(tam); }
    function lineas(texto, tam, estilo, ancho) { fuente(tam, estilo); return doc.splitTextToSize(limpiar(texto), ancho); }
    function alto(n, tam) { return n * tam * FACTOR; }

    // Escribe líneas ya partidas desde la línea base y; devuelve la nueva y.
    function escribir(ls, x, yy, tam, estilo, color) {
      fuente(tam, estilo); tinta(color);
      ls.forEach(function (l, i) { doc.text(l, x, yy + i * tam * FACTOR); });
      return yy + alto(ls.length, tam);
    }

    function etiqueta(texto, x, yy, color) {
      fuente(7.2, "bold"); tinta(color || C.tenue);
      doc.text(limpiar(texto).toUpperCase(), x, yy, { charSpace: 0.35 });
    }

    function nuevaPagina() {
      doc.addPage();
      // Encabezado corto en las páginas siguientes
      fuente(8, "normal"); tinta(C.tenue);
      var corto = doc.splitTextToSize(limpiar("Lex Boss · Constancia de " + p.nombre + " · " + modulo.tema), W)[0];
      doc.text(corto, M, 12);
      trazo(C.linea); doc.setLineWidth(0.3); doc.line(M, 14.5, ANCHO - M, 14.5);
      y = 22;
    }

    function asegurar(h) { if (y + h > LIMITE) nuevaPagina(); }

    function tituloSeccion(texto, sub) {
      var hSub = sub ? alto(lineas(sub, 9, "normal", W).length, 9) + 1 : 0;
      asegurar(12 + hSub + 20);
      fuente(13, "bold"); tinta(C.marco);
      doc.text(limpiar(texto), M, y);
      trazo(C.marco); doc.setLineWidth(0.5); doc.line(M, y + 2, ANCHO - M, y + 2);
      y += 7;
      if (sub) y = escribir(lineas(sub, 9, "normal", W), M, y, 9, "normal", C.tenue) + 2;
    }

    function marca(x, yy, ok) {
      relleno(ok ? C.verde : C.rojo);
      doc.circle(x, yy, 2.6, "F");
      doc.setFont("zapfdingbats", "normal"); doc.setFontSize(7.5); tinta(C.blanco);
      doc.text(ok ? "4" : "8", x, yy + 1.05, { align: "center" });
    }

    /* ---------- 1. Encabezado ---------- */

    relleno(C.pizarra); doc.rect(0, 0, ANCHO, 36, "F");
    relleno(C.marco); doc.rect(0, 36, ANCHO, 1.4, "F");
    fuente(8, "bold"); tinta(C.amarillo);
    doc.text("LEX BOSS · CLAUDE E IA PARA ABOGADOS", M, 12, { charSpace: 0.5 });
    fuente(22, "bold"); tinta(C.blanco);
    doc.text("Constancia de módulo", M, 24);
    fuente(9.5, "normal"); tinta([205, 214, 208]);
    doc.text(limpiar("Generada el " + fechaBonita(generada)), M, 31.5);
    y = 48;

    etiqueta("Módulo", M, y);
    y += 5.5;
    y = escribir(lineas(modulo.tema, 15, "bold", W), M, y, 15, "bold", C.texto);
    y = escribir(lineas("Jefe: " + modulo.jefe, 9.5, "normal", W), M, y + 0.5, 9.5, "normal", C.tenue);
    if (conceptoFecha) {
      y = escribir(lineas("Conceptualización completada el " + fechaBonita(conceptoFecha) +
        " · Práctica terminada el " + fechaBonita(fecha), 9.5, "normal", W), M, y + 0.5, 9.5, "normal", C.tenue);
    }
    y += 5;

    /* ---------- 2. Tarjetas: participante y resultado ---------- */

    var hTarjeta = 38;
    var wIzq = W * 0.56;
    var xDer = M + wIzq + 4;
    var wDer = W - wIzq - 4;
    var top = y;

    relleno(C.fondo); doc.roundedRect(M, top, wIzq, hTarjeta, 3, 3, "F");
    etiqueta("Participante", M + 6, top + 8);
    escribir([lineas(p.nombre, 12, "bold", wIzq - 12)[0]], M + 6, top + 14, 12, "bold", C.texto);
    escribir([lineas(p.correo, 9.5, "normal", wIzq - 12)[0]], M + 6, top + 19.5, 9.5, "normal", C.texto);
    var perfil = opciones.perfil || null;
    etiqueta(perfil ? "Perfil y área" : "Práctica terminada", M + 6, top + 27.5);
    escribir([lineas(perfil ? perfil.nombre + " · " + perfil.area : fechaBonita(fecha), 9.5, "normal", wIzq - 12)[0]], M + 6, top + 32.5, 9.5, "normal", C.texto);

    relleno(tono.claro); doc.roundedRect(xDer, top, wDer, hTarjeta, 3, 3, "F");
    // Etiqueta de resultado tipo "píldora"
    fuente(7.5, "bold");
    var textoPildora = limpiar(resultado).toUpperCase();
    var wPildora = doc.getTextWidth(textoPildora) + 7;
    relleno(tono.fuerte); doc.roundedRect(xDer + 6, top + 4.5, wPildora, 5.6, 2.8, 2.8, "F");
    tinta(C.blanco); doc.text(textoPildora, xDer + 6 + 3.5, top + 8.4);
    fuente(28, "bold"); tinta(tono.fuerte);
    doc.text(r.porcentaje + " %", xDer + 6, top + 23);
    escribir([r.buenas + " de " + r.total + " respuestas correctas"], xDer + 6, top + 29, 9.5, "normal", C.texto);
    // Barra de aciertos
    var wBarra = wDer - 12;
    relleno(C.blanco); doc.roundedRect(xDer + 6, top + 32, wBarra, 2.6, 1.3, 1.3, "F");
    if (r.porcentaje > 0) {
      relleno(tono.fuerte);
      doc.roundedRect(xDer + 6, top + 32, Math.max(2.6, wBarra * r.porcentaje / 100), 2.6, 1.3, 1.3, "F");
    }
    y = top + hTarjeta + 7;

    /* ---------- 3. Siguiente paso ---------- */

    var destino = correoTI || "TI";
    var pasos = [
      "1.  Guarda este PDF (ya quedó en tu carpeta de descargas).",
      "2.  Envíalo a " + destino + " desde tu correo de la firma.",
      "3.  Asunto sugerido: «" + asuntoCorreo(modulo, p.nombre) + "»."
    ];
    var lsPasos = [];
    pasos.forEach(function (t) { lsPasos = lsPasos.concat(lineas(t, 9.5, "normal", W - 14)); });
    var hPaso = 12 + alto(lsPasos.length, 9.5) + 3;
    relleno(C.ambarClaro); doc.roundedRect(M, y, W, hPaso, 3, 3, "F");
    relleno(C.marco); doc.rect(M, y, 1.6, hPaso, "F");
    escribir(["Siguiente paso: envía esta constancia a TI para su control"], M + 7, y + 7, 10.5, "bold", C.marco);
    escribir(lsPasos, M + 7, y + 13, 9.5, "normal", C.texto);
    y += hPaso + 9;

    /* ---------- Evaluación general: resultado por tema y resumen del curso ---------- */

    if (modulo.evaluacion) {
      var porTema = {};
      var orden = [];
      b.historial.forEach(function (h) {
        if (!porTema[h.tema]) { porTema[h.tema] = { intentos: 0, ok: false }; orden.push(h.tema); }
        porTema[h.tema].intentos++;
        if (h.acierto) porTema[h.tema].ok = true;
      });
      tituloSeccion("Resultado por tema", "Una pregunta de cada tema del curso. Las falladas volvían al final hasta resolverlas.");
      orden.forEach(function (tema) {
        var t = porTema[tema];
        var estado = !t.ok ? "Sin resolver" : (t.intentos === 1 ? "Al primer intento" : "Resuelta en " + t.intentos + " intentos");
        var ls = lineas(tema, 9.5, "normal", W - 60);
        asegurar(alto(ls.length, 9.5) + 3);
        marca(M + 3, y - 1.2, t.ok && t.intentos === 1);
        escribir(ls, M + 9, y, 9.5, "normal", C.texto);
        fuente(9, "bold"); tinta(t.ok ? (t.intentos === 1 ? C.verde : C.ambar) : C.rojo);
        doc.text(limpiar(estado), ANCHO - M, y, { align: "right" });
        y += alto(ls.length, 9.5) + 2.2;
      });
      y += 5;

      tituloSeccion("Resumen general de las lecciones", "Lo esencial de cada tema del curso.");
      (opciones.modulos || []).forEach(function (m, i) {
        var clave = (opciones.claves || {})[m.id];
        if (!clave) return;
        var lsT = lineas((i + 1) + ". " + m.tema, 10, "bold", W - 4);
        var lsC = lineas(clave, 9.2, "normal", W - 8);
        asegurar(alto(lsT.length, 10) + alto(lsC.length, 9.2) + 4);
        var yy = escribir(lsT, M, y, 10, "bold", C.marco);
        y = escribir(lsC, M + 4, yy + 0.5, 9.2, "normal", C.texto) + 3.5;
      });
      y += 4;
    }

    /* ---------- 4. Para repasar ---------- */

    var resueltasLuego = {};
    b.historial.forEach(function (h) { if (h.acierto) resueltasLuego[h.id] = true; });
    var malas = b.historial.filter(function (h) { return !h.acierto; });
    var buenas = b.historial.filter(function (h) { return h.acierto; });
    var wTexto = W - 16;

    if (!b.historial.length) {
      tituloSeccion("Respuestas");
      escribir(["No se respondieron preguntas en este intento."], M, y, 10, "italic", C.tenue);
      y += 6;
    }

    if (malas.length) {
      tituloSeccion("Para repasar (" + malas.length + ")", "Las preguntas que fallaste, con la respuesta correcta y la explicación.");
      malas.forEach(function (h, i) {
        var bloques = [
          { et: null, ls: lineas((i + 1) + ". " + h.concepto + (resueltasLuego[h.id] ? " (luego la respondiste bien)" : ""), 10.5, "bold", wTexto), tam: 10.5, est: "bold", col: C.texto },
          { et: "Pregunta", ls: lineas(h.pregunta, 9.5, "normal", wTexto), tam: 9.5, est: "normal", col: C.texto },
          { et: "Tu respuesta", ls: lineas(h.elegida, 9.5, "normal", wTexto), tam: 9.5, est: "normal", col: C.rojo },
          { et: "Respuesta correcta", ls: lineas(h.correcta, 9.5, "bold", wTexto), tam: 9.5, est: "bold", col: C.verde },
          { et: "Por qué", ls: lineas(h.explicacion, 9, "italic", wTexto), tam: 9, est: "italic", col: C.tenue }
        ];
        // La tarjeta se dibuja por tramos: si no cabe entera, sigue en la página
        // siguiente en vez de dejar un hueco. El título nunca queda solo.
        var altos = bloques.map(function (bl) { return (bl.et ? 4 : 0) + alto(bl.ls.length, bl.tam) + 2.2; });
        altos[0] += 4.5;                       // margen superior de la tarjeta
        altos[altos.length - 1] += 1.5;        // margen inferior
        asegurar(altos[0] + altos[1]);
        bloques.forEach(function (bl, j) {
          var h = altos[j];
          if (j > 1) asegurar(h);
          relleno(C.fondo); doc.rect(M, y, W, h, "F");
          relleno(C.rojo); doc.rect(M, y, 1.4, h, "F");
          var yy = y + (j === 0 ? 7.4 : 3.4);
          if (j === 0) marca(M + 7.5, y + 6.2, false);
          if (bl.et) { etiqueta(bl.et, M + 13, yy); yy += 4; }
          escribir(bl.ls, M + 13, yy, bl.tam, bl.est, bl.col);
          y += h;
        });
        y += 4;
      });
      y += 3;
    }

    /* ---------- 5. Respondiste bien ---------- */

    if (buenas.length) {
      tituloSeccion("Respondiste bien (" + buenas.length + ")");
      buenas.forEach(function (h) {
        var lsC = lineas(h.concepto, 10, "bold", wTexto);
        var lsP = lineas(h.pregunta, 9, "normal", wTexto);
        var hFila = alto(lsC.length, 10) + alto(lsP.length, 9) + 4;
        asegurar(hFila + 2);
        marca(M + 3, y - 1.2, true);
        var yy = escribir(lsC, M + 9, y, 10, "bold", C.texto);
        yy = escribir(lsP, M + 9, yy + 0.6, 9, "normal", C.tenue);
        trazo(C.linea); doc.setLineWidth(0.25); doc.line(M + 9, yy + 0.4, ANCHO - M, yy + 0.4);
        y = yy + 5;
      });
    }

    /* ---------- Pie en todas las páginas ---------- */

    var paginas = doc.getNumberOfPages();
    for (var n = 1; n <= paginas; n++) {
      doc.setPage(n);
      trazo(C.linea); doc.setLineWidth(0.3); doc.line(M, ALTO - 17, ANCHO - M, ALTO - 17);
      var pie = lineas(
        "Este documento contiene datos personales del participante (nombre, correo y resultados), usados solo para " +
        "el seguimiento de la capacitación en IA. Trátalo conforme a la política de tratamiento de datos de la firma.",
        7.3, "normal", W - 28);
      escribir(pie, M, ALTO - 12.5, 7.3, "normal", C.tenue);
      fuente(7.5, "bold"); tinta(C.tenue);
      doc.text("Página " + n + " de " + paginas, ANCHO - M, ALTO - 12.5, { align: "right" });
    }

    return { doc: doc, nombre: nombreArchivo(modulo, p.correo, fecha), resumen: r, resultado: resultado };
  }

  // Correo para TI ya redactado. El PDF se adjunta a mano: una página web no puede adjuntar archivos.
  function enlaceCorreo(opciones, archivo) {
    var p = opciones.participante;
    var b = opciones.batalla;
    var r = resumen(b);
    var cuerpo = [
      "Hola, equipo de TI:",
      "",
      "Adjunto mi constancia del módulo «" + opciones.modulo.tema + "» del juego de capacitación Lex Boss.",
      "",
      "Participante: " + p.nombre + " (" + p.correo + ")",
      "Resultado: " + resultadoTexto(b),
      "Puntaje: " + r.buenas + " de " + r.total + " respuestas correctas (" + r.porcentaje + " %)",
      "Archivo: " + archivo,
      "",
      "(Recuerda adjuntar el PDF descargado antes de enviar.)"
    ].join("\r\n");
    return "mailto:" + encodeURIComponent(opciones.correoTI || "").replace(/%40/g, "@") +
      "?subject=" + encodeURIComponent(asuntoCorreo(opciones.modulo, p.nombre)) + "&body=" + encodeURIComponent(cuerpo);
  }

  global.Constancia = { generar: generar, enlaceCorreo: enlaceCorreo, limpiar: limpiar, resumen: resumen };
})(window);
