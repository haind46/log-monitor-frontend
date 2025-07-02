FROM node:20.1.0-alpine3.16
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install 


FROM node:20.1.0-alpine3.16
WORKDIR /app
COPY --from=0 /app/node_modules ./node_modules
COPY . .
RUN yarn db:generate
RUN yarn build

FROM node:20.1.0-alpine3.16
WORKDIR /app
ENV NODE_ENV production
ENV PORT 3000
ENV NEXT_SHARP_PATH /app/node_modules/sharp
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=1 /app/public ./public
COPY --from=1 /app/package.json ./package.json
COPY --from=1 --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=1 --chown=nextjs:nodejs /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]