import { call, put, takeEvery, takeLatest, fork, all } from 'redux-saga/effects'

// worker Saga: will be fired on INIT_SESSION actions
function* doSomething(action: any) {
    yield put({ type: "INIT_SESSION_SUCCESS" });
}

function* sessionSagas () {
    yield all([
        takeLatest("INIT_SESSION", doSomething),
        // add sagas here
      ]);
}

export default sessionSagas;