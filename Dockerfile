FROM node as base

FROM base as development

WORKDIR /app

COPY package.json . 

RUN npm install

COPY . .

ENV PORT=4000

EXPOSE ${PORT}

CMD ["npm", "run" , "dev"]
