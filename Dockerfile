FROM node:20-slim

# Install git AND build tools (required for compiling some Nebula modules)
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./

# Install dependencies
RUN npm install

# FORCE BUILD the nebula bare server so the 'dist' folder is created
RUN cd node_modules/@nebula-services/bare-server-node && npm install && npm run build

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
