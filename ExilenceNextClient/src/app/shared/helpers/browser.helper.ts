export class BrowserHelper {
    public static getBrowserLang() {
        return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
    }
}
