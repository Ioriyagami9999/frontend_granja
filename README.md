# Granja — Frontend

Interfaz React del sistema de gestión de engorda de ganado (animales, corrales, fórmulas,
raciones, mapa de distribución, panel de administración con RBAC dinámico y bitácora de
peticiones para el rol "programador").

## Variables de entorno

Crea un `.env.local` con la URL del backend:

```
VITE_API_URL=http://localhost:3000
```

## Desarrollo

```
npm install
npm run dev
```

Requiere el backend + Postgres corriendo (ver el repo `backend_granja`, o `docker compose up -d`
desde la raíz del proyecto si tienes ambos repos como parte del monorepo local).

## Build de producción

```
npm run build
```

Genera `dist/` (servido por el `Dockerfile` incluido vía nginx, o por cualquier hosting estático).

## Tests de interfaz (Playwright)

```
npx playwright install chromium   # solo la primera vez
npm run test:e2e
```

Corren contra la app real (Vite dev server, que Playwright levanta solo) y el backend real — sin
mocks. Requieren que el backend/DB estén arriba primero. Incluye dos journeys completos de punta a
punta: el ciclo de vida de un animal en la engorda, y el ciclo de vida de un rol/permiso en RBAC.
