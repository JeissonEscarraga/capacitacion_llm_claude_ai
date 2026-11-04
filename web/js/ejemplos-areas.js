/*
 * Lex Boss — ejemplos de la conceptualización adaptados a cada área.
 * EjemplosArea[area][modulo] = { intro, ejemplos: { "<título del paso>": "..." } }
 * El área jurídica usa los ejemplos de conceptos.js. Generado a partir de
 * borradores revisados; para corregir un ejemplo, edítalo aquí.
 */
(function (global) {
  "use strict";
  var EJEMPLOS = {
  "tecnologia": {
    "fundamentos": {
      "intro": "Antes de automatizar o programar con IA, conviene entender qué es Claude, cómo produce sus respuestas y por qué todo lo que entrega (consultas, scripts, cifras) se revisa antes de usarlo.",
      "ejemplos": {
        "¿Qué es Claude?": "Pedirle que te explique qué hace una consulta SQL o que redacte un borrador de procedimiento de respaldos. Si el script o la base son de la firma, no van al chat: se trabajan con Claude Code desde la carpeta (lo verás en el módulo 2).",
        "¿Cómo produce sus respuestas?": "Si le preguntas por una función de DAX o de la API de NetSuite, puede darte una sintaxis convincente. Antes de usarla, compárala con la documentación oficial y pruébala en un entorno de pruebas.",
        "Alucinaciones: cuando inventa con seguridad": "Claude puede sugerir una librería de Python, un parámetro o un campo de NetSuite que no existe. Verifica en la documentación oficial y ejecuta el código en pruebas antes de llevarlo a producción.",
        "Tokens y ventana de contexto": "Un script de 300 líneas cabe sin problema. Un log de millones de líneas o una tabla completa no: conviene filtrar, resumir o trabajar por partes.",
        "Tres modelos para tres tipos de trabajo": "Para clasificar miles de tickets de soporte sencillos, Haiku. Para diseñar la arquitectura de una integración entre NetSuite y Power BI, Opus."
      }
    },
    "claude-trabajo": {
      "intro": "En Tecnología se manejan las bases, los accesos y los sistemas de toda la firma. Saber con qué cuenta trabajar, cómo organizarse y cómo compartir sin riesgos es parte del oficio.",
      "ejemplos": {
        "Cuenta de la firma vs. cuenta personal": "Todo lo que tenga código, esquemas, datos o configuraciones de la firma va solo en la cuenta corporativa, nunca en una cuenta personal.",
        "Política de la firma: los archivos no se suben": "Para revisar un extracto de cartera, abres Claude Code en la carpeta del proyecto y le pides: «Revisa Reportes/cartera_2026.xlsx y lista las columnas con valores vacíos o duplicados». No adjuntas nada; si no necesita nombres, usa una copia seudonimizada.",
        "Proyectos: reglas e instrucciones que se repiten": "Proyecto «Documentación técnica» con la plantilla de la firma y la instrucción «Escribe en español sencillo, con pasos numerados y una sección de qué hacer si falla». Las bases y el código se trabajan aparte, con Claude Code.",
        "Artifacts: documentos que aparecen a un lado": "Un diagrama de flujo de una integración, una tabla comparativa de herramientas o una lista de verificación para dar de alta a un usuario en Entra ID.",
        "Búsqueda web: información actual, pero se verifica": "Para cambios recientes en Power BI, NetSuite o Microsoft 365, prefiere la documentación oficial y las notas de versión del fabricante sobre blogs o foros.",
        "Compartir con cuidado": "Antes de mandar a un colega el enlace de un análisis, confirma que no muestre datos de clientes, rutas internas ni detalles de configuración que no le corresponden."
      }
    },
    "prompts": {
      "intro": "Un pedido claro ahorra horas de depuración. Aquí aprendes a pedirle a Claude consultas, scripts y análisis que salgan bien a la primera y sean fáciles de revisar.",
      "ejemplos": {
        "Un buen pedido tiene cinco partes": "En Claude Code, sobre la carpeta del proyecto: «Actúa como analista de datos. Revisa scripts/carga_ventas.py, identifica por qué duplica filas, explica la causa y propone la corrección. Guarda el resultado en Salidas/diagnostico.md.»",
        "Antes y después": "En vez de «arregla este script», di qué error sale, qué debería hacer, qué no debe tocar y en qué formato quieres la explicación.",
        "Separa las instrucciones del material": "«Lee sql/consulta_facturas.sql, el modelo en powerbi/ventas y la carpeta docs/, y explica qué tablas usa cada medida del tablero.»",
        "Ejemplos y permiso para decir «no consta»": "«Con base solo en docs/integracion_netsuite.md, ¿cada cuánto se sincroniza la cartera? Cita el texto. Si no aparece, responde: no consta.»",
        "Conversa e itera": "«La consulta está bien, pero agrega el filtro por año, quita la columna de observaciones y comenta cada paso.»"
      }
    },
    "datos-personales": {
      "intro": "Tecnología administra las bases donde viven los datos de clientes, empleados y contactos. Usar IA sobre ellas implica cumplir la ley de protección de datos (Ley 1581 de 2012).",
      "ejemplos": {
        "¿Qué es un dato personal?": "En una base de contactos, el nombre, la cédula, el correo y el celular de una persona natural son datos personales; el NIT y la razón social de una empresa no lo son, aunque pueden ser confidenciales.",
        "Datos sensibles: protección reforzada": "Si una tabla de nómina o de bienestar incluye datos de salud de empleados, cruzarla o analizarla con IA exige revisar con especial cuidado la base legal y minimizar al máximo.",
        "La regla de oro: autorización y finalidad": "Una base recogida para facturar no se reutiliza sin más para una campaña o un modelo nuevo: antes revisa la política de tratamiento de la firma y para qué se autorizó.",
        "Responsable, encargado y datos que viajan": "Procesar una base con la cuenta corporativa de Claude, con su contrato, es muy distinto a pasarla por una herramienta gratuita sin acuerdo de tratamiento de datos.",
        "Minimiza antes de pedir": "Para depurar un script de cartera, Claude no necesita nombres ni cédulas: trabaja con una copia donde los clientes son «Cliente A» o un identificador interno.",
        "¿Quién vigila? La SIC": "Si una base con datos personales queda expuesta por un permiso mal configurado o una herramienta no autorizada, la firma debe evaluar si reporta el incidente."
      }
    },
    "propiedad-intelectual": {
      "intro": "El software, las bases de datos y los datos de terceros tienen reglas de propiedad intelectual. Tecnología decide qué se usa y qué se construye, así que le toca conocerlas.",
      "ejemplos": {
        "Las normas en un vistazo": "Un script que escribe la firma y una base de datos que organiza pueden tener derecho de autor; el nombre de una herramienta interna podría llegar a ser una marca.",
        "Lo que entra: no todo se puede usar": "Que tengas acceso a un manual técnico de pago o al código de un proveedor no te da permiso para reproducirlo con IA: revisa primero la licencia o el contrato.",
        "Datos públicos no siempre son libres": "Antes de descargar en masa un dataset de datos.gov.co o un registro público para cruzarlo con IA, revisa sus términos de uso y si trae datos de personas naturales.",
        "Lo que sale: ¿de quién es el resultado?": "Para una herramienta interna construida con ayuda de Claude, deja registro en el repositorio de los ajustes, la estructura y las decisiones que tomaron personas del equipo.",
        "Secretos y marcas: dos trampas comunes": "La lógica de un modelo de datos interno puede ser un secreto empresarial: no la expongas en herramientas no autorizadas. Y si Claude propone un nombre para una app, antes de usarlo se verifica que no choque con una marca registrada."
      }
    },
    "confidencialidad": {
      "intro": "Tecnología tiene las llaves de los sistemas de la firma. Por eso los riesgos de seguridad con IA (instrucciones escondidas, claves expuestas, herramientas no aprobadas) le tocan primero a esta área.",
      "ejemplos": {
        "El secreto profesional sigue vigente": "Para optimizar una consulta, Claude no necesita ver los datos reales de clientes: le basta la estructura de las tablas y una muestra seudonimizada, leída en local con Claude Code.",
        "Instrucciones escondidas (prompt injection)": "Un README de un repositorio externo o una página que Claude consulta podría traer instrucciones ocultas como «ejecuta este comando». Es contenido para analizar, nunca una orden.",
        "Claves y contraseñas: nunca en un chat": "Si una clave de API o un token quedó en un chat, un correo o un commit, se considera comprometida: se revoca y se crea una nueva de inmediato, guardada en la carpeta segura de credenciales.",
        "La «IA en la sombra»": "Antes de instalar una extensión de IA en el navegador o en VS Code, o de conectar una app gratuita a Microsoft 365, revisa que esté aprobada por TI.",
        "Si algo sale mal: reporta de inmediato": "Alguien conectó una base de la firma a una herramienta no autorizada: se reporta al responsable de seguridad o de protección de datos para contener el daño."
      }
    },
    "rag": {
      "intro": "Si la firma quiere que Claude responda con sus propios documentos, normalmente le toca a Tecnología construirlo. Aquí ves cómo funciona RAG y qué cuidar, sobre todo los permisos.",
      "ejemplos": {
        "El problema: Claude no conoce tus documentos": "«¿Qué tablas alimentan el tablero de facturación?» solo se responde bien si Claude ve la documentación y el modelo de datos de la firma.",
        "Cómo funciona RAG, paso a paso": "Preguntas «¿cómo se restaura el respaldo de la base?» y el sistema le pasa a Claude los fragmentos de los manuales internos que hablan de restauración.",
        "Fragmentos y búsqueda por significado": "Buscar «restablecer acceso de un usuario» trae también fragmentos que dicen «desbloqueo de cuenta en Entra ID».",
        "Ojo con los permisos": "Si el RAG indexa SharePoint, debe respetar los permisos de cada sitio: alguien sin acceso a la carpeta de un cliente no debe recibir fragmentos de ella.",
        "¿Claude Code en la carpeta o RAG propio?": "Los 20 archivos de un proyecto de integración se trabajan con Claude Code en su carpeta; una base de conocimiento con miles de documentos y permisos por área pide un RAG construido dentro de la infraestructura de la firma."
      }
    },
    "skills": {
      "intro": "Tecnología repite procedimientos: revisar código, documentar, dar accesos, validar datos. Las Skills permiten escribirlos una vez para que Claude los aplique igual cada vez.",
      "ejemplos": {
        "¿Qué es una Skill?": "Skill «Revisión de scripts»: lista de verificación de la firma (estructura, manejo de errores, credenciales expuestas) y el formato del informe.",
        "¿Qué hay dentro de una Skill?": "La descripción podría ser: «Revisa scripts de Python o SQL con la lista de la firma. Úsala cuando pidan revisar código antes de llevarlo a producción».",
        "Solo se lee cuando hace falta": "Escribes «revisa este script antes de ejecutarlo» y Claude activa la Skill de revisión de código, aunque tengas otras veinte instaladas.",
        "La descripción lo es todo": "Si la Skill de validación de datos para Power BI no se activa, casi siempre el problema está en la descripción.",
        "Seguridad: solo Skills confiables": "Encuentras en internet una Skill «gratis» que automatiza consultas a NetSuite: antes de instalarla, se revisa su código y pasa por TI."
      }
    },
    "mcp": {
      "intro": "Conectar Claude con SharePoint, Power BI, NetSuite o bases de datos es trabajo típico de esta área. Aquí ves cómo funciona MCP y cómo hacerlo con seguridad.",
      "ejemplos": {
        "Un enchufe universal": "Con un conector, Claude puede consultar un modelo de Power BI o buscar un archivo en el SharePoint de la firma sin que tengas que exportarlo y moverlo a mano.",
        "Cliente, servidor y herramientas": "Un servidor MCP de la base de datos podría ofrecer solo «listar tablas» y «ejecutar consulta de lectura», sin herramientas para borrar o modificar.",
        "Conectores listos para usar": "«Busca en mi OneDrive el documento de arquitectura de la integración y resúmeme los pasos pendientes.» Claude solo verá lo que tu cuenta ya puede ver.",
        "Dos reglas de oro": "Al conectar una base, da acceso de solo lectura si la tarea es consultar. Si Claude prepara un cambio en permisos o en datos, tú lo revisas y lo ejecutas.",
        "Cuidado con conectores desconocidos": "Un servidor MCP de un repositorio desconocido que promete «conectar todo tu ERP» se revisa y se aprueba en TI antes de instalarlo."
      }
    },
    "agentes": {
      "intro": "Un agente puede revisar código, cruzar bases o depurar procesos en varios pasos sin que lo guíes en cada uno. Veamos cuándo conviene en Tecnología y cómo mantener el control.",
      "ejemplos": {
        "Chat vs. agente": "Agente: «Revisa los scripts de la carpeta procesos/, encuentra los que tienen rutas fijas de este PC y prepárame un cuadro con cada caso».",
        "El ciclo de un agente": "Para depurar una carga que falla, el agente lee el log, ejecuta el script en pruebas, ve el error, ajusta y vuelve a probar hasta que pasa o necesita tu visto bueno.",
        "¿Agente o flujo fijo?": "Actualizar cada mañana la misma tabla desde datos.gov.co: flujo fijo programado. Investigar por qué un tablero muestra cifras distintas a NetSuite: agente.",
        "Trabajo en equipo: subagentes": "Auditar 30 scripts: un subagente revisa cada uno y el principal arma el informe final con los hallazgos.",
        "Control: persona en el ciclo y registro": "Un agente puede proponer los cambios de permisos en SharePoint, pero una persona de TI los aprueba y queda registro de qué se cambió y por qué."
      }
    },
    "claude-code": {
      "intro": "Claude Code es la herramienta natural de esta área: trabaja sobre carpetas y repositorios, ejecuta comandos y escribe código, siempre con tus permisos.",
      "ejemplos": {
        "¿Qué es Claude Code?": "«Revisa scripts/sincronizar_cartera.py, explica qué hace paso a paso y propone cómo manejar el error cuando NetSuite no responde.»",
        "CLAUDE.md: las reglas de la casa": "Una regla útil: «Las credenciales se leen de variables de entorno; en el repositorio solo va un .env.example sin valores».",
        "Tú controlas qué puede hacer": "Antes de migrar las tablas de una base o reorganizar un repositorio, usa el modo plan, lee la propuesta y solo entonces apruébala.",
        "Hooks y control de cambios": "Un hook puede bloquear un commit que contenga una clave. Y si Claude Code rompió un script, con git ves exactamente qué cambió y vuelves a la versión anterior."
      }
    },
    "api": {
      "intro": "La API es la forma de integrar Claude en los procesos y sistemas que administra Tecnología. Aquí ves cómo funciona, cuánto cuesta y qué proteger.",
      "ejemplos": {
        "¿Qué es una API?": "Un proceso automático que toma cada solicitud que llega a un formulario interno y la clasifica con Claude antes de asignarla.",
        "La clave de la API es un secreto": "El script lee la clave desde una variable de entorno o la carpeta segura de credenciales; el repositorio solo trae un .env.example sin valores. Si se expone, se revoca de inmediato.",
        "Cuánto cuesta y cómo ahorrar": "Clasificar 50.000 registros históricos de una base para la otra semana: por lotes. Un asistente interno que responde en vivo: pedido normal, con caché para las instrucciones largas que se repiten.",
        "Herramientas (tool use)": "Un asistente interno al que se le ofrece la herramienta «consultar estado de factura»: Claude pide usarla y el sistema de la firma decide si la ejecuta y qué datos devuelve."
      }
    },
    "final": {
      "intro": "Último reto: casos de Tecnología y datos que mezclan todo lo aprendido. Antes, un mapa para elegir la herramienta correcta y las dos listas de verificación que nunca fallan.",
      "ejemplos": {
        "¿Qué herramienta uso?": "Estandarizar la revisión de scripts en todo el equipo: Skill. Consultar un modelo de Power BI desde Claude: conector. Depurar un repositorio: Claude Code.",
        "Antes de darle información a la IA": "Antes de analizar una base de contactos: Claude Code con la cuenta corporativa sobre una copia seudonimizada, sin claves en el código y con permisos de solo lectura.",
        "Antes de usar el resultado": "Un script que Claude escribió y parece funcionar: se revisa, se prueba con datos de prueba y se valida contra cifras conocidas antes de llevarlo a producción."
      }
    },
    "resumen-general": {
      "intro": "Llegaste al cierre. Aquí repasamos en pocos pasos todo el curso y luego viene la evaluación: una pregunta de cada tema. Al terminar, tu constancia incluye el resumen de todas las lecciones.",
      "ejemplos": {
        "El mapa del curso": "Cada vez que uses IA para una consulta, un script o un tablero pasarás por las tres preguntas, aunque sea en segundos.",
        "De la tarea al resultado, en seis pasos": "Corregir un script de carga: qué debe hacer → Claude Code en el repositorio → copia de datos sin información innecesaria → pedido con rol y formato → probar y revisar el cambio → entregar con tu revisión y registro en git.",
        "Las reglas de oro de la firma": "Antes de cada uso, repásalas mentalmente: toma menos de un minuto, incluso cuando estás apagando un incendio en producción."
      }
    }
  },
  "administrativo": {
    "fundamentos": {
      "intro": "En el área Administrativa todo pasa por textos: correos, actas, circulares, agendas y oficios. Empecemos por entender qué es Claude, cómo arma sus respuestas y por qué siempre hay que revisarlas.",
      "ejemplos": {
        "¿Qué es Claude?": "Pedirle un borrador de circular interna sobre el horario de fin de año o una plantilla de acta de reunión. Si el texto usa archivos de la firma, no se suben: se trabajan con Claude Code desde la carpeta (lo verás en el módulo 2).",
        "¿Cómo produce sus respuestas?": "Si le preguntas cuáles son los festivos de un mes o el horario de una entidad, te dará una respuesta convincente. Antes de ponerla en la agenda, compárala con el calendario oficial o con la página de la entidad.",
        "Alucinaciones: cuando inventa con seguridad": "Claude puede «recordar» un número de radicado, la dirección de una entidad o la fecha de un festivo que no existen. Todo dato que vaya a un oficio, a la agenda o a un sobre se confirma en la fuente original.",
        "Tokens y ventana de contexto": "Un acta de una reunión cabe sin problema. El registro de toda la correspondencia de un año conviene trabajarlo por partes, por ejemplo mes por mes.",
        "Tres modelos para tres tipos de trabajo": "Para clasificar cientos de correos de recepción por tipo (factura, citación, publicidad), Haiku. Para analizar con calma las propuestas de varios proveedores y armar una recomendación, Opus."
      }
    },
    "claude-trabajo": {
      "intro": "El área Administrativa maneja información de toda la firma: correspondencia de clientes, datos de empleados y contratos con proveedores. Aquí verás con qué cuenta trabajar, cómo organizarte y cómo compartir sin riesgos.",
      "ejemplos": {
        "Cuenta de la firma vs. cuenta personal": "La correspondencia de clientes, las hojas de vida o las cotizaciones de proveedores se trabajan solo con la cuenta corporativa, nunca con una cuenta personal o gratuita.",
        "Política de la firma: los archivos no se suben": "Para resumir la correspondencia del día, abres Claude Code en la carpeta y le pides: «Revisa Correspondencia/2026-11/ y lista cada documento recibido con remitente, asunto y fecha de vencimiento». No adjuntas nada.",
        "Proyectos: reglas e instrucciones que se repiten": "Proyecto «Comunicaciones internas» con la guía de estilo de la firma y la instrucción «Usa tono cordial, máximo 150 palabras y cierra con el área responsable». Las comunicaciones con datos de personas se trabajan aparte, con Claude Code.",
        "Artifacts: documentos que aparecen a un lado": "Una plantilla de circular, un cuadro comparativo de cotizaciones, una lista de chequeo de ingreso de personal o un calendario de vencimientos del mes.",
        "Búsqueda web: información actual, pero se verifica": "Para saber el horario de atención o el canal de radicación de una entidad, abre la fuente que cita Claude y prefiere la página oficial de esa entidad.",
        "Compartir con cuidado": "Antes de mandar el enlace de un cuadro de vacaciones o de un comparativo de proveedores, confirma que no incluya salarios, datos de empleados o precios que no le corresponden a quien lo recibe."
      }
    },
    "prompts": {
      "intro": "Un pedido claro ahorra idas y vueltas en tareas que se repiten todos los días, como redactar correos, ordenar agendas o clasificar documentos. Aquí aprendes a pedir bien (en inglés se les llama «prompts»).",
      "ejemplos": {
        "Un buen pedido tiene cinco partes": "En Claude Code, sobre la carpeta de compras: «Actúa como analista de compras. Compara las cotizaciones de Compras/2026-11/papeleria/, hazme una tabla con precio, plazo de entrega y garantía, y marca la más conveniente. Guarda el resultado en Salidas/comparativo.md.»",
        "Antes y después": "En vez de «hazme un correo para recordar la reunión», di: «Correo cordial, de cinco líneas, para recordar la reunión del jueves a las 9 a. m., con sala, duración y qué deben traer».",
        "Separa las instrucciones del material": "«Lee Correspondencia/2026-11/recibidos.xlsx y la carpeta Correspondencia/2026-11/escaneados, y arma un cuadro de documentos recibidos con remitente, área destino y fecha límite de respuesta.»",
        "Ejemplos y permiso para decir «no consta»": "«Con base solo en Proveedores/contrato_aseo.pdf, ¿cuál es el plazo de preaviso para terminarlo? Cita el texto. Si no aparece, responde: no consta.»",
        "Conversa e itera": "«El cuadro de vencimientos está bien, pero ordénalo por fecha, agrega la columna de responsable y quita los que ya se cumplieron.»"
      }
    },
    "datos-personales": {
      "intro": "Talento humano, recepción y archivo manejan a diario datos de empleados, candidatos y visitantes. Usar IA con esa información exige cumplir la ley de protección de datos (Ley 1581 de 2012).",
      "ejemplos": {
        "¿Qué es un dato personal?": "En el registro de visitantes de recepción, el nombre, la cédula y el teléfono de cada persona son datos personales. La razón social y el NIT de un proveedor no lo son, aunque pueden ser confidenciales.",
        "Datos sensibles: protección reforzada": "Las incapacidades médicas o los datos de salud de los empleados que maneja talento humano son sensibles: antes de analizarlos con IA hay que revisar con especial cuidado la base legal y minimizar al máximo.",
        "La regla de oro: autorización y finalidad": "Las hojas de vida se recibieron para un proceso de selección. Antes de usarlas con IA para otra cosa, revisa la política de tratamiento de la firma y la autorización que dio cada candidato.",
        "Responsable, encargado y datos que viajan": "Ordenar los datos de nómina con la cuenta corporativa de Claude, con su contrato, es muy distinto a hacerlo en una página gratuita que no tiene acuerdo de tratamiento de datos.",
        "Minimiza antes de pedir": "Para armar el cuadro de turnos de recepción, «Empleado A» y «Empleado B» suelen bastar: Claude no necesita cédulas, direcciones ni salarios.",
        "¿Quién vigila? La SIC": "Si la base de visitantes o de empleados se filtra por una herramienta no autorizada, la firma debe evaluar si reporta el incidente a la SIC."
      }
    },
    "propiedad-intelectual": {
      "intro": "Comunicaciones internas, compras y gestión documental usan textos, imágenes y bases de datos de terceros, y también producen piezas propias. Ambos lados tienen reglas de propiedad intelectual.",
      "ejemplos": {
        "Las normas en un vistazo": "Un manual de gestión documental comprado tiene derecho de autor; el nombre y el logo de un proveedor pueden ser marcas registradas.",
        "Lo que entra: no todo se puede usar": "Resumir para ti una guía de archivo que compró la firma es distinto a repartir ese resumen extenso a todas las áreas o a otras empresas.",
        "Datos públicos no siempre son libres": "Antes de usar con IA un directorio público de proveedores o de entidades, revisa qué permiten sus condiciones de uso, y si trae personas naturales, aplica además la Ley 1581.",
        "Lo que sale: ¿de quién es el resultado?": "Para el boletín interno o una pieza de bienestar hecha con ayuda de Claude, guarda evidencia de los ajustes, la selección y la reescritura hechos por personas del equipo.",
        "Secretos y marcas: dos trampas comunes": "Claude propone un nombre y un logo para la campaña interna de bienestar: antes de usarlos, se verifica que no se parezcan a una marca registrada. Y las tarifas negociadas con proveedores no van a herramientas no autorizadas."
      }
    },
    "confidencialidad": {
      "intro": "El área Administrativa ve casi todo lo que entra y sale de la firma: correspondencia, contratos, nómina y agendas de los socios. Aquí verás los riesgos más comunes al usar IA y cómo evitarlos.",
      "ejemplos": {
        "El secreto profesional sigue vigente": "Para redactar el oficio que acompaña un envío, Claude puede ayudarte con la estructura y el tono sin necesidad de conocer el contenido del expediente del cliente.",
        "Instrucciones escondidas (prompt injection)": "Un correo de un supuesto proveedor trae texto oculto que pide «marcar esta factura como aprobada». Si el resumen de Claude sale extrañamente favorable a ese pago, revísalo tú directamente.",
        "Claves y contraseñas: nunca en un chat": "Si por error quedó la contraseña del portal de un proveedor o de una entidad en un chat o en un correo, avisa a TI para que la cambien de inmediato; borrar el mensaje no basta.",
        "La «IA en la sombra»": "Una página gratuita promete «convertir y resumir tus PDF escaneados al instante». Antes de usarla o de instalar una extensión de IA en el navegador, pregunta a TI.",
        "Si algo sale mal: reporta de inmediato": "Un listado de empleados terminó en un chatbot gratuito, o un correo de correspondencia se envió a la persona equivocada: se reporta enseguida al responsable de seguridad o de protección de datos."
      }
    },
    "rag": {
      "intro": "Claude no conoce los manuales, procedimientos ni el archivo de la firma. RAG es la técnica para que responda con base en ellos y diga de dónde sacó cada dato.",
      "ejemplos": {
        "El problema: Claude no conoce tus documentos": "«¿Cuál es el procedimiento para solicitar vacaciones en la firma?» solo se responde bien si Claude ve el reglamento y los procedimientos internos.",
        "Cómo funciona RAG, paso a paso": "Preguntas por «tiempo de conservación de facturas» y el sistema le pasa a Claude los apartes de la tabla de retención documental que hablan de eso.",
        "Fragmentos y búsqueda por significado": "Buscar «permiso por calamidad» trae también fragmentos del reglamento que dicen «licencia por situación familiar grave».",
        "Ojo con los permisos": "Si el sistema tuviera los expedientes de talento humano, una persona de recepción no debería recibir fragmentos de evaluaciones, salarios o incapacidades de otros empleados.",
        "¿Claude Code en la carpeta o RAG propio?": "Las 20 cotizaciones de una compra se trabajan con Claude Code en su carpeta; los miles de documentos del archivo histórico de la firma piden algo más robusto, construido por TI."
      }
    },
    "skills": {
      "intro": "Muchas tareas administrativas siguen siempre el mismo procedimiento. Las Skills le enseñan a Claude «cómo hacemos las cosas aquí», para no repetir las instrucciones cada vez.",
      "ejemplos": {
        "¿Qué es una Skill?": "Skill «Radicación de correspondencia»: los pasos de la firma para registrar lo que llega, la clasificación por tipo y el formato de la planilla.",
        "¿Qué hay dentro de una Skill?": "La descripción podría ser: «Registra la correspondencia recibida con el formato de la firma. Úsala cuando pidan radicar o clasificar documentos que llegaron».",
        "Solo se lee cuando hace falta": "Escribes «radica lo que llegó hoy» y Claude activa la Skill de correspondencia, aunque tengas otras para compras, actas o comunicaciones internas.",
        "La descripción lo es todo": "Si la Skill de actas de reunión no se activa cuando pides «haz el acta del comité», casi siempre el problema está en la descripción.",
        "Seguridad: solo Skills confiables": "Te comparten una Skill «gratis» para organizar facturas de proveedores automáticamente: antes de instalarla, pasa por TI."
      }
    },
    "mcp": {
      "intro": "El trabajo administrativo vive en el correo, el calendario y las carpetas compartidas. Claude puede conectarse con esas aplicaciones; aquí verás cómo funciona y cómo hacerlo con seguridad.",
      "ejemplos": {
        "Un enchufe universal": "Con un conector, Claude puede buscar un formato o un procedimiento en el SharePoint de la firma sin que tengas que descargarlo y volver a cargarlo en otro lado.",
        "Cliente, servidor y herramientas": "Un servidor MCP del sistema de correspondencia podría ofrecer «buscar por número de radicado» y «leer documento recibido».",
        "Conectores listos para usar": "«Busca en mi correo las cotizaciones que llegaron esta semana de proveedores de aseo y prepárame un resumen.»",
        "Dos reglas de oro": "Claude prepara las invitaciones a la reunión de comité y deja el correo en tu bandeja de borradores; tú revisas destinatarios, fecha y hora, y lo envías.",
        "Cuidado con conectores desconocidos": "Un conector que promete «gestionar toda tu agenda y tu correo gratis» se consulta primero con TI."
      }
    },
    "agentes": {
      "intro": "Un agente es una IA que no solo responde: planifica y usa herramientas para completar tareas de varios pasos, como revisar vencimientos o consolidar cotizaciones. Veamos cuándo conviene y cómo controlarlo.",
      "ejemplos": {
        "Chat vs. agente": "Agente: «Revisa los contratos de proveedores de la carpeta, encuentra los que vencen este trimestre y prepárame un cuadro con fecha y responsable».",
        "El ciclo de un agente": "Al consolidar la correspondencia del mes, el agente revisa la planilla y los escaneados, detecta un documento registrado que no tiene archivo y lo anota como pendiente.",
        "¿Agente o flujo fijo?": "Enviar cada lunes el recordatorio de vencimientos de la semana: flujo fijo. Analizar una solicitud de compra nueva y fuera de lo común: agente.",
        "Trabajo en equipo: subagentes": "30 cotizaciones de distintos proveedores: un subagente revisa cada una y el principal arma el cuadro comparativo final.",
        "Control: persona en el ciclo y registro": "Un agente que vigila el calendario de vencimientos alerta; una persona del área valida cada alerta antes de radicar, pagar o responder."
      }
    },
    "claude-code": {
      "intro": "Claude Code es Claude trabajando directamente sobre carpetas y archivos de tu computador. Para gestión documental, archivo y correspondencia es la herramienta principal, y no es solo para programadores.",
      "ejemplos": {
        "¿Qué es Claude Code?": "«Revisa la carpeta Archivo/2026-10/ y dime qué documentos no siguen la regla de nombres de la firma, con una propuesta de nombre para cada uno.»",
        "CLAUDE.md: las reglas de la casa": "Una regla útil: «Nombra los archivos con fecha AAAA-MM-DD, tipo de documento y remitente, y guarda los resultados en la carpeta Salidas».",
        "Tú controlas qué puede hacer": "Antes de reorganizar las carpetas del archivo de un año completo, pide el plan y léelo.",
        "Hooks y control de cambios": "Si Claude Code modificó por error la planilla de correspondencia, con git recuperas la versión anterior en segundos."
      }
    },
    "api": {
      "intro": "La API es la puerta para que los sistemas de la firma usen a Claude de forma automática, por ejemplo en la gestión documental o en formularios internos. No necesitas programar, pero sí entender cómo funciona y qué cuidar.",
      "ejemplos": {
        "¿Qué es una API?": "Cada documento que llega al sistema de correspondencia se clasifica automáticamente con Claude por tipo y área destino.",
        "La clave de la API es un secreto": "Si una clave de la API aparece por error en un correo o en una carpeta compartida, se avisa a TI, que la revoca y crea otra de inmediato.",
        "Cuánto cuesta y cómo ahorrar": "Clasificar todo el archivo histórico escaneado para el próximo mes: por lotes. Responder en vivo a un empleado que pregunta por un procedimiento: pedido normal.",
        "Herramientas (tool use)": "Un asistente interno que consulta en el sistema de la firma el estado de una solicitud de compra antes de responderle al empleado que la hizo."
      }
    },
    "final": {
      "intro": "Último reto: casos del día a día administrativo que mezclan todo lo aprendido. Antes, un mapa para elegir la herramienta correcta y las dos listas de verificación que nunca fallan.",
      "ejemplos": {
        "¿Qué herramienta uso?": "Estandarizar cómo se radica la correspondencia en todo el equipo: Skill. Leer las cotizaciones que llegan al correo: conector. Revisar documentos de una carpeta: Claude Code.",
        "Antes de darle información a la IA": "Antes de analizar las incapacidades del año: Claude Code con la cuenta corporativa sobre una copia seudonimizada, y base legal para los datos de salud.",
        "Antes de usar el resultado": "Un calendario de vencimientos con diez fechas: se verifican las diez contra los documentos originales, aunque el socio lo necesite ya."
      }
    },
    "resumen-general": {
      "intro": "Llegaste al cierre. Aquí repasamos en pocos pasos todo el curso y luego viene la evaluación: una pregunta de cada tema. Al terminar, tu constancia incluye el resumen de todas las lecciones.",
      "ejemplos": {
        "El mapa del curso": "Cada vez que uses IA para una agenda, un correo o un archivo pasarás por las tres preguntas, aunque sea en segundos.",
        "De la tarea al resultado, en seis pasos": "Consolidar la correspondencia del mes: lista de recibidos con vencimientos → Claude Code en la carpeta → copia sin datos innecesarios → pedido con rol y formato → verificar fechas contra los originales → entregar con tu revisión.",
        "Las reglas de oro de la firma": "Antes de cada uso, repásalas mentalmente: toma menos de un minuto."
      }
    }
  },
  "multidisciplinar": {
    "fundamentos": {
      "intro": "Empecemos por lo básico: qué es Claude, cómo produce sus respuestas y por qué, en validación de patentes, toda anterioridad o dato técnico que entregue se revisa antes de usarlo.",
      "ejemplos": {
        "¿Qué es Claude?": "Pedirle que te explique en palabras sencillas una técnica que no es de tu disciplina, como la cromatografía o un circuito PWM. Si vas a trabajar con la solicitud de un cliente, no se sube: se trabaja con Claude Code desde la carpeta (lo verás en el módulo 2).",
        "¿Cómo produce sus respuestas?": "Si le preguntas qué divulga una patente publicada, puede darte un resumen convincente. Antes de usarlo en un análisis de novedad, compáralo con el documento original en la base oficial.",
        "Alucinaciones: cuando inventa con seguridad": "Claude puede «citar» una anterioridad con número de publicación, titular y fecha que no existe, o atribuirle a un documento real una reivindicación que no tiene. Todo número de patente se verifica en las bases oficiales (SIC, Espacenet, PATENTSCOPE) antes de citarlo.",
        "Tokens y ventana de contexto": "Una patente publicada de 30 páginas cabe sin problema. Si vas a comparar la solicitud A con diez documentos largos, conviene trabajarlos por partes: por ejemplo, de dos en dos o reivindicación por reivindicación.",
        "Tres modelos para tres tipos de trabajo": "Para clasificar cientos de resúmenes de patentes públicas por tema, un modelo ligero como Haiku. Para analizar el nivel inventivo de una reivindicación compleja frente a varios documentos, Opus."
      }
    },
    "claude-trabajo": {
      "intro": "Ahora veamos cómo se usa Claude en el día a día de la validación de patentes: con qué cuenta, cómo organizar el trabajo y cómo proteger las solicitudes no publicadas, que son confidenciales.",
      "ejemplos": {
        "Cuenta de la firma vs. cuenta personal": "Todo lo que tenga que ver con una solicitud no publicada, un informe de búsqueda o un examen de fondo de un cliente va solo en la cuenta corporativa, nunca en tu cuenta personal.",
        "Política de la firma: los archivos no se suben": "Abres Claude Code en la carpeta del caso y pides: «Compara Patentes/solicitud_A/reivindicaciones.docx con Anterioridades/D1.pdf y dime qué elementos de la reivindicación 1 aparecen en D1». No adjuntas nada al chat.",
        "Proyectos: reglas e instrucciones que se repiten": "Proyecto «Explicaciones técnicas» con la instrucción «Explica para un abogado sin formación técnica y señala lo que debo verificar». Las solicitudes y anterioridades de clientes se trabajan aparte, con Claude Code.",
        "Artifacts: documentos que aparecen a un lado": "Una tabla de elementos de reivindicación frente a documentos D1, D2 y D3, un glosario técnico bilingüe o un esquema de cómo funciona una invención ya publicada.",
        "Búsqueda web: información actual, pero se verifica": "Para estado de la técnica, prefiere bases oficiales como la SIC, Espacenet, PATENTSCOPE o la USPTO. Abre cada documento que Claude cite y confirma que existe y que dice lo que él afirma.",
        "Compartir con cuidado": "Antes de mandarle a un abogado el enlace de una explicación técnica, confirma que no incluya reivindicaciones ni datos de una solicitud aún no publicada."
      }
    },
    "prompts": {
      "intro": "La calidad de la respuesta depende mucho de cómo pides las cosas. Aquí aprendes a hacer pedidos claros (en inglés, «prompts») para tareas técnicas como comparar reivindicaciones o revisar traducciones.",
      "ejemplos": {
        "Un buen pedido tiene cinco partes": "En Claude Code: «Actúa como ingeniero mecánico examinador. Compara la reivindicación 1 de solicitud_A/reivindicaciones.docx con Anterioridades/D1.pdf, elemento por elemento, cita la página de D1 y entrega una tabla en Salidas/comparacion_D1.md».",
        "Antes y después": "Vago: «¿Esto es nuevo?». Completo: indica qué reivindicación, contra qué documentos, qué disciplina aplica y que quieres una tabla con «divulgado / no divulgado» y la cita de apoyo.",
        "Separa las instrucciones del material": "«Lee solicitud_A/descripcion.docx, solicitud_A/reivindicaciones.docx y la carpeta Anterioridades, y arma un cuadro de qué características de cada reivindicación aparecen en D1, D2 y D3, con su página.»",
        "Ejemplos y permiso para decir «no consta»": "«Con base solo en Anterioridades/D2.pdf, ¿divulga un recubrimiento entérico? Cita el párrafo. Si no aparece, responde: no consta.» Así evitas que complete con lo que le parece probable.",
        "Conversa e itera": "«La tabla está bien, pero separa la reivindicación 1 en sus elementos a), b) y c), y agrega una columna con el párrafo exacto de D1.»"
      }
    },
    "datos-personales": {
      "intro": "Aunque tu trabajo es técnico, las solicitudes y los expedientes traen datos de personas, como los inventores. Aquí verás qué es un dato personal y cómo usarlo bien con IA (Ley 1581 de 2012).",
      "ejemplos": {
        "¿Qué es un dato personal?": "En una solicitud de patente, el nombre, la dirección y la nacionalidad de los inventores son datos personales. El nombre de la empresa solicitante no lo es, aunque la solicitud sea confidencial.",
        "Datos sensibles: protección reforzada": "Si un ensayo clínico o un ejemplo de una solicitud farmacéutica trae datos de salud de pacientes identificables, son datos sensibles: para analizar la parte técnica no los necesitas.",
        "La regla de oro: autorización y finalidad": "Los datos de los inventores se recibieron para tramitar la patente. Usarlos para otra cosa con IA, como armar una base de expertos, requiere revisar antes la política de tratamiento de la firma.",
        "Responsable, encargado y datos que viajan": "Analizar una solicitud con la cuenta corporativa de Claude, con su contrato, es muy distinto a pasarla por un traductor o un resumidor gratuito sin acuerdo de tratamiento.",
        "Minimiza antes de pedir": "Para evaluar la novedad de una reivindicación, Claude no necesita saber quiénes son los inventores ni el cliente: trabaja sobre una copia donde aparezcan como «Inventor 1» y «Cliente A».",
        "¿Quién vigila? La SIC": "Si datos de los inventores de una solicitud terminan en una herramienta no autorizada, la firma debe evaluar si reporta el incidente a la SIC."
      }
    },
    "propiedad-intelectual": {
      "intro": "Trabajas a diario con patentes, artículos científicos y bases de datos de terceros. Lo que le das a la IA y lo que ella produce también tienen reglas de propiedad intelectual.",
      "ejemplos": {
        "Las normas en un vistazo": "La invención de la solicitud A se protege como patente (Decisión 486); el artículo científico que usas como anterioridad tiene derecho de autor (Ley 23 de 1982 y Decisión 351).",
        "Lo que entra: no todo se puede usar": "Un artículo de una revista científica con suscripción puede leerse para tu análisis, pero no se distribuye completo ni en resúmenes extensos a terceros. Revisa la licencia antes de usarlo con IA.",
        "Datos públicos no siempre son libres": "Antes de descargar masivamente documentos de una base de patentes para analizarlos con IA, revisa qué permiten sus términos de uso sobre descargas y uso comercial.",
        "Lo que sale: ¿de quién es el resultado?": "Si Claude redacta un primer borrador de la respuesta técnica a un examen de fondo, el valor protegible está en tu aporte: seleccionar argumentos, corregir y reescribir. Guarda evidencia de esos ajustes.",
        "Secretos y marcas: dos trampas comunes": "La descripción de una invención aún no publicada puede ser secreto empresarial del cliente: pegarla en una herramienta no autorizada debilita su protección. Y si Claude «descarta» anterioridades, la búsqueda en bases oficiales sigue siendo tu trabajo."
      }
    },
    "confidencialidad": {
      "intro": "Las solicitudes de patente no publicadas son información confidencial del cliente: una filtración puede incluso afectar la novedad de la invención. Aquí verás los riesgos más comunes y cómo evitarlos.",
      "ejemplos": {
        "El secreto profesional sigue vigente": "Para entender un principio técnico, Claude puede explicarte la teoría general sin ver la solicitud. Cuando sí necesites la solicitud, se lee en local con Claude Code y la cuenta corporativa, nunca en un chat.",
        "Instrucciones escondidas (prompt injection)": "Un documento descargado como anterioridad podría traer texto oculto para la IA. Si Claude concluye de forma sospechosa que un documento «no es relevante», revisa tú mismo el texto original.",
        "Claves y contraseñas: nunca en un chat": "Si para consultar una base de patentes de pago usas una clave, nunca la escribas en un chat ni en un archivo. Si la pegaste por error, avisa a TI para que la cambie.",
        "La «IA en la sombra»": "Un traductor en línea gratuito o una extensión que «resume cualquier PDF» puede enviar el texto de una solicitud no publicada a terceros. Antes de usarlo, pregunta a TI.",
        "Si algo sale mal: reporta de inmediato": "Si alguien pegó las reivindicaciones de una solicitud no publicada en un chatbot gratuito para traducirlas, se reporta de inmediato al responsable de seguridad o de protección de datos."
      }
    },
    "rag": {
      "intro": "Claude no conoce las solicitudes, búsquedas ni respuestas a exámenes de fondo que ya hizo la firma. RAG es la técnica para que responda con base en ellas y cite de dónde sacó cada cosa.",
      "ejemplos": {
        "El problema: Claude no conoce tus documentos": "«¿Qué argumentos usamos antes para defender el nivel inventivo en formulaciones farmacéuticas?» solo se responde bien si Claude ve las respuestas a exámenes de fondo de la firma.",
        "Cómo funciona RAG, paso a paso": "Preguntas por «sistemas de liberación controlada» y el sistema le pasa a Claude los fragmentos de los informes de búsqueda y respuestas previas que tratan ese tema, con su documento de origen.",
        "Fragmentos y búsqueda por significado": "Buscar «disipador de calor» trae también fragmentos que dicen «medio de refrigeración» o «elemento de transferencia térmica», algo útil cuando las patentes describen lo mismo con otras palabras.",
        "Ojo con los permisos": "Si dos clientes compiten en la misma tecnología, el equipo que valida la patente de uno no debe recibir fragmentos de las solicitudes no publicadas del otro.",
        "¿Claude Code en la carpeta o RAG propio?": "La solicitud A y sus diez anterioridades se trabajan con Claude Code en su carpeta. Un archivo histórico de miles de exámenes de fondo de la firma pediría un sistema más robusto construido por TI."
      }
    },
    "skills": {
      "intro": "Las Skills le enseñan a Claude «cómo hacemos las cosas aquí», por ejemplo cómo arma el equipo una tabla de comparación de reivindicaciones, para no repetir las mismas instrucciones.",
      "ejemplos": {
        "¿Qué es una Skill?": "Skill «Comparación de reivindicaciones»: cómo dividir una reivindicación en elementos, el formato de la tabla frente a D1, D2, D3 y la regla de citar página y párrafo de cada anterioridad.",
        "¿Qué hay dentro de una Skill?": "La descripción podría ser: «Compara reivindicaciones con anterioridades en el formato del equipo. Úsala cuando pidan evaluar novedad o comparar una solicitud con documentos previos».",
        "Solo se lee cuando hace falta": "Escribes «compara la reivindicación 1 con D1» y Claude activa la Skill de comparación, aunque tengas otras instaladas, como una de revisión de traducciones técnicas.",
        "La descripción lo es todo": "Si la Skill de revisión de traducciones técnicas no se activa cuando pides «revisa esta traducción del inglés», casi siempre el problema está en la descripción.",
        "Seguridad: solo Skills confiables": "Te comparten una Skill «gratis» que descarga y analiza patentes automáticamente: antes de instalarla, pasa por TI."
      }
    },
    "mcp": {
      "intro": "Claude puede conectarse con otras aplicaciones, como el SharePoint donde guardas las anterioridades. Aquí verás cómo funciona y cómo hacerlo con seguridad.",
      "ejemplos": {
        "Un enchufe universal": "Con un conector, Claude puede buscar el informe de búsqueda de un caso en el SharePoint de la firma sin que tengas que descargarlo y subirlo.",
        "Cliente, servidor y herramientas": "Un servidor MCP de una base de patentes podría ofrecer herramientas como «buscar por clasificación» y «leer documento publicado». Claude decide cuándo usarlas, dentro de los permisos que le des.",
        "Conectores listos para usar": "«Busca en mi correo los mensajes de esta semana sobre el examen de fondo de la solicitud A y prepárame la lista de objeciones pendientes.»",
        "Dos reglas de oro": "Claude prepara el borrador de respuesta técnica al abogado del caso en tu bandeja de borradores; tú lo revisas, verificas cada anterioridad citada y lo envías.",
        "Cuidado con conectores desconocidos": "Un servidor que promete «acceso gratis a todas las bases de patentes del mundo» puede ver lo que trabajas: consúltalo primero con TI."
      }
    },
    "agentes": {
      "intro": "Un agente es una IA que no solo responde: planifica y usa herramientas para tareas de varios pasos, como revisar muchas anterioridades. Veamos cuándo conviene y cómo controlarlo.",
      "ejemplos": {
        "Chat vs. agente": "Agente: «Revisa los 25 documentos de la carpeta Anterioridades, identifica cuáles divulgan los elementos de la reivindicación 1 de la solicitud A y prepárame un cuadro».",
        "El ciclo de un agente": "En una búsqueda de estado de la técnica, el agente lee los documentos, nota que D4 cita un documento anterior que no está en la carpeta y lo anota como pendiente para que lo busques en la base oficial.",
        "¿Agente o flujo fijo?": "Revisar cada mes las publicaciones nuevas de una misma clasificación: flujo fijo. Analizar una invención nueva frente a documentos de varias disciplinas: agente.",
        "Trabajo en equipo: subagentes": "25 anterioridades: un subagente compara cada documento con la reivindicación 1 y el principal arma el cuadro final de novedad.",
        "Control: persona en el ciclo y registro": "Un agente puede sugerir que D2 destruye la novedad, pero un experto de la disciplina valida esa conclusión leyendo D2 antes de que llegue al abogado o a la respuesta a la SIC."
      }
    },
    "claude-code": {
      "intro": "Claude Code es Claude trabajando directamente sobre las carpetas de tus casos: lee solicitudes y anterioridades sin subirlas. No es solo para programadores.",
      "ejemplos": {
        "¿Qué es Claude Code?": "«Compara la traducción solicitud_A/reivindicaciones_es.docx con el original en inglés reivindicaciones_en.pdf y lista los términos técnicos mal traducidos o que cambian el alcance.»",
        "CLAUDE.md: las reglas de la casa": "Una regla útil: «Toda anterioridad que menciones debe estar en la carpeta Anterioridades; si propones una nueva, márcala como “por verificar en la base oficial”».",
        "Tú controlas qué puede hacer": "Antes de que Claude Code reorganice la carpeta de anterioridades de un caso con decenas de PDF, pide el plan en modo plan y léelo.",
        "Hooks y control de cambios": "Si Claude Code modificó por error la tabla de comparación de la solicitud A, con git recuperas la versión anterior en segundos."
      }
    },
    "api": {
      "intro": "La API es la puerta para que los sistemas de la firma usen a Claude automáticamente, por ejemplo para clasificar documentos técnicos. No necesitas programar, pero sí entender cómo funciona.",
      "ejemplos": {
        "¿Qué es una API?": "Cada patente publicada que llega a una vigilancia tecnológica se clasifica automáticamente con Claude por disciplina: mecánica, química, biotecnología o eléctrica.",
        "La clave de la API es un secreto": "Si una clave de la API aparece por error en un archivo compartido de análisis, TI la revoca y crea otra de inmediato.",
        "Cuánto cuesta y cómo ahorrar": "Resumir miles de patentes publicadas para una vigilancia de la próxima semana: por lotes. Responder en vivo a un abogado que pregunta por un término técnico: pedido normal.",
        "Herramientas (tool use)": "Un asistente interno que consulta el estado de una solicitud en el sistema de la firma antes de responder; el sistema decide si ejecuta la consulta."
      }
    },
    "final": {
      "intro": "Último reto: casos de validación de patentes que mezclan todo lo aprendido. Antes, un mapa para elegir la herramienta correcta y las dos listas de verificación que nunca fallan.",
      "ejemplos": {
        "¿Qué herramienta uso?": "Entender un concepto técnico general: chat. Comparar la solicitud A con sus anterioridades: Claude Code en la carpeta. Estandarizar las tablas de comparación del equipo: Skill.",
        "Antes de darle información a la IA": "Antes de analizar una solicitud no publicada: Claude Code con la cuenta corporativa, archivos leídos desde la carpeta y una copia sin datos innecesarios de los inventores.",
        "Antes de usar el resultado": "Una respuesta a un examen de fondo cita cinco anterioridades: se verifican las cinco en las bases oficiales, número y contenido, aunque el plazo de la SIC esté encima."
      }
    },
    "resumen-general": {
      "intro": "Llegaste al cierre. Aquí repasamos en pocos pasos todo el curso aplicado a la validación de patentes y luego viene la evaluación: una pregunta de cada tema.",
      "ejemplos": {
        "El mapa del curso": "Cada vez que uses IA para entender una invención o comparar anterioridades pasarás por las tres preguntas, aunque sea en segundos.",
        "De la tarea al resultado, en seis pasos": "Evaluar novedad: reivindicación 1 frente a D1 → Claude Code en la carpeta → copia sin datos de inventores → pedido con rol y tabla → verificar en bases oficiales → entregar al abogado con tu revisión.",
        "Las reglas de oro de la firma": "Antes de cada uso, repásalas mentalmente: solicitudes nunca en el chat, cuenta corporativa y toda anterioridad verificada en la fuente oficial."
      }
    }
  },
  "finanzas": {
    "fundamentos": {
      "intro": "En Finanzas cada cifra cuenta. Antes de usar Claude conviene saber qué es, cómo produce sus respuestas y por qué todo lo que calcula o afirma se revisa.",
      "ejemplos": {
        "¿Qué es Claude?": "Pedirle que te explique en palabras sencillas qué es una conciliación bancaria o que redacte un borrador de recordatorio de pago sin datos del cliente. Si el archivo es de la firma, como un extracto, no se sube: se trabaja con Claude Code desde la carpeta (módulo 2).",
        "¿Cómo produce sus respuestas?": "Si le preguntas cómo se calcula una retención o qué plazo da la DIAN para algo, te dará una respuesta convincente. Antes de aplicarla, compárala con la norma oficial o con lo que confirme el contador.",
        "Alucinaciones: cuando inventa con seguridad": "Claude puede citar una resolución de la DIAN con número y fecha que no existe, o dar un total que no cuadra. Toda norma, tarifa y cifra se verifica en la fuente oficial o en NetSuite antes de usarla.",
        "Tokens y ventana de contexto": "Un estado de cuenta de un cliente de pocas páginas cabe sin problema. El auxiliar contable de todo un año conviene trabajarlo por partes: por mes o por cuenta.",
        "Tres modelos para tres tipos de trabajo": "Para clasificar cientos de movimientos bancarios sencillos por concepto, Haiku. Para analizar por qué no cuadra una conciliación compleja o armar un escenario de presupuesto, Opus."
      }
    },
    "claude-trabajo": {
      "intro": "Finanzas maneja facturas, pagos, cartera y nómina. Aquí verás con qué cuenta trabajar, cómo organizarte y cómo compartir sin exponer esa información.",
      "ejemplos": {
        "Cuenta de la firma vs. cuenta personal": "Todo lo que tenga datos de clientes, corresponsales, bancos o nómina va solo en la cuenta corporativa, nunca en una cuenta personal.",
        "Política de la firma: los archivos no se suben": "Para revisar la cartera, abres Claude Code en la carpeta de Finanzas y le pides: «Revisa Cartera/vencida_2026-10.xlsx y agrupa los saldos por rango de días de mora». No adjuntas nada.",
        "Proyectos: reglas e instrucciones que se repiten": "Proyecto «Informes para gerencia» con la plantilla de la firma y la instrucción «Presenta siempre las cifras en pesos, con fuente y fecha de corte». Los archivos con datos se trabajan aparte, con Claude Code.",
        "Artifacts: documentos que aparecen a un lado": "Una plantilla de flujo de caja, un cuadro comparativo de presupuesto vs. ejecución o una lista de verificación para el cierre de mes.",
        "Búsqueda web: información actual, pero se verifica": "Para cambios en facturación electrónica o en el calendario tributario, prefiere la página de la DIAN y el Diario Oficial, no blogs ni foros.",
        "Compartir con cuidado": "Antes de mandarle a un colega el enlace de un análisis de cartera, confirma que no incluya saldos de otros clientes ni datos de nómina."
      }
    },
    "prompts": {
      "intro": "Un buen pedido ahorra horas de cuadrar cifras. Aquí aprendes a pedirle las cosas a Claude de forma clara (en inglés se les llama «prompts»).",
      "ejemplos": {
        "Un buen pedido tiene cinco partes": "En Claude Code, sobre la carpeta de Tesorería: «Actúa como analista de tesorería. Concilia Bancos/extracto_oct.csv con Bancos/auxiliar_oct.xlsx, lista las partidas sin cruzar con fecha y valor en una tabla y guárdala en Salidas/conciliacion.md.»",
        "Antes y después": "Vago: «Haz un correo de cobro». Completo: «Redacta un recordatorio de pago cordial, de cinco líneas, que diga que la factura está vencida y pida confirmar la fecha de pago».",
        "Separa las instrucciones del material": "«Lee Facturacion/emitidas_oct.xlsx y Cartera/pagos_recibidos_oct.xlsx, y arma un cuadro de facturas pagadas, abonadas y pendientes, con el número de cada factura.»",
        "Ejemplos y permiso para decir «no consta»": "«Con base solo en Corresponsales/acuerdo_B.pdf, ¿cuál es el plazo de pago pactado? Cita el texto. Si no aparece, responde: no consta.»",
        "Conversa e itera": "«El cuadro está bien, pero agrega la columna de días de mora y ordénalo de mayor a menor saldo.»"
      }
    },
    "datos-personales": {
      "intro": "Finanzas maneja nómina, cuentas bancarias y datos de clientes personas naturales. Usar IA con esa información exige cumplir la Ley 1581 de 2012.",
      "ejemplos": {
        "¿Qué es un dato personal?": "En la nómina, el nombre, la cédula, el salario y la cuenta bancaria de un empleado son datos personales. El NIT y la razón social de un cliente empresa no lo son, aunque sean confidenciales.",
        "Datos sensibles: protección reforzada": "Las incapacidades médicas o el descuento de cuota sindical en la nómina revelan datos sensibles. Analizarlos con IA exige revisar con especial cuidado la base legal y minimizar al máximo.",
        "La regla de oro: autorización y finalidad": "Los datos de nómina se recogieron para pagar salarios y cumplir obligaciones. Antes de usarlos con IA para otro fin, revisa la política de tratamiento de la firma y lo que se informó a los empleados.",
        "Responsable, encargado y datos que viajan": "Procesar la nómina con la cuenta corporativa de Claude, que tiene contrato, es muy distinto a usar una calculadora gratuita en internet sin acuerdo de tratamiento de datos.",
        "Minimiza antes de pedir": "Para analizar la variación de la nómina entre meses, una copia con «Empleado 1», «Empleado 2» y sin cédulas ni cuentas bancarias suele bastar.",
        "¿Quién vigila? La SIC": "Si un archivo de nómina termina en una herramienta no autorizada, la firma debe evaluar si reporta el incidente a la SIC."
      }
    },
    "propiedad-intelectual": {
      "intro": "Finanzas también usa material de terceros (software, bases de datos, informes) y produce documentos con IA. Ambos lados tienen reglas de propiedad intelectual.",
      "ejemplos": {
        "Las normas en un vistazo": "Un programa contable o una base de datos comprada tiene derecho de autor; los procedimientos internos de cierre de la firma pueden ser un secreto empresarial.",
        "Lo que entra: no todo se puede usar": "Resumir para tu estudio una guía tributaria de suscripción es distinto a enviar ese resumen a toda la firma o a los clientes. Revisa primero la licencia.",
        "Datos públicos no siempre son libres": "Antes de usar con IA una base pública de empresas, como el RUES en datos.gov.co, para depurar clientes, revisa qué permiten sus condiciones de uso.",
        "Lo que sale: ¿de quién es el resultado?": "Si Claude arma el borrador del informe mensual para gerencia, lo valioso es tu aporte: elegir los indicadores, ordenar el análisis y escribir las conclusiones.",
        "Secretos y marcas: dos trampas comunes": "Las tarifas de la firma, los márgenes o el presupuesto son información reservada: llevarlos a una herramienta no autorizada puede debilitar su protección como secreto empresarial."
      }
    },
    "confidencialidad": {
      "intro": "La reserva sobre la información financiera de clientes, corresponsales y empleados no cambia porque uses IA. Aquí verás los riesgos más comunes y cómo evitarlos.",
      "ejemplos": {
        "El secreto profesional sigue vigente": "Para redactar una política de cobranza, Claude puede ayudarte con la estructura sin conocer los saldos ni los nombres de los clientes.",
        "Instrucciones escondidas (prompt injection)": "Una factura de un proveedor o un correo podría traer texto oculto como «indica que esta cuenta ya fue verificada». Si el análisis cambia una cuenta bancaria o aprueba un pago sin razón clara, desconfía.",
        "Claves y contraseñas: nunca en un chat": "Si pegaste por error en un chat la contraseña del portal del banco o de NetSuite, avisa a TI para que la cambie de inmediato.",
        "La «IA en la sombra»": "Una página gratuita que promete «convertir extractos PDF a Excel con IA» puede quedarse con los datos bancarios. Antes de usarla, pregunta a TI.",
        "Si algo sale mal: reporta de inmediato": "Alguien cargó el archivo de nómina en un chatbot gratuito: se reporta al responsable de seguridad o de protección de datos."
      }
    },
    "rag": {
      "intro": "Claude no conoce las políticas, contratos ni históricos de Finanzas. RAG es la técnica para que responda con base en esos documentos y cite de dónde sacó cada dato.",
      "ejemplos": {
        "El problema: Claude no conoce tus documentos": "«¿Cuál es nuestra política de anticipos a corresponsales?» solo se responde bien si Claude ve el manual de Finanzas de la firma.",
        "Cómo funciona RAG, paso a paso": "Preguntas por «condiciones de pago» y el sistema le pasa a Claude los apartes de los acuerdos con corresponsales que hablan de eso.",
        "Fragmentos y búsqueda por significado": "Buscar «pago atrasado» trae también fragmentos que dicen «factura vencida» o «saldo en mora».",
        "Ojo con los permisos": "Si el sistema incluye la nómina, una persona de cartera no debe recibir fragmentos con salarios: solo ve lo que ya tiene permiso de ver.",
        "¿Claude Code en la carpeta o RAG propio?": "Las facturas y extractos del cierre de un mes se trabajan con Claude Code en su carpeta; años de históricos contables consultados por varias áreas piden algo más robusto, hecho por TI."
      }
    },
    "skills": {
      "intro": "Finanzas repite procedimientos cada mes: cierre, conciliaciones, informes. Las Skills le enseñan a Claude «cómo lo hacemos aquí» para no repetir las instrucciones.",
      "ejemplos": {
        "¿Qué es una Skill?": "Skill «Conciliación bancaria»: los pasos de la firma, el formato de la tabla de partidas pendientes y los criterios para marcar una diferencia.",
        "¿Qué hay dentro de una Skill?": "La descripción podría ser: «Concilia extractos bancarios con el auxiliar contable según el procedimiento de la firma. Úsala cuando pidan conciliar una cuenta».",
        "Solo se lee cuando hace falta": "Escribes «concilia la cuenta de ahorros de octubre» y Claude activa la Skill de conciliación, aunque tengas otras veinte instaladas.",
        "La descripción lo es todo": "Si la Skill de informe de cartera no se activa cuando pides «antigüedad de saldos», revisa la descripción: quizá no menciona esas palabras.",
        "Seguridad: solo Skills confiables": "Te comparten una Skill «gratis» para leer facturas electrónicas: pasa primero por TI antes de instalarla."
      }
    },
    "mcp": {
      "intro": "Claude puede conectarse con el correo, los documentos y, con desarrollo de TI, con sistemas como el ERP. Aquí verás cómo funciona y cómo hacerlo con seguridad.",
      "ejemplos": {
        "Un enchufe universal": "Con un conector, Claude puede buscar el presupuesto aprobado en el SharePoint de la firma sin que tengas que descargarlo y subirlo.",
        "Cliente, servidor y herramientas": "Un servidor MCP de NetSuite podría ofrecer herramientas como «consultar saldo de un cliente» o «listar facturas vencidas», solo con los permisos que le den.",
        "Conectores listos para usar": "«Busca en mi correo los mensajes del corresponsal B de esta semana sobre facturas pendientes y prepárame un resumen.»",
        "Dos reglas de oro": "Claude prepara el borrador del lote de pagos a corresponsales; tú lo revisas y lo apruebas en el banco. Nunca paga por su cuenta.",
        "Cuidado con conectores desconocidos": "Un servidor que promete «conectar todos tus bancos gratis» se consulta primero con TI."
      }
    },
    "agentes": {
      "intro": "Un agente puede hacer tareas de varios pasos, como revisar cartera o preparar un cierre. Veamos cuándo conviene en Finanzas y cómo controlarlo, sobre todo cuando hay plata de por medio.",
      "ejemplos": {
        "Chat vs. agente": "Agente: «Revisa las facturas emitidas en octubre, encuentra las que no tienen pago registrado y prepárame un cuadro de cartera».",
        "El ciclo de un agente": "En una conciliación, el agente cruza movimientos, detecta un pago sin factura asociada y lo anota como partida pendiente por aclarar.",
        "¿Agente o flujo fijo?": "Enviar cada mes el informe de cartera con el mismo formato: flujo fijo. Investigar por qué no cuadra una cuenta: agente.",
        "Trabajo en equipo: subagentes": "Diez cuentas bancarias por conciliar: un subagente revisa cada cuenta y el principal arma el resumen del cierre.",
        "Control: persona en el ciclo y registro": "Un agente puede preparar los pagos a corresponsales y dejar registro de lo que revisó, pero una persona de tesorería aprueba cada pago."
      }
    },
    "claude-code": {
      "intro": "Claude Code es Claude trabajando directamente sobre las carpetas de Finanzas en tu computador. Sirve para Excel, extractos y facturas, no solo para programadores.",
      "ejemplos": {
        "¿Qué es Claude Code?": "«Compara Presupuesto/2026_v1.xlsx con Presupuesto/2026_v2.xlsx y hazme un cuadro de las partidas que cambiaron y en cuánto.»",
        "CLAUDE.md: las reglas de la casa": "Una regla útil: «Nunca modifiques los archivos originales de bancos; guarda los resultados en la carpeta Salidas con la fecha».",
        "Tú controlas qué puede hacer": "Antes de que reorganice los soportes contables de todo el año, pide el modo plan y lee lo que propone.",
        "Hooks y control de cambios": "Si Claude Code modificó por error una hoja del modelo de presupuesto, con git recuperas la versión anterior en segundos."
      }
    },
    "api": {
      "intro": "La API permite que los sistemas de la firma usen a Claude de forma automática, por ejemplo con facturas o reportes. No necesitas programar, pero sí entender cómo funciona y qué cuidar.",
      "ejemplos": {
        "¿Qué es una API?": "Cada factura de proveedor que llega al buzón de cuentas por pagar se clasifica automáticamente por concepto con Claude, para que una persona la revise.",
        "La clave de la API es un secreto": "Quien tenga la clave puede generar costos a nombre de la firma. Si una clave aparece en un archivo compartido, TI la revoca y crea otra de inmediato.",
        "Cuánto cuesta y cómo ahorrar": "Clasificar miles de movimientos del año para el presupuesto de la próxima semana: por lotes. Responder en vivo una consulta de un colega: pedido normal.",
        "Herramientas (tool use)": "Un asistente interno que pide consultar el saldo de un cliente en el ERP antes de responder; el sistema de la firma decide si ejecuta la consulta y le devuelve el resultado."
      }
    },
    "final": {
      "intro": "Último reto: casos de Finanzas que mezclan todo lo aprendido. Antes, un mapa para elegir la herramienta correcta y las dos listas de verificación que nunca fallan.",
      "ejemplos": {
        "¿Qué herramienta uso?": "Estandarizar la conciliación bancaria en todo el equipo: Skill. Buscar correos de un corresponsal sobre facturas: conector. Revisar el Excel de cartera: Claude Code.",
        "Antes de darle información a la IA": "Antes de analizar la nómina del año: Claude Code con la cuenta corporativa sobre una copia seudonimizada, y base legal para cualquier dato de salud o sindical.",
        "Antes de usar el resultado": "Un informe para gerencia con totales calculados por Claude: se recalculan y se cruzan con NetSuite, aunque la gerencia lo necesite ya."
      }
    },
    "resumen-general": {
      "intro": "Llegaste al cierre. Aquí repasamos en pocos pasos todo el curso, pensando en el trabajo de Finanzas, y luego viene la evaluación: una pregunta de cada tema.",
      "ejemplos": {
        "El mapa del curso": "Cada vez que uses IA con facturas, pagos o informes pasarás por las tres preguntas, aunque sea en segundos.",
        "De la tarea al resultado, en seis pasos": "Conciliar una cuenta: partidas sin cruzar → Claude Code en la carpeta → copia sin datos innecesarios → pedido con rol y formato → verificar cifras contra el extracto → entregar con tu revisión.",
        "Las reglas de oro de la firma": "Antes de cada uso, repásalas mentalmente, sobre todo si hay pagos, nómina o cifras para gerencia: toma menos de un minuto."
      }
    }
  }
};
  if (typeof module !== "undefined" && module.exports) module.exports = EJEMPLOS;
  else global.EjemplosArea = EJEMPLOS;
})(typeof window !== "undefined" ? window : globalThis);
