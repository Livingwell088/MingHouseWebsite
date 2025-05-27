import CartItem from "./CartItem";


const CartLeft = (props) => {


    return <>
        {/*{console.log(props.cart)}*/}
        {props.cart.map((item, index) => {
            // console.log(item)

            return <CartItem id={item.id} name={item.orderName} price={item.orderPrice} item={item.item} order={item} updateCart={props.updateCart} full={props.fullMenu[index]}></CartItem>
        })}
        {(props.cart.length === 0) && <div>
            <h3>No Items in Cart</h3>
            <h4>Browse <a className={"Link"} href={"/menuPage"}>
                Menu
            </a></h4>
        </div>

        }
    </>
}


export default CartLeft;

