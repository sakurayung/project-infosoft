FROM node:20-alpine as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm i -g pnpm && pnpm install

COPY . .
RUN pnpm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.config

EXPOSE 80
EXPOSE 5173

CMD [ "nginx", "-g", "daemon off;" ]