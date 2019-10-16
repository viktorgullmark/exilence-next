import { electronService } from "./electron.service";

export const authService = {
    setAuthCookie,
    isLoggedIn
};

function setAuthCookie(sessionId: string) {
    removeAuthCookie();

    const cookie = {
        url: 'https://www.pathofexile.com',
        name: 'POESESSID',
        value: sessionId,
        domain: '.pathofexile.com',
        path: '/',
        secure: false,
        httpOnly: false,
        expirationDate: undefined
    };

    electronService.remote.session.defaultSession.cookies.set(cookie, (error: any) => {});
}

function removeAuthCookie() {
    electronService.remote.session.defaultSession.cookies.remove('https://www.pathofexile.com', 'POESESSID', (error: any) => {});
}

function isLoggedIn() {
    // todo: implement and check directly against state instead
    return false;
}

