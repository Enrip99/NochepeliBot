# NochepeliBot

Bot para discord que permite hacer listas de películas *(u otros medios)* pendientes para grupos.

Permite mantener una lista global, añadir enlaces de descarga asociados a cada película al alcance de todos y listar los miembros del grupo que muestren interés por la película.

## SETUP

Ejecuta el comando `scripts/init.sh` en tu terminal dentro de la carpeta en que hayas descargado el proyecto.

Crea un directorio llamado `data` en la raíz del proyecto. Mueve el archivo `config.json`.

Edita el archivo `config.json` y rellena los campos con las IDs requeridas.
 - `owners` son los [identificadores de los usuarios](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) que podrán apagar el bot con el comando `shut off`. Puedes añadir tantos como quieras, separados  por comas.
 - `token` es el token de tu bot. Puedes obtenerlo en el [portal de desarrolladores de Discord](https://discord.com/developers/).
 - `clientId` es la ID de usuario de tu bot. Puedes obtenerla en el [portal de desarrolladores de Discord](https://discord.com/de
 - `guildId` es la ID del servidor donde utilizarás el bot. Si quieres utilizarlo en más de un servidor, cambia el código de `deploy-commands.js` para que despliegue los comandos globalmente. Puedes ver cómo hacerlo en [el siguiente tutorial](https://discordjs.guide/interactions/slash-commands.html#global-commands).
 - `channelId` es la ID del canal en que correrás el bot. El bot está diseñado para solo funcionar en un único canal para evitar saturar otros.


La primera vez que utilices el bot, ejecuta `scripts/register-commands.sh` para que Discord sepa cuáles son los comandos del bot. Cada vez que añadas un comando nuevo o cambies los parámetros de un comando existente, ejecuta dicho script de nuevo.

Puedes lanzar el bot ejecutando `scripts/launch.sh`. Para compilar el bot y producir un archivo ejecutable, ejecuta `scripts/build.sh`. Se puede cambiar el sistema operativo de destino en las constantes del propio script.

`https://github.com/Enrip99/NochepeliBot`
