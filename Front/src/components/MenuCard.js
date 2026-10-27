import Card from 'react-bootstrap/Card';
import "../styles/menuCard.css"
import Typography from "@mui/material/Typography";
import {Button, Col, Row} from "react-bootstrap";
import MenuPopup from "./MenuPopup";
import {useState} from "react";
import Image from "react-bootstrap/Image";
import {useMenuPhoto} from "../Services/MenuPhotos";


const MenuCard = (props) => {

    // const handleShow = () => setShowPopup(true);
    // const handleClose = () => setShowPopup(false);

    const {photo, onPhotoError} = useMenuPhoto(props.number);


    // console.log(props)

    // const toggleModal = () => {
    //     setShowPopup(!showPopup)
    // };

    let sizes = []
    for (let i = 0; i < props.size.length; i++){
        sizes.push(i)
    }



    return (

        // <Card className={"menuCard"}  onClick={handleShow} >
        //
        //     <Card.Title>{props.number + ". " + props.name}</Card.Title>
        //     <Card.Body className={"cardBody1"}>
        //         <Row>
        //
        //             <Col>
        //     { sizes.map(current => {
        //
        //             if (sizes.length === 1){
        //                 if (props.size[current] === ""){
        //                     return <div >{"$" + props.price[current]}</div>;
        //                 }
        //                 else if (props.size[current][0] !== "("){
        //                     return <div >{"(" + props.size[current] + ") : $" + props.price[current]}</div>;
        //                 }
        //                 else{
        //                     return <div >{props.size[current] + ": $" + props.price[current]}</div>;
        //                 }
        //             }
        //             else{
        //                 return <div >{props.size[current] + ": $" + props.price[current]}</div>;
        //             }
        //
        //     })
        //
        //     }
        //             </Col>
        //             <Button className={"addButton square-md"} onClick={handleShow} rounded>+</Button>
        //             <MenuPopup show={showPopup} onClose={handleClose} id={props.id} name={props.name} item={props.menu} quantity={1} do={"Add"}/>
        //
        //         {/*    id={props.id} name={props.name} number={props.number} size={props.size} price={props.price} item={props.menu}*/}
        //         </Row>
        //     </Card.Body>
        //
        //
        //
        // </Card>

        // onClick={handleShow}

        <Card className={"menuCard teko"} onClick={() => props.onOpen(props.menu)} >

            {/*<Image src={"/images/" + props.number + ".png"} className={"menuCardImage"}*/}
            {/*       rounded/>*/}

            {/*<div className="menuCardImage noImage">*/}
            {/*    <span>Appetizer</span>*/}
            {/*</div>*/}

            {photo ? (
                <img
                    src={photo}
                    className="menuCardImage"
                    onError={onPhotoError}
                    alt={props.name}
                />
            ) : (
                <div className="menuCardImage noImage">
                    <span className="noImageLabel">Photo coming soon</span>
                </div>
            )}

            <Card.Body className="menuCardBody">
                <Card.Title className="menuCardTop">
                    <h5>{props.number + ". " + props.name}</h5>
                    <span className="menuCardPrice">${props.price[0]}</span>
                </Card.Title>

                <Button className="menuCardBottom"  onClick={(e) => {
                    e.stopPropagation();
                    props.onOpen(props.menu);
                }}>
                    Add to Cart
                </Button>
            </Card.Body>

        </Card>

    );

};

export default MenuCard;
