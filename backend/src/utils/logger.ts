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
  dirname: './logs', // Directory where log files will be stored
  filename: 'application-%DATE%.log', // Log file naming pattern, %DATE% is replaced by current date
  datePattern: 'YYYY-MM-DD', // The format of the date in the filename (e.g., application-2025-03-10.log)
  zippedArchive: true, // Compress old log files to save disk space
  maxSize: '20m', // Maximum size of a log file before a new one is created (20MB)
  maxFiles: '14d', // Log files older than 14 days are deleted
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
  level: 'info', // The minimum log level to capture ('info' and all levels above)
  format: winston.format.combine( // Log formatting: combines timestamp and JSON format
    winston.format.timestamp(), // Adds a timestamp to each log entry
    winston.format.json() // Formats log entries as JSON objects
  ),
  transports: [
    dailyRotateFileTransport, // Add the daily rotating file transport to the logger
  ],
});

export { logger };
