export class ColourUtils {
    public static rgbToHex(r: number, g: number, b: number) {
        return '#' + ColourUtils.componentToHex(r) + ColourUtils.componentToHex(g) + ColourUtils.componentToHex(b);
    }

    public static componentToHex(c: number) {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
}
