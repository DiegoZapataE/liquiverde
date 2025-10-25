# Liquiverde — Optimización y Sustitución Inteligente de Productos

Proyecto desarrollado como parte de una **prueba técnica fullstack**, enfocado en el análisis, optimización y sustitución de productos considerando **nutrición, sostenibilidad y costos**.  
El sistema integra un backend en **Node.js + Express + MongoDB**, un frontend en **React (Vite + TailwindCSS)** y un entorno **Dockerizado** para ejecución completa.

---

## Características principales

- **Búsqueda inteligente** por nombre o código de barras (API externa + base local MongoDB).
- **Optimización de lista de compras** según presupuesto, proteínas y sostenibilidad.
- **Sustitución inteligente** de productos con alternativas más saludables o sostenibles.
- **Análisis de impacto ambiental y nutricional.**
- **Dataset local** con 20 productos simulados cargados en MongoDB (`data/productos.json`).
- **Despliegue unificado con Docker Compose.**

---

## Estructura del proyecto

```
Prueba_Tecnica/
├── api/                      # Backend (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── algorithms/       # Algoritmos de optimización y sustitución
│   │   ├── models/           # Esquemas Mongoose
│   │   ├── routes/           # Rutas REST (productos, openfood, etc.)
│   │   └── utils/            # Conexión DB, helpers
│   ├── data/productos.json   # Dataset de ejemplo
│   ├── seed.js               # Script para cargar datos iniciales
│   ├── Dockerfile
│   ├── app.js
│   └── .env
│
├── web/                      # Frontend (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── pages/            # Buscador, Análisis, Optimización, Sustitución
│   │   ├── api/apiClient.ts  # Cliente centralizado de la API
│   │   └── components/       # UI Reutilizable
│
├── docker-compose.yml         # Configuración de servicios
├── README.md
└── package.json
```

---

## Instalación local

### 1. Requisitos previos

- Node.js ≥ 18
- Docker y Docker Compose
- Git

---

### 2. Clonar el repositorio

```bash
git clone https://github.com/DiegoZapataE/liquiverde.git
cd liquiverde
```

---

### 3. Configurar variables de entorno

En la carpeta `api/`, crea un archivo `.env` con el siguiente contenido:

```bash
MONGO_URI=mongodb://mongo:27017/liquiverde
PORT=3000
```

---

### 4. Levantar el entorno con Docker

```bash
docker-compose up --build
```

Esto iniciará los siguientes servicios:

| Servicio | Puerto | Descripción |
|-----------|--------|--------------|
| MongoDB | 27017 | Base de datos local |
| API Node | 3000 | Backend Express |
| Frontend React | 5173 | Aplicación web |

---

### 5. Cargar el dataset inicial

Ejecuta dentro del contenedor de la API:

```bash
docker exec -it liquiverde-api node src/seed.js
```

Verás el mensaje:

```
Productos importados correctamente
```

Puedes verificarlo desde MongoDB:

```bash
docker exec -it liquiverde-mongo mongosh
use liquiverde
show collections
db.productos.find().pretty()
```

---

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/productos` | Lista todos los productos locales (MongoDB) |
| GET | `/api/externos/openfood?nombre={nombre}` | Busca productos por nombre (API externa) |
| GET | `/api/externos/openfood/barcode/{codigo}` | Busca producto por código de barras |
| GET | `/api/optimizacion` | Genera lista optimizada |
| GET | `/api/sustitucion` | Recomienda alternativas |

---

## Algoritmos implementados

### 1. Optimización de lista de compras

Implementa una versión adaptada del **problema de la mochila (Knapsack Problem)**:

- Maximiza proteínas y sostenibilidad.
- Respeta un presupuesto máximo definido por el usuario.
- Calcula un valor total ponderado:  
  `score = (proteínas × sostenibilidad) / precio`

### 2. Sustitución inteligente

Compara un producto base con alternativas del dataset:

- Evalúa diferencias de proteínas, azúcares y sostenibilidad.
- Determina motivo de sustitución (“más proteínas”, “menor impacto ambiental”, etc.).
- Retorna la mejor alternativa según un **score compuesto**.

---

## Dataset de ejemplo

Archivo: `api/data/productos.json`

Incluye 20 productos simulados con atributos como:

```json
{
  "nombre": "Hamburguesa Vegetal",
  "marca": "NotCo",
  "categoria": "en:plant-based-foods",
  "energia_kcal_100g": 220,
  "grasas_100g": 12,
  "azucares_100g": 0.8,
  "proteinas_100g": 18,
  "precio": 3500,
  "sostenibilidad": {
    "puntaje_global": 89,
    "impacto_ambiental": 8,
    "impacto_economico": 12,
    "salud": "Alta"
  },
  "codigo_barras": "100000000006"
}
```

---

## Cálculo de impacto y ahorro

El sistema estima:

- **Ahorro potencial** (comparando sustitutos con precio menor).
- **Impacto ambiental total** (kg CO₂) según puntaje.
- **Eficiencia nutricional** (proteínas por peso/precio).

---

## Frontend (React + Tailwind)

Incluye 4 páginas principales:

| Página | Función |
|---------|----------|
| Buscador | Buscar productos por nombre o código de barras |
| Análisis | Visualizar valores nutricionales |
| Optimización | Crear lista de compras óptima |
| Sustitución | Comparar producto base con alternativas |

El diseño usa **Cloudscape Design System**, adaptado a modo oscuro con TailwindCSS.

---

## Tecnologías utilizadas

| Categoría | Tecnologías |
|------------|-------------|
| Backend | Node.js, Express, MongoDB, Mongoose |
| Frontend | React, Vite, TailwindCSS |
| Infraestructura | Docker, Docker Compose |
| APIs | OpenFoodFacts, API interna de productos |
| Extras | Cloudscape UI, Fetch API, Context API |

---

## Uso de Inteligencia Artificial

Durante el desarrollo se utilizó **ChatGPT (modelo GPT-5)** para:

- Diseñar la arquitectura y estructura del proyecto.
- Generar y depurar los algoritmos de optimización y sustitución.
- Elaborar el dataset base.
- Crear y documentar el sistema de carga (`seed.js`).
- Mejorar validaciones, flujo de UI y documentación técnica.

---

## Entregables

- **Repositorio público:** [https://github.com/DiegoZapataE/liquiverde]
- **Aplicación funcional completa (API + Frontend + MongoDB)**
- **Dataset de ejemplo:** `/api/data/productos.json`
- **Documentación completa:** `README.md`

---

## Autor

**Diego Zapata E.**  
Full Stack Developer  
Santiago, Chile  
Octubre 2025
