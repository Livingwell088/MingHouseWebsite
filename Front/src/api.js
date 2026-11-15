import axios from "axios";
import {rememberedAdminToken, rememberAdminToken, forgetAdminToken} from './Services/AdminDeviceStorage';

let apiToken = null;
let apiTokenFetchTime = new Date();
// Password credentials live only in memory. Remembered devices use a revocable token.
let adminAuthorization = null;

export function clearAdminCredentials() {
    adminAuthorization = null;
    forgetAdminToken();
}

export function clearCustomerSession() {
    ['customerToken','guestToken','username','sessionId','loggedIn','checkoutAttempt'].forEach(key => sessionStorage.removeItem(key));
}
let sessionPending;
export function ensureCustomerSession() {
    if (!sessionPending) sessionPending = (async () => {
        if (sessionStorage.getItem('customerToken')) {
            try {
                const {data} = await Api().get('/users/me');
                if (!data.guest) { sessionStorage.setItem('username',data.usernameId); sessionStorage.setItem('loggedIn','true'); }
                return;
            } catch (e) { if (e.response?.status !== 401 && e.response?.status !== 403) throw e; }
        }
        clearCustomerSession();
        await API.cartAPI.generate();
    })().finally(() => { sessionPending = null; });
    return sessionPending;
}

function Api(adminRequest = false) {
    const axiosConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        timeout: 10000,
    };
    const local = ['localhost','127.0.0.1'].includes(window.location.hostname);
    axiosConfig.baseURL = process.env.REACT_APP_API_URL || (local ? 'http://localhost:8080' : 'https://minghousewebsite-backend.onrender.com');
    if (adminRequest && adminAuthorization) {
        axiosConfig.headers.Authorization = adminAuthorization;
        axiosConfig.headers["X-Admin-Request"] = "true";
    } else if (adminRequest) {
        const deviceToken = rememberedAdminToken();
        if (deviceToken) {
            axiosConfig.headers['X-Admin-Token'] = deviceToken;
            axiosConfig.headers['X-Admin-Request'] = 'true';
        }
    }
    const token = sessionStorage.getItem('customerToken');
    if (token && !adminRequest) axiosConfig.headers['X-Customer-Token'] = token;
    // axiosConfig.baseURL = "http://localhost:8080";
    // http://localhost:8080

    const client = axios.create(axiosConfig);
    client.interceptors.response.use(response => {
        if (response.headers['x-customer-token']) sessionStorage.setItem('customerToken', response.headers['x-customer-token']);
        return response;
    }, error => {
        if (error.response?.status === 401 && (axiosConfig.headers.Authorization || axiosConfig.headers['X-Admin-Token'])) {
            clearAdminCredentials();
            window.dispatchEvent(new Event('admin-session-ended'));
        }
        return Promise.reject(error);
    });
    return client;
}


async function checkToken(){
    return apiToken;
}

const dayHours = {0: {"open" : "12:00", "close": "22:30"},
    1: {"open" : "11:00", "close": "22:30"},
    2: {"open" : "11:00", "close": "22:30"},
    3: {"open" : "11:00", "close": "22:30"},
    4: {"open" : "11:00", "close": "22:30"},
    5: {"open" : "11:00", "close": "23:00"},
    6: {"open" : "11:00", "close": "23:00"},

}


// /**
//  * Return
//  */
const compareTime = (time1, time2) => {
    const hour1 = parseInt(time1.split(":")[0])
    const min1 = parseInt(time1.split(":")[1])

    const hour2 = parseInt(time2.split(":")[0])
    const min2 = parseInt(time2.split(":")[1])

    if (time1 == time2) {
        return 0
    }

    if (hour1 < hour2){
        return -1
    }
    else if (hour1 > hour2){
        let hours = hour1 - hour2
        let mins = min1 - min2;

        if (mins < 0){
            hours -=1;
            mins += 60
        }

        return (hours * 60) + mins;
    }
    else{
        if (min1 < min2){
            return -1
        }
        else{
            return min1 - min2
        }
    }
}

const appropriateTime = (current, timeWanted) => {
    if (compareTime(timeWanted, current) === -1){
        return false
    }
    else {
        if (compareTime(timeWanted, current) >= 15){
            return true;
        }

        return false
    }
}


const isBetweenHours = (start, end, current) => {

    const startHour = parseInt(start.split(":")[0])
    const endHour = parseInt(end.split(":")[0])
    const currentHour = parseInt(current.split(":")[0])

    const startMin = parseInt(start.split(":")[1])
    const endMin = parseInt(end.split(":")[1])
    const currentMin = parseInt(current.split(":")[1])

    if (endHour < currentHour){
        return false
    }
    else {
        if (currentHour === endHour){
            if (endMin - currentMin < 30){
                return false
            }
        }

    }

    return true
}

const addToTimes = (current, end, want) => {

    const wantHour = parseInt(want.split(":")[0])
    const endHour = parseInt(end.split(":")[0])
    const currentHour = parseInt(current.split(":")[0])

    const wantMin = parseInt(want.split(":")[1])
    const endMin = parseInt(end.split(":")[1])
    const currentMin = parseInt(current.split(":")[1])

    if (currentHour > wantHour || endHour < wantHour){
        return false
    }
    else {
        if (wantHour === endHour){
            // console.log(want)
            // console.log(current)
            if (endMin - wantMin < 30){
                return false
            }
        }
        else if (currentHour === wantHour){
            if (wantMin - currentMin < 20){
                return false
            }
        }
    }
    return true

}

const addTime = (time, timeToAdd) =>  {

    let timeHour = parseInt(time.split(":")[0])
    let timeMin = parseInt(time.split(":")[1])

    while (timeToAdd > 0){

        if (timeToAdd + timeMin >= 60){
            timeHour += 1;
            timeToAdd -= (60 - timeMin);
            timeMin = 0;
        }
        else{
            timeMin += timeToAdd;
            timeToAdd = 0
        }
    }

    return timeHour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + timeMin.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})

}

const formatTime = (time) => {

    let timeHour = parseInt(time.split(":")[0])
    let timeMin = parseInt(time.split(":")[1])

    if (timeHour < 12) {
        return time + " AM"
    }
    else{
        return (timeHour - 12) + ":" + timeMin.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + " PM"
    }
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


const API = {
    storeAPI: {
        ordering: () => Api().get('/store/ordering'),
    },
    adminAPI: {
        ordering: () => Api(true).get('/admin/ordering'),
        setOrdering: enabled => Api(true).put('/admin/ordering', {enabled}),
        login: async (username, password, remember = false) => {
            const bytes = new TextEncoder().encode(`${username}:${password}`);
            adminAuthorization = `Basic ${btoa(String.fromCharCode(...bytes))}`;
            try {
                const session = await Api(true).get('/admin/session');
                if (remember) {
                    const {data} = await Api(true).post('/admin/devices');
                    try {rememberAdminToken(data.token);}
                    catch (storageError) {
                        // Do not leave a valid server token behind if the browser cannot save it.
                        await Api(true).post('/admin/devices/logout', null, {headers: {'X-Admin-Token': data.token}});
                        throw new Error('This browser cannot remember devices. Uncheck Remember this device and try again.');
                    }
                    adminAuthorization = null;
                } else forgetAdminToken();
                return session;
            } catch (error) {
                clearAdminCredentials();
                throw error;
            }
        },
        notifications: () => Api(true).get('/admin/notifications'),
        retryNotification: id => Api(true).post('/admin/notifications/' + id + '/retry'),
        session: () => Api(true).get('/admin/session'),
        logout: async () => {
            try {if (rememberedAdminToken()) await Api(true).post('/admin/devices/logout');}
            catch (error) {if (error.response?.status !== 401) throw error;}
            finally {clearAdminCredentials();}
        },
        revokeDevices: async () => {
            await Api(true).post('/admin/devices/revoke-all');
            clearAdminCredentials();
            window.dispatchEvent(new Event('admin-session-ended'));
        },
    },
    priceAPI: {
        price: (price) => {

            const value = Number(price);

            if (!Number.isFinite(value)) {
                return "0.00";
            }

            return value.toFixed(2);
        }
    },
    menuAPI: {
        get: async () => {
            const result = await (Api().get("/menu/getMenu"))
            // console.log(result.data)

            return result //.data
        },
        getByNumber: async (number) => {

            const result = await (Api().get("/menu/numbers/" + number))
            // console.log(result.data)

            return result;
        },
        edit: async (menuItem) => {

            return await Api(true).put("/menu/edit", menuItem, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            });
        }
    },
    cartAPI: {

        // String cartName, Double cartPrice, Integer quantity, Menu item, String specialInstruction
        create: async (cartName, cartPrice, quantity, item, cartId, specialInstruction) => {
            let cart = {
                // id: id,
                orderName: cartName,
                orderPrice: cartPrice,
                quantity: quantity,
                item: item,
                cartId: cartId,
                specialInstruction: specialInstruction
            };

            // console.log({...cart})

            return await Api().post("/carts/add", {...cart}, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            })

        },
        get: async (cartId) => {
            const result = await (Api().get("/carts/getCarts/" + cartId))
            // console.log(result.data)

            return result //.data
        },
        edit: async (id, cartName, cartPrice, quantity, item, specialInstruction, cartId) => {
            let cart = {
                id: id,
                orderName: cartName,
                orderPrice: cartPrice,
                quantity: quantity,
                item: item,
                cartId: cartId,
                specialInstruction: specialInstruction
            };

            // console.log({...cart})

            return await Api().put("/carts/" + cartId, {...cart}, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            })
        },
        // delete: async (id) => {
        //     return await Api().delete("/carts/" + id);
        // },

        delete: async (cartName, cartPrice, quantity, item, cartId, specialInstruction) => {
            let cart = {
                // id: id,
                orderName: cartName,
                orderPrice: cartPrice,
                quantity: quantity,
                item: item,
                cartId: cartId,
                specialInstruction: specialInstruction
            };

            return await Api().post("/carts/delete", {...cart}, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            })
        },
        deleteById: async (id) => {
            return await Api().post("/carts/deleteById/" + id, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            })
        },
        generate: async () => {

            const result = await (Api().get("/carts/generate"));
            if (!result.headers['x-customer-token']) throw new Error('The server did not issue a guest credential');
            sessionStorage.setItem('sessionId', result.data);
            sessionStorage.setItem('guestToken', result.headers['x-customer-token']);
            sessionStorage.setItem('loggedIn', 'false');

            return result
        },

        cartLogin: async(cartId, username) => {

            return await Api().post("carts/cartLogin/" + username, cartId, {
                headers: {
                    'X-Guest-Token': sessionStorage.getItem('guestToken') || '',
                    Accept: "text/plain",
                    "Content-Type": "text/plain",
                },
                timeout: 10000,
            })
        }
    },

    orderAPI: {
        submission: key => Api().get('/orders/submissions/' + encodeURIComponent(key)),
        create: async (orderName, orderPrice, orderType, username, address, phoneNumber, specialInstruction, orderTime, orderItems, customerEmail, requestKey) => {

            const date = new Date();
            const currentDate = months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
            const currentTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()

            // console.log(currentDate)
            // console.log(currentTime)
            let user = {}

            await API.userAPI.getUser(username)
                .then(r => {
                    user = r.data
                })
                .catch((error) => console.log(error.message))


            let order = {
                orderName: date.getMonth().toString() + date.getDate().toString() + date.getFullYear().toString(),
                orderPrice: orderPrice,
                requestKey: requestKey,
                orderType: orderType,
                user: {...user, email: customerEmail === undefined ? user.email : customerEmail.trim()},
                address: address,
                phoneNumber: phoneNumber,
                specialInstructions: specialInstruction,
                orderTime: orderTime,
                datePlaced: currentDate,
                timePlaced: currentTime,
                items: orderItems
            }

            return await Api().post("/orders/placeOrder", {...order}, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            })

        },
        get: async () => {
            const result = await (Api(true).get("/orders/getAllOrders"))
            // console.log(result.data)

            return result //.data
        },
        getOrderByUser: async (usernameId) => {
            const result = await (Api().get("/orders/getOrder/" + usernameId))
            // console.log(result.data)

            return result //.data
        },
        updateStatus: async (id, status) => {
            return await Api(true).put(`/orders/${id}/status`, {
                status: status
            });
        }
    },

    userAPI: {
        updateContact: contact => Api().put('/users/contact', contact),
        create: async(usernameId, password, firstName, lastName, email, isGuest) => {

            let user = {
                usernameId: usernameId,
                password: password,
                firstName: firstName,
                lastName: lastName,
                email: email,
                guest: isGuest
            }

            return await Api().post("/users/add", {...user}, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            })
        },

        get: async() => {

            const result = await (Api(true).get("/users/getAllUsers"))
            // console.log(result.data)

            return result //.data
        },

        validate: async(user, pass) => {

            let current = {
                usernameId: user,
                password: pass
            }
            return await Api().post("/users/validate", {...current}, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            })

        },

        getUser: async(userId) => {

            return await Api().get("/users/getUser/" + encodeURIComponent(userId || sessionStorage.getItem("username") || sessionStorage.getItem("sessionId")), {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            })
        }
    },
    timeAPI: {
        get: () => {
            const date = new Date();
            const currentTime = date.getHours()
                + ':' + date.getMinutes()

            const hours = []

            const todaysHour = dayHours[(date.getDay())]


            let start = todaysHour.open;

            while (compareTime(start, todaysHour.close) === -1){
                if (appropriateTime(currentTime, start)){
                    hours.push(formatTime(start))
                }
                start = addTime(start, 15)
            }


            return hours;
        },
        compare: (time1, time2) => {
            return compareTime(time1, time2)
        },

        getDate: () => {
            const date = new Date();
            // console.log(date);
            // return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
            const currentDate = months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
            const currentTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()

            return currentDate;
        }
    }
}


export default API;
