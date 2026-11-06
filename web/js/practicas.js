/*
 * AI BOSS — lecciones intercaladas: un paso teórico, uno práctico, otro
 * teórico, otro práctico...
 *
 * conceptos.js guarda la teoría (pasos «concepto») y algunas prácticas
 * («elige» o «clasifica»). Aquí se define qué práctica va justo después de
 * cada concepto, para que la persona aplique enseguida lo que acaba de leer:
 *
 *   PRACTICAS[modulo][«título del concepto»] = número | paso
 *     número  posición (desde 0) de una práctica que ya está en conceptos.js
 *     paso    una práctica nueva, con el mismo formato de conceptos.js
 *
 * Si un concepto no aparece aquí, se le asigna la siguiente práctica de
 * conceptos.js que no se haya usado (en su orden). Las que sobren quedan al
 * final. Las pruebas verifican que todos los módulos alternen teoría y práctica.
 */
(function (global) {
  "use strict";

  var PRACTICAS = {
    /* ------------------------------------------------------------------ */
    fundamentos: {
      "¿Qué es Claude?": {
        tipo: "elige",
        titulo: "Practica: ¿para qué le pido ayuda?",
        situacion: "Es tu primer día usando Claude con la cuenta de la firma. ¿Cuál de estos pedidos encaja mejor con lo que Claude hace bien?",
        opciones: [
          { t: "«Dime cuál es el número de radicado del proceso del Cliente A».", ok: false, r: "Claude no conoce los sistemas ni los expedientes de la firma: si no le das la información, la inventa o no la sabe." },
          { t: "«Propón la estructura de una carta para informar a un cliente sobre un cambio de horario de atención».", ok: true, r: "Exacto: redactar borradores y ordenar ideas es justo lo que mejor hace. Tú revisas y ajustas." },
          { t: "«Firma el poder por mí y envíalo al juzgado».", ok: false, r: "Claude no firma ni actúa en tu nombre: las decisiones y las firmas son de una persona." }
        ]
      },
      "¿Cómo produce sus respuestas?": 6,
      "Alucinaciones: cuando inventa con seguridad": 5,
      "Tokens y ventana de contexto": {
        tipo: "elige",
        titulo: "Practica: el expediente gigante",
        situacion: "Necesitas un resumen de un expediente de 3.000 folios que está en la carpeta del caso. ¿Cómo lo planteas?",
        opciones: [
          { t: "Le pido a Claude Code que lo trabaje por partes (por cuaderno o por etapa) y luego que una los resúmenes.", ok: true, r: "Bien: dividir el trabajo respeta la ventana de contexto y hace cada resumen más fácil de revisar." },
          { t: "Le pido que lo lea todo de una vez: la ventana de contexto no tiene límite.", ok: false, r: "Sí tiene límite. Si te pasas, Claude no puede tener todo en cuenta a la vez y puede omitir partes." },
          { t: "Copio todo el texto en un chat para que lo vea completo.", ok: false, r: "Además de pasarte del límite, rompes la política: los documentos de clientes no se pegan ni se suben a chats." }
        ]
      },
      "Tres modelos para tres tipos de trabajo": {
        tipo: "clasifica",
        titulo: "Practica: ¿qué modelo conviene?",
        instruccion: "Clasifica cada tarea según el modelo que más conviene.",
        categorias: ["Rápido y económico (Haiku)", "Más capaz (Opus)"],
        items: [
          { t: "Clasificar 20.000 correos por tipo de solicitud", c: 0 },
          { t: "Analizar la estrategia de un arbitraje internacional complejo", c: 1 },
          { t: "Extraer la fecha y el número de factura de miles de documentos", c: 0 },
          { t: "Comparar tres líneas jurisprudenciales que se contradicen", c: 1 }
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    "claude-trabajo": {
      "Cuenta de la firma vs. cuenta personal": 7,
      "Cuentas gratuitas o personales: el riesgo en detalle": {
        tipo: "clasifica",
        titulo: "Practica: ¿cuenta de la firma o cuenta personal?",
        instruccion: "Clasifica cada cuenta según si sirve o no para trabajar con información de la firma.",
        categorias: ["Sirve para la firma", "No sirve para la firma"],
        items: [
          { t: "Claude Team o Enterprise de la firma, con tu correo corporativo", c: 0 },
          { t: "ChatGPT Plus pagado con tu tarjeta personal", c: 1 },
          { t: "Claude gratis en el navegador del celular", c: 1 },
          { t: "Espacio ChatGPT Business o Enterprise aprobado por TI", c: 0 },
          { t: "Claude Pro o Max con el correo de la firma, pero contratado por ti", c: 1 },
          { t: "Un chat temporal en tu cuenta gratuita de ChatGPT", c: 1 }
        ]
      },
      "Política de la firma: los archivos no se suben": {
        tipo: "clasifica",
        titulo: "Practica: ¿se puede o no se puede?",
        instruccion: "Clasifica cada acción según la política de documentos de la firma.",
        categorias: ["Se puede", "No se puede"],
        items: [
          { t: "Adjuntar a un chat de Claude el contrato que envió un cliente", c: 1 },
          { t: "Pedirle a Claude Code que lea ese contrato desde la carpeta del caso", c: 0 },
          { t: "Cargar el expediente de un cliente en un Proyecto de Claude", c: 1 },
          { t: "Preguntar en el chat qué es una cláusula de indemnidad, sin datos del cliente", c: 0 }
        ]
      },
      "Proyectos: reglas e instrucciones que se repiten": 8,
      "Artifacts: documentos que aparecen a un lado": {
        tipo: "elige",
        titulo: "Practica: la tabla que quieres ajustar",
        situacion: "Claude te mostró en un Artifact una tabla comparativa de tipos societarios (información general, sin clientes). Le falta una columna de costos. ¿Qué haces?",
        opciones: [
          { t: "Empiezo un chat nuevo y le explico todo otra vez.", ok: false, r: "No hace falta: el Artifact se puede ajustar en la misma conversación." },
          { t: "Le pido en la misma conversación que agregue la columna de costos al Artifact y reviso el resultado.", ok: true, r: "Así se trabaja: pides cambios concretos sobre el Artifact y revisas antes de usarlo." },
          { t: "Copio la tabla en Word y la completo inventando los costos.", ok: false, r: "Puedes copiarla, pero los datos se verifican, nunca se inventan." }
        ]
      },
      "Búsqueda web: información actual, pero se verifica": {
        tipo: "elige",
        titulo: "Practica: la norma de la semana pasada",
        situacion: "Con la búsqueda web activada, Claude te dice que la semana pasada salió un decreto que cambia un plazo. ¿Qué haces?",
        opciones: [
          { t: "Abro la fuente que cita y confirmo el decreto en el Diario Oficial antes de usarlo.", ok: true, r: "Correcto: la búsqueda web ayuda a encontrar, pero la verificación en la fuente oficial es tuya." },
          { t: "Lo uso de una vez: si buscó en internet, ya está verificado.", ok: false, r: "Las páginas pueden estar desactualizadas o equivocadas. Abre la fuente y confírmala." },
          { t: "Lo descarto: Claude nunca conoce normas nuevas.", ok: false, r: "Con búsqueda web sí puede encontrarlas. Lo que no puedes es usarlas sin verificar." }
        ]
      },
      "Compartir con cuidado": {
        tipo: "elige",
        titulo: "Practica: el enlace para el equipo",
        situacion: "Quieres compartir con un compañero el enlace de una conversación de Claude. ¿Qué haces antes?",
        opciones: [
          { t: "Nada: los enlaces de Claude son privados por naturaleza.", ok: false, r: "Un enlace se reenvía con facilidad. Revisa siempre qué contiene y quién lo podrá ver." },
          { t: "Lo publico en el canal general para que todos aprendan.", ok: false, r: "Compartir de más es el riesgo. Solo con quien lo necesite y sin información confidencial." },
          { t: "Reviso que no tenga información confidencial y lo comparto solo con quien lo necesita.", ok: true, r: "Exacto: la confidencialidad también aplica a lo que compartes desde herramientas de IA." }
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    aplicativos: {
      "Tres formas de usar la IA con documentos": {
        tipo: "elige",
        titulo: "Practica: ¿qué camino tomas?",
        situacion: "Toda el área revisará cada mes, durante años, los contratos de proveedores con el mismo criterio. ¿Qué camino conviene?",
        opciones: [
          { t: "Que cada persona le pregunte a la IA a su manera cada mes.", ok: false, r: "Cada pedido distinto da respuestas distintas: no hay un proceso repetible ni controlado." },
          { t: "Un aplicativo corporativo, con criterios fijos, permisos, registro y revisión experta.", ok: true, r: "Correcto: para un uso de muchas personas y por mucho tiempo, se justifica el camino corporativo." },
          { t: "El prototipo personal que hizo un compañero en su equipo.", ok: false, r: "Un aplicativo personal sirve para explorar, no para el trabajo de toda el área con datos de clientes." }
        ]
      },
      "¿Qué hace corporativo a un aplicativo?": 6,
      "El aplicativo personal: útil, pero con límites": 7,
      "Subir archivos y preguntar vs. un aplicativo": {
        tipo: "elige",
        titulo: "Practica: dos respuestas distintas",
        situacion: "Dos asociados le preguntaron a la IA por el mismo tipo de contrato y recibieron conclusiones distintas. ¿Qué lo explica mejor?",
        opciones: [
          { t: "La IA está dañada y hay que reportarla.", ok: false, r: "No está dañada: la respuesta depende de cómo se pide y de lo que se le da." },
          { t: "Cada respuesta depende del pedido de ese momento; para un criterio único hace falta un proceso fijo y revisado.", ok: true, r: "Exacto: preguntar sirve para algo puntual. Si se necesita el mismo criterio siempre, se diseña un aplicativo." },
          { t: "Uno de los dos usó una cuenta personal.", ok: false, r: "Puede pasar incluso con la misma cuenta: la variación viene del pedido." }
        ]
      },
      "La revisión del experto no es opcional": {
        tipo: "elige",
        titulo: "Practica: pasó todas las pruebas",
        situacion: "Un aplicativo que clasifica marcas por riesgo pasó todas las pruebas técnicas. ¿Ya se puede usar con clientes?",
        opciones: [
          { t: "Sí: si pasó las pruebas, no se equivoca.", ok: false, r: "Las pruebas técnicas no garantizan que el criterio jurídico sea correcto con casos reales." },
          { t: "Sí, y si falla, el cliente nos avisará.", ok: false, r: "El cliente no es quien revisa. El error llegaría con la firma de la firma." },
          { t: "No todavía: un experto en marcas revisa una muestra de resultados reales y se define cada cuánto se repite esa revisión.", ok: true, r: "Correcto: la IA presenta sus errores con la misma seguridad que sus aciertos. Solo el experto los detecta." }
        ]
      },
      "¿Cuánto tiempo toma cada uno?": {
        tipo: "clasifica",
        titulo: "Practica: ¿minutos o meses?",
        instruccion: "Clasifica cada necesidad según el tiempo que suele tomar.",
        categorias: ["Minutos u horas", "Semanas o meses"],
        items: [
          { t: "Una consulta puntual sobre un documento de tu carpeta con Claude Code", c: 0 },
          { t: "Un aplicativo corporativo que usará toda el área con datos de clientes", c: 1 },
          { t: "Un borrador de correo sin datos de clientes", c: 0 },
          { t: "Un tablero aprobado por TI con permisos por rol y revisión experta", c: 1 }
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    prompts: {
      "Un buen pedido tiene cinco partes": 5,
      "Antes y después": {
        tipo: "elige",
        titulo: "Practica: mejora el pedido",
        situacion: "Un compañero escribió: «Hazme algo sobre el contrato». ¿Cuál es la mejor versión?",
        opciones: [
          { t: "«Hazme algo bueno sobre el contrato, por favor».", ok: false, r: "Ser amable no aclara el encargo: sigue sin rol, tarea, formato ni criterios." },
          { t: "«Actúa como abogado de la firma. Lee Contratos/arriendo.docx y lista en una tabla las obligaciones del arrendatario, con la cláusula de cada una. Si algo no consta, dilo».", ok: true, r: "Tiene rol, tarea, material, formato y criterio. El resultado será más fácil de revisar." },
          { t: "«Contrato. Rápido».", ok: false, r: "Más corto no es mejor: Claude tendrá que adivinar qué necesitas." }
        ]
      },
      "Separa las instrucciones del material": {
        tipo: "elige",
        titulo: "Practica: ¿cómo le indicas el material?",
        situacion: "Quieres que Claude Code compare dos versiones de un contrato que están en la carpeta del caso. ¿Cómo se lo pides?",
        opciones: [
          { t: "Copio y pego los dos contratos completos en el mensaje.", ok: false, r: "Con Claude Code no se pegan documentos: se le indica qué archivos leer." },
          { t: "«Compara los contratos», sin decir cuáles.", ok: false, r: "Sin nombres ni ubicación, puede leer otros archivos o confundirse." },
          { t: "«Lee Caso/contrato_v1.docx y Caso/contrato_v2.docx y lista los cambios, cláusula por cláusula».", ok: true, r: "Nombrar los archivos con su ubicación separa las instrucciones del material y evita confusiones." }
        ]
      },
      "Ejemplos y permiso para decir «no consta»": {
        tipo: "elige",
        titulo: "Practica: el dato que no aparece",
        situacion: "Le preguntas a Claude Code quién es el representante legal según un certificado de la carpeta. ¿Qué agregas al pedido para reducir invenciones?",
        opciones: [
          { t: "«Básate solo en ese archivo, cita el fragmento de apoyo y, si no aparece, responde: no consta».", ok: true, r: "Exacto: darle permiso para decir «no consta» y pedir la cita reduce las invenciones." },
          { t: "«Respóndeme sí o sí, aunque tengas que suponer».", ok: false, r: "Eso lo empuja a inventar. Es justo lo contrario de lo que buscas." },
          { t: "Nada: Claude nunca inventa cuando lee un archivo.", ok: false, r: "Aun leyendo un archivo puede completar con lo que le parece probable. Pide la cita." }
        ]
      },
      "Conversa e itera": 6
    },

    /* ------------------------------------------------------------------ */
    "datos-personales": {
      "¿Qué es un dato personal?": 6,
      "Datos sensibles: protección reforzada": {
        tipo: "clasifica",
        titulo: "Practica: ¿sensible o no?",
        instruccion: "Clasifica cada dato de una persona natural.",
        categorias: ["Dato sensible", "Dato personal no sensible"],
        items: [
          { t: "Un diagnóstico médico en una incapacidad", c: 0 },
          { t: "El correo de trabajo de un empleado", c: 1 },
          { t: "La afiliación sindical de un trabajador", c: 0 },
          { t: "El número de cédula", c: 1, r: "Es dato personal, pero la ley no lo cataloga como sensible." },
          { t: "Datos biométricos como la huella dactilar", c: 0 }
        ]
      },
      "La regla de oro: autorización y finalidad": {
        tipo: "elige",
        titulo: "Practica: un nuevo uso de los datos",
        situacion: "La firma tiene los datos de contacto de un cliente persona natural para gestionar su proceso. Alguien propone usarlos, con ayuda de IA, para una campaña de mercadeo. ¿Qué dices?",
        opciones: [
          { t: "Adelante: ya tenemos sus datos.", ok: false, r: "Tener los datos no autoriza cualquier uso: la finalidad informada marca el límite." },
          { t: "Antes hay que revisar si la autorización cubre esa finalidad; si no, se necesita una nueva autorización.", ok: true, r: "Correcto: los datos se usan solo para aquello que se informó y autorizó." },
          { t: "No hay problema si la IA es de la cuenta corporativa.", ok: false, r: "La herramienta no cambia la regla: la finalidad sigue siendo el límite." }
        ]
      },
      "Responsable, encargado y datos que viajan": {
        tipo: "elige",
        titulo: "Practica: ¿quién es quién?",
        situacion: "La firma usa la cuenta corporativa de Claude, con acuerdo de tratamiento de datos con Anthropic. ¿Qué papel tiene cada uno?",
        opciones: [
          { t: "La firma es responsable (decide para qué se usan los datos) y Anthropic es encargado (los procesa por cuenta de la firma).", ok: true, r: "Exacto. Y si los servidores están fuera de Colombia, hay que tener en cuenta las reglas de transferencia y transmisión." },
          { t: "Anthropic es responsable y la firma no tiene obligaciones.", ok: false, r: "La firma decide el para qué y el cómo: sigue siendo responsable." },
          { t: "Nadie es responsable porque es inteligencia artificial.", ok: false, r: "La ley aplica igual cuando se usa IA: siempre hay un responsable." }
        ]
      },
      "Minimiza antes de pedir": 7,
      "¿Quién vigila? La SIC": {
        tipo: "elige",
        titulo: "Practica: ¿a quién le importa?",
        situacion: "Un compañero dice: «Como es inteligencia artificial, la ley de datos personales no aplica». ¿Qué le respondes?",
        opciones: [
          { t: "Tiene razón: la Ley 1581 es anterior a la IA.", ok: false, r: "La ley aplica a cualquier tratamiento de datos, con o sin IA." },
          { t: "Solo aplica si la IA es colombiana.", ok: false, r: "Lo que importa es el tratamiento de datos de personas, no la nacionalidad de la herramienta." },
          { t: "Sí aplica: la SIC vigila el tratamiento de datos también con IA y publicó lineamientos en 2024.", ok: true, r: "Correcto: privacidad desde el diseño, evaluación de riesgos y responsabilidad demostrada también con IA." }
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    "propiedad-intelectual": {
      "Las normas en un vistazo": {
        tipo: "clasifica",
        titulo: "Practica: ¿derecho de autor o propiedad industrial?",
        instruccion: "Clasifica qué protege cada cosa.",
        categorias: ["Derecho de autor", "Propiedad industrial"],
        items: [
          { t: "Un libro de doctrina", c: 0 },
          { t: "Una marca de un producto", c: 1 },
          { t: "Un programa de computador", c: 0 },
          { t: "Una invención patentable", c: 1 },
          { t: "Un secreto empresarial", c: 1 }
        ]
      },
      "Lo que entra: no todo se puede usar": 5,
      "Datos públicos no siempre son libres": {
        tipo: "elige",
        titulo: "Practica: el portal de datos abiertos",
        situacion: "Quieres descargar masivamente un portal público con datos de personas naturales para analizarlos con IA. ¿Qué revisas primero?",
        opciones: [
          { t: "Nada: si está publicado, es libre.", ok: false, r: "Los portales tienen términos de uso y, si hay personas naturales, aplica la Ley 1581." },
          { t: "Los términos de uso del portal y la base legal para tratar esos datos personales.", ok: true, r: "Exacto: público no siempre es libre, ni para descargar masivamente ni para tratar datos personales." },
          { t: "Solo que la IA tenga capacidad para procesarlos.", ok: false, r: "La capacidad técnica no resuelve los permisos ni las obligaciones legales." }
        ]
      },
      "Lo que sale: ¿de quién es el resultado?": {
        tipo: "elige",
        titulo: "Practica: el texto 100 % generado",
        situacion: "Un cliente pregunta si puede registrar como obra suya un texto que la IA generó completo, sin ningún aporte creativo humano. ¿Qué le explicas?",
        opciones: [
          { t: "Sí, sin problema: lo generó su cuenta.", ok: false, r: "Para el derecho de autor el autor debe ser una persona natural: sin aporte creativo humano la protección es dudosa." },
          { t: "Que la protección es dudosa sin aporte creativo humano, aunque contractualmente el resultado le pertenezca.", ok: true, r: "Correcto: pertenecer por contrato no es lo mismo que tener protección como obra." },
          { t: "Que el autor es Anthropic.", ok: false, r: "Según los términos comerciales, el resultado le pertenece al usuario en la medida que la ley lo permita." }
        ]
      },
      "Secretos y marcas: dos trampas comunes": 6
    },

    /* ------------------------------------------------------------------ */
    confidencialidad: {
      "El secreto profesional sigue vigente": {
        tipo: "elige",
        titulo: "Practica: ¿aplica el secreto?",
        situacion: "Un abogado dice: «El secreto profesional es con personas; con una herramienta de IA no aplica». ¿Es correcto?",
        opciones: [
          { t: "No: el secreto profesional aplica también a lo que escribes o das a leer a una herramienta de IA.", ok: true, r: "Correcto: por eso se usan herramientas aprobadas, la cuenta corporativa y la mínima información necesaria." },
          { t: "Sí: la IA no es una persona.", ok: false, r: "El deber es tuyo, no de la herramienta: revelas información si la entregas a un tercero sin las garantías debidas." },
          { t: "Depende de si el chat se borra después.", ok: false, r: "Borrar no deshace la revelación. El deber aplica antes de escribir." }
        ]
      },
      "Instrucciones escondidas (prompt injection)": 6,
      "Claves y contraseñas: nunca en un chat": {
        tipo: "elige",
        titulo: "Practica: la clave pegada",
        situacion: "Sin darte cuenta, pegaste una contraseña de un sistema de la firma en un chat. Ya borraste el mensaje. ¿Qué sigue?",
        opciones: [
          { t: "Nada: ya la borré.", ok: false, r: "Borrar el mensaje no basta: la clave se considera comprometida." },
          { t: "Cambio la clave cuando tenga tiempo.", ok: false, r: "Debe ser de inmediato: mientras tanto, cualquiera que la haya visto puede usarla." },
          { t: "La cambio o la hago revocar de inmediato y aviso a TI.", ok: true, r: "Correcto: una clave expuesta se revoca y se reemplaza ya, y TI evalúa si hubo accesos indebidos." }
        ]
      },
      "La «IA en la sombra»": 5,
      "Si algo sale mal: reporta de inmediato": {
        tipo: "elige",
        titulo: "Practica: el error del viernes",
        situacion: "El viernes a las 6 p. m. te das cuenta de que adjuntaste el documento de un cliente en una herramienta no aprobada. ¿Qué haces?",
        opciones: [
          { t: "Espero al lunes para no molestar a nadie.", ok: false, r: "Cada hora cuenta para contener el daño. Se reporta de inmediato." },
          { t: "Lo reporto de inmediato a TI o al responsable de seguridad, con lo que pasó y a qué hora.", ok: true, r: "Correcto: reportar rápido permite contener, evaluar y cumplir obligaciones, como un posible reporte a la SIC." },
          { t: "Borro mi cuenta de la herramienta y no digo nada.", ok: false, r: "Ocultarlo agrava el problema. El objetivo del reporte es corregir, no castigar." }
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    "riesgos-legales": {
      "Subir es entregar": 8,
      "Correos electrónicos": {
        tipo: "elige",
        titulo: "Practica: el hilo de correos",
        situacion: "Quieres que la IA te ayude a responder un hilo largo de correos con un cliente. ¿Qué haces?",
        opciones: [
          { t: "Pego el hilo completo en un chat para que tenga todo el contexto.", ok: false, r: "Un hilo trae datos de varias personas, información del cliente y a veces adjuntos: pegarlo es entregarlo a un tercero." },
          { t: "Le pido un borrador con hechos generales y sin datos identificables, y completo yo los detalles; o uso el conector aprobado por TI.", ok: true, r: "Correcto: minimizas lo que entregas y usas solo los caminos aprobados." },
          { t: "Reenvío el hilo a mi correo personal y lo trabajo desde allá.", ok: false, r: "Sacar información de los sistemas de la firma multiplica el riesgo." }
        ]
      },
      "Documentos para patentar": 9,
      "Marcas antes de radicar": {
        tipo: "elige",
        titulo: "Practica: el lanzamiento secreto",
        situacion: "Un cliente lanzará una marca nueva el próximo año y aún no la ha radicado. Quieres ideas de eslogan. ¿Qué haces?",
        opciones: [
          { t: "Escribo el nombre de la marca en un chat compartido para pedir ideas.", ok: false, r: "Si se filtra antes de radicar, un tercero podría solicitarla primero." },
          { t: "Pido ideas describiendo el tipo de producto, sin el nombre ni los planes del cliente.", ok: true, r: "Correcto: obtienes ayuda sin revelar información confidencial que podría costarle la marca al cliente." },
          { t: "La busco en una app gratuita de IA para ver si ya existe.", ok: false, r: "Una app no aprobada es justo el lugar donde no debe quedar esa información." }
        ]
      },
      "Secretos de innovación y patentabilidad": {
        tipo: "clasifica",
        titulo: "Practica: ¿secreto que proteger?",
        instruccion: "Clasifica cada información de un cliente de propiedad industrial.",
        categorias: ["Secreto: se protege", "Pública: se puede usar"],
        items: [
          { t: "El análisis de patentabilidad de una invención no radicada", c: 0 },
          { t: "El texto publicado de una patente ya concedida", c: 1 },
          { t: "Los resultados de pruebas técnicas del laboratorio del cliente", c: 0 },
          { t: "Una norma de la Decisión 486", c: 1 },
          { t: "La estrategia de protección de la cartera de marcas del cliente", c: 0 }
        ]
      },
      "Contratos con nombres y datos": {
        tipo: "elige",
        titulo: "Practica: el contrato laboral",
        situacion: "Necesitas revisar un contrato laboral que tiene nombre, cédula, salario y una cláusula sobre una condición de salud del trabajador. ¿Cómo lo trabajas?",
        opciones: [
          { t: "Lo subo a un chat: es solo un contrato.", ok: false, r: "Contiene datos personales y sensibles, además de confidencialidad: no se sube." },
          { t: "Lo reviso con Claude Code sobre una copia seudonimizada, sin los datos de salud que no se necesiten.", ok: true, r: "Correcto: lectura local, minimización y protección reforzada para los datos sensibles." },
          { t: "Le pido al trabajador que me autorice por WhatsApp a subirlo.", ok: false, r: "No resuelve la política de la firma ni la confidencialidad con el cliente." }
        ]
      },
      "Las consecuencias": {
        tipo: "clasifica",
        titulo: "Practica: ¿qué tipo de consecuencia?",
        instruccion: "Clasifica cada consecuencia.",
        categorias: ["Pública (Estado)", "Privada (con el cliente o la firma)"],
        items: [
          { t: "Una multa de la SIC por violar la ley de datos personales", c: 0 },
          { t: "Una sanción disciplinaria al abogado por violar el secreto profesional", c: 0 },
          { t: "Una demanda del cliente por incumplir la cláusula de confidencialidad", c: 1 },
          { t: "La pérdida del cliente y de la confianza en la firma", c: 1 }
        ]
      },
      "Qué hacer en su lugar": {
        tipo: "elige",
        titulo: "Practica: la alternativa correcta",
        situacion: "Necesitas analizar con IA un documento confidencial de un cliente. ¿Cuál es el camino correcto?",
        opciones: [
          { t: "Claude Code sobre la carpeta de la firma, con la cuenta corporativa, una copia seudonimizada si basta y revisión del resultado.", ok: true, r: "Ese es el camino: la IA sí se puede usar con información sensible, pero por la vía correcta." },
          { t: "Una app gratuita, porque no guarda historial.", ok: false, r: "Sin contrato ni controles no sabes qué hace con la información." },
          { t: "Pegar solo las partes más delicadas para que el chat se concentre en ellas.", ok: false, r: "Al contrario: lo delicado es lo que menos debe salir." }
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    rag: {
      "El problema: Claude no conoce tus documentos": {
        tipo: "elige",
        titulo: "Practica: el concepto interno",
        situacion: "Le preguntas a Claude, en un chat sin documentos, qué opinó la firma en un concepto interno de 2022. Te responde con mucha seguridad. ¿Qué pasa?",
        opciones: [
          { t: "Lo sabe porque es la cuenta de la firma.", ok: false, r: "La cuenta corporativa no le da conocimiento de los documentos internos." },
          { t: "Probablemente lo inventó: no conoce los documentos de la firma si no se los dan.", ok: true, r: "Correcto: la solución es darle la información correcta en el momento de responder, no confiar en su memoria." },
          { t: "Hay que reentrenarlo con todos los conceptos.", ok: false, r: "No se reentrena: se le entrega la información relevante cuando la necesita (eso hace RAG)." }
        ]
      },
      "Cómo funciona RAG, paso a paso": 6,
      "Fragmentos y búsqueda por significado": {
        tipo: "elige",
        titulo: "Practica: ¿cómo partir el documento?",
        situacion: "Vas a preparar un estatuto de 200 artículos para un RAG. ¿Cuál es la mejor forma de dividirlo en fragmentos?",
        opciones: [
          { t: "En trozos de 500 caracteres exactos, aunque corten un artículo por la mitad.", ok: false, r: "Cortar a la mitad mezcla ideas y empeora la búsqueda." },
          { t: "Todo el estatuto como un solo fragmento.", ok: false, r: "Un fragmento gigante hace difícil encontrar lo relevante." },
          { t: "Respetando su estructura: un fragmento por artículo o grupo de artículos relacionados.", ok: true, r: "Correcto: respetar la estructura ayuda a que la búsqueda por significado encuentre lo que importa." }
        ]
      },
      "Ojo con los permisos": {
        tipo: "elige",
        titulo: "Practica: la respuesta que no te tocaba",
        situacion: "El asistente RAG de la firma te muestra fragmentos del expediente de un cliente con el que no trabajas. ¿Qué haces?",
        opciones: [
          { t: "Lo reporto a TI: el sistema no está respetando los permisos.", ok: true, r: "Correcto: un buen RAG solo muestra lo que cada persona ya puede ver. Es un incidente." },
          { t: "Lo aprovecho: si me lo mostró, puedo verlo.", ok: false, r: "Que el sistema falle no te autoriza a usar información que no te corresponde." },
          { t: "Lo comparto con el equipo de ese cliente.", ok: false, r: "Difundirlo agrava el problema. Primero se reporta." }
        ]
      },
      "¿Claude Code en la carpeta o RAG propio?": 5
    },

    /* ------------------------------------------------------------------ */
    skills: {
      "¿Qué es una Skill?": 5,
      "¿Qué hay dentro de una Skill?": {
        tipo: "elige",
        titulo: "Practica: lo obligatorio",
        situacion: "Vas a crear tu primera Skill. ¿Qué es lo único obligatorio?",
        opciones: [
          { t: "Un programa en Python.", ok: false, r: "Los scripts son opcionales." },
          { t: "Un archivo SKILL.md con nombre, descripción e instrucciones.", ok: true, r: "Correcto: plantillas, ejemplos y scripts son opcionales." },
          { t: "Una clave de la API.", ok: false, r: "Una Skill no necesita claves, y nunca deben ir dentro de ella." }
        ]
      },
      "Solo se lee cuando hace falta": {
        tipo: "elige",
        titulo: "Practica: ¿muchas Skills llenan el escritorio?",
        situacion: "Tu área tiene 30 Skills instaladas. Un compañero teme que Claude se sature. ¿Qué le explicas?",
        opciones: [
          { t: "Que tiene razón: Claude lee las 30 completas en cada pedido.", ok: false, r: "No: al inicio solo ve el nombre y la descripción de cada una." },
          { t: "Que Claude solo ve nombre y descripción, y abre una Skill completa solo cuando el pedido coincide.", ok: true, r: "Correcto: es la divulgación progresiva. Por eso puedes tener muchas." },
          { t: "Que hay que borrar las que no se usaron hoy.", ok: false, r: "No es necesario: solo se cargan cuando hacen falta." }
        ]
      },
      "La descripción lo es todo": 6,
      "Seguridad: solo Skills confiables": {
        tipo: "clasifica",
        titulo: "Practica: ¿la instalas?",
        instruccion: "Clasifica cada Skill.",
        categorias: ["Instalar", "No instalar sin revisión de TI"],
        items: [
          { t: "Una Skill que hizo el área, revisada y aprobada por TI", c: 0 },
          { t: "Una Skill descargada de un foro, con scripts que no entiendes", c: 1 },
          { t: "Una Skill oficial de una fuente confiable, aprobada por la firma", c: 0 },
          { t: "Una Skill que pide tus contraseñas para «funcionar mejor»", c: 1 }
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    mcp: {
      "Un enchufe universal": {
        tipo: "elige",
        titulo: "Practica: ¿qué es MCP?",
        situacion: "En una reunión preguntan qué es MCP. ¿Cuál es la mejor explicación?",
        opciones: [
          { t: "Un estándar abierto para conectar la IA con otras aplicaciones y fuentes de datos.", ok: true, r: "Correcto: como un enchufe universal, una misma conexión sirve para distintas herramientas compatibles." },
          { t: "Un nuevo modelo de Claude más rápido.", ok: false, r: "No es un modelo: es un protocolo de conexión." },
          { t: "Un antivirus para la IA.", ok: false, r: "No protege por sí mismo: por eso los conectores se aprueban y se limitan." }
        ]
      },
      "Cliente, servidor y herramientas": {
        tipo: "elige",
        titulo: "Practica: ¿quién hace qué?",
        situacion: "Claude, conectado por MCP al gestor documental, quiere usar la herramienta «buscar expediente». ¿Qué puede hacer?",
        opciones: [
          { t: "Cualquier cosa en el gestor documental, aunque el servidor no la ofrezca.", ok: false, r: "Solo puede usar las herramientas que el servidor ofrece." },
          { t: "Usar solo las herramientas que el servidor ofrece, con los permisos configurados.", ok: true, r: "Correcto: Claude (cliente) decide cuándo usarla, pero el servidor define qué se puede hacer." },
          { t: "Nada: MCP solo sirve para leer correos.", ok: false, r: "MCP conecta muchas aplicaciones, no solo el correo." }
        ]
      },
      "Conectores listos para usar": {
        tipo: "elige",
        titulo: "Practica: el archivo que no puedes ver",
        situacion: "Con el conector de Microsoft 365, ¿puede Claude mostrarte un archivo de otra área al que tú no tienes acceso?",
        opciones: [
          { t: "Sí: el conector tiene acceso a todo.", ok: false, r: "Los conectores respetan tus permisos." },
          { t: "Sí, si se lo pides con amabilidad.", ok: false, r: "El pedido no cambia los permisos." },
          { t: "No: el conector usa tus permisos; si lo viera, es un problema que se reporta a TI.", ok: true, r: "Correcto: si tú no puedes ver un archivo, Claude tampoco debería verlo a través del conector." }
        ]
      },
      "Dos reglas de oro": 6,
      "Cuidado con conectores desconocidos": 5
    },

    /* ------------------------------------------------------------------ */
    agentes: {
      "Chat vs. agente": {
        tipo: "clasifica",
        titulo: "Practica: ¿chat o agente?",
        instruccion: "Clasifica cada tarea.",
        categorias: ["Basta un chat", "Conviene un agente"],
        items: [
          { t: "Reescribir un párrafo en lenguaje claro", c: 0 },
          { t: "Buscar en varias fuentes, comparar y preparar un informe de varios pasos", c: 1 },
          { t: "Pedir tres ideas de título", c: 0 },
          { t: "Revisar una carpeta completa, detectar inconsistencias y proponer correcciones", c: 1 }
        ]
      },
      "El ciclo de un agente": {
        tipo: "elige",
        titulo: "Practica: el orden del ciclo",
        situacion: "¿Cuál es el ciclo de trabajo de un agente?",
        opciones: [
          { t: "Responde una vez y termina.", ok: false, r: "Eso es un chat, no un agente." },
          { t: "Decide qué hacer, usa una herramienta, mira el resultado y ajusta, hasta cumplir el objetivo o necesitar tu aprobación.", ok: true, r: "Correcto: trabaja en ciclos y se detiene cuando necesita una persona." },
          { t: "Hace todo sin herramientas, solo con su memoria.", ok: false, r: "Los agentes usan herramientas para buscar, leer y actuar." }
        ]
      },
      "¿Agente o flujo fijo?": 6,
      "Trabajo en equipo: subagentes": {
        tipo: "elige",
        titulo: "Practica: 40 contratos",
        situacion: "Hay que revisar 40 contratos con la misma lista de chequeo. ¿Cómo aprovechas los subagentes?",
        opciones: [
          { t: "Un solo agente lee los 40 seguidos en la misma conversación.", ok: false, r: "Puede llenar su contexto y perder calidad." },
          { t: "Cada subagente revisa un grupo de contratos con su propio contexto y el agente principal reúne los resultados para tu revisión.", ok: true, r: "Correcto: divides el trabajo, incluso en paralelo, y mantienes una revisión final humana." },
          { t: "Cada subagente envía su informe directo al cliente.", ok: false, r: "Las acciones externas requieren aprobación humana." }
        ]
      },
      "Control: persona en el ciclo y registro": 5
    },

    /* ------------------------------------------------------------------ */
    "claude-code": {
      "¿Qué es Claude Code?": {
        tipo: "elige",
        titulo: "Practica: ¿cuándo usarlo?",
        situacion: "Necesitas que la IA te ayude con los documentos de un cliente que están en la carpeta de la firma. ¿Qué herramienta usas?",
        opciones: [
          { t: "Claude Code, que lee los archivos desde la carpeta sin subirlos a un chat.", ok: true, r: "Correcto: es la herramienta de la firma para trabajar con documentos." },
          { t: "Un chat de Claude con los documentos adjuntos.", ok: false, r: "La política de la firma: los documentos no se suben a chats." },
          { t: "Un Proyecto de Claude con los documentos cargados.", ok: false, r: "Tampoco: en los Proyectos no van documentos de clientes." }
        ]
      },
      "CLAUDE.md: las reglas de la casa": 5,
      "Tú controlas qué puede hacer": 4,
      "Hooks y control de cambios": {
        tipo: "elige",
        titulo: "Practica: el cambio que salió mal",
        situacion: "Claude Code modificó varios archivos de la carpeta y el resultado no te gusta. La carpeta usa git. ¿Qué haces?",
        opciones: [
          { t: "Reviso con git qué cambió exactamente y vuelvo a la versión anterior.", ok: true, r: "Correcto: git guarda cada versión y permite deshacer con seguridad." },
          { t: "Borro la carpeta y empiezo de cero.", ok: false, r: "No hace falta: git te deja volver atrás sin perder nada." },
          { t: "Nada: lo que hace Claude Code no se puede deshacer.", ok: false, r: "Con control de cambios sí se puede." }
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    api: {
      "¿Qué es una API?": {
        tipo: "elige",
        titulo: "Practica: ¿chat o API?",
        situacion: "El gestor documental debe clasificar automáticamente cada documento que llega, sin que nadie escriba en un chat. ¿Qué se usa?",
        opciones: [
          { t: "Un chat abierto todo el día, donde alguien pega cada documento.", ok: false, r: "No escala y rompe la política de documentos." },
          { t: "La API de Anthropic, integrada por TI en el gestor documental.", ok: true, r: "Correcto: la API permite que un sistema le envíe pedidos a Claude y reciba las respuestas." },
          { t: "Una cuenta personal compartida.", ok: false, r: "Nunca: sin controles, sin contrato y sin trazabilidad." }
        ]
      },
      "La clave de la API es un secreto": 4,
      "Cuánto cuesta y cómo ahorrar": 5,
      "Herramientas (tool use)": {
        tipo: "elige",
        titulo: "Practica: ¿quién ejecuta la herramienta?",
        situacion: "Por la API, Claude pide usar la herramienta «consultar estado del proceso». ¿Quién la ejecuta?",
        opciones: [
          { t: "Claude, directamente en los servidores de la firma.", ok: false, r: "Claude solo pide usarla: no entra a los sistemas de la firma." },
          { t: "Nadie: es solo una sugerencia.", ok: false, r: "Sí se ejecuta, pero lo decide el sistema." },
          { t: "El sistema de la firma, que decide si la ejecuta y le devuelve el resultado a Claude.", ok: true, r: "Correcto: el control queda del lado de la firma." }
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    final: {
      "¿Qué herramienta uso?": 3,
      "Antes de darle información a la IA": 4,
      "Antes de usar el resultado": {
        tipo: "clasifica",
        titulo: "Practica: ¿listo para enviar?",
        instruccion: "Clasifica cada situación antes de enviar un resultado de la IA al cliente.",
        categorias: ["Listo para enviar", "Falta revisar"],
        items: [
          { t: "Citas verificadas en la relatoría y cifras confirmadas", c: 0 },
          { t: "Un concepto con cinco sentencias que nadie buscó", c: 1 },
          { t: "Un logo generado por IA sin revisar marcas similares", c: 1 },
          { t: "Un resumen que un abogado leyó y corrigió", c: 0 }
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    "resumen-general": {
      "El mapa del curso": {
        tipo: "elige",
        titulo: "Practica: las tres preguntas",
        situacion: "El curso responde tres grandes preguntas. ¿Cuáles son?",
        opciones: [
          { t: "¿Cuánto cuesta Claude?, ¿quién lo hizo? y ¿cuándo sale la próxima versión?", ok: false, r: "Son datos interesantes, pero no son el eje del curso." },
          { t: "¿Cómo funciona Claude?, ¿cómo se usa en la firma? y ¿cómo se protege la información?", ok: true, r: "Correcto: entender, usar bien y proteger." },
          { t: "¿Cómo programar?, ¿cómo diseñar? y ¿cómo vender?", ok: false, r: "El curso es sobre el uso responsable de la IA en la firma." }
        ]
      },
      "De la tarea al resultado, en seis pasos": 4,
      "Las reglas de oro de la firma": 3
    }
  };

  function esPractica(p) { return p && (p.tipo === "elige" || p.tipo === "clasifica"); }

  // Devuelve los pasos del módulo alternando teoría y práctica.
  function intercalar(moduloId, pasos, mapa) {
    // Los talleres (recetas) ya tienen su propio orden: no se tocan.
    if (pasos.some(function (p) { return p.tipo === "receta" || p.tipo === "constructor"; })) return pasos.slice();
    mapa = mapa || PRACTICAS[moduloId] || {};
    var usadas = {};
    Object.keys(mapa).forEach(function (t) { if (typeof mapa[t] === "number") usadas[mapa[t]] = true; });
    var resultado = [];
    pasos.forEach(function (p) {
      if (esPractica(p)) return;
      resultado.push(p);
      if (p.tipo !== "concepto") return;
      var asignada = mapa[p.titulo];
      if (typeof asignada === "number") {
        if (esPractica(pasos[asignada])) resultado.push(pasos[asignada]);
      } else if (asignada && esPractica(asignada)) {
        resultado.push(asignada);
      } else {
        for (var i = 0; i < pasos.length; i++) {
          if (esPractica(pasos[i]) && !usadas[i]) { usadas[i] = true; resultado.push(pasos[i]); break; }
        }
      }
    });
    // Las prácticas que no se asignaron a ningún concepto quedan al final.
    pasos.forEach(function (p, i) { if (esPractica(p) && !usadas[i] && resultado.indexOf(p) < 0) resultado.push(p); });
    return resultado;
  }

  var api = { PRACTICAS: PRACTICAS, intercalar: intercalar };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else global.Practicas = api;
})(typeof window !== "undefined" ? window : globalThis);
