# End User App

## Development

```sh
yarn workspace @app/end-user-app add <package-name>
yarn workspace @app/end-user-app dev
```

## Deployment

### Amplify

- Environment variables

    - AMPLIFY_DIFF_DEPLOY=false
    - AMPLIFY_MONOREPO_APP_ROOT=packages/end-user-app

- `amplify.yml`

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