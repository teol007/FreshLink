# FreshLink - storitev za upravljanje ponudbe izdelkov

## Vzpostavitev za razvoj

1. Lokalno zaženi MySql podatkovno bazo (port 3306) in izvedi `CREATE DATABASE IF NOT EXISTS ita_products_offering;` 
2. Premik v mapo storitve: `cd FreshLink\products-offering`
3. `./mvnw clean package`
4. Zaženi storitev v IntelliJ IDEA

## Docker

1. Premik v mapo storitve: `cd products-offering` 
2. `./mvnw clean package`
3. `docker build -f Dockerfile.jvm -t ita-products-offering .`
4. Zagon storitve: `docker compose up -d`
