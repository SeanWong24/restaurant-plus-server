FROM debian:jessie-slim

ARG DENO_VERSION=v1.0.0

RUN apt-get update\
    && apt-get install -y curl unzip\
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* \
    && curl -fsSL https://deno.land/x/install/install.sh -s $DENO_VERSION | sh

ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"

COPY . .

CMD deno run -A --unstable --config ./tsconfig.json ./mod.ts $PORT
