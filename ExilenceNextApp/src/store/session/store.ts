import { observable, action } from 'mobx'
import { AccountDetails } from './../../interfaces/account-details.interface';

export class SessionStore {
    @observable accountDetails: AccountDetails = { account: '', sessionId: '' };
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