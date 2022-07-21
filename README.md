# [Fi]*regex 🔥

## What is Firegex?
Firegex is a firewall that includes different functionalities, created for CTF Attack-Defence competitions that has the aim to limit or totally deny malicious traffic through the use of different kind of filters.

## Why "Firegex"?
Initiially the project was based only on regex filters, and also now the main function uses regexes, but firegex have and will have also other filtering tools.

## Get started firegex
What you need is a linux machine and docker ( + docker-compose )
```
python3 start.py
```
This command will generate the docker-compose configuration and start it with docker-compose, read the help with -h to customize you firegex instance.
We recommend to use -t paramether and specify the number of threads to use for each service running on firegex, this will make you network more stable with multiple connections `python3 start.py -t 4`.

The default port of firegex is 4444. At the startup you will choose a password, that is essential for your security.

![Firegex Network scheme](docs/Firegex_Screenshot.jpg)

## Functionalities

- Regex filtering using [NFQUEUE](https://netfilter.org/projects/libnetfilter_queue/doxygen/html/) with [nftables](https://netfilter.org/projects/nftables/) with a c++ file that handle the regexes and the requests, blocking the malicius requests. PCRE2 regexes are used. The requests are intercepted kernel side, so this filter works immediatly (IPv4/6 and TCP/UDP supported)
- TCP Proxy regex filter, create a proxy tunnel from the service internal port to a public port published by the proxy. Internally the c++ proxy filter the request with PCRE2 regexes. For mantaining the same public port you will need to open only in localhost the real service. (Only TCP IPv4)
- Port Hijacking (not available yet) allow you to redirect the traffic on a specific port to another port. Thanks to this you can start your own proxy, connecting to the real service using loopback interface. Firegex will be resposable about the routing of the packets using internally [nftables](https://netfilter.org/projects/nftables/)

## Documentation

Find the documentation of the backend and of the frontend in the related README files

- [Frontend (React)](frontend/README.md)
- [Backend (FastAPI + C++)](backend/README.md)

![Firegex Working Scheme](docs/FiregexInternals.png)

### Main Points of Firegex
#### 1. Efficiency
Firegex should not slow down the traffic on the network. For this the core of the main functionalities of firegex is a c++ binary file.
#### 2. Availability
Firegex **must** not become a problem for the SLA points!
This means that firegex is projected to avoid any possibility to have the service down. We know that passing all the traffic through firegex, means also that if it fails, all services go down. It's for this that firegex implements different logics to avoid this. Also, if you add a wrong filter to your services, firegex will always offer you a fast or instant way to reset it to the previous state.
1. Every reverse proxy is isolated from each other, avoiding the crash of all the proxies started by firegex
2. The proxy is a binary program written in C, started as an indipendent process with indipendent memory, and uses boost lib for the connection and the std lib for checking the regex for each packet
3. If a regex fails for whatever reason, the proxy remove this from the filter list and continue to forward the packets like it did't exist.
4. If the firewall is restarted, at the startup it try to rebuild the previous status of proxies
5. The firewall interface it's protected by a password. No one excepts your team must have access to firegex, this can be really really dangerous!
6. If a regex makes trouble, you can delete it (this have an instant effect on the proxy), or put the service in pause (also called Transparent mode), this will deactivate all the filters from the proxy, but still continue to publish the service on the right port
7. Every status change (except if you decide to stop the proxy) that you made to the service, and so to the proxy is instantaneous and done with 0 down time. The proxy is **never** restarted, it's configuration changes during runtime
    
# Credits 
- Copyright (c) 2007 Arash Partow (http://www.partow.net) for the base of our proxy implementation
- Copyright (c) 2022 Pwnzer0tt1
