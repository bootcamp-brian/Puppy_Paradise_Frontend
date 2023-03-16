import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import ButtonAppBar from "../components/AppBar";
import Container from "@mui/material/Container";
import { getCart } from "../utils/API";

export default function Root() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const page = location.pathname;

    const renderRoot = async () => {
        if (token) {
            const userCart = await getCart(token);
            setCartItems(userCart.cartItems);
        } else {
            const storedCartItems = JSON.parse(localStorage.getItem('cartItems'))
            if (storedCartItems) {
                setCartItems(storedCartItems);
            }
        }
    }
    useEffect(() => {
        if (page === "/") {
            navigate("/home");
        }
        renderRoot();
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
                <Outlet context={[token, setToken, adminToken, setAdminToken, cartItems, setCartItems]}/>
            </Container>
        </> 
    );
}