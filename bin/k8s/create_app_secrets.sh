#!/bin/sh
set -eu

NAMESPACE="${NAMESPACE:-bunn}"
SECRET_NAME="${SECRET_NAME:-app-secrets}"

require() {
  key="$1"
  eval "val=\${$key:-}"
  if [ -z "${val}" ]; then
    echo "missing env: ${key}" >&2
    exit 1
  fi
}

# DB
require POSTGRES_USER
require POSTGRES_PASSWORD
require POSTGRES_DB

# Rails
require SECRET_KEY_BASE
require JWT_SECRET

# Messaging
require RABBITMQ_USER
require RABBITMQ_PASSWORD

RABBITMQ_HOST="${RABBITMQ_HOST:-rabbitmq}"
RABBITMQ_PORT="${RABBITMQ_PORT:-5672}"
RABBITMQ_URL="${RABBITMQ_URL:-amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}}"

kubectl get ns "${NAMESPACE}" >/dev/null 2>&1 || kubectl create ns "${NAMESPACE}"

kubectl -n "${NAMESPACE}" create secret generic "${SECRET_NAME}" \
  --from-literal=POSTGRES_USER="${POSTGRES_USER}" \
  --from-literal=POSTGRES_PASSWORD="${POSTGRES_PASSWORD}" \
  --from-literal=POSTGRES_DB="${POSTGRES_DB}" \
  --from-literal=SECRET_KEY_BASE="${SECRET_KEY_BASE}" \
  --from-literal=JWT_SECRET="${JWT_SECRET}" \
  --from-literal=RABBITMQ_USER="${RABBITMQ_USER}" \
  --from-literal=RABBITMQ_PASSWORD="${RABBITMQ_PASSWORD}" \
  --from-literal=RABBITMQ_URL="${RABBITMQ_URL}" \
  --dry-run=client -o yaml \
| kubectl apply -f -

echo "ok: created/updated secret ${NAMESPACE}/${SECRET_NAME}"

