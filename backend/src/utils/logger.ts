import winston from 'winston';
import 'winston-daily-rotate-file';

/**
 * Creates a daily rotating file transport for Winston logger.
 * The log files are stored in the './logs' directory with filenames formatted as 'application-%DATE%.log',
 * where '%DATE%' is replaced with the current date in 'YYYY-MM-DD' format.
 * Additionally, logs are zipped and archived to save space, with a maximum file size of 20MB per log file.
 * Older logs are retained for up to 14 days, after which they are deleted.
 *
 * @type {winston.transports.DailyRotateFile} - A transport that manages daily rotation and archiving of log files.
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
 * This logger uses the daily rotating file transport to manage log files.
 * It formats log entries as JSON, including a timestamp for each log message.
 * The log level is set to 'info', which means it will log messages with 'info' level and higher severity.
 *
 * @type {winston.Logger} - The logger instance used for logging messages throughout the application.
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
