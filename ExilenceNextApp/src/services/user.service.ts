import axios from 'axios';
import { from, Observable, throwError, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const apiUrl = 'https://localhost:57369';

export const userService = {
    login,
    logout,
    isAuthorized
};

function login(username: any, password: any): Observable<any> {
    return from(axios.post(`${apiUrl}/users/authenticate`, {
        username: username,
        password: password
    })).pipe(switchMap((res: any) => {
        if (res.status !== 200) {
            if (res.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }
    
            const error = (res && res.message) || res.statusText;
            return throwError(error);
        }
    
        return of(res.data);
    })).pipe(switchMap((user: any) => {  

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));

        return of(user);
    }));
}

function logout() {
    localStorage.removeItem('user');
}

function isAuthorized() {
    return localStorage.getItem('user') !== null;
}