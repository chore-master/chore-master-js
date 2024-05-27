import { EnvEnum } from '@module/utils/constants'

export default function getConfig() {
  const ENV_NAME = process.env.NEXT_PUBLIC_ENV_NAME || EnvEnum.PRODUCTION

  let HOST
  let IAM_API_HOST
  let CHORE_MASTER_API_HOST

  if (ENV_NAME === EnvEnum.LOCAL) {
    HOST = 'http://localhost:3000'
    IAM_API_HOST = 'http://localhost:13000'
    CHORE_MASTER_API_HOST = 'http://localhost:13000'
  } else if (ENV_NAME === EnvEnum.DEVELOPING) {
    HOST = 'https://dev--chore-master.lation.app'
    IAM_API_HOST = 'https://dev--chore-master-api.lation.app'
    CHORE_MASTER_API_HOST = 'https://dev--chore-master-api.lation.app'
  } else if (ENV_NAME === EnvEnum.PRODUCTION) {
    HOST = 'https://chore-master.lation.app'
    IAM_API_HOST = 'https://chore-master-api.lation.app'
    CHORE_MASTER_API_HOST = 'https://chore-master-api.lation.app'
  }

  return {
    ENV_NAME,
    HOST,
    IAM_API_HOST,
    CHORE_MASTER_API_HOST,
  }
}
