# Registro central en SharePoint, paso a paso

Con esto, cada persona entra con **correo y clave desde cualquier equipo** y sigue donde iba. Además, la firma ve en una sola lista quién ha jugado y cómo va.

```
Juego (GitHub Pages) ──► Flujo de Power Automate ──► Lista de SharePoint
   envía correo,            valida, compara la         una fila por persona:
   clave cifrada y          clave, bloquea abusos,     correo, clave cifrada,
   progreso                 lee o guarda la fila       nombre y progreso
```

- **La clave nunca sale del navegador.** El juego envía un *verificador*: la clave pasada 150.000 veces por PBKDF2‑SHA‑256. Con él se comprueba la clave, pero no se puede leer.
- **Ningún token queda en el sitio.** La conexión con SharePoint vive dentro del flujo, en Microsoft 365. La URL del flujo solo puede hacer lo que el flujo hace sobre esta lista: no da acceso al resto de SharePoint.
- **Una lista, no un .txt.** Si varias personas reescriben el mismo archivo a la vez, se pisan. En la lista cada persona tiene su fila, y se puede exportar a Excel o CSV.
- **Protecciones incluidas:** validación de lo que llega (evita que alguien manipule la búsqueda), bloqueo de 15 minutos tras 5 claves equivocadas, límite de tamaño y nombres saneados para Excel.

Necesitas: un sitio de SharePoint donde puedas crear listas y una licencia de **Power Automate Premium**, porque el disparador HTTP es premium. Si al guardar el flujo te pide licencia, consulta con TI.

---

## Parte 1. Crear la lista en SharePoint (10 minutos)

1. Abre el sitio de SharePoint donde quieres guardar los datos (de preferencia uno de Analítica o de Capacitación, con acceso restringido).
2. **+ Nuevo → Lista → Lista en blanco**. Nombre: `LexBoss_Progreso`. **Crear**.
3. La columna **Título** ya existe: ahí irá el correo. No la borres.
4. Agrega estas columnas con **+ Agregar columna** (escribe los nombres exactamente así):

   | Nombre | Tipo | Para qué |
   |---|---|---|
   | `Verificador` | Una línea de texto | clave cifrada |
   | `Nombre` | Una línea de texto | nombre del participante |
   | `Actualizado` | Una línea de texto | fecha del último avance |
   | `Registro` | Varias líneas de texto | progreso en JSON |
   | `Fallos` | Número | claves equivocadas seguidas |
   | `BloqueadoHasta` | Una línea de texto | fin del bloqueo, si lo hay |

5. En la columna **Registro**: clic en el encabezado → **Configuración de columna → Editar** → **Más opciones** → desactiva *Usar texto enriquecido* → **Guardar**.
6. Permisos: **Configuración (engranaje) → Configuración de la lista → Permisos de esta lista**. Deja solo a quien administra la capacitación. Los participantes **no** necesitan acceso: el flujo escribe por ellos.

## Parte 2. Crear el flujo en Power Automate (40 minutos)

Entra a https://make.powerautomate.com con tu cuenta de la firma.

**Tres reglas para todo el flujo:**

- **Renombra cada acción exactamente como se indica** (tres puntos de la acción → **Cambiar nombre**): las fórmulas usan esos nombres.
- Todo lo que aparece en un bloque de código se pega con el editor de expresiones (**fx**), salvo los cuerpos JSON de las respuestas, que se pegan como texto.
- **Respuesta estándar:** cada vez que la guía dice «Respuesta», es la acción **Solicitud → Respuesta** con:
  - Código de estado: `200` (salvo que se indique otro).
  - Encabezados: `Access-Control-Allow-Origin` = `https://jeissonescarraga.github.io` y `Content-Type` = `application/json`.
  - El cuerpo que diga cada paso.

  Cuando tengas la primera, usa **Copiar en mi portapapeles** en sus tres puntos y pégala donde haga falta otra.

### 2.1 Disparador

1. **+ Crear → Flujo de nube instantáneo**. Nombre: `LexBoss registro central`. Elige **Cuando se recibe una solicitud HTTP** → **Crear**.
2. En el disparador, **Quién puede desencadenar el flujo**: **Cualquiera**. (El navegador de cada participante llama sin iniciar sesión; la protección la dan la clave y los pasos siguientes.) Deja vacío el esquema JSON.

### 2.2 Leer lo que envía el juego

3. **+ → Redactar** (Data Operation → Compose). Renómbrala **`Datos`**. Entradas:
   ```
   json(triggerBody())
   ```
   Si al probar falla en este paso, cámbialo por:
   ```
   json(base64ToString(triggerBody()?['$content']))
   ```

### 2.3 Validar antes de tocar la lista

Este paso impide que alguien envíe un «correo» con comillas o trucos para manipular la búsqueda y adivinar datos de otras personas.

4. **+ → Control → Condición**. Renómbrala **`Valido`**. Lado izquierdo:
   ```
   and(equals(string(outputs('Datos')?['correo']), toLower(trim(string(outputs('Datos')?['correo'])))), lessOrEquals(length(string(outputs('Datos')?['correo'])), 120), contains(string(outputs('Datos')?['correo']), '@'), not(contains(string(outputs('Datos')?['correo']), '''')), not(contains(string(outputs('Datos')?['correo']), ' ')), equals(length(string(outputs('Datos')?['verificador'])), 64), contains(createArray('cargar', 'guardar', 'borrar'), outputs('Datos')?['accion']), or(not(equals(outputs('Datos')?['accion'], 'guardar')), and(not(equals(outputs('Datos')?['registro'], null)), lessOrEquals(length(string(outputs('Datos')?['registro'])), 30000))))
   ```
   Operador **es igual a**; lado derecho: `true`.

   Qué revisa: el correo viene en minúsculas, sin espacios ni comillas, tiene @ y no pasa de 120 caracteres; el verificador mide 64; la acción es una de las tres; y si se guarda, el progreso existe y no pasa de 30.000 caracteres.

5. En la rama **Falso**:
   - **Respuesta** con código `400` y cuerpo `{"ok": false, "error": "invalido"}`.
   - Debajo: **+ → Control → Finalizar** (*Terminate*), estado **Correcto**.

   La rama **Verdadero** queda vacía: el flujo sigue debajo de la condición.

### 2.4 Buscar a la persona

6. **Debajo de la condición `Valido`** (no dentro): **+ → SharePoint → Obtener elementos**. Renómbrala **`Buscar`**.
   - Dirección del sitio: tu sitio. Nombre de la lista: `LexBoss_Progreso`.
   - **Consulta de filtro**: escribe `Title eq '`, inserta con **fx** la expresión de abajo y cierra con `'`:
     ```
     replace(outputs('Datos')?['correo'], '''', '''''')
     ```
     (Escapa las comillas: es una segunda barrera además de la validación.)
   - **Recuento superior**: `1`.

7. **+ → Redactar**. Renómbrala **`Fila`**. Entradas:
   ```
   first(body('Buscar')?['value'])
   ```

### 2.5 ¿Está bloqueado?

8. **+ → Condición**. Renómbrala **`Bloqueado`**. Lado izquierdo:
   ```
   greater(ticks(if(empty(outputs('Fila')?['BloqueadoHasta']), '2000-01-01T00:00:00Z', outputs('Fila')?['BloqueadoHasta'])), ticks(utcNow()))
   ```
   **es igual a** `true`.

9. Rama **Verdadero**:
   - **Respuesta** con cuerpo `{"ok": false, "error": "bloqueado"}`.
   - **Finalizar** (Correcto).

### 2.6 ¿La clave es incorrecta?

10. Debajo de `Bloqueado`: **+ → Redactar**. Renómbrala **`FallosNuevos`**. Entradas:
    ```
    add(coalesce(outputs('Fila')?['Fallos'], 0), 1)
    ```

11. **+ → Condición**. Renómbrala **`ClaveIncorrecta`**. Lado izquierdo:
    ```
    and(not(equals(outputs('Fila'), null)), not(equals(outputs('Fila')?['Verificador'], outputs('Datos')?['verificador'])))
    ```
    **es igual a** `true`.

12. Rama **Verdadero**: suma el fallo y, al quinto, bloquea 15 minutos.
    1. **+ → SharePoint → Actualizar elemento**, en tu lista:
       - Id:
         ```
         outputs('Fila')?['ID']
         ```
       - Título:
         ```
         outputs('Fila')?['Title']
         ```
       - Fallos:
         ```
         if(greaterOrEquals(outputs('FallosNuevos'), 5), 0, outputs('FallosNuevos'))
         ```
       - BloqueadoHasta:
         ```
         if(greaterOrEquals(outputs('FallosNuevos'), 5), addMinutes(utcNow(), 15), '')
         ```
    2. **Respuesta** con cuerpo `{"ok": false, "error": "clave"}`.
    3. **Finalizar** (Correcto).

### 2.7 Cargar, guardar o borrar

13. Debajo de `ClaveIncorrecta`: **+ → Control → Switch**. En *Activado*:
    ```
    outputs('Datos')?['accion']
    ```

14. **Caso** `cargar`: **Respuesta** cuyo cuerpo es esta expresión:
    ```
    if(equals(outputs('Fila'), null), json('{"ok":true,"registro":null}'), json(concat('{"ok":true,"registro":', outputs('Fila')?['Registro'], '}')))
    ```

15. **Agregar caso** `guardar`:
    1. **+ → Redactar**. Renómbrala **`NombreSeguro`** (recorta a 80 caracteres y neutraliza fórmulas de Excel). Entradas:
       ```
       if(or(startsWith(take(string(outputs('Datos')?['registro']?['nombre']), 80), '='), startsWith(take(string(outputs('Datos')?['registro']?['nombre']), 80), '+'), startsWith(take(string(outputs('Datos')?['registro']?['nombre']), 80), '-'), startsWith(take(string(outputs('Datos')?['registro']?['nombre']), 80), '@')), concat('''', take(string(outputs('Datos')?['registro']?['nombre']), 80)), take(string(outputs('Datos')?['registro']?['nombre']), 80))
       ```
    2. **Condición**: izquierda `equals(outputs('Fila'), null)`, **es igual a**, derecha `true`.
    3. Rama **Verdadero** (persona nueva): **SharePoint → Crear elemento**, en tu lista:
       - Título: `outputs('Datos')?['correo']`
       - Verificador: `outputs('Datos')?['verificador']`
       - Nombre: `outputs('NombreSeguro')`
       - Actualizado: `outputs('Datos')?['registro']?['actualizado']`
       - Registro: `string(outputs('Datos')?['registro'])`
       - Fallos: `0`
    4. Rama **Falso** (ya existía): **SharePoint → Actualizar elemento**, en tu lista:
       - Id: `outputs('Fila')?['ID']`
       - Los mismos campos y valores que en *Crear elemento*. Fallos en `0` reinicia el contador cuando la persona entra bien.
    5. Debajo de la condición, dentro del caso: **Respuesta** con cuerpo `{"ok": true}`.

16. **Agregar caso** `borrar`:
    1. **Condición**: izquierda `equals(outputs('Fila'), null)`, **es igual a**, derecha `false`.
    2. Rama **Verdadero**: **SharePoint → Eliminar elemento**, en tu lista, Id: `outputs('Fila')?['ID']`.
    3. Debajo de la condición: **Respuesta** con cuerpo `{"ok": true}`.

17. **Guardar**. Abre de nuevo el disparador y copia la **URL HTTP POST**.

## Parte 3. Conectar el juego

Mándame la URL y la pongo en `web/config.js`; se publica sola con un PR. Si prefieres hacerlo tú, edita el archivo en GitHub:

```js
window.LEXBOSS_CONFIG = {
  registroCentral: {
    url: "PEGA_AQUÍ_LA_URL_DEL_FLUJO"
  }
};
```

Al activarse, el aviso de privacidad de la pantalla de inicio dice solo que los datos también se guardan en el registro central de la firma.

## Parte 4. Probar

1. Abre el juego y entra con un correo de prueba y una clave de prueba (10 caracteres o más). Responde dos preguntas.
2. En SharePoint debe aparecer una fila con ese correo.
3. Abre el juego en **otro navegador** (o en una ventana privada) y entra con el mismo correo y clave: debe seguir donde ibas.
4. Equivócate de clave 5 veces seguidas. La sexta vez (aunque pongas la buena) debe decir que el registro está bloqueado. A los 15 minutos debe dejarte entrar.
5. Revisa que la validación funcione. Puedes pedirme que haga esta prueba por ti cuando el flujo exista.
   - Envía al flujo un correo con comillas, por ejemplo `x' or Title ne '@a.co`.
   - Debe responder `invalido` y no tocar la lista.
6. En Power Automate → **Historial de ejecuciones** se ve cada llamada. Si algo falla, ahí se ve en qué paso.
7. Borra las filas de prueba.

## Cómo ver a los participantes

Abre la lista `LexBoss_Progreso`: cada fila es una persona, con su correo, su nombre y su última actualización. **Exportar → Exportar a CSV o Excel** para trabajarla. La columna *Registro* trae el detalle en JSON:

- `progreso.preguntas`: por cada pregunta, los intentos, aciertos, fallos y la última respuesta (`ok` o `error`).
- `progreso.modulos`: los jefes vencidos.

También se puede conectar a Power BI.

## Si algo falla

| Síntoma | Causa probable y solución |
|---|---|
| El juego dice «el registro central no respondió» | A alguna *Respuesta* le falta el encabezado `Access-Control-Allow-Origin`, o el disparador no está en **Cualquiera**. Revísalo en el historial. |
| El flujo falla en `Datos` | Usa la fórmula alternativa del paso 3. |
| Todo responde `invalido` | Revisa la fórmula de `Valido` (paso 4): debe quedar en una sola línea y compararse con `true`. |
| Falla en *Crear* o *Actualizar elemento* | Los nombres de las columnas no coinciden con los de la Parte 1, o *Registro* tiene texto enriquecido activado. |
| Cada respuesta crea una fila nueva | La consulta de filtro del paso 6 está mal escrita: revisa las comillas simples. |
| Nadie puede entrar: «bloqueado» | Borra el valor de *BloqueadoHasta* en la fila de esa persona. |
| Pide licencia al guardar | El disparador HTTP es premium: consulta con TI. |

## Seguridad: qué queda expuesto y qué no

**No queda expuesto:** el resto de SharePoint, la conexión del flujo ni la lista (que solo ven quienes tienen permiso). Tampoco hay tokens ni claves en el repo ni en el sitio.

**Riesgos que quedan, ya acotados:**

| Riesgo | Cómo queda |
|---|---|
| Manipular la búsqueda para adivinar datos de otros | Bloqueado por la validación (paso 4) y el escape de comillas (paso 6). |
| Probar claves sin límite | Mínimo 10 caracteres en el juego; 5 fallos bloquean 15 minutos. |
| Saber si un correo ya jugó | Sigue siendo posible (la respuesta distingue «clave incorrecta» de «no existe»). Es una fuga menor, frenada por el bloqueo. |
| Alguien registra antes el correo de otra persona | Posible, porque no se verifica el correo. Si pasa, borra esa fila y la persona se registra de nuevo. |
| Filas basura o muchas llamadas | Tamaño máximo validado. Si hay abuso, regenera la URL del disparador y actualiza `config.js`. |
| Fórmulas al exportar a Excel | El nombre se neutraliza en `NombreSeguro`. |

- La URL del flujo lleva una firma (`sig=`) y es visible en el sitio público. Si se filtra fuera de contexto o hay abuso, se regenera.
- Si la firma necesita eliminar del todo esa exposición, la alternativa es publicar el juego en un sitio interno o exigir inicio de sesión con Entra ID.
- Antes de activarlo, valídalo con el área de protección de datos: se tratan nombre, correo y resultados de la capacitación.
- Cada respuesta del juego es una ejecución del flujo (cerca de 80 por persona para todo el juego). Revisa que quepa en el límite diario de la licencia si van a jugar muchas personas el mismo día.
