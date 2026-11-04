/*
 * AI BOSS — dibujos en tiza (SVG 120x120).
 * Las clases c-* dan el color de la tiza y están en estilos.css.
 */
(function (global) {
  "use strict";

  function g(clase, contenido) { return '<g class="' + clase + '">' + contenido + "</g>"; }
  function p(d) { return '<path d="' + d + '"/>'; }
  function c(cx, cy, r) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>'; }
  function ojos(x1, x2, y, r) {
    return g("c-blanca", c(x1, y, r) + c(x2, y, r)) + g("c-pizarra lleno", c(x1 + 1, y + 1, r / 2.4) + c(x2 + 1, y + 1, r / 2.4));
  }
  function ceño(x1, x2, y) {
    return g("c-blanca sin-relleno", p("M" + (x1 - 6) + " " + (y - 9) + "l11 4M" + (x2 + 6) + " " + (y - 9) + "l-11 4"));
  }

  var JEFES = {
    ojo: function (k) {
      return g(k, p("M14 60q46-50 92 0q-46 50-92 0z")) +
        g("c-blanca", c(60, 60, 18)) + g(k + " lleno", c(60, 60, 9)) + g("c-pizarra lleno", c(60, 60, 4)) +
        g("c-blanca sin-relleno fino", p("M30 32l-6-10M60 24v-12M90 32l6-10M30 88l-6 10M90 88l6 10")) +
        g("c-amarilla sin-relleno fino brillo", p("M100 18l4-4M106 26h6"));
    },
    garra: function (k) {
      return g(k, p("M30 100q-6-40 10-58l-12-22l20 12q12-6 24 0l20-12l-12 22q16 18 10 58z")) +
        g(k + " sin-relleno", p("M18 56q-10 10-4 28l10-6M102 56q10 10 4 28l-10-6")) +
        ojos(50, 72, 56, 6) + ceño(50, 72, 56) +
        g("c-blanca", p("M48 80h26l-4 8l-4-6l-4 6l-4-6l-4 6l-4-6z"));
    },
    mago: function (k) {
      return g(k, p("M32 112q4-48 28-50q24 2 28 50z")) +
        g("c-blanca", c(60, 56, 15)) + ojos(54, 67, 54, 3.5) +
        g("c-blanca", p("M46 64q14 30 28 0q-14 8-28 0z")) +
        g(k, p("M30 44h60M40 44l22-38l16 38z")) +
        g("c-amarilla lleno", p("M62 24l2 4l4 1l-3 3l1 4l-4-2l-4 2l1-4l-3-3l4-1z")) +
        g("c-naranja sin-relleno", p("M98 112V40")) + g("c-amarilla", c(98, 34, 6)) +
        g("c-blanca sin-relleno fino", p("M10 30h14M12 40h10M8 50h16"));
    },
    escudo: function (k) {
      return g(k, p("M60 10l40 14v30q0 38-40 56q-40-18-40-56V24z")) +
        g("c-blanca sin-relleno fino", p("M60 22v76M32 48h56")) +
        ojos(46, 74, 60, 6) + ceño(46, 74, 60) +
        g("c-blanca sin-relleno", p("M48 84q12-8 24 0")) +
        g("c-amarilla sin-relleno fino", p("M52 34h16v8H52zM56 34v-4a4 4 0 0 1 8 0v4"));
    },
    dragon: function (k) {
      return g(k, p("M24 104q-6-40 20-56q-4-20 10-30l6 12l6-12q14 10 10 30q26 16 20 56z")) +
        g(k + " sin-relleno", p("M22 70q-16-14-10-34q10 8 18 18M98 70q16-14 10-34q-10 8-18 18")) +
        ojos(50, 70, 56, 6) + ceño(50, 70, 56) +
        g("c-blanca", p("M48 76q12 10 24 0z")) +
        g("c-naranja sin-relleno brillo", p("M60 86q-6 10 0 20q6-10 0-20z")) +
        g("c-amarilla sin-relleno fino", p("M86 14q6 4 4 10M94 22l6-2"));
    },
    fantasma: function (k) {
      return g(k, p("M28 104V54q0-34 32-34t32 34v50l-8-8l-8 8l-8-8l-8 8l-8-8l-8 8l-8-8z")) +
        ojos(48, 72, 54, 7) +
        g("c-blanca sin-relleno", p("M50 78q10-8 20 0")) +
        g("c-blanca sin-relleno fino", p("M10 40q6-6 12 0M98 30q6-6 12 0"));
    },
    buho: function (k) {
      return g(k, p("M30 106q-8-40 6-62l-6-20l18 12q12-6 24 0l18-12l-6 20q14 22 6 62z")) +
        g("c-blanca", c(48, 56, 11) + c(72, 56, 11)) +
        g("c-pizarra lleno", c(48, 56, 4) + c(72, 56, 4)) +
        g("c-amarilla", p("M56 68l4 8l4-8z")) +
        g("c-blanca sin-relleno fino", p("M44 86q4 4 8 0q4 4 8 0q4 4 8 0q4 4 8 0")) +
        g("c-azul", p("M10 100h30v8H10zM14 92h24v8H14z"));
    },
    caldero: function (k) {
      return g("c-blanca sin-relleno fino", p("M40 40q-4-10 4-16M58 34q-6-12 2-20M76 40q6-10-2-18")) +
        g(k, p("M20 52h80q0 40-20 50H40q-20-10-20-50z")) +
        g("c-tenue", p("M16 46h88v8H16z")) +
        ojos(48, 72, 70, 6) + ceño(48, 72, 70) +
        g("c-blanca sin-relleno", p("M50 88q10 6 20 0")) +
        g("c-naranja sin-relleno", p("M40 110l6-8M80 110l-6-8M60 112v-10"));
    },
    pulpo: function (k) {
      return g(k, p("M30 66q0-46 30-46t30 46z")) +
        g(k + " sin-relleno", p("M34 66q-14 20-6 40M46 66q-6 24 0 42M60 66v44M74 66q6 24 0 42M86 66q14 20 6 40")) +
        ojos(48, 72, 46, 6) + ceño(48, 72, 46) +
        g("c-amarilla sin-relleno fino brillo", p("M28 106l-8 4M92 106l8 4M14 70h8M98 70h8")) +
        g("c-blanca sin-relleno", p("M52 60q8 4 16 0"));
    },
    golem: function (k) {
      return g(k, p("M30 106l4-50l-14-6l6-24l24-4h20l24 4l6 24l-14 6l4 50z")) +
        g("c-tenue sin-relleno fino", p("M44 74l10 6l-4 12M78 70l-8 10l6 10M40 40l8 4")) +
        g("c-amarilla lleno", c(50, 44, 4) + c(70, 44, 4)) +
        g("c-blanca sin-relleno", p("M48 58h24")) +
        g("c-amarilla sin-relleno fino brillo", p("M50 34l-4-6M70 34l4-6"));
    },
    robot: function (k) {
      return g(k, p("M30 50h60v52H30z")) +
        g(k, p("M38 18h44v32H38z")) +
        g("c-blanca sin-relleno fino", p("M60 18V8M54 8h12")) +
        g("c-amarilla lleno", c(50, 34, 4) + c(70, 34, 4)) +
        g("c-blanca sin-relleno", p("M48 44h24")) +
        g("c-pizarra", p("M38 60h44v24H38z")) +
        g("c-verde sin-relleno fino", p("M42 66l6 4l-6 4M52 76h12")) +
        g(k + " sin-relleno", p("M30 60l-14 18M90 60l14 18M44 102v8M76 102v8"));
    },
    serpiente: function (k) {
      return g(k + " sin-relleno grueso", p("M20 106q20-20 40 0t40 0M24 86q16-30 36-30t26-14")) +
        g(k, p("M70 20q22-4 26 14q2 14-14 16q-16 0-18-14q0-12 6-16z")) +
        g("c-amarilla lleno", c(78, 30, 3) + c(90, 30, 3)) +
        g("c-roja sin-relleno fino", p("M84 48v8l-4 4M84 56l4 4")) +
        g("c-amarilla sin-relleno fino", p("M14 30h16v10H14zM18 30v-4h8v4")) +
        g("c-blanca sin-relleno fino", p("M20 22l-4-6M30 22l4-6"));
    },
    comite: function (k) {
      function silla(x) {
        return g(k, p("M" + (x - 14) + " 108q0-34 14-36q14 2 14 36z")) +
          g("c-blanca", c(x, 60, 9)) +
          g("c-pizarra lleno", c(x - 3, 59, 1.6) + c(x + 3, 59, 1.6)) +
          g("c-blanca sin-relleno fino", p("M" + (x - 5) + " 52l4 2M" + (x + 5) + " 52l-4 2"));
      }
      return g("c-tenue", p("M8 80h104v6H8z")) +
        silla(28) + silla(60) + silla(92) +
        g("c-amarilla", p("M44 30l6-14l10 10l10-10l6 14z")) +
        g("c-amarilla sin-relleno fino brillo", p("M60 8v-4M44 10l-3-3M76 10l3-3"));
    },
    arquitecto: function (k) {
      // Casco de obra y un plano a medio hacer: construye sin revisar.
      return g(k, p("M26 64q0-34 34-34t34 34z")) +
        g(k, p("M18 64h84v8H18z")) +
        g("c-blanca sin-relleno fino", p("M60 30v-6M50 34v30M70 34v30")) +
        g("c-blanca", p("M34 72h52v16q-26 16-52 0z")) +
        ojos(48, 72, 80, 5) + ceño(48, 72, 80) +
        g("c-azul", p("M76 94l28-6v20l-28 6z")) +
        g("c-blanca sin-relleno fino", p("M80 98l20-4M80 104l12-2M88 96v12")) +
        g("c-roja sin-relleno", p("M14 106l10-12M18 94l6 6"));
    },
    libro: function (k) {
      // Gran libro abierto con ojos y birrete: el examinador.
      return g(k, p("M14 96V44q24-8 46 4q22-12 46-4v52q-24-8-46 4q-22-12-46-4z")) +
        g("c-blanca sin-relleno fino", p("M60 48v52M22 56q16-4 30 2M22 66q16-4 30 2M68 58q14-6 30-2M68 68q14-6 30-2")) +
        ojos(40, 80, 80, 6) + ceño(40, 80, 80) +
        g("c-pizarra", p("M36 24l24-10l24 10l-24 10z")) +
        g("c-amarilla sin-relleno", p("M36 24l24-10l24 10l-24 10zM46 28v8q14 6 28 0v-8M84 24v12")) +
        g("c-amarilla sin-relleno fino brillo", p("M10 30l4-4M106 30l-4-4"));
    }
  };

  var PERSONAJES = {
    it: function () {
      // Persona con audífonos, servidor y nube de datos.
      return g("c-roja", p("M40 112q2-42 20-44q18 2 20 44z")) +
        g("c-blanca", c(60, 52, 13)) + ojos(55, 66, 51, 2) +
        g("c-tenue", p("M47 47q1-15 13-15t13 15q-5-8-13-8t-13 8z")) +
        g("c-blanca sin-relleno", p("M45 54q-2-18 15-19q17 1 15 19")) +
        g("c-roja", p("M42 50h5v9h-5zM73 50h5v9h-5z")) +
        g("c-azul", p("M84 76h22v32H84z")) +
        g("c-blanca sin-relleno fino", p("M88 84h14M88 92h14M88 100h14")) +
        g("c-verde lleno", c(102, 84, 1.4) + c(102, 92, 1.4)) +
        g("c-azul sin-relleno fino", p("M86 66q-4-10 6-12q2-8 11-5q9-1 9 8q6 2 3 9z"));
    },
    administrativo: function () {
      // Persona con agenda y clip.
      return g("c-amarilla", p("M40 112q2-42 20-44q18 2 20 44z")) +
        g("c-blanca", c(60, 52, 13)) + ojos(55, 66, 51, 2) +
        g("c-naranja", p("M46 50q0-20 14-20t14 20q-3-12-14-12q-11 0-14 12zM72 44q10 4 6 14")) +
        g("c-azul", p("M80 74h26v34H80z")) +
        g("c-blanca sin-relleno fino", p("M84 82h18M84 88h18M84 94h12M86 70v8M100 70v8")) +
        g("c-roja sin-relleno", p("M30 96v-14a4 4 0 0 1 8 0v16a6 6 0 0 1-12 0v-12"));
    },
    multidisciplinar: function () {
      // Persona con lupa y engranaje (validación técnica de patentes).
      return g("c-verde", p("M40 112q2-42 20-44q18 2 20 44z")) +
        g("c-blanca", c(60, 52, 13)) + ojos(55, 66, 51, 2) +
        g("c-tenue", p("M47 48q2-16 13-16t13 16q-4-8-13-8t-13 8z")) +
        g("c-blanca", p("M50 70h20v6H50z")) +
        g("c-amarilla sin-relleno", c(96, 84, 9) + p("M102 91l8 9")) +
        g("c-azul sin-relleno fino", c(96, 84, 4)) +
        g("c-naranja sin-relleno", c(24, 92, 7) + p("M24 81v4M24 99v4M13 92h4M31 92h4M16 84l3 3M29 97l3 3M16 100l3-3M29 87l3-3"));
    },
    finanzas: function () {
      // Persona con calculadora y gráfico de crecimiento.
      return g("c-naranja", p("M40 112q2-42 20-44q18 2 20 44z")) +
        g("c-blanca", p("M54 68l6 10l6-10z")) + g("c-verde", p("M58 76l2 14l2-14z")) +
        g("c-blanca", c(60, 52, 13)) + ojos(55, 66, 51, 2) +
        g("c-morada", p("M47 48q2-16 13-16t13 16q-4-8-13-8t-13 8z")) +
        g("c-tenue", p("M84 78h20v30H84z")) +
        g("c-verde lleno", p("M87 81h14v6H87z")) +
        g("c-blanca lleno", c(89, 93, 1.6) + c(94, 93, 1.6) + c(99, 93, 1.6) + c(89, 100, 1.6) + c(94, 100, 1.6) + c(99, 100, 1.6)) +
        g("c-amarilla sin-relleno", p("M14 104l8-10l7 5l10-14M33 85h6v6"));
    },
    socio: function () {
      return g("c-azul", p("M40 112q2-42 20-44q18 2 20 44z")) +
        g("c-blanca", p("M54 68l6 10l6-10z")) + g("c-roja", p("M58 76l2 14l2-14z")) +
        g("c-blanca", c(60, 52, 13)) + ojos(55, 66, 51, 2) +
        g("c-tenue", p("M47 48q2-14 13-14t13 14q-6-6-13-6t-13 6z")) +
        g("c-naranja", p("M82 88h22v18H82z")) + g("c-naranja sin-relleno fino", p("M88 88v-4h10v4"));
    },
    asociado: function () {
      return g("c-verde", p("M40 112q2-42 20-44q18 2 20 44z")) +
        g("c-blanca", c(60, 52, 13)) + ojos(55, 66, 51, 2) +
        g("c-amarilla", p("M47 50q0-18 13-18t13 18q-2-10-13-10t-13 10z")) +
        g("c-tenue", p("M80 82h28l-4 16H84z")) + g("c-azul lleno", p("M85 86h18l-2 8H87z")) +
        g("c-blanca sin-relleno fino", p("M76 100h36"));
    },
    analista: function () {
      return g("c-naranja", p("M40 112q2-42 20-44q18 2 20 44z")) +
        g("c-blanca", c(60, 52, 13)) +
        g("c-blanca sin-relleno fino", c(55, 51, 4) + c(66, 51, 4) + p("M59 51h3")) +
        g("c-morada", p("M47 48q2-16 13-16t13 16q-4-8-13-8t-13 8z")) +
        g("c-blanca sin-relleno fino", p("M84 108V80M84 108h26")) +
        g("c-verde lleno", p("M88 106v-8h4v8zM96 106v-14h4v14zM104 106v-22h4v22z"));
    },
    paralegal: function () {
      return g("c-morada", p("M40 112q2-42 20-44q18 2 20 44z")) +
        g("c-blanca", c(60, 52, 13)) + ojos(55, 66, 51, 2) +
        g("c-naranja", p("M46 50q-2-20 14-20t14 20l2 14q-4-14-16-16q-12 2-16 16z")) +
        g("c-amarilla", p("M80 78h26v30H80z")) +
        g("c-blanca sin-relleno fino", p("M85 86h16M85 92h16M85 98h10")) +
        g("c-verde sin-relleno", p("M94 100l4 4l8-10"));
    }
  };

  function envolver(contenido, etiqueta) {
    return '<svg viewBox="0 0 120 120" role="img" aria-label="' + etiqueta + '" class="dibujo">' +
      '<g filter="url(#tiza)">' + contenido + "</g></svg>";
  }

  var api = {
    jefe: function (modulo) {
      var f = JEFES[modulo.forma] || JEFES.fantasma;
      return envolver(f("c-" + (modulo.color || "blanca")), modulo.jefe);
    },
    personaje: function (perfilId, nombre) {
      var f = PERSONAJES[perfilId] || PERSONAJES.socio;
      return envolver(f(), nombre || "Tu personaje");
    },
    corazon: function (lleno) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true" class="icono-corazon ' + (lleno ? "lleno" : "vacio") + '">' +
        '<path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3a4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z"/></svg>';
    },
    medalla: function () {
      return '<svg viewBox="0 0 24 24" aria-hidden="true" class="icono-medalla"><path d="M8 2h8l-2 7h-4z"/><circle cx="12" cy="15" r="6"/></svg>';
    }
  };

  global.Dibujos = api;
})(window);
