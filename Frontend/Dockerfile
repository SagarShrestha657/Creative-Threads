FROM node:18-alpine

# Set working dir
WORKDIR /app

# Copy only dependency files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Now copy rest of the project
COPY . .

EXPOSE 3000     
            
CMD ["npm", "run", "dev"]    
