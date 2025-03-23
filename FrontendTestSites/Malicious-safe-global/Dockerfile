# Stage 1: Install dependencies and build the Next.js application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install Python and build tools required for node-gyp
RUN apk add --no-cache python3 make g++

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Run the Next.js application
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy built application and dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000
EXPOSE 80

# Start the Next.js application
CMD ["npm", "run", "start"]
