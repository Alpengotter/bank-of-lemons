# Используем официальный Node.js образ в качестве базового
FROM node:18

# Устанавливаем Yarn глобально
RUN npm install --global yarn

# Создаем директорию для приложения внутри контейнера
WORKDIR /app

# Копируем package.json и yarn.lock для установки зависимостей
COPY package.json yarn.lock ./

# Копируем весь исходный код в контейнер
COPY . .

# Собираем проект
RUN yarn build

# Сообщаем Docker, что контейнер слушает на порту 5173
EXPOSE 5173

# Запускаем приложение
CMD ["yarn", "run", "dev", "--", "--host"]