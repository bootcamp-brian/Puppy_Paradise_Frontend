import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import ButtonAppBar from "../components/AppBar";
import Container from "@mui/material/Container";
import { getCart, getStripeCheckout, createOrder, createGuestOrder } from "../utils/API";

export default function Root() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
    const [checkoutId, setCheckoutId] = useState(localStorage.getItem('checkoutId'));
    const [cartItems, setCartItems] = useState(localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []);
    const navigate = useNavigate();
    const location = useLocation();
    const page = location.pathname;

    const renderRoot = async () => {
        console.log('test')
        if (token) {
            const userCart = await getCart(token);
            setCartItems(userCart.cartItems)
            if (checkoutId) {
                const checkoutSession = await getStripeCheckout(checkoutId);
                const date = new Date();
                const timestamp = date.toISOString();
                if (checkoutSession.session.payment_status === "paid") {
                        const newOrder = await createOrder(token, timestamp);
                        console.log(newOrder)
                        localStorage.removeItem('checkoutId');
                        localStorage.removeItem('cartItems');
                        setCheckoutId('');
                        setCartItems([]);
                }
            }
        } else {
            if (checkoutId) {
                const checkoutSession = await getStripeCheckout(checkoutId);
                const date = new Date();
                const timestamp = date.toISOString();
                if (checkoutSession.session.payment_status === "paid") {
                        await createGuestOrder(cartItems, timestamp);
                        localStorage.removeItem('checkoutId');
                        localStorage.removeItem('cartItems');
                        setCheckoutId('');
                        setCartItems([]);
                    }
            }
        }
    }
    useEffect(() => {
        renderRoot();
        if (page === "/") {
            navigate("/home");
        }
    }, [token]);

    return (
        <>
            <ButtonAppBar
                token={token}
                setToken={setToken}
                adminToken={adminToken}
                setAdminToken={setAdminToken}
                cartItems={cartItems}
                setCartItems={setCartItems}
            />
            <Container sx={{ marginY: 5, minWidth: '980px' }}>
                <Outlet context={[token, setToken, adminToken, setAdminToken, cartItems, setCartItems, checkoutId, setCheckoutId]}/>
            </Container>
        </> 
    );
}