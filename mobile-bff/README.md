# FreshLink - mobilni BFF

Backend za frontend (BFF) mobilnih odjemalcev. (Prehod, gateway)

## Predpostavke
- Inštaliran Python verzije (glej datoteko `.python-version`) (pyenv)
- Inštaliran [poetry](https://python-poetry.org): `pipx install poetry`
- Če se .proto datoteka spremeni, je potrebno zagnati ukaza:
  - `cd mobile-bff/src`
  -  `python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. .\modules\clients\productsOfferingService\productsOffering.proto`

## Vzpostavitev
1. Premik v mapo `mobile-bff`
2. `poetry install`
3. `poetry run python src/main.py`

## Docker
1. Premik v mapo: `mobile-bff` 
2. `docker build -t ita-mobile-bff .`
3. `docker compose up -d`
