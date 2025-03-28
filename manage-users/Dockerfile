# STAGE 1: Build the application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application files
COPY . .

# Run the build process to create the dist folder
RUN npm run build

# STAGE 2: Run the application
FROM node:20-alpine

WORKDIR /app

# Copy built files from the build stage (dist folder) and other necessary files
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json

# Install production dependencies
RUN npm ci --only=production

# Expose port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
