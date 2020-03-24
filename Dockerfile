FROM maxmcd/deno:slim-v0.36.0

COPY . .

CMD deno run -A --config ./tsconfig.json ./mod.ts $PORT