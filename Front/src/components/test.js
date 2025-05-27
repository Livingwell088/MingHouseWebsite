
import * as React from 'react';
import APIService from '../test'
import MenuServiceFetch from "../Services/MenuServiceFetch";
import {Grid} from "@mui/material";
import {Col, Row} from "react-bootstrap";
import '../styles/fonts.css';
import "../styles/menuComponent.css"
import MenuCard from "./MenuCard";


export default class q extends React.Component {



    constructor(props) {
        super(props);

        this.state = {
            menu: [],
            categories: [],
            types: []
        }
    }

    t = (type) => {
        if (type == "All"){
            let current = this.state.types.slice(1)
            this.setState({categories: current});
        }
        else{
            this.setState({categories: [type]});

        }
        // window.location.reload()
    }


    async componentDidMount() {
        const res = await fetch('/menu/getMenu');
        const body = await res.json();

        // this.setState({menu: body})
        // MenuServiceFetch.getMenu().then((res) => {
        //     this.setState({menu: res})
        // });

        let categories = new Set()

        // console.log(menu.category)
        for (let i = 0; i < body.length; i++){
            categories.add(body[i].category)
        }
        categories = Array.from(categories)

        let menus = Array.from(body)

        let newMenu = []
        let newMenuId = []
        for (let i = 0; i < menus.length; i++){
            if (newMenuId.includes(menus[i].number)){
                for (let n = 0; n < newMenu.length; n++){
                    if (newMenu[n].number == menus[i].number){
                        newMenu[n].size = newMenu[n].size.concat(",", menus[i].size)
                        newMenu[n].price = newMenu[n].price.concat(",", menus[i].price)
                    }
                }
            }
            else{
                newMenu.push(menus[i])
                newMenuId.push(menus[i].number)
            }

        }

        newMenu.sort(function(a,b){
            return a.id - b.id;
        });

        this.setState({menu: newMenu})


        let types = {}
        for (let i = 0; i < categories.length; i++){
            types[categories[i]] = menus.filter((item) => item.category === categories[i])

        }


        categories = ["Appetizer", "Soup", "Chow Mein", "Fried Rice", "Lo Mein", "Mei Fun",
        "Pork", "Poultry", "Beef", "Seafood", "Egg Foo Young", "Sweet And Sour", "Vegetable",
        "Moo Shu", "Special Combination Plates", "Chefs Specialties", "All Day Special", "Special Healthy Diet",
        "Other", "Lunch Special", "American Dishes"]

        // console.log(this.state.menu)
        this.setState({categories: categories})

        categories = ["All", "Appetizer", "Soup", "Chow Mein", "Fried Rice", "Lo Mein", "Mei Fun",
        "Pork", "Poultry", "Beef", "Seafood", "Egg Foo Young", "Sweet And Sour", "Vegetable",
        "Moo Shu", "Special Combination Plates", "Chefs Specialties", "All Day Special", "Special Healthy Diet",
        "Other", "Lunch Special", "American Dishes"]
        this.setState({types: categories})

        // this.setState({types: types})
        // console.log(types)


    }

    render() {
        const {menu, categories, types} = this.state



        return (
            <div>
                <Row id={"menuRow"}>
                    <Col xs={1}></Col>
                    <Col xs={2}>
                        <ul id={"foodTypes"} >
                            {
                                this.state.types.map(current =>
                                    <li onClick={() => this.t(current)}>{current}</li>
                                )
                            }
                        </ul>
                    </Col>
                    <Col xs={9}>
                        {
                            this.state.categories.map(current =>
                                <Row>
                                    <h2 className={"headers spicy-rice-regular"}>{current}</h2>
                                    {
                                        menu.filter((type) => type.category === current).map(item => {
                                            // console.log(item.number);
                                            return <Col className={"col-6"}><MenuCard number={item.number} name={item.name} size={item.size} price={item.price} menu={item}/></Col>
                                        })


                                    }
                                </Row>
                            )
                        }

                    </Col>
                </Row>

            </div>
        )
    }

}



