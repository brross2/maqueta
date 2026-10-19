# Maqueta — cómo publicarla y conectarla con Google Drive

Esta carpeta es el sitio completo. No necesita servidor: son archivos estáticos.

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app entera |
| `sw.js` | Guarda la app para abrirla sin conexión |
| `manifest.webmanifest` + íconos | Permiten instalarla como app |
| `.nojekyll` | Le dice a GitHub que no procese los archivos |

## 1. Publicarla en GitHub Pages (gratis)

1. Creá una cuenta en github.com si no tenés.
2. **New repository** → nombre `maqueta` → **Public** → Create.
3. En el repositorio: **Add file → Upload files**. Arrastrá **todo el contenido de esta carpeta** (no la carpeta, sus archivos), incluido `.nojekyll` si tu sistema lo muestra. **Commit changes**.
4. **Settings → Pages**. En *Build and deployment* elegí **Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guardá.
5. En uno o dos minutos aparece la dirección: `https://TU-USUARIO.github.io/maqueta/`. Esa es tu app.

**Instalarla:** en Chrome o Edge, menú → *Instalar Maqueta*. En iPhone, Safari → Compartir → *Agregar a pantalla de inicio*. La primera vez que se abre necesita internet (descarga Three.js); después abre sin conexión.

**Actualizarla:** cuando haya una versión nueva, subí de nuevo **todos** los archivos (reemplazan a los anteriores). `index.html` y `sw.js` van siempre juntos.

## 2. Conectar con Google Drive

Hace falta un *Client ID* propio. Es gratis, se hace una sola vez y no es un secreto: solo dice a Google desde qué sitio puede pedir permiso la app. Los nombres del menú de Google cambian de tanto en tanto; si algo no coincide, buscá el equivalente.

1. Entrá a **console.cloud.google.com** con tu cuenta y creá un proyecto nuevo (por ejemplo «Maqueta»).
2. **APIs y servicios → Biblioteca** → buscá **Google Drive API** → **Habilitar**.
3. **Pantalla de consentimiento de OAuth** (en la versión nueva: *Google Auth Platform*):
   - Tipo de usuario: **Externo**.
   - Nombre de la app: «Maqueta». Tu correo como contacto.
   - En *Acceso a los datos* (scopes) agregá **`https://www.googleapis.com/auth/drive.file`**. Es el permiso más acotado: la app solo ve los archivos que ella misma crea.
   - Mientras la app esté en modo *Prueba*, solo pueden conectarse las cuentas que agregues en **Usuarios de prueba**: agregá la tuya. Si preferís no tener esa lista, usá **Publicar la app**. Con este único permiso Google normalmente no pide verificación; si la pide en tu caso, seguí lo que indique.
4. **Credenciales → Crear credenciales → ID de cliente de OAuth** (en la versión nueva: *Clientes → Crear cliente*):
   - Tipo: **Aplicación web**.
   - **Orígenes autorizados de JavaScript**: `https://TU-USUARIO.github.io` (solo eso: sin barra final y sin `/maqueta`). Para probar en tu compu podés agregar también `http://localhost:8000`.
   - **No** hace falta ningún URI de redireccionamiento.
5. Copiá el **ID de cliente** (termina en `.apps.googleusercontent.com`).
6. En la app: **Proyecto → Google Drive** → pegá el ID → **Conectar** → elegí tu cuenta y aceptá.
7. Activá **«Guardar este proyecto en Drive»**. A partir de ahí se sube solo, unos segundos después de cada cambio.

Si querés que el ID venga ya puesto, abrí `index.html` con un editor de texto y completá la línea `const DRIVE_CLIENT_ID = '';` con el tuyo entre las comillas.

## 3. Cómo funciona

- En tu Drive aparece una carpeta **Maqueta** con una subcarpeta por proyecto. Adentro hay un archivo por cada archivo del proyecto (la escena de cada nivel, el terreno, las mallas, las texturas) y un `project.json`.
- Siempre se suben primero los archivos que cambiaron y **al final** `project.json`. Si se corta la conexión a mitad, Drive queda con el estado anterior completo, nunca a medias, y se retoma solo.
- Todo lo que baja de Drive se verifica archivo por archivo antes de tocar lo local. Si algo llega dañado, no se aplica.
- **Si cambia en dos lugares** (por ejemplo, editaste en el celular y en la compu sin sincronizar), la app te pregunta cuál conservar. Nunca pisa en silencio.
- **Otro dispositivo:** conectá con la misma cuenta y tocá **Traer proyectos de Drive**.
- La app guarda siempre primero en tu navegador; Drive es una segunda copia. Si no hay conexión, sigue funcionando y sube cuando vuelva.

## 4. Límites y problemas frecuentes

- **Cada hora hay que volver a conectar.** Google da permisos de una hora y la app no los renueva sola sin abrir una ventana. Cuando pase, el chip de Drive dice *reconectar*; un toque y listo. Mientras tanto no se pierde nada: queda pendiente y se sube después.
- Un archivo del proyecto no puede pasar de **4,8 MB** (es el límite de la subida simple). Es mucho más de lo que ocupa una escena de blockout normal.
- Funciona solo desde `https` (como GitHub Pages) o `localhost`. En la versión que corre dentro del chat no, porque ese entorno bloquea las conexiones a otros sitios.
- **Error 400: origin_mismatch** → el origen del paso 4 no coincide exactamente con la dirección de tu sitio (revisá `https`, mayúsculas, barra final). Los cambios de Google pueden tardar unos minutos.
- **Error 403: access_denied** → tu cuenta no está en *Usuarios de prueba* (paso 3).
- **No se abre la ventana de Google** → permití las ventanas emergentes para tu sitio.
- Los datos van de tu navegador directo a tu Drive. No hay ningún servidor intermedio.
