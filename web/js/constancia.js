/*
 * Lex Boss — constancia en PDF de cada módulo.
 *
 * Se genera en el navegador con jsPDF (web/vendor, licencia MIT): no se envía
 * nada a ningún servidor. La persona descarga el PDF y lo envía a TI.
 */
(function (global) {
  "use strict";

  var MARGEN = 18;
  var ANCHO = 210;
  var ALTO = 297;
  var UTIL = ANCHO - 2 * MARGEN;
  var COLORES = {
    texto: [33, 37, 41],
    tenue: [108, 117, 125],
    verde: [25, 120, 60],
    rojo: [176, 42, 55],
    acento: [122, 84, 52]
  };
  // Caracteres de Windows-1252 por encima de 0xFF que las fuentes estándar del PDF sí muestran.
  var EXTRA_1252 = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ";

  function limpiar(texto) {
    var s = String(texto == null ? "" : texto)
      .replace(/[‐-‒−]/g, "-")
      .replace(/ /g, " ");
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      var code = s.charCodeAt(i);
      if (code === 10 || (code >= 32 && code <= 126) || (code >= 160 && code <= 255) || EXTRA_1252.indexOf(c) >= 0) out += c;
      else if (code >= 0xd800 && code <= 0xdbff) i++; // emoji u otro par sustituto: se omite
    }
    return out;
  }

  function dosDigitos(n) { return (n < 10 ? "0" : "") + n; }

  function fechaLarga(iso) {
    var d = new Date(iso);
    return dosDigitos(d.getDate()) + "/" + dosDigitos(d.getMonth() + 1) + "/" + d.getFullYear() +
      " " + dosDigitos(d.getHours()) + ":" + dosDigitos(d.getMinutes());
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

  function generar(opciones) {
    var jsPDF = global.jspdf && global.jspdf.jsPDF;
    if (!jsPDF) throw new Error("No se pudo cargar el generador de PDF.");
    var p = opciones.participante;
    var modulo = opciones.modulo;
    var b = opciones.batalla;
    var correoTI = opciones.correoTI || "";
    var fecha = b.terminada || new Date().toISOString();
    var r = resumen(b);

    var doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setProperties({ title: limpiar("Constancia Lex Boss - " + modulo.tema), subject: "Constancia de módulo", creator: "Lex Boss" });
    var y = MARGEN;

    function color(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function saltoSiHaceFalta(alto) {
      if (y + alto > ALTO - MARGEN - 12) { doc.addPage(); y = MARGEN; }
    }
    function parrafo(texto, tam, estilo, col, sangria) {
      doc.setFont("helvetica", estilo || "normal");
      doc.setFontSize(tam || 10);
      color(col || COLORES.texto);
      var x = MARGEN + (sangria || 0);
      var lineas = doc.splitTextToSize(limpiar(texto), UTIL - (sangria || 0));
      var alto = (tam || 10) * 0.42;
      lineas.forEach(function (l) {
        saltoSiHaceFalta(alto);
        doc.text(l, x, y);
        y += alto;
      });
    }
    function dato(etiqueta, valor) {
      saltoSiHaceFalta(6);
      doc.setFont("helvetica", "bold"); doc.setFontSize(10); color(COLORES.tenue);
      doc.text(limpiar(etiqueta), MARGEN, y);
      doc.setFont("helvetica", "normal"); color(COLORES.texto);
      var lineas = doc.splitTextToSize(limpiar(valor), UTIL - 38);
      doc.text(lineas, MARGEN + 38, y);
      y += 5.2 * lineas.length;
    }

    // Encabezado
    parrafo("Lex Boss · Claude e IA para abogados", 9, "normal", COLORES.tenue);
    y += 6; // espacio para la altura del título de 20 pt
    parrafo("Constancia de módulo", 20, "bold", COLORES.acento);
    y += 3;
    doc.setDrawColor(COLORES.acento[0], COLORES.acento[1], COLORES.acento[2]);
    doc.setLineWidth(0.6);
    doc.line(MARGEN, y, ANCHO - MARGEN, y);
    y += 7;

    dato("Participante", p.nombre);
    dato("Correo", p.correo);
    dato("Módulo", modulo.tema);
    dato("Jefe", modulo.jefe);
    dato("Fecha", fechaLarga(fecha));
    saltoSiHaceFalta(6);
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); color(COLORES.tenue);
    doc.text("Resultado", MARGEN, y);
    color(b.gano ? COLORES.verde : COLORES.rojo);
    doc.text(limpiar(resultadoTexto(b)), MARGEN + 38, y);
    y += 5.2;
    dato("Puntaje", r.buenas + " de " + r.total + " respuestas correctas (" + r.porcentaje + " %)");
    dato("Incorrectas", String(r.malas));
    y += 3;

    // Indicación de envío a TI
    var aviso = correoTI
      ? "Envía esta constancia a TI (" + correoTI + ") para su control."
      : "Envía esta constancia a TI para su control.";
    doc.setFillColor(248, 243, 230);
    var lineasAviso = doc.splitTextToSize(limpiar(aviso), UTIL - 8);
    var altoAviso = 5 * lineasAviso.length + 5;
    saltoSiHaceFalta(altoAviso + 2);
    doc.rect(MARGEN, y - 4, UTIL, altoAviso, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); color(COLORES.acento);
    doc.text(lineasAviso, MARGEN + 4, y + 1);
    y += altoAviso + 4;

    // Respuestas
    parrafo("Respuestas", 13, "bold", COLORES.acento);
    y += 2;
    if (!b.historial.length) parrafo("No se respondieron preguntas en este intento.", 10, "italic", COLORES.tenue);
    b.historial.forEach(function (h, i) {
      saltoSiHaceFalta(18);
      doc.setFont("helvetica", "bold"); doc.setFontSize(10);
      color(h.acierto ? COLORES.verde : COLORES.rojo);
      doc.text((i + 1) + ". " + (h.acierto ? "Correcta" : "Incorrecta"), MARGEN, y);
      color(COLORES.texto);
      var titulo = doc.splitTextToSize(limpiar(h.concepto), UTIL - 32);
      doc.text(titulo, MARGEN + 32, y);
      y += 4.6 * titulo.length + 0.8;
      parrafo("Pregunta: " + h.pregunta, 9.5, "normal", COLORES.texto, 4);
      parrafo("Respuesta elegida: " + h.elegida, 9.5, "normal", h.acierto ? COLORES.texto : COLORES.rojo, 4);
      if (!h.acierto) {
        parrafo("Respuesta correcta: " + h.correcta, 9.5, "bold", COLORES.verde, 4);
        parrafo("Por qué: " + h.explicacion, 9, "italic", COLORES.tenue, 4);
      }
      y += 3;
    });

    // Pie en todas las páginas
    var paginas = doc.getNumberOfPages();
    for (var n = 1; n <= paginas; n++) {
      doc.setPage(n);
      doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); color(COLORES.tenue);
      var pie = doc.splitTextToSize(limpiar(
        "Este documento contiene datos personales del participante (nombre, correo y resultados), " +
        "usados solo para el seguimiento de la capacitación en IA. Trátalo conforme a la política de tratamiento de datos de la firma."
      ), UTIL - 25);
      doc.text(pie, MARGEN, ALTO - 12);
      doc.text("Página " + n + " de " + paginas, ANCHO - MARGEN, ALTO - 12, { align: "right" });
    }

    return { doc: doc, nombre: nombreArchivo(modulo, p.correo, fecha), resumen: r, resultado: resultadoTexto(b) };
  }

  // Correo para TI ya redactado. El PDF se adjunta a mano: una página web no puede adjuntar archivos.
  function enlaceCorreo(opciones, archivo) {
    var p = opciones.participante;
    var b = opciones.batalla;
    var r = resumen(b);
    var asunto = "Constancia Lex Boss - " + opciones.modulo.tema + " - " + p.nombre;
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
      "?subject=" + encodeURIComponent(asunto) + "&body=" + encodeURIComponent(cuerpo);
  }

  global.Constancia = { generar: generar, enlaceCorreo: enlaceCorreo, limpiar: limpiar, resumen: resumen };
})(window);
