#############
### build ###
#############

FROM node:16.13.2 as build

LABEL mantainer="alessandroiudicone@gmail.com"

# Setting work directory
WORKDIR /app

# Bundling app dependency structure
COPY package.json ./
COPY package-lock.json ./

# Bundling vite.js configuration files
COPY vite.config.js ./

# Installing packages for production environment
RUN npm ci

# Bundling application source code
COPY src src

# Building application
RUN npm run build

############
### prod ###
############

FROM nginx:latest

# Installing timezone and setting localtime to CET
RUN apt install tzdata
ENV TZ=Europe/Rome
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

LABEL mantainer="alessandroiudicone@gmail.com"

# Removing bundled NGINX page
RUN rm -rf /usr/share/nginx/html/*

# Copying the built artifacts from the build environment
COPY --from=build /app/dist /usr/share/nginx/html

# TODO: Is it normal to declare the assets to bundle with the application? Maybe I should declare them in a configuration file.
COPY src/assets /usr/share/nginx/html/assets

# Declaring exposed ports
EXPOSE 80
