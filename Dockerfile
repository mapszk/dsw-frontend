# Imagen para desarrollo local (servidor de Vite con hot reload)
FROM node:22-alpine

WORKDIR /app

# Correr como usuario "node" (uid 1000) para que los archivos creados
# dentro del bind mount no queden con dueño root en la maquina host
RUN chown node:node /app
USER node

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

COPY --chown=node:node . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
