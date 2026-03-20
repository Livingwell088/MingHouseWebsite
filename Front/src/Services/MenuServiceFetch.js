
const MENU_REST_API_URL = 'https://minghousewebsite-backend.onrender.com/menu/getMenu';

// http://localhost:8080/menu/getMenu

class MenuServiceFetch {

    getMenu() {
        return fetch(MENU_REST_API_URL).then((res => res.json()))
    }
}


export default new MenuServiceFetch();