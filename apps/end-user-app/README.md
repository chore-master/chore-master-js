# End User App

## Development

1. Copy `.env.local.example` to `.env.local` and set the environment variables.
2. Run the development server.

    ```sh
    PORT=2000 yarn workspace @app/end-user-app dev
    ```

3. To install a new package, run the following command.

    ```sh
    yarn workspace @app/end-user-app add <package-name>
    ```

## Deployment

## Docker Compose

```sh
sudo docker compose -f ./deployments/docker-compose.local.yml -p chore_master_end_user_app_local up -d --build
sudo docker compose -f ./deployments/docker-compose.local.yml -p chore_master_end_user_app_local down
```

### Amplify

- App settings > General settings

    - Platform: `WEB_COMPUTE`
    - Framework: `Next.js - SSR`


- Hosting > Environment variables

    - AMPLIFY_DIFF_DEPLOY=false
    - AMPLIFY_MONOREPO_APP_ROOT=apps/end-user-app

- Hosting > Build settings

    ```yml
    version: 1
    applications:
    - frontend:
        phases:
            preBuild:
            commands:
                - npm install
            build:
            commands:
                - npm run build
        artifacts:
            baseDirectory: .next
            files:
            - '**/*'
        cache:
            paths:
            - .next/cache/**/*
            - node_modules/**/*
        appRoot: apps/end-user-app
    ```