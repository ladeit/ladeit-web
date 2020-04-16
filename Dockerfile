FROM nginx

ARG CONTAINERNAME

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
ADD build/build.tar.gz /usr/share/nginx/html