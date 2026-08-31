import React, {useEffect, useRef, useState} from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MingBotApi from "../Services/MingBotApi";
import "../styles/mingBot.css";

const MESSAGES_KEY = "mingBotMessages";
const SESSION_KEY = "mingBotSessionId";
const WELCOME_CONTENT = "Hello from Ming Bot - your Ming House AI Assistant! You can ask me about our menu, hours, location, or recommendations. It is important to know that I am just an AI assistant and my answers may be wrong.";

const createWelcomeMessage = () => ({
    id: crypto.randomUUID(),
    role: "assistant",
    content: WELCOME_CONTENT,
    timestamp: Date.now()
});

const readStoredMessages = () => {
    try {
        const storedMessages = localStorage.getItem(MESSAGES_KEY);
        if (!storedMessages) return [createWelcomeMessage()];

        const parsedMessages = JSON.parse(storedMessages);
        if (parsedMessages[0]?.role === "assistant") {
            parsedMessages[0] = {...parsedMessages[0], content: WELCOME_CONTENT};
        }
        return parsedMessages;
    } catch {
        return [createWelcomeMessage()];
    }
};

export default function MingBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [messages, setMessages] = useState(readStoredMessages);
    const [input, setInput] = useState("");
    const [sessionId, setSessionId] = useState(() => localStorage.getItem(SESSION_KEY));
    const [isLoading, setIsLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const closeTimerRef = useRef(null);

    useEffect(() => {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages, isLoading]);

    useEffect(() => {
        if (sessionId) localStorage.setItem(SESSION_KEY, sessionId);
    }, [sessionId]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    useEffect(() => () => clearTimeout(closeTimerRef.current), []);

    const openChat = () => {
        clearTimeout(closeTimerRef.current);
        setIsClosing(false);
        setIsOpen(true);
    };

    const closeChat = () => {
        if (!isOpen || isClosing) return;
        setIsClosing(true);
        closeTimerRef.current = setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 220);
    };

    const submitMessage = async (event) => {
        event?.preventDefault();
        const message = input.trim();
        if (isLoading || !message) return;

        const request = sessionId === null
            ? {message}
            : {session_id: sessionId, message};

        setMessages(previous => [...previous, {
            id: crypto.randomUUID(),
            role: "user",
            content: message,
            timestamp: Date.now()
        }]);
        setInput("");
        setIsLoading(true);

        try {
            const result = await MingBotApi.chat(request);
            setSessionId(result.session_id);
            setIsOnline(true);
            setMessages(previous => [...previous, {
                id: crypto.randomUUID(),
                role: "assistant",
                content: result.answer,
                timestamp: Date.now()
            }]);
        } catch (error) {
            setIsOnline(false);
            setMessages(previous => [...previous, {
                id: crypto.randomUUID(),
                role: "assistant",
                content: error.response?.data?.detail || "Sorry, something went wrong. Please try again.",
                timestamp: Date.now()
            }]);
        } finally {
            setIsLoading(false);
            setInput("");
        }
    };

    const resetChat = async () => {
        const sessionToReset = sessionId;
        localStorage.removeItem(MESSAGES_KEY);
        localStorage.removeItem(SESSION_KEY);
        setSessionId(null);
        setMessages([createWelcomeMessage()]);
        setInput("");

        if (sessionToReset) {
            try {
                await MingBotApi.reset({session_id: sessionToReset});
                setIsOnline(true);
            } catch {
                // The local reset remains authoritative if a server session expired.
            }
        }
        inputRef.current?.focus();
    };

    return (
        <aside className="ming-bot-widget" aria-label="Ming Bot assistant">
            {isOpen && (
                <section className={`ming-bot-panel ${isClosing ? "ming-bot-panel--closing" : ""}`}>
                    <header className="ming-bot-header">
                        <div className="ming-bot-title-wrap">
                            <span className="ming-bot-title">Ming Bot</span>
                            <span className={`ming-bot-status ${isOnline ? "" : "ming-bot-status--offline"}`}>
                                <span />{isOnline ? "Online" : "Connection issue"}
                            </span>
                        </div>
                        <div className="ming-bot-header-actions">
                            <button type="button" onClick={closeChat} aria-label="Close Ming Bot">
                                <CloseRoundedIcon />
                            </button>
                        </div>
                    </header>

                    <>
                            <div className="ming-bot-messages" aria-live="polite">
                                {messages.map(message => (
                                    <div key={message.id} className={`ming-bot-message-row ming-bot-message-row--${message.role}`}>
                                        {message.role === "assistant" && (
                                            <span className="ming-bot-avatar" aria-hidden="true">
                                                <img src="/images/LogoSquare.png" alt="" />
                                            </span>
                                        )}
                                        <div>
                                            <div className="ming-bot-message">{message.content}</div>
                                            <time>{new Date(message.timestamp).toLocaleTimeString([], {hour: "numeric", minute: "2-digit"})}</time>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="ming-bot-message-row ming-bot-message-row--assistant">
                                        <span className="ming-bot-avatar" aria-hidden="true">
                                            <img src="/images/LogoSquare.png" alt="" />
                                        </span>
                                        <div className="ming-bot-typing" aria-label="Ming Bot is typing">
                                            <span /><span /><span />
                                        </div>
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </div>

                            <form className="ming-bot-input" onSubmit={submitMessage}>
                                <label>
                                    <span className="ming-bot-sr-only">Message Ming Bot</span>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Ask Ming Bot…"
                                        value={input}
                                        onChange={event => setInput(event.target.value)}
                                        maxLength={2000}
                                    />
                                </label>
                                <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send message">
                                    <SendRoundedIcon />
                                </button>
                            </form>
                            <button className="ming-bot-reset" type="button" onClick={resetChat}>
                                <AddRoundedIcon /> New chat
                            </button>
                    </>
                </section>
            )}

            <button
                className={`ming-bot-launcher ${isOpen ? "ming-bot-launcher--open" : ""}`}
                type="button"
                aria-expanded={isOpen}
                aria-label={isOpen ? "Close Ming Bot" : "Open Ming Bot"}
                onClick={isOpen ? closeChat : openChat}
            >
                {isOpen ? <CloseRoundedIcon /> : <><img src="/images/LogoSquare.png" alt="" /><span>Ask Ming Bot</span></>}
            </button>
        </aside>
    );
}
