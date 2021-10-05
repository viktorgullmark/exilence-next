enum BROWSER_WINDOWS {
  MAIN_BROWSER_WINDOW = 'main',
  LOG_MONITOR_OVERLAY = 'log-monitor',
  NET_WORTH_OVERLAY = 'net-worth',
}

enum COOKIES {
  SET = 'set-cookie',
  GET = 'get-cookie',
  REMOVE = 'remove-cookie',
}

enum LOGS {
  CREATE = 'log-create',
  START = 'log-start',
  STOP = 'log-stop',
  EVENT = 'log-event',
  PATH = 'log-path',
}

enum MENU_FUNCTIONS {
  CLOSE = 'close',
  MAXIMIZE = 'maximize',
  MINIMIZE = 'minimize',
  UNMAXIMIZE = 'unmaximize',
}

enum RELEASE_CHANNELS {
  LATEST_STABLE = 'latest',
  BETA = 'beta',
}

enum SYSTEMS {
  WINDOWS = 'win32',
  LINUX = 'debian',
  MACOS = 'darwin',
}

export { BROWSER_WINDOWS, COOKIES, LOGS, MENU_FUNCTIONS, RELEASE_CHANNELS, SYSTEMS };
