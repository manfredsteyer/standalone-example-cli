import { DefaultLogAppender, defaultLogFormatFn, LoggerConfig, LogLevel } from "./shared/util-logger";

export const loggerConfig: Partial<LoggerConfig> = {
    level: LogLevel.DEBUG,
    appenders: [DefaultLogAppender],
    formatter: defaultLogFormatFn,
};
