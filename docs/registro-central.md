# Registro central del progreso (opcional)

Sin configuración, cada persona guarda su avance en su propio navegador y lo lleva a otro equipo con el **código de continuación**. Si la firma quiere ver en un solo lugar quién jugó, qué aprendió y qué le falta, y que cada persona retome desde cualquier equipo solo con correo y clave, se activa este registro central.

La opción recomendada usa infraestructura que la firma ya tiene: **Power Automate + una lista de SharePoint** (Microsoft 365).

## 1. Lista de SharePoint

Crear una lista `LexBoss_Progreso` con estas columnas:

| Columna | Tipo | Uso |
|---------|------|-----|
| Title | Una línea de texto | correo (en minúsculas) |
| Verificador | Una línea de texto | verificador PBKDF2 de la clave (no es la clave) |
| Nombre | Una línea de texto | nombre del participante |
| Actualizado | Una línea de texto | fecha ISO de la última actualización |
| Registro | Varias líneas de texto (texto sin formato) | JSON con el progreso |

Dar acceso a la lista solo a quien administra la capacitación.

## 2. Flujo de Power Automate

Disparador: **Cuando se recibe una solicitud HTTP** (cualquiera puede llamarla; por eso se valida el verificador). El juego envía el cuerpo como `text/plain` para evitar la consulta previa CORS, así que en el flujo se lee con `json(triggerBody())`. Su contenido es:

```json
{ "accion": "cargar | guardar | borrar", "correo": "persona@firma.com", "verificador": "hex de 64 caracteres", "registro": { "...": "solo en guardar" } }
```

Lógica del flujo:

1. Buscar en la lista el elemento con `Title = correo`.
2. Si existe y su `Verificador` es distinto del recibido → responder `{"ok": false, "error": "clave"}`.
3. Según `accion`:
   - `cargar` → responder `{"ok": true, "registro": <JSON de la columna Registro o null>}`.
   - `guardar` → crear o actualizar el elemento (Title, Verificador, Nombre, Actualizado, Registro) y responder `{"ok": true}`.
   - `borrar` → eliminar el elemento y responder `{"ok": true}`.
4. Agregar a la respuesta el encabezado `Access-Control-Allow-Origin: https://jeissonescarraga.github.io` (para que el navegador acepte la respuesta) y `Content-Type: application/json`.

El juego nunca envía la clave; solo el verificador. Si el flujo no responde, el juego sigue guardando en el navegador y avisa.

## 3. Activarlo

Poner la URL del flujo en `web/config.js`:

```js
window.LEXBOSS_CONFIG = { registroCentral: { url: "https://..." } };
```

**Ojo:** la URL de un disparador HTTP de Power Automate lleva una firma (`sig=`) que permite invocarlo. Como el sitio de Pages es público, esa URL queda visible. El verificador impide que alguien lea o cambie el avance de otra persona sin su clave, pero cualquiera podría crear registros falsos. Si eso no es aceptable para la firma, hay dos alternativas:

- publicar el juego en un sitio interno (SharePoint o un servidor de la firma) en lugar de Pages, o
- poner delante una API corporativa con autenticación de Entra ID.

Antes de activarlo, actualizar el aviso de privacidad de la pantalla de inicio (el juego lo cambia solo para decir que también se guarda en el registro central) y validar con el área de protección de datos.

## 4. Reporte consolidado

Con la lista llena, el consolidado se puede ver en SharePoint, exportar a Excel o conectar a Power BI (columna `Registro` en JSON: `progreso.preguntas` trae por pregunta los intentos, aciertos, fallos y la última respuesta; `progreso.modulos` trae los jefes vencidos).
