

export function accessToken() {

    return localStorage.getItem('file_manager_access_token');


}

export function setToken(token) {

    localStorage.setItem('file_manager_access_token', token);

}


export function isLoggedIn() {

    const token = localStorage.getItem('file_manager_access_token');

    return token != null;
}