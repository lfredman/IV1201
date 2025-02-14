import winston from 'winston';
import 'winston-daily-rotate-file';

// Create a new transport with rotation
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  dirname: './logs',
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

// Create the Winston logger instance
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
