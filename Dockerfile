FROM hayd/alpine-deno:1.1.0

EXPOSE $PORT

WORKDIR /app

ADD . .

CMD ["run", "-A", "--unstable", "-c", "tsconfig.json", "mod.ts", "$PORT"]