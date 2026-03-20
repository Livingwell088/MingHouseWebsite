

const Menu_REST_API = 'https://minghousewebsite-backend.onrender.com/menu/getMenu';

// localhost:8080/menu/getMenu

class APIService {
    getMenu() {
        return fetch(Menu_REST_API, {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
            },
            'credenitals': 'same-origin'
        })
            .then(res => res.json())
    }
}


export default new APIService()