# Etapa de build
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Etapa final
FROM nginx:1.23
# Remover arquivos padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*
# Copiar build Angular da subpasta browser/
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Garantir permissões
RUN chmod -R 755 /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
