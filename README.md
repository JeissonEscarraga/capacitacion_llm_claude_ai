# Lex Boss: Claude e IA para abogados

Juego web de capacitación para los abogados de la firma. Cada tema es un **jefe** que se vence respondiendo preguntas: si aciertas, lo atacas; si fallas, pierdes credibilidad, pero siempre ves la explicación correcta. Al terminar cada módulo, la persona descarga una **constancia en PDF** con su nombre, correo, puntaje y respuestas correctas e incorrectas, y la envía a TI para su control. El juego no guarda datos en ningún servidor.

**Jugar:** https://jeissonescarraga.github.io/capacitacion_llm_claude_ai/

La mecánica se inspira en la versión web de [Logic Boss Game](https://github.com/As-Yung/Logic-Boss-Game) (licencia MIT): pizarra con dibujos en tiza, jefes en un mapa, rachas con golpe crítico y ventajas por personaje.

## Qué enseña

| # | Jefe | Tema |
|---|------|------|
| 1 | El Oráculo Alucinante | Fundamentos de Claude y de los LLM (modelos, tokens, contexto, alucinaciones, responsabilidad) |
| 2 | La Gárgola del Escritorio | Claude en el trabajo: cuenta corporativa, proyectos, artifacts, búsqueda web |
| 3 | El Hechicero de los Prompts Vagos | Cómo pedirle las cosas a Claude (prompting) |
| 4 | El Guardián del Hábeas Data | Ley 1581 de 2012, datos sensibles, transferencia/transmisión, SIC e IA |
| 5 | El Dragón del Copyright | Propiedad intelectual: obras de terceros, outputs, términos de fuentes, secreto empresarial, marcas |
| 6 | La Sombra de la Fuga | Secreto profesional, prompt injection, manejo de claves, IA no aprobada, incidentes |
| 7 | El Bibliotecario Perdido | RAG: embeddings, chunking, permisos, cuándo basta un Proyecto |
| 8 | El Alquimista de las Recetas | Skills: SKILL.md, divulgación progresiva, seguridad |
| 9 | La Medusa de los Mil Cables | MCP y conectores prediseñados, mínimo privilegio, confirmación humana |
| 10 | El Gólem Autónomo | Agentes, flujos fijos, subagentes, Agent SDK, trazabilidad |
| 11 | El Titán de la Terminal | Claude Code: CLAUDE.md, permisos, modo plan, hooks, git |
| 12 | El Leviatán de los Tokens | API de Anthropic: claves, costos, caché de prompts, lotes, tool use, workspaces |
| Final | El Comité de Riesgo Supremo | Casos integrales (se abre al vencer a los 12) |

Son 83 preguntas, cada una con su concepto y su explicación. Cada módulo tiene dos partes:

1. **Conceptualización** (para personas sin conocimientos previos): pasos con explicación en lenguaje sencillo, un esquema visual, una analogía («En palabras simples»), un ejemplo de la firma y ejercicios prácticos que hay que resolver para avanzar. El contenido está en `web/js/conceptos.js`.
2. **Práctica:** la batalla contra el jefe.

Lo que se falla aparece luego en un **jefe de repaso**. Al completar la conceptualización y terminar la práctica se descarga la constancia en PDF.

## Cómo funciona

1. **Entrada con nombre y correo**, más el aviso de privacidad. No hay clave ni cuenta.
2. **Juego:** antes de cada jefe hay una conceptualización paso a paso (no se puede saltar la primera vez); en la batalla, cada respuesta muestra la explicación. Lo que se falla vuelve en el jefe de repaso. El jefe final está siempre abierto.
3. **Constancia en PDF:** se descarga sola solo si se completó la conceptualización y se terminó la práctica (ganada o perdida; si la persona se retira, no hay constancia; el repaso tampoco genera). Al inicio muestra la fecha y hora en que se generó; incluye participante, correo, módulo, fechas de conceptualización y práctica, resultado, puntaje y cada pregunta: lo que eligió, la respuesta correcta y la explicación de las falladas. Se genera en el navegador con [jsPDF](https://github.com/parallax/jsPDF) (MIT), copiado en `web/vendor/`, así que no se envía nada a terceros.
4. **Envío a TI:** el botón «Enviar a TI» abre un correo ya redactado dirigido al buzón de TI configurado en `web/config.js` (`correoTI`, hoy `admon_sistemas@cavelier.com`). La persona adjunta el PDF y lo envía desde su cuenta de la firma, así que el remitente queda verificado por Microsoft 365.
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
  css/estilos.css     estilo de pizarra
  js/contenido.js     temas, resúmenes y preguntas de la batalla  ← contenido
  js/conceptos.js     conceptualización de cada módulo (pasos, visuales, prácticas)  ← contenido
  js/logica.js        batalla, progreso, niveles (sin interfaz)
  js/constancia.js    constancia en PDF y correo para TI
  vendor/jspdf.umd.min.js  jsPDF 2.5.1 (MIT)
  js/dibujos.js       jefes y personajes en SVG
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
