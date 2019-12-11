import { electronService } from '../services/electron.service';
import { MouseEvent } from 'react';

export class WindowUtils {
  public static maximize() {
    electronService.remote.getCurrentWindow().maximize();
  }

  public static unmaximize() {
    electronService.remote.getCurrentWindow().unmaximize();
  }

  public static minimize() {
    electronService.remote.getCurrentWindow().minimize();
  }

  public static close() {
    electronService.remote.getCurrentWindow().close();
  }

  public static openLink(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    let link = event.currentTarget.href;
    electronService.shell.openExternal(link);
  }
}
