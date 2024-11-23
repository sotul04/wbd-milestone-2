import Cookies from "js-cookie";

export function login(token: string) {
    const expires = new Date(new Date().getTime() + 60 * 60 * 1000);
    Cookies.set('jwt', token, {expires, secure: true, sameSite: 'Strict'});
}

export function logout() {
    Cookies.remove('jwt');
}

export function getToken() {
    return Cookies.get('jwt');
}