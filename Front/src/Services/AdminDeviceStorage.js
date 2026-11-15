export const ADMIN_DEVICE_KEY = 'minghouse.adminDevice';

export function rememberedAdminToken() {
    try {return localStorage.getItem(ADMIN_DEVICE_KEY) || null;}
    catch (error) {return null;}
}

export function rememberAdminToken(token) {
    localStorage.setItem(ADMIN_DEVICE_KEY, token);
}

export function forgetAdminToken() {
    try {localStorage.removeItem(ADMIN_DEVICE_KEY);}
    catch (error) { /* Storage may be disabled in private browsing. */ }
}
