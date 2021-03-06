import winston, { format, Logform } from "winston";

/**
 * Build a set of file loggers that optionally filters to a specific log level.
 * So we get errors in `error.log`, warnings only in `warn.log` and so on.
 * Othewrise log levels are upwards and inclusive.
 */
const buildFileFormatter = ({ level }: { level?: string } = {}) => {
  const baseFormats = [winston.format.timestamp(), winston.format.simple()];

  const formats =
    // If we are given a log level to filter to, then prepend this to the array
    // of formatters, otherwise, use just the base formatters.
    typeof level === "string" && level.length > 0
      ? [
          format((info: Logform.TransformableInfo) =>
            // Returning false here disables this entry being logged
            info.level === level ? info : false
          )(),
        ].concat(baseFormats)
      : baseFormats;

  return format.combine(...formats);
};

const devTransports = [
  new winston.transports.Console({
    level: "debug",
    format: format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  new winston.transports.File({
    filename: "data/debug.log",
    level: "debug",
  }),
];

const prodTransports = [
  new winston.transports.Console({
    level: "info",
    format: format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  new winston.transports.File({
    filename: "data/error.log",
    level: "error",
    format: buildFileFormatter({ level: "error" }),
  }),
  new winston.transports.File({
    filename: "data/warn.log",
    level: "warn",
    format: buildFileFormatter({ level: "warn" }),
  }),
  new winston.transports.File({
    filename: "data/info.log",
    level: "info",
    format: buildFileFormatter({ level: "info" }),
  }),
];

const options: winston.LoggerOptions = {
  transports:
    process.env.NODE_ENV === "production" ? prodTransports : devTransports,
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== "production") {
  logger.debug("Logging initialized at debug level #tKMPf1");
}

export default logger;
