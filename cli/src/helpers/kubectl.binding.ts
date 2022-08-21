export class Kubectl {
    static checkVersion() {
        return `kubectl version --client`;
    }

    static getContexts() {
        return `kubectl config get-contexts`;
    }

    static useContext(context: string) {
        return `kubectl config use-context ${context}`;
    }

    static getPods() {
        return `kubectl get pods`;
    }

    static describePod(pod: string) {
        return `kubectl describe pod ${pod}`;
    }

    static getLogs(pod: string, tail: number = 50) {
        return `kubectl logs ${pod} -f --tail ${tail}`;
    }
}
