# AI BOSS: Claude e IA para abogados

Juego web de capacitación para los abogados de la firma. Cada tema es una **AI** a la que se le gana respondiendo preguntas: si aciertas, lo atacas; si fallas, pierdes credibilidad, pero siempre ves la explicación correcta. Al terminar cada módulo, la persona descarga una **constancia en PDF** con su nombre, correo, puntaje y respuestas correctas e incorrectas, y la envía a TI para su control. El juego no guarda datos en ningún servidor.

**Jugar:** https://jeissonescarraga.github.io/capacitacion_llm_claude_ai/

La mecánica se inspira en la versión web de [Logic Boss Game](https://github.com/As-Yung/Logic-Boss-Game) (licencia MIT): pizarra con dibujos en tiza, jefes en un mapa, rachas con golpe crítico y ventajas por personaje.

## Qué enseña

| # | AI | Tema |
|---|------|------|
| 1 | El Oráculo Alucinante | Fundamentos de Claude y de los LLM (modelos, tokens, contexto, alucinaciones, responsabilidad) |
| 2 | La Gárgola del Escritorio | Claude en el trabajo: cuenta corporativa, proyectos, artifacts, búsqueda web |
| 3 | El Arquitecto Improvisado | Aplicativo corporativo vs. aplicativo personal vs. subir archivos y preguntar; revisión del experto y tiempos orientativos |
| 4 | El Hechicero de los Prompts Vagos | Cómo pedirle las cosas a Claude (prompting) |
| 5 | El Guardián del Hábeas Data | Ley 1581 de 2012, datos sensibles, transferencia/transmisión, SIC e IA |
| 6 | El Dragón del Copyright | Propiedad intelectual: obras de terceros, outputs, términos de fuentes, secreto empresarial, marcas |
| 7 | La Sombra de la Fuga | Secreto profesional, prompt injection, manejo de claves, IA no aprobada, incidentes |
| 8 | El Juez de lo Filtrado | Implicaciones legales de subir correos, documentos de patentes o marcas no radicadas, secretos de innovación y contratos con datos: privacidad, secreto profesional, confidencialidad, novedad, prioridad y consecuencias |
| 9 | El Contador Indiscreto | Claude y ChatGPT con NetSuite de Oracle: no se suben archivos al chat, no se da información de forma directa, todo se crea y se obtiene desde NetSuite con autorización escrita del jefe; sin autorización responde quien ejecuta el prompt y con autorización, el jefe que la dio |
| 10 | El Bibliotecario Perdido | RAG: embeddings, chunking, permisos, cuándo basta Claude Code en la carpeta |
| 11 | El Alquimista de las Recetas | Skills: SKILL.md, divulgación progresiva, seguridad |
| 12 | La Medusa de los Mil Cables | MCP y conectores prediseñados, mínimo privilegio, confirmación humana |
| 13 | El Gólem Autónomo | Agentes, flujos fijos, subagentes, Agent SDK, trazabilidad |
| 14 | El Titán de la Terminal | Claude Code: CLAUDE.md, permisos, modo plan, hooks, git |
| 15 | El Leviatán de los Tokens | API de Anthropic: claves, costos, caché de prompts, lotes, tool use, workspaces |
| Final | El Comité de Riesgo Supremo | Casos integrales |
| Cierre | El Gran Examinador | Resumen general del curso y evaluación: una pregunta al azar de cada tema; el PDF incluye el resultado por tema y la idea clave de cada lección |
| Responsiva | El Pergamino del Compromiso | **Sin batalla. Firma obligatoria.** Responsiva de uso de Claude, ChatGPT y otras IA: la persona la lee, completa sus datos, firma en pantalla, descarga el PDF firmado (con huella SHA-256) y lo envía a TI con el mismo correo .eml con adjunto de las constancias. Aclara que quien ejecuta el prompt responde por la pérdida, filtración, robo o incumplimiento legal derivado de su mal uso, salvo los usos que su jefe autorice por escrito |
| Taller | El Taller del Constructor | **Sin batalla.** 16 recetas visuales paso a paso para construir lo aprendido: entrar con la cuenta de la firma, armar un pedido (juego interactivo), chat, Proyecto, Artifact, Claude Code, leer documentos sin subirlos, CLAUDE.md, modo plan, Skill, subagente, conectores/MCP, mini RAG, hook, API y de la idea al aplicativo. Datos técnicos verificados en la documentación oficial (noviembre de 2026) |

Son 106 preguntas, cada una con su concepto y su explicación. Cada módulo tiene dos partes:

1. **Conceptualización** (para personas sin conocimientos previos): **alterna teoría y práctica**, una página teórica y enseguida un ejercicio para aplicarla, y así sucesivamente. Cada página teórica tiene explicación en lenguaje sencillo, un esquema visual, una analogía («En palabras simples») y un ejemplo de la firma; cada ejercicio hay que resolverlo para avanzar. La teoría está en `web/js/conceptos.js` y la práctica que sigue a cada concepto, en `web/js/practicas.js`.
2. **Práctica:** la batalla contra la AI.

Lo que se falla aparece luego en una **AI de repaso**. Al completar la conceptualización y terminar la práctica se descarga la constancia en PDF.

## Personajes y áreas

Al empezar, cada persona elige el personaje más cercano a su trabajo. La **introducción y el ejemplo de cada paso de la conceptualización se adaptan al personaje** según lo que hace (`web/js/ejemplos-perfiles.js`): el socio decide y aprueba, el asociado redacta rápido, el paralegal verifica, el analista cruza datos, IT configura y protege, etc., y cada personaje tiene una ventaja distinta en las batallas:

| Personaje | Área | Ventaja |
|---|---|---|
| Socio(a) estratega | Jurídica | 1 punto de credibilidad extra |
| Asociado(a) ágil | Jurídica | Golpe crítico con 2 aciertos seguidos |
| Paralegal meticuloso(a) | Jurídica | El primer error no quita credibilidad |
| Analista de datos | Tecnología y datos | 2 consultas al expediente |
| IT & Big Data | Tecnología y datos | 3 consultas, pero 2 de credibilidad |
| Administrativo(a) organizado(a) | Administrativa | Cada crítico devuelve una consulta |
| Experto(a) multidisciplinar | Multidisciplinar (validación de patentes) | Crítico con 2 aciertos y escudo, pero 2 de credibilidad |
| Analista de finanzas | Finanzas | 50 % más de experiencia |

## Política de documentos que enseña el juego

Los documentos de clientes y de la firma **no se suben ni se adjuntan** a chats ni a Proyectos de Claude: se trabajan con **Claude Code**, que los lee desde la carpeta local o de la firma. El chat queda para preguntas generales, redacción sin datos de clientes y material público. El juego aclara que, aunque el archivo no se sube, el texto que Claude lee sí se procesa en el modelo bajo el contrato de la firma; por eso también enseña a trabajar con copias seudonimizadas.

## Responsiva de uso de IA

La responsiva (`web/js/responsiva.js`) es un **modelo**: antes de usarla como documento vinculante debe revisarla y aprobarla el área jurídica y de talento humano de la firma. Si se cambia el texto, hay que subir `VERSION` para que TI sepa qué versión firmó cada persona. La firma se dibuja en pantalla y el PDF incluye una huella SHA-256 del texto firmado y de los datos del firmante; como la constancia, se genera en el navegador y técnicamente se puede alterar, así que para un control a prueba de manipulación habría que usar un servicio de firma electrónica corporativo.

## Cómo funciona

1. **Entrada con nombre y correo**, más el aviso de privacidad. No hay clave ni cuenta.
2. **Juego:** antes de cada AI hay una conceptualización paso a paso (no se puede saltar la primera vez). En la batalla, la AI tiene tantos puntos como preguntas el módulo: hay que responder bien **todas** (las falladas vuelven al final de la fila), así que ganarle a la AI significa 100 % aprendido. El golpe crítico devuelve un punto de credibilidad. En el mapa, cada módulo muestra sus tres pasos: Aprende, Practica y PDF.
3. **Constancia en PDF:** se descarga sola solo si se completó la conceptualización y se terminó la práctica (ganada o perdida; si la persona se retira, no hay constancia; el repaso tampoco genera). Al inicio muestra la fecha y hora en que se generó; incluye participante, correo, módulo, fechas de conceptualización y práctica, resultado, puntaje y cada pregunta: lo que eligió, la respuesta correcta y la explicación de las falladas. Se genera en el navegador con [jsPDF](https://github.com/parallax/jsPDF) (MIT), copiado en `web/vendor/`, así que no se envía nada a terceros.
4. **Envío a TI (con el PDF adjunto):** el botón «Preparar correo a TI» descarga un correo (.eml) dirigido al buzón `correoTI` de `web/config.js` (hoy `capacitacionai@cavelier.com`) que **ya trae el PDF adjunto**. Al abrirlo con doble clic, Outlook lo muestra como borrador (cabecera `X-Unsent: 1`); la persona revisa y pulsa «Enviar», desde su cuenta de la firma. Una página web no puede enviar correos sola ni adjuntar archivos a un enlace `mailto:`, por eso se usa este borrador. Si no se abre en Outlook (por ejemplo, en Outlook web), hay un enlace de respaldo que abre un correo sin adjunto.
5. **Nada se guarda:** el avance vive en memoria mientras la página está abierta. Al recargar o salir se pierde; las constancias descargadas son el registro.

### Límites que conviene conocer

- El PDF lo genera el navegador de la persona: técnicamente se puede alterar. Para una capacitación suele bastar; si hiciera falta un control a prueba de manipulación, habría que usar un servicio corporativo autenticado (por ejemplo, Microsoft Forms con inicio de sesión).
- El envío depende de que la persona adjunte el PDF y pulse «Enviar».
- El buzón de TI que se configure queda visible en el sitio público.

### Qué hacer si falla

| Situación | Qué hacer |
|-----------|-----------|
| No se descargó el PDF | Botón «Descargar PDF» en la ventana de resultado. Revisa que el navegador permita descargas del sitio. |
| «Enviar a TI» no abre nada | No hay una aplicación de correo predeterminada en el equipo. Escribe a TI desde Outlook y adjunta el PDF. |
| Se perdió el avance | Es normal al recargar: el juego no guarda nada. Las constancias ya descargadas siguen siendo válidas. |

## Publicar en GitHub Pages

El flujo [.github/workflows/pages.yml](.github/workflows/pages.yml) corre las pruebas y publica la carpeta `web/` en cada cambio a `main`. Pages está configurado con *Source: GitHub Actions*. También se puede publicar a mano desde **Actions → Probar y publicar en GitHub Pages → Run workflow**.

## Probar en Codespaces

1. En GitHub: **Code → Codespaces → Create codespace on main**.
2. Al crearse, corre las pruebas y arranca el servidor (`npm start`). Se abre la vista previa del puerto **8080**; si no, pestaña **Ports → 8080 → Open in browser**.

## Probar en el equipo local

Con Node.js 20 o superior (no hay dependencias que instalar):

```bash
npm test
```

```bash
npm start
```

y abrir http://localhost:8080.

## Estructura

```
web/
  index.html          pantallas del juego
  config.js           configuración (buzón de TI; sin secretos)
  css/estilos.css     estilo de pizarra (gris ratón y azul rey)
  js/contenido.js     temas, resúmenes y preguntas de la batalla  ← contenido
  js/conceptos.js     conceptualización de cada módulo (pasos, visuales, prácticas)  ← contenido
  js/practicas.js     práctica que sigue a cada concepto (teoría y práctica intercaladas)  ← contenido
  js/responsiva.js    responsiva de uso de IA: cláusulas y PDF firmado  ← contenido
  js/taller.js        taller final: recetas paso a paso y constructor de pedidos  ← contenido
  js/ejemplos-perfiles.js  ejemplos e introducciones adaptados a cada personaje  ← contenido
  js/logica.js        batalla, progreso, niveles (sin interfaz)
  js/constancia.js    constancia en PDF y correo para TI
  vendor/jspdf.umd.min.js  jsPDF 2.5.1 (MIT)
  js/dibujos.js       AI rivales y personajes en SVG
  js/interfaz.js      pantallas y eventos
  tests/juego.test.js pruebas (contenido y lógica)
scripts/servir.js     servidor estático sin dependencias
```

### Agregar o corregir preguntas

Las preguntas de la batalla están en `web/js/contenido.js`; la conceptualización, en `web/js/conceptos.js` (el comentario del inicio explica los tipos de paso y de visual). Cada pregunta tiene `id` (no cambiarlo: el progreso guardado depende de él), `concepto`, `p` (enunciado), `ok` (respuesta correcta), `no` (tres incorrectas) y `e` (explicación). Luego correr `npm test`.

## Seguridad y privacidad

- Este repositorio y el sitio de Pages son **públicos**: no se ponen claves, tokens, contraseñas ni datos de clientes en ningún archivo, incluido `config.js`.
- El juego no guarda datos personales ni pide datos sensibles. El aviso de privacidad está en la pantalla de inicio. Las constancias que llegan a TI sí contienen nombre, correo y resultados: hay que definir quién accede a ese buzón y cuánto tiempo se conservan.
- Las referencias normativas y de producto son orientativas y deben revisarse periódicamente (normas, términos de Anthropic y funciones de los productos cambian).

## Licencia

MIT. La mecánica de juego se inspira en Logic Boss Game © 2020 Santiago Quiroga Torres (MIT).
