export class ColourHelper {
    public static rgbToHex(r: number, g: number, b: number) {
        return "#" + ColourHelper.componentToHex(r) + ColourHelper.componentToHex(g) + ColourHelper.componentToHex(b);
    }

    public static componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}
