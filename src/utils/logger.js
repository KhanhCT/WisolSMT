// 'use strict';
const winston = require("winston");
const fs = require("fs");
const logDir = __dirname + "/../logs";
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const tsFormat = () => new Date().toISOString();
const logger = new winston.Logger({
    transports: [
        // colorize the output to the console
        new winston.transports.Console({
            timestamp: tsFormat,
            colorize: true,
            level: "debug",
        }),
        new (require("winston-daily-rotate-file"))({
            filename: `${logDir}/-results.log`,
            timestamp: tsFormat,
            datePattern: "yyyy-MM-dd",
            prepend: true,
            level: "warn",
        }),
    ],
});
module.exports = logger;
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 } -- LOGGING LEVEL
// logger.debug('Debugging info');
// logger.verbose('Verbose info');
// logger.info('Hello world');
// logger.warn('Warning message');
// logger.error('Error info');
