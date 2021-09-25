import { BrowserWindow } from 'electron';

type CheckForMissingWindowProps = {
  mainWindow: BrowserWindow | null;
  category: string;
};

const checkForMissingWindow = ({ mainWindow, category }: CheckForMissingWindowProps) => {
  if (mainWindow) return;
  throw new Error(`[${category}] Main Window is not present`);
};

export default checkForMissingWindow;
