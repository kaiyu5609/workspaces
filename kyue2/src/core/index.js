import Kyue from './instance/index'
import { initGlobalAPI } from './global-api'

initGlobalAPI(Kyue)

Kyue.version = '__VERSION__'

export default Kyue