
export class ExportHelper {
    public static mapToNetWorthExport(items: any[]) {
        return items.map(x => {
            return {
                NAME: x.name,
                QUANTITY: x.stackSize,
                VALUE: x.calculated,
                TOTAL: x.total
            };
        });
    }
}
