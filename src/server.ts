import { logger } from "./utils";
import server from './app'

const PORT = process.env.PORT || 8080;

const initServer = () => {
  server.listen(PORT, () => {
    logger.debug('Application started on port 8080.')
  })
}
initServer()

export default server