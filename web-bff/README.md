# FreshLink - spletni BFF

Backend za frontend (BFF) spletnih odjemalcev. (Prehod, gateway)

Swagger API dokumentacija dostopna na "/api-docs"

## Vzpostavitev za razvoj
1. Premik v mapo `web-bff`
2. npm install
3. npm run dev

## Vzpostavitev
1. Premik v mapo `web-bff`
2. npm install
3. npm run build
4. npm start

## Docker
1. Premik v mapo `web-bff`
2. npm install
3. npm run build
4. docker build -t ita-web-bff .
5. docker run -d -p 3002:3002 --name ita-web-bff ita-web-bff
