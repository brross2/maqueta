# Maqueta — cómo publicarla y conectarla con Google Drive

Esta carpeta es el sitio completo. No necesita servidor: son archivos estáticos.

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app entera |
| `config.js` | **Lo único que hay que editar:** el ID de cliente de Google (ver el paso 2) |
| `sw.js` | Guarda la app para abrirla sin conexión |
| `manifest.webmanifest` + íconos | Permiten instalarla como app |
| `.nojekyll` | Le dice a GitHub que no procese los archivos |

## Cómo se usa (lo que ve quien entra)

1. Abre la página y un mensaje le explica que, para guardar y versionar sus proyectos, tiene que enlazar su Google Drive. Toca **Enlazar con Google Drive**, elige su cuenta y acepta. Eso es todo: no hay que buscar ni pegar nada.
2. Si prefiere no enlazar, puede **Trabajar sin guardar** (modo efímero): el trabajo vive solo en la memoria de la página y se pierde al cerrarla. Más tarde puede tocar «Efímero», en la barra de arriba, y enlazar: lo que hizo se guarda tal cual.
3. Después ve la gestión de proyectos, elige el nivel y empieza a trabajar.

## 1. Publicarla en GitHub Pages (gratis)

1. Creá una cuenta en github.com si no tenés.
2. **New repository** → nombre `maqueta` → **Public** → Create.
3. En el repositorio: **Add file → Upload files**. Arrastrá **todo el contenido de esta carpeta** (sus archivos, no la carpeta), incluido `.nojekyll` si tu sistema lo muestra. **Commit changes**.
4. **Settings → Pages**. En *Build and deployment* elegí **Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guardá.
5. En uno o dos minutos aparece la dirección: `https://TU-USUARIO.github.io/maqueta/`. Esa es tu app.

**Instalarla:** en Chrome o Edge, menú → *Instalar Maqueta*. En iPhone, Safari → Compartir → *Agregar a pantalla de inicio*. La primera vez necesita internet (descarga Three.js); después abre sin conexión.

**Actualizarla:** cuando haya una versión nueva, subí de nuevo los archivos que cambiaron (`index.html` y `sw.js` van siempre juntos). **No hace falta volver a subir `config.js`** si ya lo editaste.

## 2. Conseguir el ID de cliente de Google (una sola vez, lo hace quien publica)

El ID de cliente es gratis y no es un secreto: solo le dice a Google desde qué sitio puede pedir permiso la app. Los nombres del menú de Google cambian de tanto en tanto; si algo no coincide, buscá el equivalente.

1. Entrá a **console.cloud.google.com** con tu cuenta y creá un proyecto nuevo (por ejemplo «Maqueta»).
2. **APIs y servicios → Biblioteca** → buscá **Google Drive API** → **Habilitar**.
3. **Pantalla de consentimiento de OAuth** (en la versión nueva: *Google Auth Platform*):
   - Tipo de usuario: **Externo**.
   - Nombre de la app: «Maqueta». Tu correo como contacto.
   - En *Acceso a los datos* (scopes) agregá **`https://www.googleapis.com/auth/drive.file`**. Es el permiso más acotado: la app solo ve los archivos que ella misma crea.
   - Mientras la app esté en modo *Prueba*, solo pueden conectarse las cuentas que agregues en **Usuarios de prueba**. Para que entre cualquiera, usá **Publicar la app**. Con este único permiso Google normalmente no pide verificación; si la pide en tu caso, seguí lo que indique.
4. **Credenciales → Crear credenciales → ID de cliente de OAuth** (en la versión nueva: *Clientes → Crear cliente*):
   - Tipo: **Aplicación web**.
   - **Orígenes autorizados de JavaScript**: `https://TU-USUARIO.github.io` (solo eso: sin barra final y sin `/maqueta`). Para probar en tu compu podés agregar también `http://localhost:8000`.
   - **No** hace falta ningún URI de redireccionamiento.
5. Copiá el **ID de cliente** (termina en `.apps.googleusercontent.com`).
6. En tu repositorio de GitHub abrí `config.js` (lápiz para editar) y pegá el ID entre las comillas:
   `window.MAQUETA = { driveClientId: "1234567890-abc.apps.googleusercontent.com" };`
   Commit. En un minuto, quien entre solo ve el botón de enlazar: nadie tiene que buscar ni pegar nada.

Si no lo configurás, el botón de Drive queda apagado y la entrada lo avisa; el modo sin guardar sigue funcionando.

## 3. Cómo funciona el guardado

- En tu Drive aparece una carpeta **Maqueta** con una subcarpeta por proyecto. Adentro hay un archivo por cada archivo del proyecto (la escena de cada nivel, el terreno, las mallas, las texturas), un `project.json` y una carpeta **Versiones**.
- **Todos** los proyectos se guardan en Drive una vez enlazado. Se sube solo, unos segundos después de cada cambio.
- Siempre se suben primero los archivos que cambiaron y **al final** `project.json`. Si se corta la conexión a mitad, Drive queda con el estado anterior completo, nunca a medias, y se retoma solo.
- **Versiones:** cada tanto (cada 30 minutos de trabajo) queda una copia completa del proyecto en `Versiones` (se conservan las últimas 20 automáticas). También podés guardar una con nombre en *Archivo › Guardar una versión*, y volver a cualquiera en *Archivo › Versiones › Restaurar* (antes de restaurar se guarda lo que había, así se puede deshacer).
- Todo lo que baja de Drive se verifica archivo por archivo antes de tocar lo local. Si algo llega dañado, no se aplica.
- **Si cambia en dos lugares** (por ejemplo, editaste en el celular y en la compu sin sincronizar), la app te pregunta cuál conservar. Nunca pisa en silencio.
- **Otro dispositivo:** al entrar y enlazar con la misma cuenta, se traen solos los proyectos de Drive.
- Si borrás un proyecto en la app, su carpeta de Drive va a la **papelera de Drive** (se puede recuperar desde ahí).
- La app guarda siempre primero en tu navegador; Drive es la copia que viaja y se versiona. Sin conexión sigue funcionando y sube cuando vuelva. Al reabrir sin conexión, la pantalla de entrada ofrece «Abrir la copia de este dispositivo».

## 4. Límites y problemas frecuentes

- **Cada hora hay que volver a conectar.** Google da permisos de una hora y la app no los renueva sola sin abrir una ventana. Cuando pase, la barra dice *Reconectar*; un toque y listo. Mientras tanto no se pierde nada: queda pendiente y se sube después. Al volver a abrir la app, «Continuar con Google» lo resuelve en un toque.
- Un archivo del proyecto no puede pasar de **4,8 MB** (es el límite de la subida simple). Es mucho más de lo que ocupa una escena de blockout normal.
- Funciona solo desde `https` (como GitHub Pages) o `localhost`. En la versión que corre dentro del chat no, porque ese entorno bloquea las conexiones a otros sitios; ahí solo sirve el modo efímero.
- **Error 400: origin_mismatch** → el origen del paso 2.4 no coincide exactamente con la dirección de tu sitio (revisá `https`, mayúsculas, barra final). Los cambios de Google pueden tardar unos minutos.
- **Error 403: access_denied** → tu cuenta no está en *Usuarios de prueba* (paso 2.3).
- **No se abre la ventana de Google** → permití las ventanas emergentes para tu sitio.
- Los datos van de tu navegador directo a tu Drive. No hay ningún servidor intermedio.
