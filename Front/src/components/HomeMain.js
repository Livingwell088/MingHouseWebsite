import {Button} from "react-bootstrap";
import React from "react";
import '../styles/App.css';

export default function HomeMain() {

    return (
        <div style={{
            display: "flex",
            height: "100vh",
            alignItems: "center"
        }} className="hero">

            {/* LEFT SIDE */}
            <div style={{
                flex: 1.15,
                // padding: "90px",
                color: "white",
                flexDirection: "column",
                // justifyContent: "center",
                display: "flex",
            }} className="hero-left">
                {/* TEXT HERE */}
                <h1 className={"kolker-brush-regular fontDark fontLarge"} style={{
                    marginBottom: "20px",
                }}>
                    Ming House</h1>

                <p className={"teko fontDark"} style={{textAlign: "left"}}>Located at 217A Chandler St, Worcester MA 01609,
                    We offer a wide range of delicious Chinese Cuisine.</p>

                <div className="hero-buttons">
                    <Button id="hero-order-btn"> Order Online </Button>
                    <Button id="menu-btn"> View Menu </Button>
                </div>





            </div>

            {/* RIGHT SIDE */}
            <div style={{
                flex: 0.85,
                height: "100%",
                position: "relative",
            }} className="hero-right">
                <img
                    src="/images/dumpling.png"
                    style={{
                        width: "100%",
                        height: "80%",
                        objectFit: "cover",
                        transform: "scale(1.05)",
                        // marginRight: "-50px"
                    }}
                />

                <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "linear-gradient(to left, transparent 40%, #0f0f0f 90%)"
                }} />
            </div>

        </div>
    )
}