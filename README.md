# DSW Frontend: gestión de reservas de estacionamiento

Aplicación web (SPA) del trabajo práctico de **Desarrollo de Software** (UTN). Interfaz para administrar playas, cocheras, tarifas, reservas y pagos, y para que los clientes gestionen sus reservas.

- Propuesta del TP: [tp-dsw/proposal.md](https://github.com/mapszk/tp-dsw/blob/main/proposal.md)
- API (backend): [mapszk/dsw-api](https://github.com/mapszk/dsw-api)
- Documentación del proyecto: [docs/README.md](docs/README.md)

## Índice

1. [Stack tecnológico](#stack-tecnológico)
2. [Instalación y ejecución local](#instalación-y-ejecución-local)
3. [Comandos útiles](#comandos-útiles)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Reglas del equipo](#reglas-del-equipo)

## Stack tecnológico

- React 19 + TypeScript
- Vite (SPA, todo del lado del cliente)
- React Router
- Tailwind CSS 4 + shadcn/ui
- TanStack Query
- React Hook Form + Zod
- Vitest + Testing Library
- ESLint + Prettier

## Instalación y ejecución local

El frontend necesita la API corriendo. Primero levantá [dsw-api](https://github.com/mapszk/dsw-api#instalación-y-ejecución-local-docker) siguiendo su README (queda en `http://localhost:3000`).

### Requisitos previos

- [Git](https://git-scm.com/downloads)
- [Node.js 22](https://nodejs.org/) (incluye npm)

Verificá la versión con `node -v` (debe ser 22.12 o superior).

### Paso a paso

**1. Clonar el repositorio**

```bash
git clone https://github.com/mapszk/dsw-frontend.git
cd dsw-frontend
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Crear el archivo de variables de entorno**

```bash
cp .env.example .env
```

**4. Levantar la aplicación**

```bash
npm run dev
```

Levanta el servidor de desarrollo de Vite con recarga automática al editar archivos de `src/`.

**5. Abrir en el navegador**

<http://localhost:5173>

La página de inicio muestra si la conexión con la API funciona ("API en línea"). Para detener el servidor: `Ctrl+C` en la terminal.

### Cómo se conecta con la API

El navegador llama a `/api/...` en el mismo origen (`localhost:5173`) y Vite reenvía esas llamadas a la API configurada en `API_PROXY_TARGET` (proxy de desarrollo). Así no hay problemas de CORS.

### Problemas frecuentes

- **"API sin conexión":** verificá que la API esté levantada (`curl http://localhost:3000/api/health`).
- **Puerto 5173 ocupado:** Vite usa el siguiente puerto libre; revisá la URL que muestra la terminal.
- **La API corre en otro puerto o máquina:** cambiá `API_PROXY_TARGET` en `.env` y reiniciá `npm run dev`.

## Comandos útiles

| Comando                              | Descripción                                   |
| ------------------------------------ | --------------------------------------------- |
| `npm run dev`                        | Servidor de desarrollo con recarga automática |
| `npm run build`                      | Build de producción en `dist/`                |
| `npm run preview`                    | Servir el build de producción localmente      |
| `npm test`                           | Ejecutar tests                                |
| `npm run test:e2e`                   | Ejecutar tests end-to-end (ver abajo)         |
| `npm run lint` / `npm run format`    | Revisar estilo / formatear código             |
| `npm run typecheck`                  | Verificar tipos de TypeScript                 |
| `npx shadcn@latest add <componente>` | Agregar un componente de shadcn/ui            |

### Tests end-to-end (Playwright)

Recorren la aplicación en un navegador real (escritorio y celular), contra la API de verdad.

1. Levantá la API y cargá el seed (`docker compose exec api npm run db:seed` en dsw-api): los tests usan `admin@dsw.com` y `cliente@dsw.com`.
2. La primera vez, instalá el navegador: `npx playwright install chromium`.
3. Ejecutá `npm run test:e2e`. Si `npm run dev` no está corriendo, Playwright lo levanta solo.

El reporte queda en `playwright-report/` (`npx playwright show-report` para abrirlo).

## Estructura del proyecto

```
dsw-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/              # componentes de shadcn/ui (Button, Card, Input, ...)
│   │   └── layout/          # layout general (header, navegación)
│   ├── config/env.ts        # variables de entorno validadas con Zod
│   ├── features/            # un directorio por entidad: servicio, hooks, componentes, schemas
│   ├── lib/                 # cliente HTTP, TanStack Query, utilidades
│   ├── pages/               # páginas asociadas a rutas
│   ├── types/               # modelos del dominio y tipos de la API
│   ├── router.tsx           # definición de rutas
│   └── main.tsx             # punto de entrada
└── docs/                    # documentación del TP
```

## Reglas del equipo

### Git y commits

- Mensajes de commit **cortos, simples y en español**, en presente: `Agrega listado de playas`, `Corrige validacion de patente`.
- Un commit por cambio lógico. No mezclar cambios no relacionados.
- Nunca commitear `.env`, `node_modules/` ni `dist/`.
- `main` siempre estable. Trabajar en ramas (`feature/listado-playas`, `fix/formulario-reserva`) y mergear mediante Pull Request revisado por otro integrante.
- Antes de abrir un PR: `npm run lint`, `npm run typecheck` y `npm test` deben pasar.

### Organización del código

Cada entidad vive en `src/features/<entidad>/`:

| Archivo                | Responsabilidad                                                        |
| ---------------------- | ---------------------------------------------------------------------- |
| `<entidad>.service.ts` | Llamadas a la API con `apiClient`. Sin React                           |
| `use-<entidad>.ts`     | Hooks de TanStack Query (`useQuery` / `useMutation`) sobre el servicio |
| `<entidad>.schema.ts`  | Schemas Zod de formularios                                             |
| `<componente>.tsx`     | Componentes de la entidad (tabla, formulario, detalle)                 |

Flujo: `página -> hook -> servicio -> apiClient -> API`.

### Convenciones de código

- Entidades y campos del dominio en **español** (igual que la API): `Reserva`, `fechaInicio`. Código técnico en inglés.
- Archivos en `kebab-case`; componentes en `PascalCase`; hooks empiezan con `use`.
- Componentes funcionales con props tipadas mediante `interface`. Los modelos de la API están en `src/types/models.ts`.
- Estilos solo con clases de Tailwind y componentes de shadcn/ui. **Mobile-first**: estilos base para celular y breakpoints `sm`, `md`, `lg` para pantallas más grandes.
- Toda llamada a la API pasa por un servicio; nunca `fetch` directo en componentes.
- Mostrar siempre estados de carga y error al usuario (mensajes claros, sin detalles técnicos).
- Imports con alias `@/` (ej: `import { Button } from '@/components/ui/button'`).

## Licencia

[MIT](LICENSE)
