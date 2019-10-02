
import axios, { AxiosResponse } from 'axios';
import { Observable, from, forkJoin } from 'rxjs';
import RateLimiter from 'rxjs-ratelimiter';
import { Stash, Tab } from '../interfaces/stash.interface';
import { map } from 'rxjs/operators';
import { PricedItem } from '../interfaces/priced-item.interface';
import { League } from '../interfaces/league.interface';
import { Character } from '../interfaces/character.interface';
import { Item } from '../interfaces/item.interface';
import { ItemHelper } from '../helpers/item.helper';

const rateLimiter = new RateLimiter(5, 10000);
const poeUrl = 'https://www.pathofexile.com';
const apiUrl = 'https://api.pathofexile.com';

export const externalService = {
    getStashTab,
    getStashTabs,
    getItemsForTabs,
    getLeagues,
    getCharacters
};

/* #region pathofexile.com */
function getStashTab(account: string, league: string, index: number): Observable<AxiosResponse<Stash>> {
    const parameters = `?league=${league}&accountName=${account}&tabIndex=${index}&tabs=1`;
    return rateLimiter.limit(
        from(axios.get<Stash>(poeUrl + '/character-window/get-stash-items' + parameters))
    );
}

function getStashTabs(account: string, league: string): Observable<AxiosResponse<Stash>> {
    const parameters = `?league=${league}&accountName=${account}&tabs=1`;
    return rateLimiter.limit(
        from(axios.get<Stash>(poeUrl + '/character-window/get-stash-items' + parameters))
    );
}

function getItemsForTabs(tabs: Tab[], account: string, league: string) {
    // todo: reset fetched tabs count
    
    return forkJoin(((tabs).map((tab: Tab) => {
        return getStashTab(account, league, tab.i).pipe(map((stash: AxiosResponse<Stash>) => {
            // todo: increment fetched tabs count
            const tabData = {
                league: league, items: stash.data.items.map((item: Item) => {
                    return {
                        id: item.id,
                        name: ItemHelper.getItemName(item.typeLine, item.name),
                        typeLine: item.typeLine,
                        frameType: item.frameType,
                        calculated: 0,
                        elder: item.elder,
                        shaper: item.shaper,
                        icon: item.icon,
                        ilvl: item.ilvl,
                        tier: item.properties !== null && item.properties !== undefined ? ItemHelper.getMapTier(item.properties) : 0,
                        corrupted: item.corrupted || false,
                        links: item.sockets !== undefined && item.sockets !== null ? ItemHelper.getLinks(item.sockets.map(t => t.group)) : 0,
                        sockets: item.sockets !== undefined && item.sockets !== null ? item.sockets.length : 0,
                        quality: item.properties !== null && item.properties !== undefined ? ItemHelper.getQuality(item.properties) : 0,
                        level: item.properties !== null && item.properties !== undefined ? ItemHelper.getQuality(item.properties) : 0,
                        stackSize: item.stackSize || 1,
                        totalStacksize: item.maxStackSize || 1,
                        variant: item.sockets !== undefined && item.sockets !== null ? ItemHelper.getItemVariant(item.sockets, item.explicitMods) : ''
                    } as PricedItem;
                })
            } as Tab;
            return { ...tab, ...tabData };
        }));
    })));
}

function getLeagues(type: string = 'main', compact: number = 1): Observable<AxiosResponse<League[]>> {
    const parameters = `?type=${type}&compact=${compact}`;
    return rateLimiter.limit(
        from(axios.get<League[]>(apiUrl + '/leagues' + parameters)));
}

function getCharacters(account: string): Observable<AxiosResponse<Character[]>> {
    const parameters = `?accountName=${account}`;
    return rateLimiter.limit(
        from(axios.get<Character[]>(poeUrl + '/character-window/get-characters' + parameters)));
}

/* #endregion */