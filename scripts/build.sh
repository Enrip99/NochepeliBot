#!/bin/sh

NODE_TARGET=node17-linux-x64
OUT_FILE=out/nochepeli_bot


if [ ! -f package.json ]; then
    echo No se ha encontrado 'package.json'. ¿Seguro que estás corriendo este script desde la raíz del proyecto?
    exit
fi

command -v pkg &> /dev/null

if [ $? -ne 0 ]; then
    echo No parece que tengas instalado 'pkg'. Instálalo globalmente con 'sudo npm install -g pkg'.
    exit
fi

echo Compilando el bot...

pkg . --targets ${NODE_TARGET} --output ${OUT_FILE}

if [ $? -ne 0 ]; then
    echo No se ha podido compilar el bot. Mira a ver qué ha podido pasar.
    exit
fi

chmod ugo+x ${OUT_FILE}
echo Se ha creado el archivo ejecutable en \'${OUT_FILE}\'.
echo Antes de correrlo, asegúrate de que existe el archivo \'data/config.json\' relativo al directorio de ejecución del bot, y de que tiene la configuración correcta.