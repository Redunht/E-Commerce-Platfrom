# server/Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory
WORKDIR /app

# COPY everything into the app directory
COPY . .

# Expose port 8000
EXPOSE 8000

# Run the server
CMD ["node", "server.js"]