FROM node:22.9.0-bullseye-slim

ENV PORT=${FRONTEND_DENO_PORT}

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./my-app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./my-app/ .

# Build the Next.js application
RUN npm run build

# Expose the new port the app runs on
EXPOSE ${PORT}

# Define the command to run the app
CMD ["npm", "start"]