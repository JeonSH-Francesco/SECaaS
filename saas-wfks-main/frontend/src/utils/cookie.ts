
const setCookie = (key: string, value: string) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    const cookieString = `${key}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieString;
};

const getCookie = (key: string): string | null => {
    const name = key + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
};

export { setCookie, getCookie };
