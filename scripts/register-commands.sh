#!/bin/sh
# PARÁMETROS:
# global: Registrar globalmente los comandos (por defecto, los registra solo para pandas).
# delete: De-registrar los comandos, de pandas o globales (según si especificas la opción anterior). No los borra del proyecto.

if [ ! -f package.json ]; then
    echo No se ha encontrado 'package.json'. ¿Seguro que estás corriendo este script desde la raíz del proyecto?
    exit
fi

echo Registrando comandos...
node scripts/generate-commands.js
if [[ $? == 0 ]]; then
    echo Comandos registrados en el proyecto.
else
    echo Ha habido algún problema para escribir los comandos en el archivo de comandos. Mira a ver los errores que habrán salido.
fi

echo Registrando comandos en Discord...
node scripts/deploy-commands.js $1 $2

if [[ $? == 0 ]]; then
    echo Se han mandado los cambios de los comandos a Discord. Puede que tarde un rato en tener efecto.
else
    echo Ha habido algún problema para registrar los comandos en Discord. Mira a ver los errores que habrán salido.
fi