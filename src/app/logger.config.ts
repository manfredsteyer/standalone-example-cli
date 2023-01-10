import { CustomFormatter } from "./shared/custom-formatter";
import { DefaultLogAppender } from "./shared/logger/log-appender";
import { LogLevel } from "./shared/logger/log-level";
import { LoggerConfig } from "./shared/logger/logger-config";
import { CustomAppender } from "./shared/custom-appender";

export const loggerConfig: Partial<LoggerConfig> = {
    level: LogLevel.DEBUG,
    appenders: [CustomAppender, DefaultLogAppender],
    formatter: CustomFormatter,
};
