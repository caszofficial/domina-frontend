# Domina Frontend

Aplicación React para gestionar usuarios y tareas consumiendo los microservicios existentes del caso práctico.

## Requisitos

- Node.js 18+
- Backend de autenticación y tareas ejecutándose (ver variables de entorno)

## Configuración

1. Copia el archivo `.env.example` y renómbralo a `.env`.
2. Ajusta la URL base hacia tu backend (la aplicación consumirá `/api/users` y `/api/tasks` desde ahí):

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Scripts disponibles

```bash
npm install       # instala dependencias
npm run dev       # ejecuta el servidor de desarrollo en http://localhost:5173
npm run build     # genera la versión de producción en /dist
npm run preview   # sirve la build generada
```

## Arquitectura

- `src/context/AuthContext.jsx`: maneja el estado global de autenticación.
- `src/api/*`: clientes para los microservicios de autenticación (Basic Auth) y tareas.
- `src/pages/AuthPage.jsx`: flujo de registro e inicio de sesión.
- `src/pages/Dashboard.jsx`: CRUD de tareas autenticado.
- `src/components/*`: componentes reutilizables para formularios y listados.

La aplicación usa `localStorage` para persistir el token de autenticación Basic y se integra con los microservicios mediante solicitudes HTTP.
