FROM node:20-slim
WORKDIR /app
COPY package.json ./
# This bypasses the need for a lockfile
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
