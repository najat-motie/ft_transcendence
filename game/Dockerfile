FROM python:3.11-slim-bullseye

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY src/requirements.txt /app/src/requirements.txt
RUN pip install --no-cache-dir -r /app/src/requirements.txt

COPY src /app/src

RUN mkdir -p /app/certs \
        && openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
            -keyout /app/certs/game.key \
            -out /app/certs/game.crt \
            -subj "/CN=game" \
            -addext "subjectAltName=DNS:game,DNS:localhost,IP:127.0.0.1"

EXPOSE 8443

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8443", "--app-dir", "/app/src", "--ssl-keyfile", "/app/certs/game.key", "--ssl-certfile", "/app/certs/game.crt"]
