# Registro central en SharePoint, paso a paso

Con esto, cada persona entra con **correo y clave desde cualquier equipo** y sigue donde iba. Además, la firma ve en una sola lista quién ha jugado y cómo va.

```
Juego (GitHub Pages) ──► Flujo de Power Automate ──► Lista de SharePoint
   envía correo,            compara la clave,          una fila por persona:
   clave cifrada y          lee o guarda la fila       correo, clave cifrada,
   progreso                                            nombre y progreso
```

- **La clave nunca sale del navegador.** El juego envía un *verificador*: la clave pasada 150.000 veces por PBKDF2‑SHA‑256. Con él se comprueba la clave, pero no se puede leer.
- **Ningún token queda en el sitio.** La conexión con SharePoint vive dentro del flujo, en Microsoft 365.
- **Una lista, no un .txt.** Si varias personas reescriben el mismo archivo a la vez, se pisan. En la lista cada persona tiene su fila. Se puede exportar a Excel o CSV cuando se quiera.

Necesitas: un sitio de SharePoint donde puedas crear listas y una licencia de **Power Automate Premium**, porque el disparador HTTP es premium. Si al guardar el flujo te pide licencia, consulta con TI.

---

## Parte 1. Crear la lista en SharePoint (10 minutos)

1. Abre el sitio de SharePoint donde quieres guardar los datos (de preferencia uno de Analítica o de Capacitación, con acceso restringido).
2. **+ Nuevo → Lista → Lista en blanco**. Nombre: `LexBoss_Progreso`. **Crear**.
3. La columna **Título** ya existe: ahí irá el correo. No la borres.
4. Agrega estas columnas con **+ Agregar columna**:

   | Nombre (escríbelo exactamente así) | Tipo |
   |---|---|
   | `Verificador` | Una línea de texto |
   | `Nombre` | Una línea de texto |
   | `Actualizado` | Una línea de texto |
   | `Registro` | Varias líneas de texto |

5. En la columna **Registro**: clic en el encabezado → **Configuración de columna → Editar** → **Más opciones** → desactiva *Usar texto enriquecido* (debe quedar como texto sin formato) → **Guardar**.
6. Permisos: **Configuración (engranaje) → Configuración de la lista → Permisos de esta lista**. Deja solo a quien administra la capacitación. Los participantes **no** necesitan acceso: el flujo escribe por ellos.

## Parte 2. Crear el flujo en Power Automate (30 minutos)

Entra a https://make.powerautomate.com con tu cuenta de la firma.

### 2.1 Disparador

1. **+ Crear → Flujo de nube instantáneo**. Nombre: `LexBoss registro central`. Elige **Cuando se recibe una solicitud HTTP** → **Crear**.
2. Abre el disparador y en **Quién puede desencadenar el flujo** elige **Cualquiera**. (El navegador de cada participante llama sin iniciar sesión. La protección la da el verificador de la clave.)
3. Deja vacío el esquema JSON.

> Importante: los nombres de las acciones se usan en las fórmulas. Renombra cada acción exactamente como se indica: clic en los tres puntos de la acción → **Cambiar nombre**.

### 2.2 Leer lo que envía el juego

4. **+ → Redactar** (Data Operation → Compose). Renómbrala **`Datos`**.
   En *Entradas* abre el editor de expresiones (**fx**) y pega:
   ```
   json(triggerBody())
   ```
   Si al probar falla en este paso, cámbialo por:
   ```
   json(base64ToString(triggerBody()?['$content']))
   ```

### 2.3 Buscar a la persona en la lista

5. **+ → SharePoint → Obtener elementos**. Renómbrala **`Buscar`**.
   - Dirección del sitio: tu sitio.
   - Nombre de la lista: `LexBoss_Progreso`.
   - **Mostrar opciones avanzadas → Consulta de filtro**: escribe `Title eq '` , luego inserta con **fx** la expresión `outputs('Datos')?['correo']` y cierra con `'`. Debe verse así:
     ```
     Title eq '@{outputs('Datos')?['correo']}'
     ```
   - **Recuento superior**: `1`.

6. **+ → Redactar**. Renómbrala **`Fila`**. Entradas (con **fx**):
   ```
   first(body('Buscar')?['value'])
   ```

### 2.4 ¿La clave es incorrecta?

7. **+ → Control → Condición**. Renómbrala **`ClaveIncorrecta`**.
   - Lado izquierdo (con **fx**):
     ```
     and(not(equals(outputs('Fila'), null)), not(equals(outputs('Fila')?['Verificador'], outputs('Datos')?['verificador'])))
     ```
   - Operador: **es igual a**. Lado derecho (con **fx**): `true`

8. En la rama **Verdadero**: **+ → Solicitud → Respuesta** (*Response*).
   - Código de estado: `200`
   - Encabezados:
     - `Access-Control-Allow-Origin` → `https://jeissonescarraga.github.io`
     - `Content-Type` → `application/json`
   - Cuerpo:
     ```json
     {"ok": false, "error": "clave"}
     ```

### 2.5 Qué pide el juego: cargar, guardar o borrar

9. En la rama **Falso**: **+ → Control → Switch**. En *Activado* (con **fx**): `outputs('Datos')?['accion']`

10. **Caso 1**, en *Es igual a* escribe `cargar`. Dentro: **+ → Respuesta**, con los mismos encabezados del paso 8 y este cuerpo (con **fx**):
    ```
    if(equals(outputs('Fila'), null), json('{"ok":true,"registro":null}'), json(concat('{"ok":true,"registro":', outputs('Fila')?['Registro'], '}')))
    ```

11. **Agregar caso**, *Es igual a* `guardar`. Dentro:
    1. **+ → Control → Condición**. Izquierda (con **fx**): `equals(outputs('Fila'), null)`; operador **es igual a**; derecha (con **fx**): `true`.
    2. Rama **Verdadero** (persona nueva): **+ → SharePoint → Crear elemento**, en tu lista:
       - Título: `outputs('Datos')?['correo']`
       - Verificador: `outputs('Datos')?['verificador']`
       - Nombre: `outputs('Datos')?['registro']?['nombre']`
       - Actualizado: `outputs('Datos')?['registro']?['actualizado']`
       - Registro: `string(outputs('Datos')?['registro'])`

       (Escribe cada valor con **fx**.)
    3. Rama **Falso** (ya existía): **+ → SharePoint → Actualizar elemento**, en tu lista:
       - Id: `outputs('Fila')?['ID']`
       - Los mismos campos que en *Crear elemento*.
    4. Después de la condición, todavía dentro del caso: **+ → Respuesta** con los encabezados del paso 8 y el cuerpo `{"ok": true}`.

12. **Agregar caso**, *Es igual a* `borrar`. Dentro:
    1. **Condición**: izquierda `equals(outputs('Fila'), null)`, **es igual a**, derecha `false`.
    2. Rama **Verdadero**: **+ → SharePoint → Eliminar elemento**, en tu lista, Id: `outputs('Fila')?['ID']`.
    3. Después de la condición: **Respuesta** con los encabezados del paso 8 y el cuerpo `{"ok": true}`.

13. **Predeterminado** del Switch: **Respuesta** con código `400`, los mismos encabezados y el cuerpo `{"ok": false, "error": "accion"}`.

14. **Guardar**. Vuelve a abrir el disparador: ahora muestra la **URL HTTP POST**. Cópiala.

## Parte 3. Conectar el juego

Mándame la URL y la pongo en `web/config.js`. Se publica sola con un PR, igual que el resto. Si prefieres hacerlo tú, edita el archivo en GitHub:

```js
window.LEXBOSS_CONFIG = {
  registroCentral: {
    url: "PEGA_AQUÍ_LA_URL_DEL_FLUJO"
  }
};
```

En cuanto se publique, el aviso de privacidad de la pantalla de inicio dice solo que los datos también se guardan en el registro central de la firma.

## Parte 4. Probar

1. Abre el juego y entra con un correo de prueba y una clave de prueba. Responde dos preguntas.
2. En SharePoint debe aparecer una fila con ese correo.
3. Abre el juego en **otro navegador** (o en una ventana privada) y entra con el mismo correo y clave: debe seguir donde ibas.
4. Entra con la clave equivocada: debe decir *«La clave no coincide con la registrada en el registro central»*.
5. En Power Automate → **Historial de ejecuciones** se ve cada llamada. Si algo falla, ahí se ve en qué paso.
6. Borra la fila de prueba.

## Cómo ver a los participantes

Abre la lista `LexBoss_Progreso`: cada fila es una persona, con su correo, su nombre y su última actualización. **Exportar → Exportar a CSV o Excel** para trabajarla. La columna *Registro* trae el detalle en JSON:

- `progreso.preguntas`: por cada pregunta, los intentos, aciertos, fallos y la última respuesta (`ok` o `error`).
- `progreso.modulos`: los jefes vencidos.

También se puede conectar a Power BI.

## Si algo falla

| Síntoma | Causa probable y solución |
|---|---|
| El juego dice «el registro central no respondió» | Falta el encabezado `Access-Control-Allow-Origin` en alguna *Respuesta*, o el disparador no está en **Cualquiera**. Revísalo en el historial de ejecuciones. |
| El flujo falla en `Datos` | Usa la fórmula alternativa del paso 4. |
| Falla en *Crear elemento* o *Actualizar elemento* | Los nombres de las columnas no coinciden con los de la Parte 1, o *Registro* tiene texto enriquecido activado. |
| Cada respuesta crea una fila nueva | La consulta de filtro del paso 5 está mal escrita: revisa las comillas simples. |
| Pide licencia al guardar | El disparador HTTP es premium: consulta con TI. |

## Seguridad: qué queda expuesto

- La URL del flujo lleva una firma (`sig=`) y queda visible en el sitio público. Con ella, nadie puede leer ni cambiar el avance de otra persona sin su clave, pero sí podría crear filas falsas o hacer muchas llamadas. Si se abusa, en el disparador se regenera la URL y se actualiza `config.js`.
- Si la firma necesita más control, la alternativa es publicar el juego en un sitio interno o poner una API con inicio de sesión de Entra ID delante del flujo.
- Antes de activarlo, conviene validarlo con el área de protección de datos: se tratan nombre, correo y resultados de la capacitación.
- Cada respuesta del juego es una ejecución del flujo (cerca de 80 por persona para todo el juego). Revisa que quepa en el límite diario de la licencia si van a jugar muchas personas el mismo día.
