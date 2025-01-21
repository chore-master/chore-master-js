# End User App

## Development

```sh
yarn workspace @app/end-user-app add <package-name>
PORT=2000 yarn workspace @app/end-user-app dev
```

## Deployment

### Amplify

- App settings > General settings

    - Platform: `WEB_COMPUTE`
    - Framework: `Next.js - SSR`


- Hosting > Environment variables

    - AMPLIFY_DIFF_DEPLOY=false
    - AMPLIFY_MONOREPO_APP_ROOT=packages/end-user-app

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
        appRoot: packages/end-user-app
    ```