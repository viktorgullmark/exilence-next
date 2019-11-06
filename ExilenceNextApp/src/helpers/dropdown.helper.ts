export class DropdownHelper {
  public static getDropdownSelection<T extends { uuid: string }>(
    items: T[],
    activeUuid?: string
  ): string {
    const item = activeUuid
      ? items.find(i => i.uuid === activeUuid)
      : undefined;
    if (item) {
      return item.uuid;
    } else if (items.length > 0) {
      return items[0].uuid;
    }
    return '';
  }
}
