const winston = require('winston');
const { combine , json , printf } = winston.format;

// logger for errors
// Examples:
// logger.info('Info message');
// logger.error('Error message');
// logger.warn(data)
// logger.warn('Hello', { data })
// logger.warn('Warning message');

const logger = winston.createLogger({
    format: combine(
        json(),
        printf(({
            timestamp,
            level,
            message,
            ...data
        }) => {
            const response = {
                level,
                timestamp,
                message,
                data,
            };
            return JSON.stringify(response);
        })
    ),
    // store logs in the logger file
    transports: [
        new winston.transports.File({
            filename: './activity.log'
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `${[info.timestamp]} - ${info.level}: ${(info.stack || '') + (info.message || '')}`),
    )
});


module.exports = logger