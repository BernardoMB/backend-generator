import * as winston from 'winston';

export function loggerFactory(): winston.Logger {
    const options = {
        file: {
            level: process.env.LOGGING_LEVEL,
            filename: process.env.LOG_FOLDER,
            handleExceptions: true,
            json: false,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: true
        },
        console: {
            level: process.env.LOGGING_LEVEL,
            handleExceptions: true,
            json: false,
            colorize: true
        }
    };
    const logger = winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(i => `timestamp=${i.timestamp} level=${i.level} application=${process.env.APPLICATION_NAME} ${i.message}`)
        ),
        transports: [
            new winston.transports.File(options.file),
            new winston.transports.Console(options.console)
        ],
        exitOnError: false, // handled exceptions will not cause process.exit
    });
    return logger;
};