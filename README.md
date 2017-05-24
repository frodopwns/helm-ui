HelmUI is a UI for interacting with helm releases from your browser.

![screencast](https://cloud.githubusercontent.com/assets/782143/26423317/77effa3a-408a-11e7-9590-1e966d8ac27a.gif)


## Prerequisites
1. Kubernetes cluster
2. Latest running Tiller `helm init`
3. Ingress Controller
```
helm install --namespace kube-system --set dashboard.domain=traefik.helm.tucker.me stable/traefik
```
4. Wildcard domain name pointed to ingress service load balancer IP.

## Building
```bash
make build
```

## Deploying
```bash
helm install --set basedomain=helm.example.com charts/helm-ui
```

