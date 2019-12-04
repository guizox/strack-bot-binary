# base image
FROM node:12.2.0-alpine

# Set to a non-root built-in user `node`
USER node
RUN sudo npm install -g @babel/cli @babel/node
RUN mkdir -p /home/node/app
# set working directory
WORKDIR /home/node/app

# install and cache app dependencies

# Bundle app source code
COPY --chown=node . .

RUN npm install

# start app
CMD ["npm", "start"]