/*
 * AI BOSS — por qué no se usan cuentas gratuitas o personales de IA
 * (Claude, ChatGPT, Gemini, Copilot personal, etc.) para trabajo de la firma.
 *
 * Se muestra en la introducción y en el resumen de TODOS los módulos (incluidos
 * los talleres), con un texto adaptado al tema de cada uno, y en la responsiva.
 * Las condiciones de los proveedores cambian: revisar este texto periódicamente
 * contra los términos vigentes de Anthropic y OpenAI.
 */
(function (global) {
  "use strict";

  var GENERAL = {
    titulo: "Cuentas gratuitas y personales: por qué no",
    resumen: "Las cuentas gratuitas o personales de Claude, ChatGPT u otra IA (incluso las de pago personal, como Claude Pro o ChatGPT Plus) se rigen por términos de consumidor, no por el contrato de la firma. Con información de la firma o de clientes no se usan nunca.",
    puntos: [
      "Pagar no la vuelve corporativa: Claude Pro o Max y ChatGPT Plus o Pro siguen siendo planes personales con términos de consumidor. Lo que protege es el plan empresarial de la firma (Claude Team o Enterprise, ChatGPT Business o Enterprise), con contrato y controles.",
      "Entrenamiento: en los planes de consumidor, lo que escribes puede usarse para entrenar o mejorar los modelos según la configuración de la cuenta (en ChatGPT viene activado por defecto; en Claude depende de la opción que elijas). Lo que entra al entrenamiento no se puede «sacar» después.",
      "Retención: las conversaciones pueden conservarse por años si autorizas el entrenamiento, por 30 días o más por seguridad, y por más tiempo si una orden judicial o una investigación lo exige. Borrar el chat no garantiza que desaparezca de inmediato.",
      "Revisión humana: en cuentas de consumidor, personal del proveedor puede revisar conversaciones marcadas por seguridad o por calidad.",
      "Sin contrato con la firma: no hay acuerdo de tratamiento de datos, ni compromisos de confidencialidad, ni garantías para la transferencia internacional de datos personales (Ley 1581 de 2012, art. 26). Para efectos legales, entregaste la información a un tercero sin las medidas debidas.",
      "Sin control de la firma: TI no puede ver, auditar, retener ni borrar lo que pasa en tu cuenta personal; no hay inicio de sesión corporativo ni registro de uso. Si te vas de la firma, las conversaciones se van contigo.",
      "Más riesgo de acceso indebido: una cuenta personal con contraseña débil o sin doble factor puede ser tomada por terceros, y con ella todo su historial. Los enlaces compartidos los puede abrir cualquiera que los tenga.",
      "Consecuencias legales: usarla con información de clientes o de la firma puede violar el secreto profesional (Ley 1123 de 2007), la protección de datos (Ley 1581 de 2012), las cláusulas de confidencialidad y la protección del secreto empresarial (Decisión 486, art. 260), que exige medidas razonables de reserva. Responde quien ejecuta el prompt.",
      "Qué hacer: usa solo la cuenta corporativa aprobada por TI, cierra sesión de tus cuentas personales en el equipo de trabajo y, si ya usaste una cuenta personal con información de la firma, repórtalo a TI de inmediato."
    ]
  };

  // Lo que significa una cuenta gratuita o personal en el tema de cada módulo.
  var MODULOS = {
    "fundamentos": "Una cuenta gratuita usa el mismo tipo de modelo, pero sin las garantías del contrato: lo que le escribas puede quedar retenido o usarse para entrenar. Además, sus límites de uso y de contexto son menores y puede cambiar de modelo sin avisarte.",
    "claude-trabajo": "La cuenta de la firma (Team o Enterprise) es la única para trabajo. Una cuenta gratuita o Pro personal no tiene contrato, ni controles de TI, ni inicio de sesión corporativo; sus Proyectos, Artifacts y enlaces compartidos quedan fuera del alcance de la firma.",
    "aplicativos": "Un aplicativo, aunque sea un prototipo personal, nunca se construye ni se prueba con una cuenta o una clave de API gratuita o personal: los datos de prueba y el código quedarían bajo términos de consumidor y fuera del control de TI.",
    "prompts": "Un buen pedido no arregla una mala cuenta: aunque redactes el prompt perfecto, si lo escribes en una cuenta gratuita con datos de la firma, la información ya salió. Practica tus prompts solo en la cuenta corporativa.",
    "datos-personales": "Pegar datos personales en una cuenta gratuita es una transferencia a un tercero sin acuerdo de tratamiento ni garantías (Ley 1581, art. 26): la firma no podría demostrar responsabilidad ante la SIC. Con datos sensibles, el riesgo es aún mayor.",
    "propiedad-intelectual": "En una cuenta gratuita, una obra de terceros, un secreto empresarial o una marca no radicada pueden terminar retenidos o usados para entrenar: pierdes las «medidas razonables» de reserva que exige la Decisión 486 y puedes infringir licencias.",
    "confidencialidad": "Una cuenta personal es «IA en la sombra»: TI no la controla, no tiene doble factor corporativo ni registro de uso. Usarla con información de la firma rompe el secreto profesional y es un incidente que se reporta de inmediato.",
    "riesgos-legales": "Subir correos, patentes, marcas o contratos a una cuenta gratuita suma riesgos: entrenamiento, retención, revisión humana y ningún contrato con la firma. Pagar el plan personal no cambia esto: sigue siendo un plan de consumidor.",
    "netsuite": "Ninguna información de NetSuite se lleva a una cuenta gratuita o personal de Claude o ChatGPT, ni siquiera con datos ficticios mezclados con reales. Las consultas de diseño (fórmulas, búsquedas, scripts) se hacen solo en la cuenta corporativa y con autorización.",
    "rag": "Un RAG o un asistente sobre documentos de la firma nunca se monta sobre una cuenta gratuita ni sobre la API con una cuenta personal: los documentos y las preguntas quedarían fuera de los permisos y del contrato de la firma.",
    "skills": "No instales ni pruebes Skills de la firma en una cuenta personal: las instrucciones, plantillas y ejemplos que contienen son conocimiento de la firma y quedarían bajo términos de consumidor.",
    "mcp": "Nunca conectes el correo, OneDrive, NetSuite u otro sistema de la firma a una cuenta gratuita o personal de Claude o ChatGPT: le darías a un tercero acceso directo a la información, sin control de TI.",
    "agentes": "Un agente en una cuenta personal puede leer, buscar y actuar con información de la firma sin registro corporativo ni aprobación de TI. Los agentes y el modo agente solo se usan en la cuenta de la firma.",
    "claude-code": "Claude Code se inicia solo con la cuenta de la firma. Si inicias sesión con una cuenta personal (Pro o Max), los archivos que lea de tu carpeta se procesan bajo términos de consumidor: revisa con /status con qué cuenta estás.",
    "api": "Una clave de API creada con una cuenta personal y tarjeta propia no está bajo el contrato de la firma ni bajo sus límites de gasto, y TI no puede revocarla. Toda integración usa claves de la organización de la firma.",
    "final": "Antes de darle cualquier información a una IA, la primera pregunta es: ¿estoy en la cuenta corporativa aprobada? Si la respuesta es no, nada de la firma entra, por más útil que parezca.",
    "resumen-general": "La regla que lo resume todo: cuenta corporativa siempre. Las cuentas gratuitas o personales (aunque sean de pago) no se usan nunca con información de la firma o de clientes.",
    "taller": "La receta 1 del taller es entrar con la cuenta de la firma por algo: cualquier otra receta hecha en una cuenta gratuita o personal deja la información fuera del contrato y del control de TI.",
    "taller-chatgpt": "ChatGPT gratis, Go, Plus o Pro son planes personales: por defecto pueden usar tus conversaciones para entrenar. Para trabajo de la firma solo sirve un espacio de trabajo ChatGPT Business o Enterprise aprobado por TI."
  };

  function texto(moduloId) { return MODULOS[moduloId] || GENERAL.resumen; }

  var api = { GENERAL: GENERAL, MODULOS: MODULOS, texto: texto };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else global.CuentasGratuitas = api;
})(typeof window !== "undefined" ? window : globalThis);
