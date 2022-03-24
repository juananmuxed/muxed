/**
* Set cookies
*
* @package cookies
* @param {string} cookieName Name of the cookie
* @param {string} cookieValue Content of the cookie
* @param {number} expirationDays Days to expire -> Default 7
* @param {string} path Path for the cookie -> Default '/'
*/
const setCookie = (cookieName: string, cookieValue: string, expirationDays: number = 7, path: string = "/"): void => {
    const date = new Date();
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * expirationDays);

    document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}; expires=${date.toUTCString()}; path=${path}`;
}

/**
* Get cookie
*
* @package cookies
* @param {string} cookieName Name of the cookie, if no passed, return Array of all cookies
* @returns {Array<String> | String | null} Content of the cookie
*/
const getCookie = (cookieName: string = ""): Array<string> | string | null => {
    if (cookieName === '') {
        let decodedCookie = decodeURIComponent(document.cookie);
        return decodedCookie.split(";");
    } else {
        const cookies = document.cookie.split(";");
        for (let x = 0; x < cookies.length; x++) {
            let cookie = cookies[x].split("=");
            if (cookieName == cookie[0].trim()) {
                return decodeURIComponent(cookie[1]);
            }
        }
        return null;
    }
}

/**
* Delete a cookie
*
* @package cookies
* @param {string} cookieName Name of the cookie
* @param {string} path Path for the cookie -> Default '/'
*/
const deleteCookie = (cookieName: string, path: string = "/") => {
    document.cookie = `${cookieName}=; expires=${new Date(+0)}; path=${path}`;
}

export { setCookie, getCookie, deleteCookie }