const { app, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const localSettingsFile = 'local-settings.json';
// Saving localSettings in AppData so auto-updater won't overwrite/recreate the file with defaults
const localSettingsFileLocation = path.join(app.getPath('userData'), localSettingsFile);
const localSettingsExist = fs.existsSync(localSettingsFileLocation);

const defaultLocalSettings = {
  isHardwareAccelerationEnabled: true,
  releaseChannel: 'latest'
}

function loadLocalSettings() {
  if(!localSettingsExist) {
    fs.writeFileSync(localSettingsFileLocation, JSON.stringify(defaultLocalSettings))
  }

  const data = fs.readFileSync(localSettingsFileLocation);
  const { isHardwareAccelerationEnabled } = JSON.parse(data);

  /**
   * Hardware Acceleration
   */
  if(!isHardwareAccelerationEnabled) {
    app.disableHardwareAcceleration();
  }

  ipcMain.on('hardware-acceleration', (_event, isHardwareAccelerationEnabled) => {
    const localData = fs.readFileSync(localSettingsFileLocation);
    fs.writeFileSync(localSettingsFileLocation, JSON.stringify({...JSON.parse(localData), isHardwareAccelerationEnabled}))
  })

  /**
   * Release Channel
   */
  ipcMain.on('release-channel', (_event, releaseChannel) => {
    const localData = fs.readFileSync(localSettingsFileLocation);
    fs.writeFileSync(localSettingsFileLocation, JSON.stringify({...JSON.parse(localData), releaseChannel}))
  })
}

function getLocalSettings() {
  if(!localSettingsExist) return defaultLocalSettings;
  const data = fs.readFileSync(localSettingsFileLocation);
  return data ? JSON.parse(data) : defaultLocalSettings;
}

module.exports = {
  loadLocalSettings,
  getLocalSettings
}