package com.example.Restaurant.Service;

import com.example.Restaurant.model.CartItem;
import com.example.Restaurant.model.Orders;
import com.example.Restaurant.model.StoreUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.util.Locale;

@Service
public class OrderNotificationService {
    private static final Logger log = LoggerFactory.getLogger(OrderNotificationService.class);
    private final com.example.Restaurant.Repository.MailOutboxRepository outbox;
    private final String restaurantEmail;

    public OrderNotificationService(com.example.Restaurant.Repository.MailOutboxRepository outbox,
            @Value("${restaurant.orders.email:Livingwell088@gmail.com}") String restaurantEmail) {
        this.outbox = outbox;
        this.restaurantEmail = restaurantEmail;
    }

    public void sendOrderEmails(Orders order) {
        String details = buildTicket(order);
        String reference = subjectText(order.getOrderName());
        String type = subjectText(order.getOrderType()).toUpperCase(Locale.US);
        send(restaurantEmail, "NEW " + type + " ORDER #" + reference + " - "
                + subjectText(order.getOrderTime()),
                wrap("New order", "An order has been received through the Ming House website. Order details are below.", details), order);

        String customerEmail = order.getUser() == null ? null : order.getUser().getEmail();
        if (customerEmail != null && !customerEmail.isBlank()) {
            send(customerEmail.trim(), "Ming House: order #" + reference + " received",
                    wrap("We received your order", "Thank you for ordering from Ming House. Your order details are below. "
                            + "For questions about your order, call <a href='tel:15087566888'>(508) 756-6888</a>.", details), order);
        }
    }

    private void send(String recipient, String subject, String body, Orders order) {
        var mail = new com.example.Restaurant.model.MailOutbox();
        mail.orderId=order.getId(); mail.recipient=recipient; mail.subject=subject; mail.body=body;
        mail.audience=recipient.equals(restaurantEmail) ? "restaurant" : "customer";
        outbox.save(mail);
    }

    static String buildTicket(Orders order) {
        StoreUser user = order.getUser();
        String customer = user == null ? "Guest" : text(user.getFirstName()) + " " + text(user.getLastName());
        StringBuilder html = new StringBuilder("<p><strong>Order #</strong> ")
                .append(escape(order.getOrderName()))
                .append("<br><strong>Type:</strong> ").append(escape(order.getOrderType()))
                .append("<br><strong>Requested time:</strong> ").append(escape(order.getOrderTime()))
                .append("<br><strong>Placed:</strong> ").append(escape(order.getDatePlaced()))
                .append(" ").append(escape(order.getTimePlaced()))
                .append("<br><strong>Customer:</strong> ").append(escape(customer.trim()))
                .append("<br><strong>Phone:</strong> ").append(escape(order.getPhoneNumber()));
        if ("Delivery".equals(order.getOrderType())) {
            html.append("<br><strong>Delivery address:</strong> ").append(escape(order.getAddress()));
        }
        html.append("</p>");
        if (order.getSpecialInstructions() != null && !order.getSpecialInstructions().isBlank()) {
            html.append("<p><strong>Order instructions:</strong> ").append(escape(order.getSpecialInstructions())).append("</p>");
        }
        html.append("<table style='width:100%;border-collapse:collapse;text-align:left'>")
                .append("<thead><tr><th>Item / options</th><th>Qty</th><th style='text-align:right'>Amount</th></tr></thead><tbody>");
        if (order.getItems() != null) {
            for (CartItem item : order.getItems()) {
                html.append("<tr><td style='padding:12px 8px 12px 0;border-bottom:1px solid #ddd'>")
                        .append(escape(item.getItem().getNumber())).append(". ")
                        .append(escape(item.getItem().getName())).append("<br>")
                        .append(escape(item.getItem().getSize()));
                if (item.getSpecialInstruction() != null && !item.getSpecialInstruction().isBlank()) {
                    html.append("<br><strong>Note:</strong> ").append(escape(item.getSpecialInstruction()));
                }
                html.append("</td><td>").append(item.getQuantity())
                        .append("</td><td style='text-align:right'>").append(money(item.getOrderPrice())).append("</td></tr>");
            }
        }
        double delivery = order.getDeliveryFee() == null ? ("Delivery".equals(order.getOrderType()) ? 2 : 0) : order.getDeliveryFee().doubleValue();
        java.math.BigDecimal taxable = java.math.BigDecimal.valueOf(order.getOrderPrice()).add(java.math.BigDecimal.valueOf(delivery));
        java.math.BigDecimal tax = order.getTax() == null ? taxable.multiply(new java.math.BigDecimal("0.07")).setScale(2, java.math.RoundingMode.HALF_UP) : order.getTax();
        java.math.BigDecimal total = order.getTotal() == null ? taxable.add(tax) : order.getTotal();
        html.append("</tbody></table><p><strong>Subtotal:</strong> ").append(money(order.getOrderPrice()));
        if (delivery > 0) html.append("<br><strong>Delivery fee:</strong> ").append(money(delivery));
        return html.append("<br><strong>Tax:</strong> ").append(money(tax.doubleValue()))
                .append("<br><strong>Total:</strong> ").append(money(total.doubleValue()))
                .append("</p><p>Ming House · 217A Chandler St, Worcester, MA · (508) 756-6888</p>").toString();
    }

    private static String wrap(String heading, String intro, String ticket) {
        return "<!doctype html><html><body style='font-family:Arial,sans-serif;color:#2b1a0d;line-height:1.5'>"
                + "<div style='max-width:640px;margin:auto;padding:20px'><h1 style='font-size:24px'>"
                + heading + "</h1><p>" + intro + "</p>" + ticket + "</div></body></html>";
    }

    private static String text(String value) { return value == null ? "" : value; }
    private static String escape(String value) { return HtmlUtils.htmlEscape(text(value)); }
    private static String subjectText(String value) { return text(value).replaceAll("[\\r\\n]", " "); }
    private static String money(double value) { return String.format(Locale.US, "$%.2f", value); }
}
