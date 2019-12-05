# base image
FROM node:10.17

# Set to a non-root built-in user `node`
USER node

RUN mkdir -p /home/node/app
# set working directory
WORKDIR /home/node/app

# install and cache app dependencies

# Bundle app source code
COPY --chown=node . .

RUN npm install node-sass
RUN npm install

# start app
CMD ["npm", "start"]