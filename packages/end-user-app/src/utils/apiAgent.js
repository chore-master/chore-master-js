import getConfig from '@/utils/config'
import APIAgent from '@module/utils/APIAgent'

const { CHORE_MASTER_API_HOST } = getConfig()
const choreMasterAPIAgent = new APIAgent(CHORE_MASTER_API_HOST)

export default choreMasterAPIAgent
