/*
 * AI BOSS — Taller final: construye paso a paso con Claude.
 *
 * Sin batalla. Recetas visuales para personas sin experiencia: qué vas a
 * construir, quién lo hace, cuánto tarda, cada paso (con clics, comandos o
 * archivos de ejemplo que se pueden copiar), qué vas a ver y qué cuidar.
 *
 * Datos técnicos verificados el 2026-11-04 en la documentación oficial:
 * code.claude.com/docs, platform.claude.com/docs y support.claude.com.
 * Los nombres de botones y menús pueden cambiar con las actualizaciones.
 *
 * Tipos de paso propios del taller (además de concepto/elige de conceptos.js):
 *   receta      { titulo, icono, nivel, quien, tiempo, construyes, simple?,
 *                 pasos: [{ t, bloque? }], resultado, cuidado }
 *   constructor { titulo, texto, plantilla, piezas: [{ campo, nombre, icono, opciones }] }
 * bloque: { tipo: "clic" | "terminal" | "archivo" | "chat", titulo?, contenido | mensajes }
 */
(function (global) {
  "use strict";

  function L() { return Array.prototype.slice.call(arguments).join("\n"); }

  var TALLER = {
    intro: "Bienvenido(a) al taller. Aquí no hay jefe ni puntaje: vas a aprender, paso a paso, cómo se construye cada cosa que viste en el curso. Cada receta te dice qué vas a construir, quién lo hace, cuánto tarda y qué cuidar. Marca cada paso cuando lo hagas. Si algo pide permisos de administrador, la receta te lo indica: en ese caso lo hace TI.",
    pasos: [
      {
        tipo: "concepto",
        titulo: "El mapa del taller",
        texto: [
          "Las recetas van de lo más sencillo a lo más avanzado. Las primeras las puede hacer cualquier persona en minutos; las últimas se hacen con apoyo de TI.",
          "No necesitas hacerlas todas hoy: vuelve a la que necesites cuando la necesites."
        ],
        visual: { tipo: "tarjetas", items: [
          { i: "🔑", t: "1. Entrar con la cuenta de la firma", d: "Básico · 5 min" },
          { i: "🧩", t: "2. Armar tu primer pedido", d: "Básico · 5 min · juego" },
          { i: "💬", t: "3. Tu primer chat", d: "Básico · 10 min" },
          { i: "📁", t: "4. Crear un Proyecto", d: "Básico · 10 min" },
          { i: "🖼️", t: "5. Pedir un Artifact", d: "Básico · 5 min" },
          { i: "💻", t: "6. Abrir Claude Code", d: "Básico · 15 min" },
          { i: "📄", t: "7. Leer un documento sin subirlo", d: "Básico · 10 min" },
          { i: "🏠", t: "8. Crear tu CLAUDE.md", d: "Intermedio · 15 min" },
          { i: "🗺️", t: "9. Usar el modo plan", d: "Intermedio · 10 min" },
          { i: "📦", t: "10. Crear una Skill", d: "Intermedio · 30 min" },
          { i: "👥", t: "11. Crear un subagente", d: "Intermedio · 20 min" },
          { i: "🔌", t: "12. Conectar una aplicación", d: "Intermedio · con TI" },
          { i: "📚", t: "13. Buscar en tus documentos (mini RAG)", d: "Intermedio · 20 min" },
          { i: "🪝", t: "14. Crear un hook", d: "Avanzado · con TI" },
          { i: "🔗", t: "15. Usar la API", d: "Avanzado · con TI" },
          { i: "🏗️", t: "16. De la idea al aplicativo", d: "Avanzado · semanas" }
        ] },
        simple: "Es como un recetario de cocina: empiezas por el huevo frito y, con práctica, llegas al plato fuerte.",
        ejemplo: "Si hoy solo tienes 15 minutos, haz las recetas 1, 2 y 3. Ya habrás usado Claude correctamente."
      },

      /* 1 */
      {
        tipo: "receta", icono: "🔑",
        titulo: "Entrar a Claude con la cuenta de la firma",
        nivel: "Básico", quien: "Lo haces tú", tiempo: "5 minutos",
        construyes: "Tu acceso seguro a Claude, con las garantías del plan de la firma (Team o Enterprise).",
        simple: "Es como entrar a la oficina con tu carné de la firma y no por la puerta de atrás.",
        pasos: [
          { t: "Abre la aplicación de escritorio de Claude o entra a claude.ai en el navegador." },
          { t: "Inicia sesión con tu correo de la firma. Si te pide elegir el método, usa el inicio de sesión de la empresa (el mismo de Microsoft 365)." },
          { t: "Revisa que estás en la organización de la firma: abre el menú de tu perfil (abajo a la izquierda) y confirma que aparece el nombre de la organización.",
            bloque: { tipo: "clic", contenido: "Menú de perfil › Organización de la firma" } },
          { t: "Si tienes otra cuenta personal de Claude, cierra esa sesión en este equipo para no confundirlas." }
        ],
        resultado: "Ves tu nombre y la organización de la firma en el menú de perfil.",
        cuidado: "Nunca uses una cuenta personal o gratuita con información de la firma. Si no te aparece la organización, escribe a TI."
      },

      /* 2 */
      {
        tipo: "constructor",
        titulo: "Arma tu primer pedido",
        texto: "Juega a armar un buen pedido: elige una opción de cada pieza y mira cómo se construye el texto. Este es el tipo de pedido que luego le harás a Claude Code sobre un archivo de tu carpeta.",
        plantilla: L(
          "Actúa como {rol}.",
          "{tarea} {material}.",
          "Entrégalo en {formato}.",
          "{criterio}",
          "Si algo no está en el archivo, responde: «no consta»."
        ),
        piezas: [
          { campo: "rol", nombre: "Rol: ¿desde qué mirada?", icono: "🎭", opciones: ["abogado(a) corporativo(a) colombiano(a)", "especialista en marcas", "analista financiero(a) de la firma", "asistente que organiza correspondencia"] },
          { campo: "tarea", nombre: "Tarea: ¿qué debe hacer?", icono: "🎯", opciones: ["Resume el archivo", "Identifica los riesgos del archivo", "Extrae las fechas y los plazos del archivo", "Compara con su versión anterior el archivo"] },
          { campo: "material", nombre: "Material: ¿qué archivo de la carpeta?", icono: "📄", opciones: ["Contratos/suministro.docx", "Marcas/oposicion_cliente_A.pdf", "Cartera/vencida_2026-10.xlsx", "Correspondencia/recibidos.xlsx"] },
          { campo: "formato", nombre: "Formato: ¿cómo lo quieres?", icono: "📐", opciones: ["una tabla de 3 columnas", "5 viñetas cortas", "un borrador de correo de máximo 10 líneas", "un cuadro con fecha, acción y responsable"] },
          { campo: "criterio", nombre: "Criterio: ¿qué es un buen resultado?", icono: "✅", opciones: ["Cita la cláusula o el fragmento que soporta cada punto.", "Usa lenguaje sencillo para alguien sin formación jurídica.", "Marca en rojo lo urgente.", "No incluyas nombres de personas."] }
        ],
        nota: "Copia el pedido y úsalo en la receta 7 (Claude Code). Así los documentos no se suben a ningún chat."
      },

      /* 3 */
      {
        tipo: "receta", icono: "💬",
        titulo: "Tu primer chat (sin datos de clientes)",
        nivel: "Básico", quien: "Lo haces tú", tiempo: "10 minutos",
        construyes: "Una conversación útil con Claude sobre un tema general, corregida hasta que quede como la necesitas.",
        simple: "Es como pedirle algo a un colega: le explicas, revisas lo que te entrega y le dices qué ajustar.",
        pasos: [
          { t: "Abre un chat nuevo y escribe una pregunta general, sin nombres ni datos de clientes.",
            bloque: { tipo: "chat", mensajes: [
              { de: "tu", t: "Explícame en 5 viñetas, para alguien sin formación jurídica, qué es un acuerdo de confidencialidad." },
              { de: "claude", t: "Claro: 1) Es un contrato en el que una o ambas partes se comprometen a no revelar cierta información..." }
            ] } },
          { t: "Lee la respuesta con ojo crítico: ¿es clara?, ¿le falta algo?, ¿hay algo que verificar?" },
          { t: "Pide un ajuste concreto en lugar de empezar de cero.",
            bloque: { tipo: "chat", mensajes: [
              { de: "tu", t: "Bien. Ahora agrega un ejemplo cotidiano en cada viñeta y quita la última." }
            ] } },
          { t: "Si la respuesta menciona normas, sentencias o cifras, verifícalas en la fuente oficial antes de usarlas." }
        ],
        resultado: "Un texto claro que ajustaste en dos o tres mensajes.",
        cuidado: "En el chat no van documentos, correos ni datos de clientes. Para eso está Claude Code (receta 7)."
      },

      /* 4 */
      {
        tipo: "receta", icono: "📁",
        titulo: "Crear un Proyecto con instrucciones",
        nivel: "Básico", quien: "Lo haces tú", tiempo: "10 minutos",
        construyes: "Un Proyecto en claude.ai con reglas permanentes (tono, formato, qué citar) que se aplican a todos sus chats.",
        simple: "Es como pegar el manual de estilo en la pared: cada vez que alguien escribe, ya conoce las reglas.",
        pasos: [
          { t: "En la barra lateral, haz clic en Projects (Proyectos) y luego en «+ New Project» (arriba a la derecha).",
            bloque: { tipo: "clic", contenido: "Projects › + New Project" } },
          { t: "Escribe un nombre y una descripción. Por ejemplo: «Redacción de conceptos»." },
          { t: "Elige la visibilidad: «Keep it private» (solo tú) o compartirlo con la organización, si tu equipo lo va a usar." },
          { t: "Abre el proyecto y haz clic en «Set project instructions». Escribe las reglas y pulsa «Save instructions».",
            bloque: { tipo: "archivo", titulo: "Instrucciones del proyecto (ejemplo)", contenido: L(
              "- Responde siempre en español formal de Colombia.",
              "- Cita la norma o el artículo que soporta cada afirmación.",
              "- Termina cada respuesta con una sección «Riesgos».",
              "- Si no estás seguro de algo, dilo y sugiere cómo verificarlo.",
              "- Nunca pidas ni uses datos personales de clientes."
            ) } },
          { t: "Abre un chat dentro del proyecto y pruébalo con una pregunta general: verás que la respuesta ya sigue tus reglas." }
        ],
        resultado: "Cada chat del proyecto respeta tus reglas sin que tengas que repetirlas.",
        cuidado: "Por política de la firma, en un Proyecto no se suben documentos de clientes: solo instrucciones, plantillas propias sin datos y normas públicas."
      },

      /* 5 */
      {
        tipo: "receta", icono: "🖼️",
        titulo: "Pedir un Artifact (documento o cuadro aparte)",
        nivel: "Básico", quien: "Lo haces tú", tiempo: "5 minutos",
        construyes: "Un documento, cuadro o pequeña herramienta que Claude muestra en un panel aparte para revisarlo, ajustarlo y descargarlo.",
        simple: "Es como pedirle a alguien que te entregue el trabajo en una hoja aparte, en lugar de dictártelo.",
        pasos: [
          { t: "La función debe estar activada para la organización. Si no ves los Artifacts, el administrador la activa en la configuración de la organización.",
            bloque: { tipo: "clic", contenido: "Organization settings › Capabilities" } },
          { t: "En un chat, pide algo largo y autocontenido.",
            bloque: { tipo: "chat", mensajes: [
              { de: "tu", t: "Crea una lista de verificación para revisar un acuerdo de confidencialidad, en una tabla con columnas: punto, qué revisar, riesgo si falta." },
              { de: "claude", t: "Listo, te dejo la lista de verificación en el panel de la derecha." }
            ] } },
          { t: "Revisa el panel de la derecha y pide ajustes: «agrega una fila sobre la vigencia», «resume en una página»." },
          { t: "Cuando esté listo, cópialo o descárgalo desde el panel." }
        ],
        resultado: "Un documento o cuadro reutilizable, separado de la conversación.",
        cuidado: "Antes de compartir un Artifact por enlace, revisa que no tenga información confidencial."
      },

      /* 6 */
      {
        tipo: "receta", icono: "💻",
        titulo: "Abrir Claude Code",
        nivel: "Básico", quien: "Tú; con TI si el equipo pide permisos", tiempo: "15 minutos",
        construyes: "Tu espacio para trabajar con documentos de la firma sin subirlos: Claude lee los archivos directamente desde una carpeta.",
        simple: "Es como sentar a un asistente frente a tu escritorio con acceso a una carpeta, en vez de enviarle los papeles por correo.",
        pasos: [
          { t: "Opción recomendada, sin instalar nada: abre la aplicación de escritorio de Claude, entra con la cuenta de la firma y ve a la pestaña Code.",
            bloque: { tipo: "clic", contenido: "App de Claude › Code › Elegir carpeta" } },
          { t: "Elige la carpeta del caso o, mejor aún, una carpeta de trabajo con copias de los documentos." },
          { t: "Opción terminal (si TI ya la instaló, o si tu equipo lo permite): en Windows, abre PowerShell y ejecuta el instalador oficial. Luego verifica la versión.",
            bloque: { tipo: "terminal", titulo: "PowerShell (Windows)", contenido: L(
              "# Instalar Claude Code (instalador oficial)",
              "irm https://claude.ai/install.ps1 | iex",
              "# Verificar que quedó instalado",
              "claude --version"
            ) } },
          { t: "Entra a la carpeta de trabajo e inicia Claude Code. La primera vez se abre el navegador para que inicies sesión con la cuenta de la firma.",
            bloque: { tipo: "terminal", titulo: "PowerShell", contenido: L(
              "cd \"C:\\Trabajo\\Caso_Cliente_A\"",
              "claude"
            ) } },
          { t: "Escribe un saludo para probar: «¿Qué archivos hay en esta carpeta?». Claude te pedirá permiso para mirar; léelo y apruébalo." }
        ],
        resultado: "Claude Code te muestra la lista de archivos de la carpeta y queda listo para trabajar.",
        cuidado: "Claude Code requiere el plan de la firma (Team o Enterprise); el plan gratuito no lo incluye. Si el instalador pide permisos que no tienes, o algo falla, pide ayuda a TI: el comando «claude doctor» les ayuda a diagnosticar."
      },

      /* 7 */
      {
        tipo: "receta", icono: "📄",
        titulo: "Leer un documento de tu carpeta (sin subirlo)",
        nivel: "Básico", quien: "Lo haces tú", tiempo: "10 minutos",
        construyes: "Un resumen o análisis de un documento de la firma, hecho sin subirlo a ningún chat y guardado en la misma carpeta.",
        simple: "El documento no sale de tu cajón: Claude viene a leerlo ahí.",
        pasos: [
          { t: "Prepara una copia del documento en la carpeta de trabajo. Si no necesitas los nombres, usa una copia seudonimizada (alias en lugar de nombres y cédulas)." },
          { t: "En Claude Code, haz tu pedido nombrando el archivo. Puedes usar el que armaste en la receta 2.",
            bloque: { tipo: "chat", mensajes: [
              { de: "tu", t: "Actúa como abogado(a) corporativo(a). Identifica los riesgos de Contratos/suministro.docx para el comprador. Entrégalo en una tabla de 3 columnas y cita la cláusula. Si algo no está, responde «no consta». Guarda el resultado en Salidas/riesgos.md." },
              { de: "claude", t: "Voy a leer Contratos/suministro.docx. ¿Me das permiso para leer el archivo?" }
            ] } },
          { t: "Lee el permiso que te pide y apruébalo solo si es lo que esperabas (leer ese archivo, crear ese resultado)." },
          { t: "Abre el resultado (Salidas/riesgos.md) y verifica cada cláusula citada contra el documento original." }
        ],
        resultado: "Un archivo con el análisis en la carpeta, sin que el documento haya pasado por un chat.",
        cuidado: "Aunque el archivo no se sube, el texto que Claude lee sí se procesa en el modelo, bajo el contrato de la firma. Por eso se minimiza. Invenciones o marcas no radicadas: solo con aprobación del área."
      },

      /* 8 */
      {
        tipo: "receta", icono: "🏠",
        titulo: "Crear tu CLAUDE.md (las reglas de la casa)",
        nivel: "Intermedio", quien: "Lo haces tú", tiempo: "15 minutos",
        construyes: "Un archivo de instrucciones permanentes que Claude Code lee cada vez que empieza a trabajar en la carpeta.",
        simple: "Es la nota pegada en la nevera de la oficina: las reglas que todos deben seguir sin que tengas que repetirlas.",
        pasos: [
          { t: "Dentro de Claude Code, en la carpeta de trabajo, escribe el comando /init. Claude revisa la carpeta y propone un CLAUDE.md (si ya existe, sugiere mejoras).",
            bloque: { tipo: "terminal", titulo: "Dentro de Claude Code", contenido: "/init" } },
          { t: "Abre el archivo CLAUDE.md que quedó en la carpeta y ajústalo con tus reglas. También puedes crearlo a mano con este contenido:",
            bloque: { tipo: "archivo", titulo: "CLAUDE.md", contenido: L(
              "# Reglas de esta carpeta",
              "",
              "- Responde en español formal de Colombia.",
              "- Nunca borres ni sobrescribas archivos originales: trabaja sobre copias.",
              "- Guarda todos los resultados en la carpeta Salidas/ con la fecha en el nombre.",
              "- Cita el archivo y la página o cláusula de donde sacas cada dato.",
              "- Si no encuentras algo, responde «no consta». No inventes.",
              "- No escribas nombres ni cédulas en los resultados: usa alias."
            ) } },
          { t: "Cierra y vuelve a abrir Claude Code en la carpeta: desde ahora sigue esas reglas. Para confirmar que lo cargó, usa /context." }
        ],
        resultado: "Claude Code respeta tus reglas sin que tengas que repetirlas en cada pedido.",
        cuidado: "Nunca pongas claves, contraseñas ni datos de clientes en CLAUDE.md."
      },

      /* 9 */
      {
        tipo: "receta", icono: "🗺️",
        titulo: "Usar el modo plan (primero el plano, luego la obra)",
        nivel: "Intermedio", quien: "Lo haces tú", tiempo: "10 minutos",
        construyes: "Una forma segura de hacer tareas grandes: Claude investiga y te propone un plan sin tocar ningún archivo hasta que lo apruebes.",
        simple: "Como en una remodelación: primero ves el plano y lo apruebas; después empiezan a trabajar.",
        pasos: [
          { t: "En Claude Code, pulsa Shift + Tab varias veces hasta que veas el modo «plan» en la parte de abajo. También puedes empezar tu mensaje con /plan.",
            bloque: { tipo: "terminal", titulo: "Dentro de Claude Code", contenido: L(
              "# Atajo: Shift + Tab hasta ver «plan»",
              "/plan Organiza los 120 PDF de esta carpeta en subcarpetas por año y tipo de documento"
            ) } },
          { t: "Lee el plan con calma: ¿qué archivos va a mover?, ¿qué carpetas va a crear?, ¿hay algo que no quieres?" },
          { t: "Pide cambios al plan si hace falta («no muevas los originales, haz copias») y apruébalo solo cuando estés de acuerdo." },
          { t: "Cuando termine, revisa el resultado antes de darlo por bueno." }
        ],
        resultado: "La tarea hecha exactamente como la aprobaste, sin sorpresas.",
        cuidado: "Para tareas que mueven o cambian muchos archivos, usa siempre el modo plan y trabaja sobre copias."
      },

      /* 10 */
      {
        tipo: "receta", icono: "📦",
        titulo: "Crear una Skill (un procedimiento reutilizable)",
        nivel: "Intermedio", quien: "Lo haces tú; para toda la firma, con aprobación", tiempo: "30 minutos",
        construyes: "Un procedimiento de la firma que Claude aplica solo cuando lo necesita, por ejemplo, revisar NDA con la lista de verificación de la firma.",
        simple: "Es una receta guardada en el recetario de Claude: la busca cuando reconoce el plato que le pides.",
        pasos: [
          { t: "Dentro de la carpeta de trabajo, crea esta ruta de carpetas: .claude › skills › revision-nda (el nombre de la última carpeta es el nombre de la Skill).",
            bloque: { tipo: "clic", contenido: ".claude › skills › revision-nda › SKILL.md" } },
          { t: "Crea el archivo SKILL.md con una descripción clara (es lo que usa Claude para decidir cuándo usarla) y las instrucciones paso a paso:",
            bloque: { tipo: "archivo", titulo: ".claude/skills/revision-nda/SKILL.md", contenido: L(
              "---",
              "name: revision-nda",
              "description: Revisa acuerdos de confidencialidad (NDA) con la lista de verificación de la firma. Úsala cuando pidan revisar un NDA o un acuerdo de confidencialidad.",
              "---",
              "",
              "# Revisión de NDA",
              "",
              "1. Identifica las partes y si el acuerdo es unilateral o mutuo.",
              "2. Revisa: definición de información confidencial, excepciones,",
              "   duración, devolución o destrucción, ley aplicable y solución de conflictos.",
              "3. Marca cada punto como Cumple / Falta / Riesgo.",
              "4. Entrega una tabla: punto | cláusula | estado | recomendación.",
              "5. Cita la cláusula exacta. Si un punto no aparece, escribe «no consta»."
            ) } },
          { t: "Pruébala en Claude Code: pídele «Revisa el NDA de la carpeta Contratos». También puedes llamarla directamente escribiendo /revision-nda." },
          { t: "Si tu equipo la va a usar, compártela con el área. En claude.ai, las Skills se agregan en Customize › Skills; para toda la organización las aprovisiona el propietario de la cuenta.",
            bloque: { tipo: "clic", contenido: "Customize › Skills › + › Create skill › Upload a skill" } }
        ],
        resultado: "Cuando pides revisar un NDA, Claude sigue el procedimiento de la firma.",
        cuidado: "Una Skill es un procedimiento: nunca lleva documentos de clientes ni claves. Solo se instalan Skills revisadas y de fuentes confiables."
      },

      /* 11 */
      {
        tipo: "receta", icono: "👥",
        titulo: "Crear un subagente (un ayudante especializado)",
        nivel: "Intermedio", quien: "Lo haces tú", tiempo: "20 minutos",
        construyes: "Un ayudante con una sola especialidad y permisos limitados, por ejemplo, uno que solo revisa citas.",
        simple: "Es como tener en el equipo a alguien que solo revisa citas: no redacta, no envía; solo verifica.",
        pasos: [
          { t: "En la carpeta de trabajo, crea el archivo .claude/agents/revisor-citas.md." },
          { t: "Escribe su nombre, su descripción (cuándo usarlo), las herramientas que puede usar (aquí, solo leer y buscar) y sus instrucciones:",
            bloque: { tipo: "archivo", titulo: ".claude/agents/revisor-citas.md", contenido: L(
              "---",
              "name: revisor-citas",
              "description: Revisa que cada cita (norma, sentencia, cláusula) de un borrador coincida con los documentos de la carpeta. Úsalo antes de entregar un concepto.",
              "tools: Read, Grep, Glob",
              "---",
              "",
              "Eres un revisor de citas. Para cada cita del borrador:",
              "1. Búscala en los archivos de la carpeta.",
              "2. Indica si coincide, si no coincide o si no la encontraste.",
              "3. No modifiques ningún archivo: solo informa."
            ) } },
          { t: "Úsalo pidiéndoselo a Claude Code: «Usa el subagente revisor-citas para revisar Salidas/concepto_borrador.md»." },
          { t: "Lee su informe y corrige tú las citas que no coincidan." }
        ],
        resultado: "Un informe de qué citas coinciden y cuáles no, sin cambios en tus archivos.",
        cuidado: "Dale a cada subagente solo las herramientas que necesita. Las citas de normas y sentencias se verifican también en la fuente oficial."
      },

      /* 12 */
      {
        tipo: "receta", icono: "🔌",
        titulo: "Conectar una aplicación (conectores y MCP)",
        nivel: "Intermedio", quien: "TI habilita; tú te conectas", tiempo: "10 minutos (tú) · variable (TI)",
        construyes: "Una conexión entre Claude y una aplicación aprobada (por ejemplo, el correo o los documentos de Microsoft 365), usando tus propios permisos.",
        simple: "Es como darle a un asistente la llave del archivo: ve lo mismo que tú, ni más ni menos.",
        pasos: [
          { t: "Primero, TI (propietario de la cuenta) agrega el conector aprobado para la organización.",
            bloque: { tipo: "clic", contenido: "Organization settings › Connectors › Browse connectors › Add to your team" } },
          { t: "Luego, tú te conectas con tu cuenta: agregar el conector no le da acceso a nadie hasta que cada persona inicia sesión.",
            bloque: { tipo: "clic", contenido: "Customize › Connectors › Conectar" } },
          { t: "En Claude Code, TI puede agregar un servidor MCP aprobado y tú puedes ver cuáles hay:",
            bloque: { tipo: "terminal", titulo: "Terminal", contenido: L(
              "# Lo hace TI, con la dirección del servidor aprobado",
              "claude mcp add --transport http <nombre> <url>",
              "# Ver los servidores configurados",
              "claude mcp list"
            ) } },
          { t: "Pruébalo con una tarea de solo lectura: «Busca en mi correo los mensajes de esta semana sobre el asunto X y resúmelos»." }
        ],
        resultado: "Claude consulta la aplicación por ti, solo con tus permisos.",
        cuidado: "Solo conectores aprobados por TI y con los permisos mínimos. Enviar, borrar o publicar siempre lo confirmas tú."
      },

      /* 13 */
      {
        tipo: "receta", icono: "📚",
        titulo: "Buscar en tus documentos (un mini RAG con Claude Code)",
        nivel: "Intermedio", quien: "Lo haces tú", tiempo: "20 minutos",
        construyes: "Respuestas basadas en los documentos de una carpeta, con la cita del archivo de donde sale cada dato.",
        simple: "Un bibliotecario que no te lee toda la biblioteca: te trae las páginas que responden tu pregunta.",
        pasos: [
          { t: "Reúne en una carpeta los documentos sobre los que quieres preguntar (por ejemplo, Conceptos/ con los conceptos de un tema), con nombres de archivo claros." },
          { t: "Abre Claude Code en esa carpeta y pregunta pidiendo citas:",
            bloque: { tipo: "chat", mensajes: [
              { de: "tu", t: "Busca en la carpeta Conceptos/ qué posición ha tomado la firma sobre las cláusulas de no competencia. Cita el archivo y el párrafo de cada afirmación. Si no aparece, responde «no consta»." },
              { de: "claude", t: "Encontré 3 conceptos que tratan el tema: Conceptos/2024_no_competencia.docx (párrafo 4) dice que..." }
            ] } },
          { t: "Abre los archivos citados y verifica que el fragmento diga lo que Claude afirma." },
          { t: "Si la carpeta crece a miles de documentos o la usará toda el área con permisos distintos, eso ya es un RAG corporativo: se lo propones a TI (receta 16)." }
        ],
        resultado: "Respuestas con citas verificables a tus propios documentos.",
        cuidado: "Respeta las barreras de información: no mezcles en una misma carpeta documentos de clientes que no deben cruzarse."
      },

      /* 14 */
      {
        tipo: "receta", icono: "🪝",
        titulo: "Crear un hook (una regla automática)",
        nivel: "Avanzado", quien: "Con TI", tiempo: "30 minutos con TI",
        construyes: "Una regla que se ejecuta sola en Claude Code, por ejemplo, para bloquear un comando peligroso antes de que ocurra.",
        simple: "Es como el portero del edificio: revisa a cada visitante antes de dejarlo pasar.",
        pasos: [
          { t: "Decide qué quieres controlar. Por ejemplo: «que nunca se ejecute un borrado masivo de archivos»." },
          { t: "TI agrega el hook en el archivo de configuración del proyecto (.claude/settings.json). Este ejemplo revisa cada comando antes de ejecutarlo:",
            bloque: { tipo: "archivo", titulo: ".claude/settings.json", contenido: L(
              "{",
              "  \"hooks\": {",
              "    \"PreToolUse\": [",
              "      {",
              "        \"matcher\": \"Bash\",",
              "        \"hooks\": [",
              "          {",
              "            \"type\": \"command\",",
              "            \"command\": \"\\\"$CLAUDE_PROJECT_DIR\\\"/.claude/hooks/bloquear-borrados.sh\"",
              "          }",
              "        ]",
              "      }",
              "    ]",
              "  }",
              "}"
            ) } },
          { t: "TI escribe el pequeño programa (bloquear-borrados.sh) que revisa el comando y, si es peligroso, lo bloquea (sale con el código 2 y explica el motivo)." },
          { t: "Prueban juntos que el bloqueo funcione en una carpeta de prueba, sin archivos reales." }
        ],
        resultado: "Si alguien intenta el comando prohibido, Claude Code lo bloquea y explica por qué.",
        cuidado: "Los hooks ejecutan programas: los configura y prueba TI. En Windows pueden requerir Git for Windows."
      },

      /* 15 */
      {
        tipo: "receta", icono: "🔗",
        titulo: "Usar la API (integrar Claude en un sistema)",
        nivel: "Avanzado", quien: "Con TI", tiempo: "1 hora con TI (prototipo)",
        construyes: "Un pequeño programa que le envía un pedido a Claude y recibe la respuesta, base de cualquier integración.",
        simple: "La API es como el mesero de un restaurante: lleva tu pedido a la cocina y te trae el plato.",
        pasos: [
          { t: "TI crea una clave en la Consola de Claude, dentro de un espacio de trabajo con límite de gasto.",
            bloque: { tipo: "clic", contenido: "Claude Console › Settings › API keys › Create key" } },
          { t: "La clave se guarda en un gestor de secretos y se entrega al programa como variable de entorno ANTHROPIC_API_KEY. Nunca se escribe en el código." },
          { t: "Se instala la librería oficial de Python:",
            bloque: { tipo: "terminal", titulo: "Terminal", contenido: "pip install anthropic" } },
          { t: "Este es el programa mínimo. Fíjate que no tiene la clave: la toma sola de la variable de entorno.",
            bloque: { tipo: "archivo", titulo: "primer_pedido.py", contenido: L(
              "import anthropic",
              "",
              "client = anthropic.Anthropic()  # lee ANTHROPIC_API_KEY del entorno",
              "",
              "message = client.messages.create(",
              "    model=\"claude-opus-5-5\",",
              "    max_tokens=1000,",
              "    messages=[",
              "        {\"role\": \"user\", \"content\": \"Explica en 3 viñetas qué es un acuerdo de confidencialidad.\"}",
              "    ],",
              ")",
              "",
              "for block in message.content:",
              "    if block.type == \"text\":",
              "        print(block.text)"
            ) } },
          { t: "Se ejecuta y se revisa la respuesta. Para tareas sencillas y de mucho volumen, TI puede elegir un modelo más económico." }
        ],
        resultado: "El programa imprime la respuesta de Claude: ya tienes la base de una integración.",
        cuidado: "La clave es como la tarjeta de crédito de la firma: nunca en el código, en correos ni en chats. Si se expone, TI la revoca de inmediato."
      },

      /* 16 */
      {
        tipo: "receta", icono: "🏗️",
        titulo: "De la idea al aplicativo (de personal a corporativo)",
        nivel: "Avanzado", quien: "Tú propones; TI, datos y el área aprueban", tiempo: "Prototipo: días · Corporativo: semanas a meses",
        construyes: "El camino completo para convertir una idea en una herramienta que use toda el área de forma segura.",
        simple: "Hacer un café para ti es fácil; abrir un restaurante necesita permisos, cocina profesional e inspecciones.",
        pasos: [
          { t: "Escribe la necesidad en una frase: qué problema resuelve, para quién y qué se repite. Ejemplo: «Cada mes revisamos 50 contratos de proveedores con los mismos criterios»." },
          { t: "Usa el modo plan de Claude Code (receta 9) para que te proponga cómo construir un prototipo." },
          { t: "Construye el prototipo en una carpeta de pruebas, con datos ficticios o de ejemplo, nunca con datos reales de clientes." },
          { t: "Guarda cada versión con control de cambios (git), para poder ver qué cambió y volver atrás." },
          { t: "Pruébalo con casos reales anonimizados y pide a un experto del área que revise una muestra de resultados." },
          { t: "Preséntalo a TI y a protección de datos: revisan la seguridad, los permisos, dónde quedan los datos y el registro de uso." },
          { t: "Hagan un piloto con pocas personas (2 a 6 semanas, orientativo) y luego la puesta en producción, con un responsable y un manual." },
          { t: "Programen revisiones periódicas: la calidad se vigila mientras el aplicativo esté en uso." }
        ],
        resultado: "Una herramienta corporativa, con controles, responsable y revisión experta.",
        cuidado: "Un prototipo personal no se usa con datos de clientes ni se comparte como oficial hasta pasar por la aprobación."
      },

      {
        tipo: "elige",
        titulo: "Juega: ¿qué receta usarías?",
        situacion: "Necesitas que, cada vez que alguien del equipo pida revisar un NDA, Claude siga exactamente la lista de verificación de la firma. ¿Qué receta usas?",
        opciones: [
          { t: "Receta 3: un chat nuevo cada vez.", ok: false, r: "Tendrías que repetir la lista en cada chat y cada persona lo haría distinto." },
          { t: "Receta 10: una Skill con la lista de verificación.", ok: true, r: "¡Exacto! La Skill guarda el procedimiento y Claude la usa cada vez que alguien pide revisar un NDA." },
          { t: "Receta 15: un programa con la API.", ok: false, r: "Es mucho más complejo de lo necesario para esta tarea." }
        ]
      }
    ]
  };

  if (typeof module !== "undefined" && module.exports) module.exports = TALLER;
  else if (global.Conceptos) global.Conceptos.CONCEPTOS.taller = TALLER;
})(typeof window !== "undefined" ? window : globalThis);
