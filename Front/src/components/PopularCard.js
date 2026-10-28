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
                <button
                    type="button"
                    className="dish-open-button"
                    aria-label={`Choose #${props.number} ${props.name}`}
                    disabled={props.disabled}
                    onClick={props.onOpen}
                />
                <CardImg className="card-img-top" src={props.image} alt={props.name} loading="lazy"/>


                <CardContent className="dish-content">
                    <span className="dish-number teko">#{props.number}</span>
                    <h3 className="teko">{props.name}</h3>
                    <p className="dancing-script">{props.description}</p>
                </CardContent>

                <CardFooter className="dish-footer">
                    <span className="price teko">{props.price ? `${props.fromPrice ? 'From ' : ''}$${props.price}` : 'See menu'}</span>
                    <span className="add-btn" aria-hidden="true">+</span>
                </CardFooter>

            </Card>

        </>
    )
}


export default PopularCard;
