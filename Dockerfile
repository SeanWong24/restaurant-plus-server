FROM hayd/alpine-deno:1.0.3

# The port that your application listens to.
EXPOSE $PORT

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
# COPY mod.ts .
# RUN deno cache mod.ts

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
# RUN deno cache -c tsconfig.json app/mod.ts

CMD ["run", "-A", "--unstable", "-c", "tsconfig.json", "app/mod.ts", "$PORT"]