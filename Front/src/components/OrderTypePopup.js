import {Col, Modal, Row} from "react-bootstrap";
import Card from "react-bootstrap/Card";


const MenuPopup = (props) => {


    return <div>
        <Modal show={props.show}
               onHide={props.onClose}
               backdrop="static"
               keyboard={false}
               size="lg"
               aria-labelledby="contained-modal-title-vcenter"
               centered
               className={"popup teko"}
               onClick={e => e.stopPropagation()}
        >
            <Modal.Header closeButton={true}>
                <Modal.Title>Select Order Type</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{margin: "auto"}}>

                <Row>
                    <Col>
                        <Card onClick={() => {
                            props.test("Pickup")
                            props.onClose()
                        }}>
                            <Card.Body>
                                Pickup
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col>
                        <Card>
                            <Card.Body onClick={() => {
                                props.test("Delivery")
                                props.onClose()
                            }}>
                                Delivery
                            </Card.Body>

                        </Card>
                    </Col>
                </Row>

            </Modal.Body>
        </Modal>
    </div>



}



export default MenuPopup;