ARG NODEVER="latest"
FROM node:$NODEVER
MAINTAINER rysiek@hackerspace.pl

RUN npm install -g bats

RUN cd /opt && \
    git clone https://github.com/amark/gun.git
RUN cd /opt/gun && \
    npm install --no-audit

COPY ./ /opt/gun-nodejs-bugs/
RUN cd /opt/gun-nodejs-bugs/ && \
    npm install --no-audit

WORKDIR /opt/gun/
EXPOSE 8765
CMD [ "npm", "start"]
