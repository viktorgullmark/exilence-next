import { Size } from 'electron';
import * as path from 'path';
import { BROWSER_WINDOWS } from './enums';

const { MAIN_BROWSER_WINDOW, LOG_MONITOR_OVERLAY, NET_WORTH_OVERLAY } = BROWSER_WINDOWS;

const browserWindows: { [k in BROWSER_WINDOWS]: any } = {
  [MAIN_BROWSER_WINDOW]: null,
  [LOG_MONITOR_OVERLAY]: null,
  [NET_WORTH_OVERLAY]: null,
};

type BrowserWindowsConfigType = {
  [k in BROWSER_WINDOWS]: {
    devLoadPath: string;
    prodLoadPath: string;
  } & Size;
};

const filePathLocations = {
  prodPath: '..',
  overlaysDev: '../../electron/main/overlays',
  overlaysProd: '../main/overlays',
};
console.log(path.resolve(__dirname, `${filePathLocations.overlaysProd}/index.html`));
const browserWindowsConfig: BrowserWindowsConfigType = {
  [MAIN_BROWSER_WINDOW]: {
    width: 1150,
    height: 800,
    devLoadPath: 'http://localhost:3000',
    prodLoadPath: path.resolve(__dirname, `${filePathLocations.prodPath}/index.html`),
  },
  [LOG_MONITOR_OVERLAY]: {
    width: 0,
    height: 0,
    devLoadPath: path.resolve(
      __dirname,
      `${filePathLocations.overlaysDev}/LogMonitor/log-monitor.html`
    ),
    prodLoadPath: path.resolve(
      __dirname,
      `${filePathLocations.overlaysProd}/LogMonitor/log-monitor.html`
    ),
  },
  [NET_WORTH_OVERLAY]: {
    width: 255,
    height: 92,
    devLoadPath: path.resolve(__dirname, `${filePathLocations.overlaysDev}/NetWorth/netWorth.html`),
    prodLoadPath: path.resolve(
      __dirname,
      `${filePathLocations.overlaysProd}/NetWorth/netWorth.html`
    ),
  },
};
export {
  browserWindows,
  browserWindowsConfig,
  MAIN_BROWSER_WINDOW,
  LOG_MONITOR_OVERLAY,
  NET_WORTH_OVERLAY,
};
