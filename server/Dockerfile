FROM node:18-slim

# Install OpenSSL and other dependencies needed by Prisma
RUN apt-get update -y && apt-get install -y openssl libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files separately to leverage Docker cache
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma Client
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 3000

# Set environment variable to help Prisma identify the environment if needed
ENV NODE_ENV=production

CMD ["node", "index.js"]
