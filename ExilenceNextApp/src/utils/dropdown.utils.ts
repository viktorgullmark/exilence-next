// todo: make more generic
export function getDropdownSelection<T extends { id: string }>(
  items: T[],
  activeId?: string
): string {
  const item = activeId ? items.find((i) => i.id === activeId) : undefined;
  if (item) {
    return item.id;
  } else if (items.length > 0) {
    return items[0].id;
  }
  return '';
}

export function getNameDropdownSelection<T extends { name: string }>(
  items: T[],
  activeName?: string
): string {
  const item = activeName ? items.find((i) => i.name === activeName) : undefined;
  if (item) {
    return item.name;
  } else if (items.length > 0) {
    return items[0].name;
  }
  return '';
}

export function mapDomainToDropdown<T extends { uuid: string }>(items: T[]) {
  return items.map((item) => {
    return {
      id: item.uuid,
      ...item,
    };
  });
}
