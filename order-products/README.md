# FreshLink - storitev za naročanje izdelkov

## Predpostavke
- Inštaliran Python verzije (glej datoteko `.python-version`)
- Inštaliran [poetry](https://python-poetry.org): `pipx install poetry`
- Inštaliran in zagnan RabbitMQ. Primer: `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management` (uporabniško ime: guest, geslo: guest)
- Inštalirana in zagnana MongoDB podatkovna baza

## Vzpostavitev
1. Premik v mapo `order-products`
2. `poetry install`
3. `poetry run python src/main.py`

- Testiranje: `poetry run python tests\run_tests.py`

## Primer sporočila
```
{
  "action": "create",
  "order": {
    "_id": "67f9899c5be73585d33d44ae",
    "restaurant_id": "restaurant12345",
    "farmer_id": "farmer456",
    "products": [
      {
        "product_id": "apple00123",
        "quantity": 105.5
      },
      {
        "product_id": "banana002",
        "quantity": 7.2
      }
    ]
  }
}
```
