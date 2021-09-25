import { app, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { RELEASE_CHANNELS } from '../enums';

const localSettingsFile = 'local-settings.json';
// Saving localSettings in AppData so auto-updater won't overwrite/recreate the file with defaults
const localSettingsFileLocation = path.join(app.getPath('userData'), localSettingsFile);
const localSettingsExist = fs.existsSync(localSettingsFileLocation);

const defaultLocalSettings = {
  isHardwareAccelerationEnabled: true,
  releaseChannel: RELEASE_CHANNELS.LATEST_STABLE,
  appExitAction: 'minimize-to-tray',
};

function loadLocalSettings() {
  if (!localSettingsExist) {
    fs.writeFileSync(localSettingsFileLocation, JSON.stringify(defaultLocalSettings));
  }

  const data = fs.readFileSync(localSettingsFileLocation);
  const { isHardwareAccelerationEnabled } = JSON.parse(data.toString());

  /**
   * Hardware Acceleration
   */
  if (!isHardwareAccelerationEnabled) {
    app.disableHardwareAcceleration();
  }

  ipcMain.on('hardware-acceleration', (_event, isHardwareAccelerationEnabled) => {
    const localData = fs.readFileSync(localSettingsFileLocation);
    fs.writeFileSync(
      localSettingsFileLocation,
      JSON.stringify({ ...JSON.parse(localData.toString()), isHardwareAccelerationEnabled })
    );
  });

  /**
   * Release Channel
   */
  ipcMain.on('release-channel', (_event, releaseChannel) => {
    const localData = fs.readFileSync(localSettingsFileLocation);
    fs.writeFileSync(
      localSettingsFileLocation,
      JSON.stringify({ ...JSON.parse(localData.toString()), releaseChannel })
    );
  });

  /**
   * When clicking X (close window)
   */
  ipcMain.on('app-exit-action', (_event, appExitAction) => {
    const localData = fs.readFileSync(localSettingsFileLocation);
    fs.writeFileSync(
      localSettingsFileLocation,
      JSON.stringify({ ...JSON.parse(localData.toString()), appExitAction })
    );
  });
}

function getLocalSettings() {
  if (!localSettingsExist) return defaultLocalSettings;
  const data = fs.readFileSync(localSettingsFileLocation);
  return data ? JSON.parse(data.toString()) : defaultLocalSettings;
}

export { loadLocalSettings, getLocalSettings };
