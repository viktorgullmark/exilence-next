const checkForMissingWindow = ({mainWindow, category}) => {
  if(mainWindow) return;
  throw new Error(`[${category}] Main Window is not present`);
}

module.exports = checkForMissingWindow;