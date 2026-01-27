# Use Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose the application port
EXPOSE 4020

# Set environment variable for port
ENV PORT=4020

# Start the application
CMD ["node", "server.js"]
