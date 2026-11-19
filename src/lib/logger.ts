type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const logger = {
  log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    // Scrub potential tokens or secrets
    const safeMeta = meta ? JSON.parse(JSON.stringify(meta, (_, value) => {
      if (typeof value === 'string' && (value.includes('token') || value.includes('Bearer'))) {
        return '[REDACTED]';
      }
      return value;
    })) : undefined;

    const logPayload = { timestamp, level, message, ...safeMeta };

    if (level === 'error') {
      console.error(`[PULSE ROOM][${level.toUpperCase()}] ${message}`, safeMeta || '');
    } else if (level === 'warn') {
      console.warn(`[PULSE ROOM][${level.toUpperCase()}] ${message}`, safeMeta || '');
    } else {
      console.log(`[PULSE ROOM][${level.toUpperCase()}] ${message}`, safeMeta || '');
    }

    return logPayload;
  },

  info(msg: string, meta?: Record<string, unknown>) {
    this.log('info', msg, meta);
  },
  warn(msg: string, meta?: Record<string, unknown>) {
    this.log('warn', msg, meta);
  },
  error(msg: string, meta?: Record<string, unknown>) {
    this.log('error', msg, meta);
  },
};
