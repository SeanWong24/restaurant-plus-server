FROM maxmcd/deno:jessie

COPY . .

CMD deno run -A --config ./tsconfig.json ./mod.ts $PORT