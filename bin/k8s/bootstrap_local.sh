#!/bin/sh
set -eu

CLUSTER_NAME="${CLUSTER_NAME:-bunn}"

if ! command -v kind >/dev/null 2>&1; then
  echo "kind not found" >&2
  exit 1
fi

if ! command -v kubectl >/dev/null 2>&1; then
  echo "kubectl not found" >&2
  exit 1
fi

kind get clusters 2>/dev/null | grep -q "^${CLUSTER_NAME}$" || kind create cluster --name "${CLUSTER_NAME}"

echo "ok: kind cluster ready (${CLUSTER_NAME})"
echo "next:"
echo "- export env vars then run: ./bin/k8s/create_app_secrets.sh"
echo "- deploy: kubectl apply -k k8s/overlays/local"

