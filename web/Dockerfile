# --- Etapa base ---
FROM node:20

WORKDIR /app

# Copiar archivos de configuración de npm primero (para aprovechar la cache)
COPY package*.json ./

# Instalar dependencias, incluyendo tailwind, postcss y autoprefixer
RUN npm install && \
    npm install -D tailwindcss postcss autoprefixer

# Copiar el resto del código
COPY . .

# Generar la configuración de Tailwind si no existe
RUN npx tailwindcss init -p || true

# Asegurar permisos y variables correctas
ENV HOST=0.0.0.0
EXPOSE 5173

# Ejecutar Vite
CMD ["npm", "run", "dev", "--", "--host"]
