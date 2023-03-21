import * as React from 'react';
import { Button, CardActions, Paper, Grid, Typography, Box } from '@mui/material';
import { addItemToCart, getCart, getPuppyById } from "../utils/API";
import PetsIcon from '@mui/icons-material/Pets';

const FeaturedDetails = ({ featuredPuppy, setFeaturedPuppy, setIsLoading, token, cartItems, setCartItems }) => {
    const {
        id,
        image1,
        image2,
        name,
        age,
        size,
        price,
        breed,
        description,
        weight,
        pedigree,
        isVaccinated,
        isAltered,
        gender,

    } = featuredPuppy;
    const convertedAge = Math.floor(age/12);
    const ageText = age <= 12 ? (age === 1 ? `${age} month` : `${age} months`) : (convertedAge === 1 ? `${convertedAge} year`: `${convertedAge} years`);

    let inCart = false;
    for (let item of cartItems) {
        if ((token ? item.puppyId : item.id) === id) {
            inCart = true;
            break;
        }
    }

    const handleBackClick = async (event) => {
        setIsLoading(true);
        setFeaturedPuppy({});
        setIsLoading(false);                              
    }

    const handleAddToCartButtonClick = async (event) => {
        setIsLoading(true);
        const cartItemId = Number(event.target.getAttribute('data-cart'));
        if (token) {
            await addItemToCart(token, cartItemId);
            const userCart = await getCart(token);
            setCartItems(userCart.cartItems);
        } else {
            const guestCartItems = [ ...cartItems ]
            const cartItem = await getPuppyById(cartItemId);
            if (!guestCartItems.includes(cartItem)) {
                guestCartItems.push(cartItem);
            }
            const guestCartItemsString = JSON.stringify(guestCartItems)
            localStorage.setItem('cartItems', guestCartItemsString);
            setCartItems(guestCartItems);
        }
        setIsLoading(false);
    }

    return <Grid item xs={12}>
        <Paper elevation={6} sx={{ border: '1px solid black', minWidth: '980px' }}>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', top: 25, height: 0, margin: 0, padding: 0 }}>
                <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    onClick={handleBackClick}
                    sx={{ ml: 1 }}
                >
                    Back
                </Button>
                <Button
                    data-cart={id}
                    variant="contained"
                    size="medium"
                    onClick={handleAddToCartButtonClick}
                    sx={{
                        mr: 1,
                        background: 'green',
                        ":hover": {
                            bgcolor: "#106B21",
                            color: "white" },
                        "&.Mui-disabled": {
                            background: "gray",
                            color: "white",
                            opacity: 0.8
                        }
                    }}
                    disabled={inCart}
                >
                    {inCart ? 'In Cart' : 'Add To Cart'}
                </Button>
            </CardActions>
            <Box sx={{ display: 'flex', borderBottom: '1px solid black' }}>
                <img
                    src={image1 ? image1 : 'https://img.freepik.com/free-vector/cute-corgi-dog-eating-bone-cartoon_138676-2534.jpg?w=360'}
                    alt=""
                    className="featuredImages"
                />
                <img
                    src={image2 ? image2 : 'https://img.freepik.com/free-vector/cute-corgi-dog-eating-bone-cartoon_138676-2534.jpg?w=360'}
                    alt={image2 ? "" : "Placeholder image"}
                    className="featuredImages"
                />
            </Box>
            <Box paddingX={2}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        pt: 1
                    }}
                    >
                        <PetsIcon />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'end'
                            }}
                        >
                            <Typography variant="h2" component="h1" sx={{ fontWeight: "bold", pb: 2, pt: 1 }}>
                                {name.toUpperCase()}
                            </Typography>
                        </Box>
                        <PetsIcon />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '1px solid black'}}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
                        <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", textAlign: 'center', borderRight: '1px solid black', p: 2, flexGrow: 1 }}>
                            {breed}
                        </Typography>
                        <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", textAlign: 'center', borderRight: '1px solid black', p: 2, flexGrow: 1 }}>
                            {ageText} old
                        </Typography>
                        <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", textAlign: 'center', borderRight: '1px solid black', p: 2, flexGrow: 1 }}>
                            {gender.toLowerCase() === 'female' ? 'Female' : 'Male'}
                        </Typography>
                        <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", textAlign: 'center', p: 2, flexGrow: 1 }}>
                            Size {size}
                        </Typography>
                    </Box>
                    <Typography variant="h5" component="p" sx={{ fontWeight: "bold", minWidth: '980px', textAlign: 'center', borderTop: '1px solid black', borderBottom: '1px solid black', p: 4 }}>   
                        {description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', borderBottom: '1px solid black' }}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", textAlign: 'center', borderRight: '1px solid black', p: 2, flexGrow: 1 }}>
                            Vaccinated: {isVaccinated ? 'Yes' : 'No'} 
                        </Typography>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", textAlign: 'center', borderRight: '1px solid black', p: 2, flexGrow: 1 }}>
                            Pedigree: {pedigree ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", textAlign: 'center', borderRight: '1px solid black', p: 2, flexGrow: 1 }}>
                            {gender.toLowerCase() === 'female' ? ' Spayed:' : ' Neutered:'} {isAltered ? 'Yes' : 'No'}
                        </Typography>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", textAlign: 'center', pt: 2, pb: 1, flexGrow: 1 }}>
                            Weight: {weight} lbs
                        </Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'end',
                        pb: 1
                    }}
                    >
                        <PetsIcon />
                        <Typography variant="h3" component="h2" sx={{ mt: 1, fontWeight: "bold", display: 'flex', justifyContent: 'center', p: 2, color: 'green' }}>
                            Price: ${price}
                        </Typography>
                        <PetsIcon />
                </Box>
            </Box>      
        </Paper>
    </Grid>
}

export default FeaturedDetails;