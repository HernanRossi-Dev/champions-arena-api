import { LoggerOptions, format, transports, createLogger } from "winston";

const options: LoggerOptions = {
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }),
    format.json()
  ),
  transports: [
    new transports.Console({
      level: process.env.NODE_ENV === "production" ? "error" : "info"
    }),
    new transports.File({ filename: "debug.log", level: "debug" })
  ]
};

const logger = createLogger(options);

if (process.env.NODE_ENV !== "production") {
  logger.debug("Logging initialized at debug level");
}

export default logger;