# Descargando la imagen alpine de Node.js
FROM node:alpine

# Declarando variables de entorno
ENV ORACLE_BASE /usr/lib/instantclient
ENV LD_LIBRARY_PATH /usr/lib/instantclient
ENV TNS_ADMIN /usr/lib/instantclient
ENV ORACLE_HOME /usr/lib/instantclient

# Ir a la carpeta temporal
WORKDIR /tmp

# Instalación de dependencias para libreria node xml2json
RUN apk add make g++

# Instalación de python 3
RUN apk add --no-cache python3

# Instlación de librerias para Oracle
RUN apk add --no-cache libaio libnsl libc6-compat

# Instlación de dependencias para el funcionamiento de canvas
RUN apk add --no-cache \
  build-base \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev

RUN apk add --update  --repository http://dl-3.alpinelinux.org/alpine/edge/testing libmount ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family fontconfig

# Descarga de cliente lite para Oracle
RUN wget --no-check-certificate https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip && \
    unzip instantclient-basiclite-linuxx64.zip && \
    mv instantclient*/ /usr/lib/instantclient && \
    rm instantclient-basiclite-linuxx64.zip && \
    ln -s /usr/lib/instantclient/libclntsh.so.19.1 /usr/lib/libclntsh.so && \
    ln -s /usr/lib/instantclient/libocci.so.19.1 /usr/lib/libocci.so && \
    ln -s /usr/lib/instantclient/libociicus.so /usr/lib/libociicus.so && \
    ln -s /usr/lib/instantclient/libnnz19.so /usr/lib/libnnz19.so && \
    ln -s /usr/lib/libnsl.so.2 /usr/lib/libnsl.so.1 && \
    ln -s /lib/libc.so.6 /usr/lib/libresolv.so.2 && \
    ln -s /lib64/ld-linux-x86-64.so.2 /usr/lib/ld-linux-x86-64.so.2

# Ir a la carpeta de trabajo
WORKDIR /usr/src/app

# copiando archivos del package.json desde la maquina local a la imagen
COPY package*.json ./

# run npm install in our local machine

RUN npm install -g node-gyp

# Instalación de dependencias
RUN npm install

# Copiando todo de la maquina local a la imagen
COPY . .

# Exponiendo el puerto 3000
EXPOSE 3000

# El comando con el cual se inicializara el contenedor
CMD ["node", "index.js"]