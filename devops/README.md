# Docker Compose

This is the development environment. It lifts a full stack system with:

-   Frontend
-   Backend
-   Database
-   Metabase
-   Redis
-   Document API
-   Document Renderer

You can lift and start the development environment using the ./start-dev.sh and ./stop-dev.sh scripts in the scripts directory.

# Kubernetes

TODO, describe setup

NB: the clusters require your public IP address to be added to the Master Authorized Network. To get your public IP run:

-   **curl canhazip.com**
-   Get a system admin to add your public IP address to the cluster on Google Cloud: [FOUND_IP]/32
-   Run kubectl get pods to test that you are connected

## Deployment process

### Staging

To deploy to staging make sure all the changes are on the staging branch.

-   Go to: **kubernetes/staging/scripts**
-   Run: **./deploy-images.sh**
    -   This will build backend and frontend images
    -   Tag them correctly
    -   Push them to the google container registry
    -   Patch the kubernetes deployments for these images so that they restart
    -   Watch for backend to be ready and run database migrations
-   Run: **kubectl get pods**

    -   Check that everything is running
    -   If the backend didn't lift, diagnose the issue by doing the following:

        -   Run: **kubectl describe pod backend-xxxxxxxx-xxxxxxx**
        -   Run: **kubectl logs backend-xxxxx-xxxxx -f --tail 50**
        -   Fix the issue and rebuild the images as above

### Production

To deploy to production make sure all the changes required have been merged into the master branch.

-   Go to: **kubernetes/prod/scripts**
-   Run: **./deploy-images.sh**

    -   This will build backend and frontend images
    -   Tag them correctly
    -   Push them to the google container registry
    -   Patch the kubernetes deployments for these images so that they restart
    -   Watch for backend to be ready and run database migrations
-   Run: **kubectl get pods**

    -   If the backend didn't lift, diagnose the issue by doing the following:

        -   Run: **kubectl describe pod backend-xxxxxxxx-xxxxxxx**
        -   Run: **kubectl logs backend-xxxxx-xxxxx -f --tail 50**
        -   Fix the issue and rebuild the images as above
