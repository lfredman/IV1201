import winston from 'winston';
import 'winston-daily-rotate-file';

/**
 * Creates a daily rotating file transport for Winston logger.
 * Logs are stored in the './logs' directory with the format 'application-%DATE%.log',
 * where '%DATE%' is replaced by the current date in 'YYYY-MM-DD' format.
 * The logs are zipped and archived, with a maximum file size of 20MB and a retention period of 14 days.
 *
 * @type {winston.transports.DailyRotateFile} - The transport that handles daily rotation of log files.
 */
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  dirname: './logs',
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

/**
 * Creates and configures a Winston logger instance.
 * The logger uses the daily rotate file transport and outputs log entries in JSON format.
 * The log level is set to 'info', meaning it will log messages of 'info' level and higher.
 *
 * @type {winston.Logger} - The logger instance for logging messages.
 */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    dailyRotateFileTransport,
  ],
});

export { logger };
