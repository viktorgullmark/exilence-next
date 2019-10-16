import { observable, action } from 'mobx'
import { AccountDetails } from './../../interfaces/account-details.interface';
import { create, persist } from 'mobx-persist'

export class SessionStore {
    @persist('object') @observable accountDetails: AccountDetails = { account: '', sessionId: '' };
    @observable state = "pending" // "pending" / "done" / "error"

    @action
    initSession(details: AccountDetails) {
        this.accountDetails = details;
        this.initSessionSuccess();
    }

    @action.bound
    initSessionSuccess() {
        this.state = "done"
    }

    @action.bound
    initSessionError(error: string) {
        console.log(error);
        this.state = "error"
    }
}

export const sessionStore = new SessionStore()