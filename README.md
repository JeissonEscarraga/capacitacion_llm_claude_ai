# Lex Boss: Claude e IA para abogados

Juego web de capacitación para los abogados de la firma. Cada tema es un **jefe** que se vence respondiendo preguntas: si aciertas, lo atacas; si fallas, pierdes credibilidad, pero siempre ves la explicación correcta. El juego guarda quién lo usó, qué aprendió, qué debe repasar y qué no ha visto.

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

Son 83 preguntas, cada una con su concepto y su explicación. Antes de cada jefe hay una lección corta. Lo que se falla aparece luego en un **jefe de repaso**. Al terminar, la persona puede imprimir una constancia.

## Cómo funciona

1. **Acceso con nombre, correo y clave personal.** La persona inventa una clave solo para el juego (mínimo 10 caracteres). La clave **no se guarda**: se guarda un verificador derivado con PBKDF2‑SHA‑256 (150.000 iteraciones). Para crear el registro se pide aceptar el aviso de privacidad (Ley 1581 de 2012).
2. **Progreso por concepto.** Cada pregunta queda como *aprendida* (la última respuesta fue correcta), *por repasar* (la última fue incorrecta) o *no vista*. «Mi avance» muestra todo por tema, deja descargar un CSV y borrar los datos.
3. **Dónde se guarda:**
   - **Por defecto, en el navegador** de cada persona (`localStorage`). No sale nada a internet.
   - **Código de continuación:** botón «Código». Genera un texto cifrado (AES‑GCM con la clave) para seguir en otro equipo o navegador. Se pega en la pantalla de inicio junto con la clave.
   - **Registro central (opcional):** si en `web/config.js` se pone la URL de un flujo de la firma (por ejemplo, Power Automate + lista de SharePoint), el progreso de todos queda consolidado y cualquiera retoma desde cualquier equipo con correo y clave. Ver [docs/registro-central.md](docs/registro-central.md).
4. **Participantes en este navegador:** desde «Mi avance» se ve y se descarga en CSV quién ha jugado en ese equipo (útil para un equipo compartido o una sala de capacitación).

### Qué hacer si falla

| Situación | Qué hacer |
|-----------|-----------|
| «La clave no coincide» | Es la clave del juego, no la del correo. Si se olvidó, no se puede recuperar: se borran los datos del sitio en ese navegador y se empieza de nuevo. |
| Cambió de equipo y no ve su avance | Usar el código de continuación (o activar el registro central). |
| Borró los datos del navegador | Sin código ni registro central, el avance se pierde. Por eso conviene guardar el código. |
| «Este navegador no permite cifrado» | Abrir el juego por `https://` o `localhost`, en un navegador actualizado. |

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
  config.js           configuración (URL del registro central; sin secretos)
  css/estilos.css     estilo de pizarra
  js/contenido.js     temas, lecciones y preguntas  ← aquí se edita el contenido
  js/logica.js        batalla, progreso, niveles (sin interfaz)
  js/almacen.js       guardado local, cifrado, código de continuación, registro central
  js/dibujos.js       jefes y personajes en SVG
  js/interfaz.js      pantallas y eventos
  tests/juego.test.js pruebas (contenido, lógica y guardado)
scripts/servir.js     servidor estático sin dependencias
docs/registro-central.md
```

### Agregar o corregir preguntas

Editar `web/js/contenido.js`. Cada pregunta tiene `id` (no cambiarlo: el progreso guardado depende de él), `concepto`, `p` (enunciado), `ok` (respuesta correcta), `no` (tres incorrectas) y `e` (explicación). Luego correr `npm test`.

## Seguridad y privacidad

- Este repositorio y el sitio de Pages son **públicos**: no se ponen claves, tokens, contraseñas ni datos de clientes en ningún archivo, incluido `config.js`.
- El juego no pide datos sensibles. El aviso de privacidad está en la pantalla de inicio.
- Las referencias normativas y de producto son orientativas y deben revisarse periódicamente (normas, términos de Anthropic y funciones de los productos cambian).

## Licencia

MIT. La mecánica de juego se inspira en Logic Boss Game © 2020 Santiago Quiroga Torres (MIT).
