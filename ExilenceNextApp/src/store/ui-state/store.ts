import { observable } from 'mobx';

export class UiStateStore {
    @observable state = "pending" // "pending" / "done" / "error"
}