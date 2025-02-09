# Use official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package.json yarn.lock ./

# Install dependencies
RUN node --max-old-space-size=256 `which yarn` install

# Copy the rest of the application
COPY . .

# Build the NestJS app
RUN yarn run build

# Expose the port (default NestJS port is 3000)
EXPOSE 3000

# Start the application
CMD ["yarn", "run", "start:prod"]
