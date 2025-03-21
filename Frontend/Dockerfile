# Use the official Node.js image as base
FROM node:18-alpine AS build

# Set working directory
WORKDIR /frontend

# Copy package files
COPY package.json tsconfig.json package-lock.json ./

# Install dependencies
RUN npm install
RUN npm install -g typescript

# Copy the rest of the project files
COPY . .  

# Build the Vite project
RUN npm run build

# Use a lightweight web server for deployment
FROM nginx:alpine

# Copy built files to Nginx's serving directory
COPY --from=build /frontend/dist/ /usr/share/nginx/html/


# Expose port 80
EXPOSE 80

# Start Nginx
CMD echo "App running at: http://localhost:5174" && nginx -g "daemon off;"

