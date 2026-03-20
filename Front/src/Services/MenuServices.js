import axios from 'axios'

const MENU_REST_API_URL = 'https://minghousewebsite-backend.onrender.com/menu';
// http://localhost:8080/menu

class MenuServices {

    getMenu(){
        return axios.get(MENU_REST_API_URL)
    }
}

export default new MenuServices();