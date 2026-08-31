import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_MING_BOT_API_URL || "http://127.0.0.1:8001";
const API_TIMEOUT_MS = Number(process.env.REACT_APP_MING_BOT_API_TIMEOUT_MS || 70000);

const mingBotClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT_MS,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    }
});

const MingBotApi = {
    chat: async (request) => {
        const result = await mingBotClient.post("/chat", request);
        return result.data;
    },
    reset: async (request) => {
        const result = await mingBotClient.post("/chat/reset", request);
        return result.data;
    }
};

export default MingBotApi;
