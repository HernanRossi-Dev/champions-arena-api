# pull official base image
FROM node:14.2-buster

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

RUN yarn
COPY yarn.lock ./

# add app
COPY . ./

EXPOSE 8080

ADD start-dev.sh /
RUN chmod +x /start-dev.sh

# start app
CMD ["start-dev.sh"]