FROM maxmcd/deno:slim

COPY . .

CMD deno run -A --config ./tsconfig.json ./mod.ts $PORT