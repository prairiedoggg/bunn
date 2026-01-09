# Step 4: Argo CD (GitOps) 붙이기

## 이 단계의 역할

- **Argo CD**는 클러스터에 직접 `kubectl apply`를 치는 대신,
  **Git 레포에 있는 매니페스트 상태를 기준으로 클러스터 상태를 자동으로 맞추는(CD)** 도구입니다.
- 그래서 “배포의 단일 진실(source of truth)”이 **Git**이 됩니다.

## 0) Argo CD 설치(로컬 kind)

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
helm upgrade --install argocd argo/argo-cd -n argocd --create-namespace -f k8s/argocd/values.yaml
```

UI 접속(포트포워딩):

```bash
kubectl port-forward service/argocd-server -n argocd 8080:443
```

초기 admin 비밀번호:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
echo
```

## 1) (중요) Argo가 Git 레포를 읽을 수 있게 만들기

현재 Application은 `repoURL: https://github.com/prairiedoggg/bunn.git` 를 사용합니다.

- 레포가 **public**이면: 추가 작업 없이 바로 sync 됩니다. (포트폴리오용으로 가장 단순)
- 레포가 **private**이면: Argo CD에 GitHub 접근 토큰(또는 deploy key)을 등록해야 합니다.

### 옵션 A: 레포를 public으로 전환(추천)

GitHub에서 레포 Settings → Visibility를 Public으로 변경.

### 옵션 B: GitHub 토큰으로 Argo에 레포 등록

1) GitHub에서 PAT(Personal Access Token) 생성
   - 최소 권한: `repo` (private repo 읽기용)
2) 아래 커맨드로 K8s Secret 생성(토큰은 절대 커밋하지 말 것)

```bash
kubectl -n argocd create secret generic repo-bunn \
  --from-literal=url=https://github.com/prairiedoggg/bunn.git \
  --from-literal=username=git \
  --from-literal=password=YOUR_GITHUB_TOKEN \
  --dry-run=client -o yaml \
| kubectl apply -f -

kubectl -n argocd label secret repo-bunn argocd.argoproj.io/secret-type=repository
```

## 2) GitOps bootstrap(App-of-Apps)

이 레포에는 두 개의 Application이 있습니다.

- `apps-local`: **하위 Application들을 재귀적으로 적용**하는 루트 앱
- `bunn-local`: 실제 앱(`k8s/overlays/local`)을 관리하는 앱

루트 앱을 한 번만 수동으로 생성하면 이후부터는 Argo가 Git을 보고 자동으로 관리합니다.

```bash
kubectl apply -n argocd -f k8s/argocd/apps/local/apps-local.yaml
kubectl get applications -n argocd
```

