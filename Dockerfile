FROM node:20 AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

RUN yarn cache clean

COPY . .

RUN yarn build

FROM nginx:alpine

ARG ENV

WORKDIR /etc/nginx/ssl

ARG CERTIFICATE_CRT
ARG CERTIFICATE_KEY
ARG CERTIFICATE_CA_CRT

RUN echo "$CERTIFICATE_CRT" > /etc/nginx/ssl/certificate.crt
RUN echo "$CERTIFICATE_KEY" > /etc/nginx/ssl/certificate.key
RUN echo "$CERTIFICATE_CA_CRT" > /etc/nginx/ssl/certificate_ca.crt

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

# Conditionally copy the environment-specific configuration file
RUN if [ "$ENV" = "prod" ]; then \
        cp /app/prod.conf /etc/nginx/conf.d/default.conf; \
    elif [ "$ENV" = "uat" ]; then \
        cp /app/uat.conf /etc/nginx/conf.d/default.conf; \
    fi

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]