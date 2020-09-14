# Frontend

## Deploy

```
gcloud builds submit --tag gcr.io/<PROJECT_ID>/<CONTAINER_NAME>
gcloud run deploy --image gcr.io/<PROJECT_ID>/<CONTAINER_NAME> --platform managed
```
