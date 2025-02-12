FROM node:14 AS development

# Create app directory
WORKDIR /nestjs_core

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install

#RUN npm install --only=development

COPY . .

RUN npm run build

# FROM node:14 as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /nestjs_core

# COPY package*.json ./

# RUN npm install

#RUN npm install --only=production

# COPY decrypt-env-into-new-file.mjs ./
# COPY .env.enc ./

# COPY locales ./locales

# COPY ssl ./ssl

# CMD node decrypt-env-into-new-file.mjs && node dist/main

FROM gcr.io/distroless/nodejs:14
# Set working directory
WORKDIR /nestjs_core
# Copy only necessary files from the build stage
COPY --from=development /nestjs_core/package*.json ./
COPY --from=development /nestjs_core/node_modules ./node_modules
COPY --from=development /nestjs_core/dist ./dist
# Expose application port
EXPOSE 3000
# Start the application
CMD ["dist/main"]
