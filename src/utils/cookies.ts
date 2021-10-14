const setCookie = (cookieName: string, cookieValue: string, expirationDays: number = 7, path: string = "/"): void => {
    const date = new Date();
    date.setTime(date.getTime() + 24*60*60*1000*expirationDays);
    const expiration = date.toUTCString();

    document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}; expires=${date.toUTCString()}; path=${path}`;
}

const getCookie = (cookieName: string = ""): Array<String> | String | null => {
    if(cookieName === '') {
        let decodedCookie = decodeURIComponent(document.cookie);
        return decodedCookie.split(";");
    } else {
        const cookies = document.cookie.split(";");
        for (let x = 0; x < cookies.length; x++) {
            let cookie = cookies[x].split("=");
            if(cookieName == cookie[0].trim()) {
                return decodeURIComponent(cookie[1]);
            }
        }
        return null;
    }
}

const deleteCookie = (cookieName: string, path: string = "/") => {
    
}

export { setCookie, getCookie }