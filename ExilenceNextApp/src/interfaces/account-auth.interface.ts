import { IProfile } from './profile.interface';

export interface IAccountAuth {
    uuid: string;
    name: string;
    token: string;
    profiles: IProfile[];
}
