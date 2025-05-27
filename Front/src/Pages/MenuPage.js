// import logo from './logo.svg';
import '../styles/menuPage.css';
import Appbar from "../components/Appbar"
import MenuComponent from "../components/MenuComponent";
import {Component} from "react";
import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import '../App';
import {Container, CssBaseline} from "@mui/material";
import Typography from "@mui/material/Typography";
import '../styles/fonts.css';
import API from "../api";
import axios from "axios";

const MenuPage = (props) => {

    const [menu, setMenu] = useState([]);
    // const [categories, setCategories] = useState([]);
    // const [types, setTypes] = useState([]);


    useEffect( () => {
        API.menuAPI.get()
            .then((data) => {
                // console.log(data)
                setMenu(data.data)
            })
            .catch((error) => console.log(error.message))



    }, [])

    var menus = JSON.parse(JSON.stringify(menu));
    // let menus = Array.from(menu)
    // console.log(menus)

    const result = Object.groupBy(menus, ({ number }) => number);

    // console.log(result.size)

    // const newMenu = JSON.parse(JSON.stringify(result))
    // console.log(newMenu)
    //
    // let newMenu = []
    // let count = 0
    // for (let i = 0; i < menus.length; i++){
    //     if (menus[i].number === count)
    // }
    // let newMenuId = []
    // for (let i = 0; i < menus.length; i++) {
    //     if (newMenuId.includes(menus[i].number)) {
    //         for (let n = 0; n < newMenu.length; n++) {
    //             if (newMenu[n].number === menus[i].number) {
    //                 newMenu[n].size = newMenu[n].size.concat(",", menus[i].size)
    //                 newMenu[n].price = newMenu[n].price.concat(",", menus[i].price)
    //             }
    //         }
    //     }
    // // }
    //     else{
    //         newMenu.push(menus[i])
    //         newMenuId.push(menus[i].number)
    //     }
    // //
    // }
    //
    // newMenu.sort(function(a,b){
    //     return a.id - b.id;
    // });

    const categories = ["Lunch Special", "American Dishes", "Appetizer", "Soup", "Chow Mein", "Fried Rice", "Lo Mein", "Mei Fun",
        "Pork", "Poultry", "Beef", "Seafood", "Egg Foo Young", "Sweet And Sour", "Vegetable",
        "Moo Shu", "Special Combination Plates", "Chefs Specialties", "All Day Special", "Special Healthy Diet",
        "Other"]


    const types = ["All", "Lunch Special", "American Dishes", "Appetizer", "Soup", "Chow Mein", "Fried Rice", "Lo Mein", "Mei Fun",
        "Pork", "Poultry", "Beef", "Seafood", "Egg Foo Young", "Sweet And Sour", "Vegetable",
        "Moo Shu", "Special Combination Plates", "Chefs Specialties", "All Day Special", "Special Healthy Diet",
        "Other"]

    // console.log(menu)
    return (
        <>
            {/*<p>{menu}</p>*/}
            <CssBaseline />
            <div className="App teko">
                <main>
                    <h1 className={"dancing-script fontDark"}>Menu</h1>
                    <div>

                        <div id={"cont"}>

                            <MenuComponent menu={result} categories={categories} types={types}/>


                            {/*{groups.map(group =>*/}
                            {/*    <div key={group.id}>*/}
                            {/*        {group.name}, {group.size}*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>
                    </div>
                </main>
                {/*<header className="App-header">*/}
                {/*    <img src={logo} className="App-logo" alt="logo" />*/}
                {/*    <div className="App-intro">*/}
                {/*        <h2>JUG List</h2>*/}
                {/*        {groups.map(group =>*/}
                {/*            <div key={group.id}>*/}
                {/*                {group.name}, {group.size}*/}
                {/*            </div>*/}
                {/*        )}*/}
                {/*    </div>*/}
                {/*</header>*/}
            </div>
        </>
    );
}

export default MenuPage;
