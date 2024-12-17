# Используем официальный Node.js образ в качестве базового
FROM node:18

# Устанавливаем git, так как он необходим для клонирования репозитория
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Создаем директорию для приложения внутри контейнера
WORKDIR /app

# Клонируем нужный репозиторий (замените <URL_репозитория> на ваш)
RUN git clone git@github.com:BjornSodenberg/bank-of-lemons.git .

# Копируем package.json и yarn.lock для установки зависимостей
COPY package.json yarn.lock ./

# Устанавливаем зависимости через Yarn
RUN yarn install

# Собираем проект
RUN yarn build

# Сообщаем Docker, что контейнер слушает на порту 5173
EXPOSE 5173

# Запускаем приложение
CMD ["yarn", "run", "dev", "--", "--host"]