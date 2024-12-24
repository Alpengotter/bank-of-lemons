# Используем официальный Node.js образ
FROM node:18 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и yarn.lock для установки зависимостей
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile && yarn cache clean

# Копируем весь проект
COPY . .

# Собираем проект
RUN yarn build

# Используем легкий образ для продакшн
FROM nginx:alpine

# Копируем собранные файлы в директорию, где nginx будет их раздавать
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурационный файл nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем SSL сертификаты
COPY certs/certificate.crt /etc/nginx/ssl/certificate.crt
COPY certs/certificate.key /etc/nginx/ssl/certificate.key
COPY certs/certificate_ca.crt /etc/nginx/ssl/certificate_ca.crt

# Открываем порт 80 и 443 для доступа
EXPOSE 80 443

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]