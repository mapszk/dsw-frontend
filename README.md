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
