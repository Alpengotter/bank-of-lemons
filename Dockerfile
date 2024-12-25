FROM node:18 AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

RUN yarn cache clean

COPY . .

RUN yarn build

FROM nginx:alpine

WORKDIR /etc/nginx/ssl

ARG CERTIFICATE_CRT
ARG CERTIFICATE_KEY
RUN printf "%s" "$CERTIFICATE_CRT" > /etc/nginx/ssl/certificate.crt
RUN printf "%s" "$CERTIFICATE_KEY" > /etc/nginx/ssl/certificate.key
RUN printf "%s" "$CERTIFICATE_CRT" > /etc/nginx/ssl/certificate.crt
RUN printf "%s" "$CERTIFICATE_KEY" > /etc/nginx/ssl/certificate.key
RUN printf "%s" "$CERTIFICATE_CA_CRT" > /etc/nginx/ssl/certificate_ca.crt

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]