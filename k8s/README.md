# Kubernetes + Argo(GitOps) 운영 구조

이 디렉토리는 **Kustomize 기반**으로 `local`/`prod` 환경을 분리합니다.

## 로컬(kind)로 최소 기동(1단계)

> Docker Desktop이 켜져 있어야 `kind` 클러스터를 만들 수 있습니다.

```bash
./bin/k8s/bootstrap_local.sh
export POSTGRES_USER=bunn
export POSTGRES_PASSWORD="$(ruby -e 'require \"securerandom\"; puts SecureRandom.hex(24)')"
export POSTGRES_DB=app_development
export SECRET_KEY_BASE="$(ruby -e 'require \"securerandom\"; puts SecureRandom.hex(64)')"
export JWT_SECRET="$(ruby -e 'require \"securerandom\"; puts SecureRandom.hex(32)')"
export RABBITMQ_USER=bunn
export RABBITMQ_PASSWORD="$(ruby -e 'require \"securerandom\"; puts SecureRandom.hex(24)')"
./bin/k8s/create_app_secrets.sh
kubectl apply -k k8s/overlays/local
kubectl get pods -n bunn
```

### 접속

로컬 오버레이는 `rails-web`을 `NodePort`로 노출합니다.

```bash
kubectl get svc -n bunn rails-web
```

헬스 체크:

```bash
kubectl port-forward -n bunn svc/rails-web 3000:3000
curl -fsS http://localhost:3000/up
```

## GitOps(2단계, Argo CD)

- `k8s/argocd/`에 Argo CD Application 매니페스트를 둡니다.
- Argo CD는 `k8s/overlays/prod` 또는 `k8s/overlays/staging` 같은 디렉토리를 sync 하게 됩니다.

