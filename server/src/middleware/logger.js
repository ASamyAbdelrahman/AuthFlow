import winston from 'winston';
import 'winston-daily-rotate-file';

const isProduction = process.env.NODE_ENV === 'production';

const logLevel = isProduction ? 'info' : 'debug';

const httpLogger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.DailyRotateFile({
            filename: 'logs/http-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            maxFiles: '14d',
            zippedArchive: true,
        }),
    ],
}
);

export const requestLogger = (req, res, next) => {
    const start = Date.now();
    const { method, url, ip } = req;

    httpLogger.info({
        message: 'Incoming request',
        method,
        url,
        ip,
        timestamp: new Date().toISOString(),
    });

    res.on('finish', () => {
        const duration = Date.now() - start;
        httpLogger.info({
            message: 'Response sent',
            method,
            url,
            status: res.statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
        });
    });

    next();
};

export const errorLogger = (err, req, res, next) => {
    httpLogger.error({
        message: 'Error occurred',
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
    });

    next(err);
};