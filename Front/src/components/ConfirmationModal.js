import { Image, Modal } from "react-bootstrap";
import API from "../api";
import "../styles/Confirmation.css";

const ConfirmationModal = ({ show, onClose, order }) => {
    if (!order) return null;

    const items = order.items ?? [];
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = Number(order.orderPrice || 0);
    const delivery = Number(order.deliveryFee ?? (order.orderType === "Delivery" ? 2 : 0));
    const tax = Number(order.tax ?? (subtotal + delivery) * 0.07);
    const total = Number(order.total ?? (subtotal + delivery) * 1.07);
    const money = value => `$${API.priceAPI.price(value)}`;

    return (
        <Modal
            show={show}
            onHide={onClose}
            backdrop="static"
            keyboard={false}
            centered
            scrollable
            className="order-confirmation"
            backdropClassName="order-confirmation-backdrop"
            aria-labelledby="order-confirmation-title"
            aria-describedby="order-confirmation-description"
            onClick={event => event.stopPropagation()}
        >
            <Modal.Header closeButton>
                <Image src="/images/LogoOneLine.png" alt="Ming House" className="receipt-logo" />
            </Modal.Header>

            <Modal.Body>
                <div className="receipt-intro">
                    <span className="receipt-check" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none"><path d="m6 12 4 4 8-8" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <h2 id="order-confirmation-title">Order received</h2>
                    <p id="order-confirmation-description">Thank you for ordering from Ming House.</p>
                </div>

                <section className="receipt-details" aria-label="Order information">
                    <div className="receipt-reference">
                        <span>Order number</span>
                        <strong>{order.orderName}</strong>
                    </div>
                    <div className="receipt-fulfillment">
                        <div><span>Order type</span><strong>{order.orderType}</strong></div>
                        <div><span>Requested time</span><strong>{order.orderTime}</strong></div>
                    </div>
                </section>

                <section className="receipt-summary" aria-labelledby="receipt-summary-title">
                    <div className="receipt-section-heading">
                        <h3 id="receipt-summary-title">Your order</h3>
                        <span>{totalItems} {totalItems === 1 ? "item" : "items"}</span>
                    </div>
                    <ul className="receipt-items">
                        {items.map((item, index) => (
                            <li key={item.id ?? index} className="receipt-item">
                                <span className="receipt-quantity" aria-label={`Quantity ${item.quantity}`}>{item.quantity}×</span>
                                <div className="receipt-item-copy">
                                    <strong>{item.item?.name || item.orderName}</strong>
                                    {item.item?.size && <span className="receipt-item-size">{item.item.size}</span>}
                                    {item.specialInstruction && <p className="receipt-item-note">{item.specialInstruction}</p>}
                                </div>
                                <strong className="receipt-price">{money(item.orderPrice)}</strong>
                            </li>
                        ))}
                    </ul>
                    <dl className="receipt-totals">
                        <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
                        {order.orderType === "Delivery" && <div><dt>Delivery fee</dt><dd>{money(delivery)}</dd></div>}
                        <div><dt>Tax</dt><dd>{money(tax)}</dd></div>
                        <div className="receipt-total"><dt>Total</dt><dd>{money(total)}</dd></div>
                    </dl>
                </section>
            </Modal.Body>

            <Modal.Footer>
                <p className="receipt-help">Questions about your order? <a href="tel:15087566888">Call (508) 756-6888</a></p>
                <button type="button" className="receipt-home" onClick={onClose}>Back to Home <span aria-hidden="true">→</span></button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
