import Card from 'react-bootstrap/Card';
import "../styles/menuCard.css"
import Typography from "@mui/material/Typography";
import {Button, Col, Row} from "react-bootstrap";
import MenuPopup from "./MenuPopup";
import {useState} from "react";


const MenuCard = (props) => {

    const [showPopup, setShowPopup] = useState(false)
    const handleShow = () => setShowPopup(true);
    const handleClose = () => setShowPopup(false);

    // console.log(props)

    const toggleModal = () => {
        setShowPopup(!showPopup)
    };

    let sizes = []
    for (let i = 0; i < props.size.length; i++){
        sizes.push(i)
    }



    return (
        <Card className={"menuCard"}  onClick={handleShow} >

            <Card.Title>{props.number + ". " + props.name}</Card.Title>
            <Card.Body className={"cardBody1"}>
                <Row>

                    <Col>
            {
                sizes.map(current => {

                    if (sizes.length === 1){
                        if (props.size[current] === ""){
                            return <div >{"$" + props.price[current]}</div>;
                        }
                        else if (props.size[current][0] !== "("){
                            return <div >{"(" + props.size[current] + ") : $" + props.price[current]}</div>;
                        }
                        else{
                            return <div >{props.size[current] + ": $" + props.price[current]}</div>;
                        }
                    }
                    else{
                        return <div >{props.size[current] + ": $" + props.price[current]}</div>;
                    }

            })

            }
                    </Col>
                    <Button className={"addButton square-md"} onClick={handleShow} rounded>+</Button>
                    <MenuPopup show={showPopup} onClose={handleClose} id={props.id} name={props.name} item={props.menu} quantity={1} do={"Add"}/>

                {/*    id={props.id} name={props.name} number={props.number} size={props.size} price={props.price} item={props.menu}*/}
                </Row>
            </Card.Body>



        </Card>
    );

    // if (props.price){
    //     return(
    //
    //     );
    // }
};

export default MenuCard;
