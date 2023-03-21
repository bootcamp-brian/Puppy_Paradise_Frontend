import * as React from 'react';
import { ThemeProvider, Container, Box, Typography, List, ListItem, ListItemText, createTheme, Paper, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { deleteCartItem, getCart, stripeCheckoutSession } from '../utils/API';


const Cart = () => {
    const [token, setToken, adminToken, setAdminToken, cartItems, setCartItems, checkoutId, setCheckoutId] = useOutletContext();
    const [subtotal, setSubtotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const theme = createTheme();

    const handleCheckoutButtonClick = async () => {
        setIsLoading(true);
        const response = await stripeCheckoutSession(cartItems);
        localStorage.setItem('checkoutId', response.session.id);
        window.location.replace(response.session.url);
        setIsLoading(false);
    }
    
    const handleRemoveButtonClick = async (event) => {
        setIsLoading(true);
        const puppyId = Number(event.target.getAttribute('data-id'));

        if (token) {
            let cartItemId;
            for (let item of cartItems) {
                if (item.puppyId === puppyId) {
                    cartItemId = item.id
                }
            }
            
            await deleteCartItem(token, cartItemId);
            const updatedCart = await getCart(token);
            setCartItems(updatedCart.cartItems);
        } else {
            const guestCartItems = [ ...cartItems ]
            const newGuestCartItems = guestCartItems.filter(item => {
                if (item.id === puppyId) {
                    return false;
                } else {
                    return true;
                }
            })
            const guestCartItemsString = JSON.stringify(newGuestCartItems)
            localStorage.setItem('cartItems', guestCartItemsString);
            setCartItems(newGuestCartItems);
        }
        setIsLoading(false);
    }

    const renderCart = async () => {
        if (token) {
            const userCart = await getCart(token);
            setCartItems(userCart.cartItems)
            
            let total = 0;
            for (let item of userCart.cartItems) {
                total += 100 * Number(item.price);
            }
            setSubtotal(total/100);
        } else {
            let total = 0;
            for (let item of cartItems) {
                total += 100 * Number(item.price);
            }
            setSubtotal(total/100);
        }
    }

    useEffect(() => {
        renderCart();
    }, [cartItems]);

    return (
        <>
            {
                isLoading && <Loading />
            }
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xl">
                    <Paper
                        elevation={16}
                        sx={{
                            m: 10,
                            p: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'space-between',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="h1" gutterBottom sx={{ fontWeight: 'bold'}}>
                                {cartItems.length === 0 ? 'Your Cart Is Empty' : 'Your Cart'}
                            </Typography>
                        </Box>
                        {
                            cartItems.length !== 0 &&
                            <>
                                <List disablePadding>
                                    {
                                        cartItems.map((item) => (
                                            <ListItem key={item.id} sx={{ py: 1, px: 0, borderBottom: '1px solid black' }}>
                                                <ListItemText primary={item.name} primaryTypographyProps={{ variant: 'h3' }} secondary={item.breed} secondaryTypographyProps={{ variant: 'h4', }}/>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end' }}>
                                                    <Typography variant="h3">{item.price}</Typography>
                                                    <Button
                                                        data-id={token ? item.puppyId : item.id}
                                                        type="button"
                                                        variant="contained"
                                                        onClick={handleRemoveButtonClick}
                                                        sx={{
                                                            ml: 1,
                                                            background: '#E71837',
                                                            ":hover": {
                                                                bgcolor: "#b9132c",
                                                                color: "white" }
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Box>
                                            </ListItem>
                                        ))
                                    }

                                    <ListItem sx={{ py: 1, px: 0 }}>
                                    <ListItemText primary="Subtotal" primaryTypographyProps={{ variant: 'h2' }} />
                                    <Typography variant="h2" sx={{ fontWeight: 700 }}>
                                        ${subtotal}
                                    </Typography>
                                    </ListItem>
                                </List>
                            </>
                        }
                        {
                            cartItems.length !== 0 &&
                            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleCheckoutButtonClick}
                                    sx={{ mb: 2,
                                        background: 'green',
                                        width: '40%',
                                        ":hover": {
                                            bgcolor: "#106B21",
                                            color: "white" }
                                    }}
                                >
                                    Go to Checkout
                                </Button>
                            </Box>
                        }
                    </Paper>
                </Container>
            </ThemeProvider>
        </>
    );
}

export default Cart;