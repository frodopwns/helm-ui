HelmUI is a UI for interacting with helm releases from your browser.

![screengrab](https://cloud.githubusercontent.com/assets/782143/26421345/fe331490-4082-11e7-8c62-4f5e40bd3d60.png)


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

