import '../styles/fonts.css';
import '../styles/HomePopular.css';

import {Component} from "react";
import PopularCard from "./PopularCard";



export default function HomePopular() {


    return (
        <>

            <section className="popular-section">
                <h2 className="trade-winds-regular">Most Popular Dishes</h2>
                <p className="teko">Signature Favorites from Ming House</p>

                <div className="popular-grid">
                    <PopularCard
                        name="General Tso’s Chicken"
                        description="Crispy chicken tossed in a sweet spicy sauce"
                        price="12.95"
                        image="/images/general-tso.jpg"
                    />
                    <PopularCard
                        name="General Tso’s Chicken"
                        description="Crispy chicken tossed in a sweet spicy sauce"
                        price="12.95"
                        image="/images/general-tso.jpg"
                    />
                    <PopularCard
                        name="General Tso’s Chicken"
                        description="Crispy chicken tossed in a sweet spicy sauce"
                        price="12.95"
                        image="/images/general-tso.jpg"
                    />
                </div>
            </section>

        </>
    )

}