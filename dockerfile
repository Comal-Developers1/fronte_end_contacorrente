# Etapa 1 — Usar imagem base do Node
FROM node:18-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar o restante do projeto
COPY . .

EXPOSE 3007

# Comando para rodar o servidor
CMD ["npm", "run", "dev"]