# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY src/ ./src
COPY tsconfig.json ./
RUN yarn build

# Production stage
FROM node:20-alpine AS prouduction
WORKDIR /app
COPY --from=build /app/dist ./dist  
COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
RUN yarn install --production --frozen-lockfile
EXPOSE 3000
CMD ["node", "dist/index.js"]
