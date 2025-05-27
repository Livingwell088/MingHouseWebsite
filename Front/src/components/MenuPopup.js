import MenuCard from "./MenuCard";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import Image from 'react-bootstrap/Image';
import "../styles/menuPopup.css"
import '../styles/fonts.css';
import API from "../api";

// import dumpling from "/"

const MenuPopup = (props) => {

    const [show, setShow] = useState(false)
    const [count, setCount] = useState(1)



    // String orderName, Double orderPrice, Integer quantity, Menu item, String specialInstruction
    const addToCart = (name, total, quantity, item, instructions, todo, id) => {

        let addTo = sessionStorage.getItem("sessionId").toString()

        if (sessionStorage.getItem("loggedIn") === "true"){
            addTo = sessionStorage.getItem("username").toString()
        }

        if (todo === "Add"){
            API.cartAPI.create(
                name.toString(), total, quantity, item, addTo, instructions
            )
                .then(r => console.log(r))
                .catch((error) => console.log(error.message))


            props.onClose()
        }
        else{

            if (quantity === 0){
                // API.cartAPI.deleteById(id)
                //     .then(r => console.log(r))
                //     .catch((error) => console.log(error.message))
                // // console.log("Attempt to delete")
                // // console.log(id, name.toString(), props.quantity * props.item.price, props.quantity, props.item, props.instructions, props.addTo)
                // // API.cartAPI.delete()

                API.cartAPI.edit(
                    id, name.toString(), total, quantity, item, instructions, addTo
                )
                    .then(r => console.log(r))
                    .catch((error) => console.log(error.message))
            }
            else{
                // console.log(name.toString(), total, quantity, item, sessionStorage.getItem("sessionId").toString(), instructions)
                API.cartAPI.edit(
                    id, name.toString(), total, quantity, item, instructions, addTo
                )
                    .then(r => console.log(r))
                    .catch((error) => console.log(error.message))

            }


            props.update()
            props.onClose()
        }



    }
    //
    const [total, setTotal] = useState(props.item.filter(obj => obj.size === (props.size || props.item[0].size))[0].price)
    const [sizeChosen, setSizeChosen] = useState(props.size || props.item[0].size)
    const [instructions, setInstructions] = useState(props.instructions || "")


    const onChange = (event) => setInstructions(event.target.value);


    let sizes = []
    for (let i = 0; i < props.item.length; i++){
        if (props.item[i].name === props.name){
            sizes.push(i)
        }
    }

    const clearStates = () => {
        setCount(props.quantity)
        if (props.do !== "Edit"){
            setSizeChosen(props.item[0].size)
            setTotal(props.item.filter(obj => obj.size === (props.size || props.item[0].size))[0].price)

        }
        else{
            setSizeChosen(props.size)
            setTotal(props.item.filter(obj => obj.size === (props.size || props.item[0].size))[0].price)

            // setTotal(props.item)
        }

    }

    const closeModal = () => {
        clearStates()
        props.onClose()
    }

    useEffect(() => {
        console.log(props)
        if (props.do === "Edit"){
            // console.log("Entered")
            setTotal(props.item.filter(obj => obj.size === (props.size || props.item[0].size))[0].price)
            props.update()
            setCount(props.quantity)
        }
        else{
            // setCount(1)
            setCount(props.quantity)

        }
    }, [props.quantity]);

    // console.log(props)


    return (
        <>

            <Modal show={props.show}
                   // onHide={props.onClose}
                   onHide={closeModal}
                // cancel={props.onClose}
                   backdrop="static"
                   keyboard={false}
                   size="lg"
                   aria-labelledby="contained-modal-title-vcenter"
                   centered
                   className={"popup teko"}
                   onClick={e => e.stopPropagation()}
            >

                <Modal.Header closeButton={true}>
                    {/*<Modal.Title>{props.name}</Modal.Title>*/}
                    {/*<Modal.Title>{props.item.filter(obj => obj.size === sizeChosen).name}</Modal.Title>*/}

                </Modal.Header>

                <Modal.Body style={{margin: "auto"}}>
                    <Image src={"/images/" + props.item[0].number + ".png"} className={"menuImg"}
                           style={{width: "100%",
                               margin: "auto"}}
                           rounded />
                </Modal.Body>

                <Modal.Body>
                    <Form style={{width: "80%",
                        margin: "auto"
                    }}>
                        <Button onClick={() => {
                            console.log(props.item)

                            console.log(props.item.filter(obj => obj.size === (props.size || props.item[0].size))[0].price)
                            console.log(total)
                            console.log(total * count)
                        }}>Test</Button>

                        {

                            sizes.map((current, index) => {

                                // console.log(props.item[current].price)
                                // console.log(total)

                                if (sizes.length === 1){
                                    if (props.item[current].size === ""){
                                        return <Form.Check
                                            id={current}
                                            name={"options"}
                                            type={"radio"}
                                            label={"$" + props.item[current].price}
                                            value={props.item[current].price}
                                            checked={total === props.item[current].price}
                                            onChange={() => {
                                                setTotal(props.item[current].price)
                                                setSizeChosen(0)
                                            }}

                                        />
                                    }
                                    else if (props.item[current].size !== "("){
                                        return <Form.Check
                                            id={current}
                                            name={"options"}
                                            type={"radio"}
                                            label={"(" + props.item[current].size + ") : $" + props.item[current].price}
                                            value={props.item[current].price}
                                            checked={total === props.item[current].price}
                                            onChange={() => {
                                                setTotal(props.item[current].price)
                                                setSizeChosen(0)
                                            }}

                                        />
                                    }
                                    else{
                                        return <Form.Check
                                            id={current}
                                            name={"options"}
                                            type={"radio"}
                                            label={props.item[current].size + ": $" + props.item[current].price}
                                            value={props.item[current].price}
                                            checked={total === props.item[current].price}
                                            onChange={() => {
                                                setTotal(props.item[current].price)
                                                setSizeChosen(0)
                                            }}

                                        />
                                    }
                                }
                                else{
                                    // console.log(sizes)
                                    return <Form.Check
                                        id={current}
                                        name={"options"}
                                        type={"radio"}
                                        value={props.item[current].price}
                                        label={props.item[current].size + ": $" + props.item[current].price}
                                        checked={sizeChosen === props.item[current].size}
                                        onChange={() => {
                                            setTotal(props.item[current].price)
                                            setSizeChosen(props.item[current].size)
                                        }}
                                    />
                                }
                            })}



                    </Form>
                </Modal.Body>

                <Modal.Body>
                    <Form.Control as="textarea" rows={3} className={"specialText"} placeholder="Special Instructions" value={instructions} onChange={onChange}/>
                </Modal.Body>

                <Modal.Footer style={{width: "100%"}} justify-content-between>
                    {/*<Row style={{width: "100%"}}>*/}
                    <Button className={"mr-auto mingButtonOutline"} variant="secondary" onClick={() => {
                        if (props.do === "Edit") {
                            if (count >= 1) {
                                setCount(count - 1)
                            }
                        }
                        else {
                            if (count >= 2) {
                                setCount(count - 1)
                            }
                        }
                    }}>
                        -
                    </Button>
                    <h2>{count}</h2>
                    <Button className={"mingButtonOutline"} variant="secondary" onClick={() => {
                        setCount(count + 1)
                    }}>
                        +
                    </Button>

                    <Button className={"mingButton"} variant="primary" onClick={() => {
                        let id = null;
                        if (props.do === "Edit") {
                            id = props.id;
                        }

                        let itemSize = {}
                        for (let q = 0; q < props.item.length; q++) {
                            if (props.item[q].size === sizeChosen) {
                                itemSize = props.item[q]
                            }
                        }

                        addToCart(props.name, total * count, count, itemSize, instructions, props.do, id)
                    }}>Add ${API.priceAPI.price(total * count)}</Button>

                </Modal.Footer>


            </Modal>

        </>
    )
}


export default MenuPopup;