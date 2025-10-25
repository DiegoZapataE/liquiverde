# Usa Node 20 como base
FROM node:20

# Crea el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto del backend
EXPOSE 3000

# Comando para iniciar la API
CMD ["npm", "start"]
