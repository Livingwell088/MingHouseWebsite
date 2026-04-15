import '../styles/fonts.css';
import '../styles/HomePopular.css';
import {CardFooter, CardImg, Image} from "react-bootstrap";
import * as React from "react";
import Card from "react-bootstrap/Card";
import {CardContent} from "@mui/material";


const PopularCard = (props) => {

    return (
        <>
            <Card className="dish-card">
                <CardImg className="card-img-top" src={"/images/1.png"}/>


                <CardContent className="dish-content">
                    <h3 className="teko">{props.name}</h3>
                    <p className="dancing-script">{props.description}</p>
                </CardContent>

                <CardFooter className="dish-footer">
                    <span className="price teko">${props.price}</span>
                    <button className="add-btn">+</button>
                </CardFooter>

            </Card>

        </>
    )
}


export default PopularCard;
