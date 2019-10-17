import { observable, action } from 'mobx'
import { AccountDetails } from '../../interfaces/account-details.interface';
import { persist } from 'mobx-persist'

export class AccountStore {
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