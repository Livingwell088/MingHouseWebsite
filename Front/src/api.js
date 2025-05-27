import axios from "axios";

let apiToken = null;
let apiTokenFetchTime = new Date();

function Api() {
    const axiosConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        timeout: 10000,
    };
    axiosConfig.baseURL = "http://localhost:8080";
    return axios.create(axiosConfig);
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
    priceAPI: {
        price: (price) => {
            return price.toFixed(2);
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

            const result = await (Api().get("/carts/generate"))

            return result
        },

        cartLogin: async(cartId, username) => {

            return await Api().post("carts/cartLogin/" + username, cartId, {
                headers: {
                    Accept: "text/plain",
                    "Content-Type": "text/plain",
                },
                timeout: 10000,
            })
        }
    },

    orderAPI: {
        create: async (orderName, orderPrice, orderType, username, address, phoneNumber, specialInstruction, orderTime, orderItems) => {

            const date = new Date();
            const currentDate = months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
            const currentTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()

            // console.log(currentDate)
            // console.log(currentTime)
            let user = {}

            await API.userAPI.getUser(username)
                .then(r => {
                    user = r.data
                    console.log(r.data)
                })
                .catch((error) => console.log(error.message))

            console.log("GetUser: " + user)


            let order = {
                orderName: date.getMonth().toString() + date.getDate().toString() + date.getFullYear().toString(),
                orderPrice: orderPrice,
                orderType: orderType,
                user: user,
                address: address,
                phoneNumber: phoneNumber,
                specialInstruction: specialInstruction,
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
            const result = await (Api().get("/orders/getOrders"))
            // console.log(result.data)

            return result //.data
        },
        getOrderByUser: async (usernameId) => {
            const result = await (Api().get("/orders/getOrder/" + usernameId))
            // console.log(result.data)

            return result //.data
        }
    },

    userAPI: {
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

            const result = await (Api().get("/users/getAllUsers"))
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

            return await Api().get("/users/getUser/" + userId, {
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

            const hours = ["ASAP"]

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
        }
    }
}


export default API;