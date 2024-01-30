FROM oven/bun:slim

WORKDIR /app
COPY package.json bun.lockb /app/
RUN bun install --frozen-lockfile --production

COPY . /app

CMD ["bun", "start"]
