# Используем официальный Node.js образ
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и yarn.lock для установки зависимостей
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install

# Копируем весь проект
COPY . .

# Собираем проект
RUN yarn build

# Сообщаем Docker, что мы будем слушать на порту 80
EXPOSE 5173

# Запускаем сервер для раздачи статических файлов
CMD ["yarn", "run", "dev", "--", "--host"]