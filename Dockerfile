#Building main conteiner
FROM python:alpine

RUN apk update
RUN apk add g++ git pcre2-dev libnetfilter_queue-dev libpcap-dev libcrypto1.1 libnfnetlink-dev libmnl-dev make cmake nftables boost-dev libcap bash

WORKDIR /tmp/
RUN git clone --single-branch --branch release https://github.com/jpcre2/jpcre2
RUN git clone --single-branch https://github.com/mfontanini/libtins.git
WORKDIR /tmp/jpcre2
RUN ./configure; make; make install
WORKDIR /tmp/libtins
RUN mkdir build; cd build; cmake ../ -DLIBTINS_ENABLE_CXX11=1; make; make install

RUN mkdir -p /execute/modules
WORKDIR /execute

ADD ./backend/requirements.txt /execute/requirements.txt
RUN pip3 install --no-cache-dir -r /execute/requirements.txt --no-warn-script-location

COPY ./backend/binsrc /execute/binsrc
RUN g++ binsrc/nfqueue.cpp -o modules/cppqueue -O3 -lnetfilter_queue -pthread -lpcre2-8 -ltins -lmnl -lnfnetlink
RUN g++ binsrc/proxy.cpp -o modules/proxy -O3 -pthread -lboost_system -lboost_thread -lpcre2-8


COPY ./backend/ /execute/
COPY ./frontend/build/ ./frontend/

ENTRYPOINT ["/bin/sh", "/execute/docker-entrypoint.sh"]


