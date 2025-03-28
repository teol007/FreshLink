# FreshLink - storitev za upravljanje uporabnikov

Swagger API dokumentacija dostopna na "/api-docs"

## Vzpostavitev za razvoj
1. Premik v mapo `manage-users`
2. npm install
3. npm run dev

## Vzpostavitev
1. Premik v mapo `manage-users`
2. npm install
3. npm run build
4. npm start

## Docker
1. Premik v mapo `manage-users`
2. npm install
3. npm run build
4. docker build -t ita-manage-users .
5. docker run -d -p 3001:3001 --name ita-manage-users ita-manage-users
