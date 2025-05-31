FROM node:lts-alpine
RUN apk add --no-cache python3 py3-pip
WORKDIR /app
COPY . .
RUN pip3 install --no-cache-dir -r requirements.txt
RUN npm test && pytest -q

EXPOSE 3000
CMD ["npx", "serve", "dashboard", "-l", "3000"]
