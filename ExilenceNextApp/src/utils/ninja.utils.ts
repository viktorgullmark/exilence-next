export function getNinjaLeagueUrl(league: string) {
  if (league === 'hardcore' || league === 'standard') {
    return league;
  } else {
    if (league.indexOf('hardcore') > -1) {
      return 'challengehc';
    } else {
      return 'challenge';
    }
  }
}

export function getNinjaTypeUrl(type: string) {
  return `${type.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()}s`
    .replace('prophecys', 'prophecies')
    .replace('accessorys', 'accessories')
    .replace('currencys', 'currency')
    .replace('fragmentss', 'fragments');
}
