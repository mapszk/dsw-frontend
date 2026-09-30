# DSW Frontend: gestión de reservas de estacionamiento

Aplicación web (SPA) del trabajo práctico de **Desarrollo de Software** (UTN). Interfaz para administrar playas, cocheras, tarifas, reservas y pagos, y para que los clientes gestionen sus reservas.

- Propuesta del TP: [tp-dsw/proposal.md](https://github.com/mapszk/tp-dsw/blob/main/proposal.md)
- API (backend): [mapszk/dsw-api](https://github.com/mapszk/dsw-api)
- Documentación del proyecto: [docs/README.md](docs/README.md)

## Índice

1. [Stack tecnológico](#stack-tecnológico)
2. [Instalación y ejecución local (Docker)](#instalación-y-ejecución-local-docker)
3. [Ejecución sin Docker](#ejecución-sin-docker)
4. [Comandos útiles](#comandos-útiles)
5. [Estructura del proyecto](#estructura-del-proyecto)
6. [Reglas del equipo](#reglas-del-equipo)

## Stack tecnológico

- React 19 + TypeScript
- Vite (SPA, todo del lado del cliente)
- React Router
- Tailwind CSS 4 + shadcn/ui
- TanStack Query
- React Hook Form + Zod
- Vitest + Testing Library
- ESLint + Prettier
- Docker + Docker Compose

## Instalación y ejecución local (Docker)

El frontend necesita la API corriendo. Primero levantá [dsw-api](https://github.com/mapszk/dsw-api#instalación-y-ejecución-local-docker) siguiendo su README (queda en `http://localhost:3000`).

### Requisitos previos

- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS) o Docker Engine + Docker Compose (Linux)
- Opcional: [Node.js 22](https://nodejs.org/)

### Paso a paso

**1. Clonar el repositorio**

```bash
git clone https://github.com/mapszk/dsw-frontend.git
cd dsw-frontend
```

**2. Crear el archivo de variables de entorno**

```bash
cp .env.example .env
```

**3. Levantar la aplicación**

```bash
docker compose up -d --build
```

Levanta el servidor de desarrollo de Vite con recarga automática al editar archivos de `src/`.

**4. Abrir en el navegador**

<http://localhost:5173>

La página de inicio muestra si la conexión con la API funciona ("API en línea").

**5. Ver logs y detener**

```bash
docker compose logs -f web   # ver logs (Ctrl+C para salir)
docker compose down          # detener
```

### Cómo se conecta con la API

El navegador llama a `/api/...` en el mismo origen (`localhost:5173`) y Vite reenvía esas llamadas a la API (proxy de desarrollo). Así no hay problemas de CORS. Dentro de Docker, el proxy apunta a `http://host.docker.internal:3000`, es decir, a la API corriendo en tu máquina.

### Problemas frecuentes

- **"API sin conexión":** verificá que la API esté levantada (`curl http://localhost:3000/api/health`).
- **Puerto 5173 ocupado:** detené el otro proceso o cambiá el puerto en `docker-compose.yml`.
- **Instalé una dependencia nueva o cambió `package.json`:** `docker compose up -d --build -V` (`-V` recrea el volumen de `node_modules`).
- **El hot reload no detecta cambios (Windows / macOS):** `docker compose restart web`.

## Ejecución sin Docker

```bash
cp .env.example .env
npm install
npm run dev        # http://localhost:5173
```

## Comandos útiles

Con Docker, anteponé `docker compose exec web` (ej: `docker compose exec web npm test`).

| Comando                              | Descripción                                   |
| ------------------------------------ | --------------------------------------------- |
| `npm run dev`                        | Servidor de desarrollo con recarga automática |
| `npm run build`                      | Build de producción en `dist/`                |
| `npm run preview`                    | Servir el build de producción localmente      |
| `npm test`                           | Ejecutar tests                                |
| `npm run lint` / `npm run format`    | Revisar estilo / formatear código             |
| `npm run typecheck`                  | Verificar tipos de TypeScript                 |
| `npx shadcn@latest add <componente>` | Agregar un componente de shadcn/ui            |

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
├── docs/                    # documentación del TP
├── docker-compose.yml
└── Dockerfile
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
