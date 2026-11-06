/*
 * AI BOSS — Taller final para usuarios de ChatGPT.
 *
 * Sin batalla. Recetas paso a paso para quien usa ChatGPT en su trabajo:
 * cómo usarlo dentro de las reglas de la firma (cuenta corporativa, nada de
 * archivos de clientes en el chat, verificación de fuentes, permisos mínimos).
 *
 * Basado en la ayuda oficial de OpenAI (help.openai.com) a noviembre de 2026.
 * Los nombres de menús y planes cambian con frecuencia: si un botón no aparece
 * con el mismo nombre, busca el equivalente o pregunta a TI.
 *
 * Usa los mismos tipos de paso que taller.js (receta, constructor, elige).
 */
(function (global) {
  "use strict";

  function L() { return Array.prototype.slice.call(arguments).join("\n"); }

  var TALLER_CHATGPT = {
    intro: "Este taller es para quienes usan ChatGPT. Tampoco hay batalla ni puntaje: son recetas cortas para usar ChatGPT bien y dentro de las reglas de la firma. La primera regla es la más importante: ChatGPT gratis, Go, Plus o Pro son planes personales y no se usan con información de la firma ni de clientes. Si la firma no te ha dado un espacio de trabajo ChatGPT Business o Enterprise aprobado por TI, usa la cuenta corporativa de Claude.",
    pasos: [
      {
        tipo: "concepto",
        titulo: "El mapa del taller de ChatGPT",
        texto: [
          "Primero va la cuenta y la configuración (recetas 1 y 2): sin eso, nada de lo demás es seguro. Luego, el uso diario y, al final, lo avanzado, que se hace con TI.",
          "Lo que aprendiste en el curso aplica igual en ChatGPT: nada de archivos ni datos de clientes en el chat, verificar todo lo que cite y responder por lo que entregas."
        ],
        visual: { tipo: "tarjetas", items: [
          { i: "🏢", t: "1. Entrar al espacio de trabajo de la firma", d: "Básico · 5 min" },
          { i: "🛡️", t: "2. Revisar los controles de datos", d: "Básico · 5 min" },
          { i: "🧩", t: "3. Armar un pedido sin archivos", d: "Básico · 5 min · juego" },
          { i: "💬", t: "4. Tu primer chat seguro", d: "Básico · 10 min" },
          { i: "🕶️", t: "5. Chat temporal y memoria", d: "Básico · 5 min" },
          { i: "📁", t: "6. Crear un Proyecto", d: "Básico · 10 min" },
          { i: "📝", t: "7. Redactar con Canvas", d: "Básico · 10 min" },
          { i: "🔎", t: "8. Buscar y verificar fuentes", d: "Intermedio · 15 min" },
          { i: "🔗", t: "9. Revisar tus enlaces compartidos", d: "Básico · 5 min" },
          { i: "🤖", t: "10. Crear un GPT para el equipo", d: "Intermedio · 30 min" },
          { i: "🔌", t: "11. Conectores y modo agente", d: "Avanzado · con TI" },
          { i: "🚨", t: "12. Si pegaste algo que no debías", d: "Básico · inmediato" }
        ] },
        simple: "Es como recibir las llaves de un carro de la empresa: antes de manejar, ajustas los espejos y te pones el cinturón (recetas 1 y 2).",
        ejemplo: "Si hoy solo tienes 15 minutos, haz las recetas 1, 2 y 4."
      },

      /* 1 */
      {
        tipo: "receta", icono: "🏢",
        titulo: "Entrar al espacio de trabajo de la firma (no a tu cuenta personal)",
        nivel: "Básico", quien: "Lo haces tú", tiempo: "5 minutos",
        construyes: "Tu acceso a ChatGPT dentro del espacio de trabajo corporativo (Business o Enterprise), con las garantías del contrato de la firma.",
        simple: "Es como entrar al edificio con el carné de la firma: adentro aplican las reglas y los seguros de la firma; afuera, no.",
        pasos: [
          { t: "Confirma con TI que la firma tiene un espacio de trabajo de ChatGPT aprobado. Si no lo tiene, no uses ChatGPT para trabajo: usa la cuenta corporativa de Claude." },
          { t: "Entra a chatgpt.com o a la aplicación de escritorio e inicia sesión con tu correo de la firma (si TI configuró el inicio de sesión corporativo, usa ese botón)." },
          { t: "Revisa en qué espacio estás: abre el menú de tu perfil y confirma que aparece el nombre del espacio de trabajo de la firma y no «Personal».",
            bloque: { tipo: "clic", contenido: "Menú de perfil › Espacio de trabajo de la firma (no «Personal»)" } },
          { t: "Si tienes una cuenta personal de ChatGPT, cierra esa sesión en el equipo de trabajo, o al menos verifica el espacio antes de cada chat de trabajo." }
        ],
        resultado: "Ves el espacio de trabajo de la firma en el menú de perfil, y no tu cuenta personal.",
        cuidado: "ChatGPT gratis, Go, Plus y Pro son planes personales aunque los pagues tú o la firma te los reembolse: por defecto pueden usar tus conversaciones para entrenar, no tienen contrato con la firma y TI no los controla. Con información de la firma, nunca."
      },

      /* 2 */
      {
        tipo: "receta", icono: "🛡️",
        titulo: "Revisar los controles de datos",
        nivel: "Básico", quien: "Lo haces tú", tiempo: "5 minutos",
        construyes: "La certeza de qué pasa con lo que escribes: si se usa para entrenar, qué recuerda ChatGPT y qué enlaces tienes abiertos.",
        simple: "Es como revisar la configuración de privacidad del celular nuevo antes de usarlo.",
        pasos: [
          { t: "Abre la configuración y entra a los controles de datos.",
            bloque: { tipo: "clic", contenido: "Menú de perfil › Configuración › Controles de datos" } },
          { t: "En el espacio de la firma, la opción de mejorar el modelo con tus datos no aparece o está desactivada por contrato. Si la ves activada, estás en una cuenta personal: vuelve a la receta 1." },
          { t: "Revisa la memoria en Personalización: decide si quieres que ChatGPT recuerde datos entre chats y borra cualquier recuerdo que contenga información de clientes.",
            bloque: { tipo: "clic", contenido: "Configuración › Personalización › Memoria › Administrar" } },
          { t: "Revisa los enlaces compartidos (receta 9) y las aplicaciones conectadas: si hay algo que no reconoces, desconéctalo y avisa a TI." }
        ],
        resultado: "Sabes que tu cuenta no entrena modelos, que la memoria no guarda datos de clientes y que no hay enlaces ni conexiones abiertas de más.",
        cuidado: "En una cuenta personal, desactivar «Mejorar el modelo para todos» reduce el riesgo pero no lo elimina: siguen faltando el contrato, el control de TI y las garantías para datos personales. La solución es la cuenta corporativa, no un ajuste."
      },

      /* 3 */
      {
        tipo: "constructor",
        titulo: "Arma un pedido sin subir archivos",
        texto: "En ChatGPT, como en Claude, el documento del cliente no se sube al chat. Arma un pedido que funcione con información general o con un texto ficticio que tú mismo(a) escribes. Elige una opción de cada pieza.",
        plantilla: L(
          "Actúa como {rol}.",
          "{tarea}",
          "Usa solo información general o el texto ficticio que te doy; no tengo documentos del cliente aquí.",
          "Entrégalo en {formato}.",
          "{criterio}"
        ),
        piezas: [
          { campo: "rol", nombre: "Rol: ¿desde qué mirada?", icono: "🎭", opciones: ["abogado(a) corporativo(a) colombiano(a)", "especialista en propiedad industrial", "analista financiero(a)", "asistente de comunicaciones internas"] },
          { campo: "tarea", nombre: "Tarea: ¿qué necesitas?", icono: "🎯", opciones: ["Prepara una lista de verificación para revisar un contrato de suministro.", "Explica qué cambia con una reforma, citando la norma.", "Redacta una plantilla de correo para pedir documentos a un cliente.", "Propón la estructura de una presentación sobre riesgos de IA."] },
          { campo: "formato", nombre: "Formato: ¿cómo lo quieres?", icono: "📐", opciones: ["una tabla de 3 columnas", "8 viñetas cortas", "un correo de máximo 10 líneas, con [CAMPOS] para completar", "un esquema de 5 diapositivas"] },
          { campo: "criterio", nombre: "Criterio: ¿qué es un buen resultado?", icono: "✅", opciones: ["Cita la fuente oficial de cada norma y dime si no estás seguro(a).", "Usa lenguaje sencillo, sin tecnicismos.", "Deja entre corchetes todo lo que deba completar con datos reales.", "No inventes cifras ni nombres."] }
        ],
        nota: "Los datos reales se completan después, fuera del chat (en Word, en NetSuite o en el sistema correspondiente). Así ChatGPT nunca ve información del cliente."
      },

      /* 4 */
      {
        tipo: "receta", icono: "💬",
        titulo: "Tu primer chat seguro",
        nivel: "Básico", quien: "Lo haces tú", tiempo: "10 minutos",
        construyes: "Una respuesta útil sobre un tema general, ajustada en dos o tres mensajes y verificada.",
        simple: "Es como trabajar con un practicante muy rápido: le explicas, revisas lo que entrega y le pides ajustes.",
        pasos: [
          { t: "Revisa el espacio de trabajo (receta 1) y abre un chat nuevo." },
          { t: "Pega el pedido que armaste en la receta 3, o escribe una pregunta general sin nombres ni datos de clientes.",
            bloque: { tipo: "chat", mensajes: [
              { de: "tu", t: "Actúa como abogado(a) corporativo(a) colombiano(a). Prepara una lista de verificación para revisar un contrato de suministro. Entrégalo en una tabla de 3 columnas. Cita la fuente oficial de cada norma y dime si no estás seguro(a)." },
              { de: "chatgpt", t: "Aquí tienes la lista: | Punto | Qué revisar | Fuente | ..." }
            ] } },
          { t: "Pide un ajuste concreto en lugar de empezar de cero.",
            bloque: { tipo: "chat", mensajes: [
              { de: "tu", t: "Agrega una columna de «riesgo si falta» y quita lo que no aplique a Colombia." }
            ] } },
          { t: "Verifica en la fuente oficial (Secretaría del Senado, SUIN-Juriscol, la Corte) cada norma o sentencia antes de usarla. ChatGPT también puede inventar citas." }
        ],
        resultado: "Una lista de verificación clara que ajustaste y verificaste.",
        cuidado: "El chat no lleva documentos, correos ni datos de clientes, ni siquiera en el espacio de la firma, salvo autorización expresa de tu jefe y de TI. Tú respondes por lo que entregas."
      },

      /* 5 */
      {
        tipo: "receta", icono: "🕶️",
        titulo: "Usar el chat temporal y manejar la memoria",
        nivel: "Básico", quien: "Lo haces tú", tiempo: "5 minutos",
        construyes: "Conversaciones que no quedan en tu historial ni en la memoria, para consultas puntuales.",
        simple: "Es como hablar en una sala de reuniones sin grabadora: al salir, no queda registro en tu historial.",
        pasos: [
          { t: "Abre un chat temporal desde el botón de la parte superior de un chat nuevo.",
            bloque: { tipo: "clic", contenido: "Chat nuevo › Chat temporal" } },
          { t: "Úsalo para consultas generales que no necesitas guardar. No aparecerá en tu historial, no usa ni crea memorias y no se usa para entrenar." },
          { t: "Si ChatGPT te dice que «recordó» algo, revisa la memoria y borra lo que no deba guardar.",
            bloque: { tipo: "clic", contenido: "Configuración › Personalización › Memoria › Administrar › Borrar" } },
          { t: "Pídele que no guarde algo específico cuando lo necesites.",
            bloque: { tipo: "chat", mensajes: [
              { de: "tu", t: "No guardes en tu memoria nada de esta conversación." }
            ] } }
        ],
        resultado: "Sabes abrir un chat temporal y revisar qué recuerda ChatGPT de ti.",
        cuidado: "Temporal no significa secreto: OpenAI conserva una copia hasta 30 días por seguridad (o más si la ley lo exige). Un chat temporal en una cuenta personal sigue siendo una cuenta personal: no sirve para información de la firma."
      },

      /* 6 */
      {
        tipo: "receta", icono: "📁",
        titulo: "Crear un Proyecto con instrucciones",
        nivel: "Básico", quien: "Lo haces tú", tiempo: "10 minutos",
        construyes: "Un espacio que agrupa los chats de un tema y le da a ChatGPT las mismas instrucciones cada vez.",
        simple: "Es como una carpeta física con una nota pegada en la tapa: «así trabajamos este tema».",
        pasos: [
          { t: "En la barra lateral, crea un proyecto nuevo y dale un nombre general (sin nombres de clientes).",
            bloque: { tipo: "clic", contenido: "Barra lateral › Proyectos › Nuevo proyecto" } },
          { t: "Escribe las instrucciones del proyecto: cómo quieres que responda.",
            bloque: { tipo: "archivo", titulo: "Instrucciones del proyecto", contenido: L(
              "Eres un asistente del área de contratos de una firma de abogados colombiana.",
              "Responde en español, en lenguaje claro.",
              "Cita la fuente oficial de cada norma y di «no estoy seguro(a)» cuando no lo estés.",
              "Nunca pidas documentos ni datos de clientes.") } },
          { t: "Agrega como archivos del proyecto solo material público o plantillas propias sin datos de clientes (por ejemplo, la lista de verificación de la receta 4)." },
          { t: "Crea los chats de ese tema dentro del proyecto para que todos sigan las mismas instrucciones." }
        ],
        resultado: "Un proyecto con instrucciones fijas donde cada chat responde de la misma forma.",
        cuidado: "Los archivos de un proyecto se suben a OpenAI: nada de contratos, expedientes ni bases de datos de clientes. Si compartes el proyecto, compártelo solo dentro del espacio de la firma."
      },

      /* 7 */
      {
        tipo: "receta", icono: "📝",
        titulo: "Redactar y editar con Canvas",
        nivel: "Básico", quien: "Lo haces tú", tiempo: "10 minutos",
        construyes: "Un borrador (por ejemplo, una plantilla o una política interna) que editas junto con ChatGPT en un panel aparte.",
        simple: "Es como trabajar en un documento compartido con un colega que propone cambios mientras tú decides.",
        pasos: [
          { t: "Pide expresamente que abra un canvas.",
            bloque: { tipo: "chat", mensajes: [
              { de: "tu", t: "Abre un canvas y redacta una plantilla de política interna de uso de IA para una firma de abogados, con [CAMPOS] para completar." }
            ] } },
          { t: "Selecciona un párrafo del canvas y pide un cambio solo sobre esa parte (más corto, más formal, más claro)." },
          { t: "Revisa los cambios propuestos y conserva solo los que aceptes. Puedes volver a una versión anterior." },
          { t: "Copia el texto final a Word y completa ahí los [CAMPOS] con los datos reales." }
        ],
        resultado: "Un borrador limpio, editado por partes, listo para completar fuera del chat.",
        cuidado: "Canvas también es parte del chat: no pegues en él contratos ni datos de clientes. El texto final es tu trabajo y tu responsabilidad."
      },

      /* 8 */
      {
        tipo: "receta", icono: "🔎",
        titulo: "Buscar en la web y verificar las fuentes",
        nivel: "Intermedio", quien: "Lo haces tú", tiempo: "15 minutos",
        construyes: "Una respuesta con enlaces a las fuentes, que revisaste una por una.",
        simple: "Es como pedirle a alguien que te traiga recortes de prensa: útil, pero los lees tú antes de citarlos.",
        pasos: [
          { t: "Activa la búsqueda o la investigación profunda desde las herramientas del chat (según lo que haya habilitado TI).",
            bloque: { tipo: "clic", contenido: "Chat › Herramientas › Buscar / Investigación profunda" } },
          { t: "Pide fuentes oficiales y una tabla de enlaces.",
            bloque: { tipo: "chat", mensajes: [
              { de: "tu", t: "Busca las modificaciones de 2025 y 2026 al régimen de protección de datos en Colombia. Usa solo fuentes oficiales y entrégame una tabla con norma, fecha, cambio y enlace." }
            ] } },
          { t: "Abre cada enlace y confirma que la fuente dice lo que ChatGPT afirma. Si un enlace no abre o no dice eso, descarta el dato." },
          { t: "Anota en tu documento la fuente oficial, no «según ChatGPT»." }
        ],
        resultado: "Una tabla de normas con enlaces que revisaste tú.",
        cuidado: "La búsqueda envía tu consulta a buscadores externos: no incluyas nombres de clientes, números de expediente ni hechos reservados en la pregunta."
      },

      /* 9 */
      {
        tipo: "receta", icono: "🔗",
        titulo: "Revisar y borrar tus enlaces compartidos",
        nivel: "Básico", quien: "Lo haces tú", tiempo: "5 minutos",
        construyes: "Una lista limpia de los chats que compartiste, sin enlaces abiertos de más.",
        simple: "Es como recoger las copias de llaves que repartiste.",
        pasos: [
          { t: "Abre la lista de enlaces compartidos.",
            bloque: { tipo: "clic", contenido: "Configuración › Controles de datos › Enlaces compartidos › Administrar" } },
          { t: "Revisa cada enlace: ¿todavía lo necesita alguien?, ¿contiene algo que no debería?" },
          { t: "Borra los que ya no se necesitan. Un enlace borrado deja de funcionar para quien lo tenga." },
          { t: "Para compartir con colegas, usa el espacio de la firma (proyectos o GPTs compartidos con el espacio) en lugar de enlaces públicos." }
        ],
        resultado: "Solo quedan los enlaces que de verdad se necesitan.",
        cuidado: "Cualquiera que tenga un enlace compartido puede abrir la conversación, aunque no sea de la firma. Si compartiste por error un chat con información sensible, bórralo y avisa a TI."
      },

      /* 10 */
      {
        tipo: "receta", icono: "🤖",
        titulo: "Crear un GPT para el equipo",
        nivel: "Intermedio", quien: "Lo haces tú (con visto bueno de tu jefe)", tiempo: "30 minutos",
        construyes: "Un asistente con instrucciones fijas para una tarea repetida del equipo, compartido solo dentro del espacio de la firma.",
        simple: "Es como un manual de procedimiento que, además, responde preguntas.",
        pasos: [
          { t: "Define la tarea repetida y pide visto bueno a tu jefe. Ejemplo: «revisar NDAs con la lista de verificación de la firma, sin subir el NDA»." },
          { t: "Crea el GPT desde la sección de GPTs.",
            bloque: { tipo: "clic", contenido: "Barra lateral › GPTs › Crear" } },
          { t: "Escribe las instrucciones en la pestaña de configuración.",
            bloque: { tipo: "archivo", titulo: "Instrucciones del GPT", contenido: L(
              "Ayudas al equipo de contratos a revisar NDAs con esta lista de verificación: [LISTA].",
              "La persona te describe la cláusula con sus palabras o con texto ficticio; nunca pidas el documento.",
              "Para cada punto responde: cumple / no cumple / no consta, y por qué.",
              "Recuerda al final: «Verifica contra el documento original antes de usar»." ) } },
          { t: "Desactiva las capacidades que no necesita (por ejemplo, búsqueda web o acciones externas)." },
          { t: "Al compartir, elige solo el espacio de trabajo de la firma o personas concretas, nunca «cualquiera con el enlace» ni la tienda pública." }
        ],
        resultado: "Un GPT que el equipo usa igual cada vez, sin documentos de clientes.",
        cuidado: "No uses GPTs de terceros de la tienda con información de la firma: quien los creó puede recibir datos a través de sus acciones. Los GPTs con acciones o conexiones externas se aprueban con TI."
      },

      /* 11 */
      {
        tipo: "receta", icono: "🔌",
        titulo: "Conectores y modo agente (solo con TI)",
        nivel: "Avanzado", quien: "TI lo habilita; tú lo usas", tiempo: "Con TI",
        construyes: "Acceso controlado de ChatGPT a una herramienta de la firma, o tareas en varios pasos, con permisos mínimos y tu confirmación.",
        simple: "Es como darle a alguien una llave de una sola oficina, por un tiempo, y acompañarlo mientras la usa.",
        pasos: [
          { t: "Pide a TI la conexión que necesitas y explica para qué. TI decide si se habilita y con qué permisos (solo lectura cuando sea posible)." },
          { t: "Conecta solo lo aprobado, siempre con tu cuenta de la firma.",
            bloque: { tipo: "clic", contenido: "Configuración › Conectores (o Aplicaciones) › la herramienta aprobada" } },
          { t: "En el modo agente, lee cada acción antes de confirmarla. No le des contraseñas ni le pidas que inicie sesión por ti en sitios de la firma o de clientes." },
          { t: "Detén el agente si hace algo distinto de lo pedido, y desconecta lo que ya no uses." }
        ],
        resultado: "Una conexión aprobada, con el mínimo acceso, que usas con supervisión.",
        cuidado: "Nunca conectes el correo, OneDrive, NetSuite u otro sistema de la firma a una cuenta personal. Un agente puede leer páginas con instrucciones ocultas: tú confirmas cada acción con consecuencias."
      },

      /* 12 */
      {
        tipo: "receta", icono: "🚨",
        titulo: "Si pegaste algo que no debías",
        nivel: "Básico", quien: "Lo haces tú, de inmediato", tiempo: "Inmediato",
        construyes: "Una reacción rápida que limita el daño y protege a la firma (y a ti).",
        simple: "Es como avisar de inmediato que perdiste las llaves de la oficina: cambiar la chapa a tiempo evita el robo.",
        pasos: [
          { t: "No sigas la conversación ni pidas a ChatGPT que «olvide» lo que pegaste: eso no lo borra." },
          { t: "Anota qué pegaste, en qué cuenta (firma o personal), en qué chat y a qué hora." },
          { t: "Borra el chat, cualquier enlace compartido y cualquier memoria relacionada (recetas 5 y 9)." },
          { t: "Repórtalo a TI y a tu jefe de inmediato (a más tardar dentro de las 24 horas): ellos evalúan si hay que notificar al cliente o a la SIC." }
        ],
        resultado: "TI y tu jefe saben qué pasó y pueden actuar a tiempo.",
        cuidado: "Ocultar un incidente es más grave que el incidente. Borrar el chat no elimina de inmediato la copia del proveedor, y en una cuenta personal lo que ya entró al entrenamiento no se puede sacar."
      },

      {
        tipo: "elige",
        titulo: "Juega: ¿qué haces?",
        situacion: "Un cliente te envía un contrato por correo y quieres que ChatGPT te ayude a encontrar sus riesgos. En tu celular tienes ChatGPT Plus, pagado por ti. ¿Qué haces?",
        opciones: [
          { t: "Lo subo a mi ChatGPT Plus: es de pago, entonces es seguro.", ok: false, r: "Plus es un plan personal: por defecto puede entrenar con tus datos, no tiene contrato con la firma y TI no lo controla. Pagar no lo vuelve corporativo." },
          { t: "Uso la lista de verificación del GPT del equipo (receta 10) describiendo las cláusulas sin el documento, o leo el contrato en local con Claude Code de la firma.", ok: true, r: "¡Exacto! El documento no sale de la firma y la herramienta es corporativa." },
          { t: "Lo subo a mi cuenta gratuita en un chat temporal, para que no quede guardado.", ok: false, r: "El chat temporal se conserva hasta 30 días y sigue siendo una cuenta personal, sin contrato ni control de TI." }
        ]
      }
    ]
  };

  if (typeof module !== "undefined" && module.exports) module.exports = TALLER_CHATGPT;
  else if (global.Conceptos) global.Conceptos.CONCEPTOS["taller-chatgpt"] = TALLER_CHATGPT;
})(typeof window !== "undefined" ? window : globalThis);
