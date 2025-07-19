import winston from 'winston';
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

// Custom format for logs
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create logger instance
const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    // Console transport
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    // File transport for errors
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      format: format.json()
    }),
    // File transport for all logs
    new transports.File({ 
      filename: 'logs/combined.log',
      format: format.json()
    })
  ]
});

export default logger;
