import { Typography, Box, TextField, Button, FormControlLabel, Checkbox, Radio, RadioGroup, FormControl, FormLabel, Autocomplete, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { adminCreatePuppy, adminEditPuppyInfo, adminGetCategoriesOfPuppy, adminRemovePuppy, adminRemovePuppyFromCategory, adminTagPuppy, getPuppyCategories } from "../utils/API";

const PuppyForm = ({
    featuredPuppy,
    adminToken,
    formMode,
    setFormMode,
    setZoom,
    responseMessage,
    setResponseMessage,
    setIsLoading,
    allCategories,
    setAllCategories
}) => {
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [size, setSize] = useState('');
    const [price, setPrice] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [description, setDescription] = useState('');
    const [gender, setGender] = useState('');
    const [isVaccinated, setIsVaccinated] = useState(false);
    const [isAltered, setIsAltered] = useState(false);
    const [pedigree, setPedigree] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [selectedCategoriesToAdd, setSelectedCategoriesToAdd] = useState([]);
    const [selectedCategoriesToRemove, setSelectedCategoriesToRemove] = useState([]);
    const [categoriesToAdd, setCategoriesToAdd] = useState([]);
    const [categoriesToRemove, setCategoriesToRemove] = useState([]);
    const [responseWindowOpen, setResponseWindowOpen] = useState(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 10,
        p: 4,
        display: 'flex',
        justifyContent: 'space-around'
    };

    const handleResponseWindowClose = () => {
        setIsLoading(true);
        setResponseWindowOpen(false);
        setResponseMessage('')
        setIsLoading(false);
    }

    const handleCategorySelect = (event, newValue, setFunction) => {
        setIsLoading(true);
        setFunction(newValue);
        setIsLoading(false);
    }

    const handleTextFieldChange = (event, setFunction) => {
        setFunction(event.target.value);
    }

    const handleCheckboxChange = (event, setFunction) => {
        setIsLoading(true);
        setFunction(event.target.checked);
        setIsLoading(false);
    }

    const handleUnavailableButtonClick = async () => {
        setIsLoading(true);
        await adminRemovePuppy(adminToken, featuredPuppy.id);
        setResponseMessage('Puppy Removed.')
        setResponseWindowOpen(true);
        setIsLoading(false);
    }

    const handleCancelButtonClick = () => {
        setIsLoading(true);
        setZoom(false);
        setFormMode('create');
        setTimeout(() => {
            setZoom(true);
        }, 500);
        setIsLoading(false);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const puppyInfo = {
            name,
            breed,
            "age": Number(age),
            "weight": Number(weight),
            size,
            "price": Number(price),
            image1,
            image2,
            description,
            gender,
            isVaccinated,
            isAltered,
            pedigree,
            isAvailable
        }
        if (formMode === 'create') {
            const newPuppy = await adminCreatePuppy(adminToken, puppyInfo);

            for (let category of selectedCategoriesToAdd) {
                await adminTagPuppy(adminToken, category.id, newPuppy.id);
            }

            if(newPuppy.error) {
                setResponseMessage(newPuppy.message);
            } else {
                setResponseMessage('New Puppy Added.')
            }
        } else if (formMode === 'edit') {
            const editedPuppy = await adminEditPuppyInfo(adminToken, featuredPuppy.id, puppyInfo);

            for (let category of selectedCategoriesToAdd) {
                await adminTagPuppy(adminToken, category.id, featuredPuppy.id);
            }

            for (let category of selectedCategoriesToRemove) {
                await adminRemovePuppyFromCategory(adminToken, featuredPuppy.id, category.id);
            }

            if(editedPuppy.error) {
                setResponseMessage(editedPuppy.message);
            } else {
                setResponseMessage('Puppy Info Edited.')
            }
        }
        setResponseWindowOpen(true);
        setIsLoading(false);
    }

    const renderPuppyForm = async () => {
        const newCategories = await getPuppyCategories();
            
        setName('');
        setBreed('');
        setAge('');
        setWeight('');
        setSize('');
        setPrice('');
        setImage1('');
        setImage2('');
        setDescription('');
        setGender('');
        setIsVaccinated(false);
        setIsAltered(false);
        setPedigree(false);
        setIsAvailable(false);
        setSelectedCategoriesToAdd([]);
        setSelectedCategoriesToRemove([]);

        if (formMode === 'create') {
            setAllCategories(newCategories);
        } else if (formMode === 'edit') {
            const puppyCategories = await adminGetCategoriesOfPuppy(adminToken, featuredPuppy.id);
            const newCategoriesToAdd = [];
            const newCategoriesToRemove = [];
            const puppyCategoriesMap = {};
            const {
                name,
                breed,
                age,
                weight,
                size,
                price,
                image1,
                image2,
                description,
                gender,
                isVaccinated,
                isAltered,
                pedigree,
                isAvailable
            } = featuredPuppy;

            if (age) {
                setAge(age);
            }
            if (weight) {
                setWeight(weight);
            }
            if (price) {
                setPrice(price);
            }
            if (image1) {
                setImage1(image1);
            }
            if (image2) {
                setImage2(image2);
            }
            setName(name);
            setBreed(breed);
            setSize(size);
            setDescription(description);
            setGender(gender.toLowerCase());
            setIsVaccinated(isVaccinated);
            setIsAltered(isAltered);
            setPedigree(pedigree);
            setIsAvailable(isAvailable);

            for (let puppyCategory of puppyCategories) {
                puppyCategoriesMap[puppyCategory.categoryId] = true;
            }
    
            for (let category of newCategories) {
                if (puppyCategoriesMap[category.id]) {
                    newCategoriesToRemove.push(category);
                } else {
                    newCategoriesToAdd.push(category);
                }
            }
            setCategoriesToAdd(newCategoriesToAdd);
            setCategoriesToRemove(newCategoriesToRemove);
        }
    }

    useEffect(() => {
        renderPuppyForm();
    }, [formMode, featuredPuppy]);

    return (
        <>
            <Typography align="center" component="h1" variant="h5">
                {formMode === 'create' ? 'Add New Puppy To Database' : `Edit Puppy #${featuredPuppy.id}`}
            </Typography>
            {/* {
                errorMessage && <Typography component="p" variant="h6" sx={{ color: 'red' }}>
                    {errorMessage}
                </Typography>
            } */}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    size="small"
                    id="name"
                    label="Name"
                    name="name"
                    value={name}
                    onChange={(event) => {
                        handleTextFieldChange(event, setName);
                    }}
                    sx={{ width: '45%' }}
                />
                <TextField
                    margin="normal"
                    required
                    size="small"
                    fullWidth
                    name="breed"
                    label="Breed"
                    id="breed"
                    value={breed}
                    onChange={(event) => {
                        handleTextFieldChange(event, setBreed);
                    }}
                    sx={{ width: '45%' }}
                />
                <TextField
                    margin="normal"
                    required
                    size="small"
                    fullWidth
                    name="age"
                    label="Age / months"
                    id="age"
                    type="number"
                    value={age}
                    onChange={(event) => {
                        handleTextFieldChange(event, setAge);
                    }}
                    sx={{ width: '30%' }}
                />
                <TextField
                    margin="normal"
                    required
                    size="small"
                    fullWidth
                    name="weight"
                    label="Weight / lbs"
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(event) => {
                        handleTextFieldChange(event, setWeight);
                    }}
                    sx={{ width: '30%' }}
                />
                <TextField
                    margin="normal"
                    required
                    size="small"
                    fullWidth
                    name="price"
                    label="Price / $"
                    id="price"
                    type="number"
                    value={price}
                    onChange={(event) => {
                        handleTextFieldChange(event, setPrice);
                    }}
                    sx={{ width: '30%' }}
                />
                <TextField
                    margin="normal"
                    required
                    size="small"
                    fullWidth
                    name="image1"
                    label="Image URL 1"
                    id="image1"
                    value={image1}
                    onChange={(event) => {
                        handleTextFieldChange(event, setImage1);
                    }}
                    sx={{ width: '45%' }}
                />
                <TextField
                    margin="normal"
                    required
                    size="small"
                    fullWidth
                    name="image2"
                    label="Image URL 2"
                    id="image2"
                    value={image2}
                    onChange={(event) => {
                        handleTextFieldChange(event, setImage2);
                    }}
                    sx={{ width: '45%' }}
                />
                <TextField
                    margin="normal"
                    required
                    size="small"
                    fullWidth
                    multiline={true}
                    rows={3}
                    name="description"
                    label="Description"
                    id="description"
                    value={description}
                    onChange={(event) => {
                        handleTextFieldChange(event, setDescription);
                    }}
                    sx={{ width: '100%' }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', p: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <FormControl>
                            <FormLabel id="gender-label">Gender</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="gender-label"
                                value={gender}
                                onChange={event => setGender(event.target.value)} 
                                name="gender-radio-group"
                            >
                                <FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
                                <FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel id="size-label">Size</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="size-label"
                                value={size}
                                onChange={event => setSize(event.target.value)} 
                                name="size-radio-group"
                            >
                                <FormControlLabel value="S" control={<Radio size="small" />} label="S" />
                                <FormControlLabel value="M" control={<Radio size="small" />} label="M" />
                                <FormControlLabel value="L" control={<Radio size="small" />} label="L" />
                                <FormControlLabel value="XL" control={<Radio size="small" />} label="XL" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    <FormControlLabel
                        label="Vaccinated?"
                        control={
                            <Checkbox
                                checked={isVaccinated}
                                onChange={event => {
                                    handleCheckboxChange(event, setIsVaccinated);
                                }}
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                    />
                    <FormControlLabel
                        label="Altered?"
                        control={
                            <Checkbox
                                checked={isAltered}
                                onChange={event => {
                                    handleCheckboxChange(event, setIsAltered);
                                }}
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                    />
                    <FormControlLabel
                        label="Pedigree?"
                        control={
                                <Checkbox
                                checked={pedigree}
                                onChange={event => {
                                    handleCheckboxChange(event, setPedigree);
                                }}
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                    />
                    <FormControlLabel
                        label="For Sale?"
                        control={
                            <Checkbox
                                checked={isAvailable}
                                onChange={event => {
                                    handleCheckboxChange(event, setIsAvailable);
                                }}
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                    />
                </Box>
                <Autocomplete
                    multiple
                    id="category-select"
                    options={formMode === 'create' ? allCategories : categoriesToAdd}
                    getOptionLabel={(option) => option.name}
                    value={selectedCategoriesToAdd}
                    onChange={(event, newValue) => {
                        handleCategorySelect(event, newValue, setSelectedCategoriesToAdd);
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    sx={{ width: "100%", mb: 2 }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Add Categories"
                        placeholder="Categories"
                    />
                    )}
                />
                {
                    formMode === 'edit' &&
                    <Autocomplete
                        multiple
                        id="category-select"
                        options={categoriesToRemove}
                        getOptionLabel={(option) => option.name}
                        value={selectedCategoriesToRemove}
                        onChange={(event, newValue) => {
                            handleCategorySelect(event, newValue, setSelectedCategoriesToRemove);
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        sx={{ width: "100%", mb: 2 }}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Remove Categories"
                            placeholder="Categories"
                        />
                        )}
                    />
                }
                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mb: 2,
                    background: 'green',
                    width: '30%',
                    ":hover": {
                        bgcolor: "#106B21",
                        color: "white" }
                    }}
                >
                Submit {formMode === 'create' ? 'New Puppy' : "Edit"}
                </Button>
                <Modal
                    open={responseWindowOpen}
                    onClose={handleResponseWindowClose}
                    slotProps={{ backdrop: {sx: { background: 'rgba(0, 0, 0, 0.2)'}}}}
                >
                    <Box sx={style}>
                        <Typography variant="h2" component="h1">
                            {responseMessage}
                        </Typography>
                    </Box>
                </Modal>
                {
                    formMode === 'edit' &&
                    <>
                        <Button
                            disabled={featuredPuppy.isAvailable ? false : true}
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ mb: 2,
                                background: '#434B4F',
                                width: '30%',
                                ":hover": {
                                    bgcolor: "#363c3f",
                                    color: "white" }
                            }}
                            onClick={handleUnavailableButtonClick}
                        >
                            Make Unavailable
                        </Button>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ mb: 2,
                                background: '#E71837',
                                width: '30%',
                                ":hover": {
                                    bgcolor: "#b9132c",
                                    color: "white" }
                            }}
                            onClick={handleCancelButtonClick}
                        >
                            Cancel
                        </Button>
                    </>
                }
            </Box>
        </>
    )
}

export default PuppyForm;