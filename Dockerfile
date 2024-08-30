# Use the latest official Node.js runtime as the base ima
FROM node:latest

# set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Serve the app
CMD ["npm", "start"]
