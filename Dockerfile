FROM node:20-bullseye-slim AS frontend
RUN mkdir /app
WORKDIR /app
ADD ./frontend/package.json .
ADD ./frontend/package-lock.json .
RUN yarn install
COPY ./frontend/ .
RUN yarn build


#Building main conteiner
FROM python:alpine AS base

RUN apk update
RUN apk add g++ git pcre2-dev libnetfilter_queue-dev libpcap-dev\
        libcrypto1.1 libnfnetlink-dev libmnl-dev make cmake nftables maturin\
        boost-dev libcap autoconf automake bash rust cargo openssl-dev libffi-dev

WORKDIR /tmp/
RUN git clone --single-branch --branch release https://github.com/jpcre2/jpcre2
RUN git clone --single-branch https://github.com/mfontanini/libtins.git
WORKDIR /tmp/jpcre2
RUN ./configure; make -j`nproc`; make install
WORKDIR /tmp/libtins
RUN mkdir build; cd build; cmake ../ -DLIBTINS_ENABLE_CXX11=1; make -j`nproc`; make install

RUN mkdir -p /execute/modules
WORKDIR /execute

ADD ./backend/requirements.txt /execute/requirements.txt
RUN pip3 install --upgrade pip
RUN pip3 install --no-cache-dir -r /execute/requirements.txt --no-warn-script-location

COPY ./backend/binsrc /execute/binsrc
RUN g++ binsrc/nfqueue.cpp -o modules/cppqueue -O3 -lnetfilter_queue -pthread -lpcre2-8 -ltins -lmnl -lnfnetlink
RUN g++ binsrc/proxy.cpp -o modules/proxy -O3 -pthread -lboost_system -lboost_thread -lpcre2-8

COPY ./backend/ /execute/
COPY --from=frontend /app/build/ ./frontend/

CMD ["/bin/sh", "/execute/docker-entrypoint.sh"]


