# client/Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory
WORKDIR /app

# COPY everything into the app directory
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the server
CMD [ "npm", "run", "start" ]