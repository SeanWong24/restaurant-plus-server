FROM hayd/alpine-deno:1.0.3

EXPOSE $PORT

WORKDIR /app

USER deno

ADD . .

CMD ["run", "-A", "--unstable", "-c", "tsconfig.json", "mod.ts", "$PORT"]