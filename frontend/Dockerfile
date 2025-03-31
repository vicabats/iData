# Usa uma imagem oficial do Node.js para o build do Angular
FROM node:18 AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Compila o projeto Angular para produção
RUN npm run build --configuration=production

# Usa uma imagem do Nginx para servir os arquivos estáticos
FROM nginx:1.23

# Copia os arquivos compilados para a pasta do Nginx
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Exposição da porta usada pelo Nginx
EXPOSE 80

# Comando padrão do Nginx
CMD ["nginx", "-g", "daemon off;"]