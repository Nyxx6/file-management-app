FROM node:18-alpine

WORKDIR /usr/src/app

# Install build deps
COPY package.json ./

# Use legacy-peer-deps to avoid stopping on peer conflicts in development
RUN npm install --legacy-peer-deps

# Copy the rest of the project
COPY . .

EXPOSE 3000

# In dev we run the Next dev server. The compose service overrides the command to run npm install on start
CMD ["npm", "run", "dev"]
