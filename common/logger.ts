import winston from "winston";

const { combine, timestamp, colorize, align, printf } = winston.format;


export const log = winston.createLogger({
    level: 'debug',
    format: combine(
        colorize({ all: true }),
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
    transports: [new winston.transports.Console()],
  });
