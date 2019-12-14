
import { AxiosResponse } from 'axios';
import axios from 'axios-observable';
import { forkJoin, Observable, throwError } from 'rxjs';
import RateLimiter from 'rxjs-ratelimiter';
import { map } from 'rxjs/operators';
import { ItemUtils } from '../utils/item.utils';
import { ICharacter } from '../interfaces/character.interface';
import { IItem } from '../interfaces/item.interface';
import { ILeague } from '../interfaces/league.interface';
import { IPricedItem } from '../interfaces/priced-item.interface';
import { IStash, IStashTab } from '../interfaces/stash.interface';
import { IStashTabSnapshot } from './../interfaces/stash-tab-snapshot.interface';
import { IGithubRelease } from '../interfaces/github/github-release.interface';

const rateLimiter = new RateLimiter(5, 10000);
const poeUrl = 'https://www.pathofexile.com';
const apiUrl = 'https://api.pathofexile.com';

export const externalService = {
    getLatestRelease,
    getStashTab,
    getStashTabs,
    getItemsForTabs,
    getLeagues,
    getCharacters
};

/* #region github.com */
function getLatestRelease() {
   return axios.get<IGithubRelease>('https://api.github.com/repos/viktorgullmark/exilence-next/releases/latest'); 
}
/* #endregion */

/* #region pathofexile.com */
function getStashTab(account: string, league: string, index: number): Observable<AxiosResponse<IStash>> {
    const parameters = `?league=${league}&accountName=${account}&tabIndex=${index}&tabs=1`;
    return rateLimiter.limit(
        axios.get<IStash>(poeUrl + '/character-window/get-stash-items' + parameters)
    );
}

function getStashTabs(account: string, league: string): Observable<AxiosResponse<IStash>> {
    const parameters = `?league=${league}&accountName=${account}&tabs=1`;
    return rateLimiter.limit(
        axios.get<IStash>(poeUrl + '/character-window/get-stash-items' + parameters)
    );
}

function getItemsForTabs(tabs: IStashTab[], account: string, league: string) {
    if(tabs.length === 0) {
        return throwError(new Error('no_stash_tabs_selected_for_profile'));
    }
    // todo: reset fetched tabs count
    return forkJoin(((tabs).map((tab: IStashTab) => {
        return getStashTab(account, league, tab.i).pipe(map((stash: AxiosResponse<IStash>) => {
            // todo: increment fetched tabs count
            const items = {
                items: stash.data.items.map((item: IItem) => {
                    return {
                        id: item.id,
                        name: ItemUtils.getItemName(item.typeLine, item.name),
                        typeLine: item.typeLine,
                        frameType: item.frameType,
                        calculated: 0,
                        elder: item.elder,
                        shaper: item.shaper,
                        icon: item.icon,
                        ilvl: item.ilvl,
                        tier: item.properties !== null && item.properties !== undefined ? ItemUtils.getMapTier(item.properties) : 0,
                        corrupted: item.corrupted || false,
                        links: item.sockets !== undefined && item.sockets !== null ? ItemUtils.getLinks(item.sockets.map(t => t.group)) : 0,
                        sockets: item.sockets !== undefined && item.sockets !== null ? item.sockets.length : 0,
                        quality: item.properties !== null && item.properties !== undefined ? ItemUtils.getQuality(item.properties) : 0,
                        level: item.properties !== null && item.properties !== undefined ? ItemUtils.getLevel(item.properties) : 0,
                        stackSize: item.stackSize || 1,
                        totalStacksize: item.maxStackSize || 1,
                        variant: item.sockets !== undefined && item.sockets !== null ? ItemUtils.getItemVariant(item.sockets, item.explicitMods, ItemUtils.getItemName(item.typeLine, item.name)) : ''
                    } as IPricedItem;
                })
            };
            return <IStashTabSnapshot>{ ...{ stashTabId: tab.id }, ...items };
        }));
    })));
}

function getLeagues(type: string = 'main', compact: number = 1): Observable<AxiosResponse<ILeague[]>> {
    const parameters = `?type=${type}&compact=${compact}`;
    return rateLimiter.limit(
        axios.get<ILeague[]>(apiUrl + '/leagues' + parameters));
}

function getCharacters(account: string): Observable<AxiosResponse<ICharacter[]>> {
    const parameters = `?accountName=${account}`;
    return rateLimiter.limit(
        axios.get<ICharacter[]>(poeUrl + '/character-window/get-characters' + parameters));
}

/* #endregion */