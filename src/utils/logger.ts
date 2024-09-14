import chalk from 'chalk';

enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR
}

class Logger {
  private static formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toLocaleString();
    const prefix = this.getPrefix(level);
    return `${chalk.gray(timestamp)} ${prefix} ${message}`;
  }

  private static getPrefix(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return chalk.magenta('[DEBUG]');
      case LogLevel.INFO:
        return chalk.blue('[INFO]');
      case LogLevel.WARN:
        return chalk.yellow('[WARN]');
      case LogLevel.ERROR:
        return chalk.red('[ERROR]');
    }
  }

  static debug(message: string): void {
    console.debug(this.formatMessage(LogLevel.DEBUG, message));
  }

  static info(message: string): void {
    console.log(this.formatMessage(LogLevel.INFO, message));
  }

  static warn(message: string): void {
    console.warn(this.formatMessage(LogLevel.WARN, message));
  }

  static error(message: string): void {
    console.error(this.formatMessage(LogLevel.ERROR, message));
  }

  /**
   * Log an error message and exit the program with a non-zero exit code.
   * @param {unknown} error - The error object to log.
   * @param {string} message - The error message to log.
   * @param {number} [exitCode=1] - The exit code to use when exiting.
   * @returns {void}
   */
  static errorAndExit(error: unknown, message: string, exitCode: number = 1) {
    if (error instanceof Error) {
      this.error(`${message}: ${error.message}`);
    } else {
      this.error(`${message}: ${String(error)}`);
    }
    process.exit(exitCode);
  }
}

export default Logger;
