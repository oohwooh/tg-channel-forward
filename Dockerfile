FROM node:16

ENV NODE_ENV=production
RUN mkdir /app
copy yarn.lock /app
copy package.json /app
WORKDIR /app
RUN NODE_ENV=development yarn install
COPY . /app
RUN yarn run build
CMD npm run start
