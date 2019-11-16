export class DropdownHelper {
  // todo: make more generic so we can split up methods
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

  public static getLeagueSelection<T extends { id: string }>(
    items: T[],
    activeId?: string
  ): string {
    const item = activeId
      ? items.find(i => i.id === activeId)
      : undefined;
    if (item) {
      return item.id;
    } else if (items.length > 0) {
      return items[0].id;
    }
    return '';
  }
}
