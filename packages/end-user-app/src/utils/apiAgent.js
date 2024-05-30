import getConfig from '@/utils/config'
import APIAgent from '@module/utils/APIAgent'

const { IAM_API_HOST, CHORE_MASTER_API_HOST } = getConfig()
const choreMasterAPIAgent = new APIAgent(CHORE_MASTER_API_HOST)

export const iamAPIAgent = new APIAgent(IAM_API_HOST)
export default choreMasterAPIAgent
