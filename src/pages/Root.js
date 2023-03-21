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

    useEffect(() => {
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