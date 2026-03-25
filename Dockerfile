FROM node:20-alpine

WORKDIR /app

# Copy server files
COPY server/ ./server/

# Copy root package.json if exists, or create minimal one
COPY package.json* ./

# Install server dependencies
WORKDIR /app/server
RUN npm install --production

WORKDIR /app

EXPOSE 3000

CMD ["node", "server/index.js"]
