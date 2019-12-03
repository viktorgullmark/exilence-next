import { electronService } from '../services/electron.service';

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
}
