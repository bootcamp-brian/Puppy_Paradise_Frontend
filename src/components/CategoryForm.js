import { Typography, Box, TextField, Button, Autocomplete } from "@mui/material";
import { useState } from "react";
import { adminCreateCategory, adminDeleteCategory, getPuppyCategories } from "../utils/API";

const CategoryForm = ({
    adminToken,
    allCategories,
    setAllCategories,
    setIsLoading
}) => {
    const [name, setName] = useState('');
    const [categoriesToRemove, setCategoriesToRemove] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        await adminCreateCategory(adminToken, name);
        const newCategories = await getPuppyCategories();
        setAllCategories(newCategories);
        setName('');
        setIsLoading(false);
    }
    
    const handleTextFieldChange = (event) => {
        setName(event.target.value);
    }

    const handleCategorySelect = (event, newValue) => {
        setIsLoading(true);
        setCategoriesToRemove(newValue);
        setIsLoading(false);
    }

    const handleDeleteButtonClick = async () => {
        setIsLoading(true);
        for (let category of categoriesToRemove) {
            await adminDeleteCategory(adminToken, category.id)
        }
        setCategoriesToRemove([]);
        const newCategories = await getPuppyCategories();
        setAllCategories(newCategories);
        setIsLoading(false);
    }
    return (
        <>
            <Typography align="center" component="h1" variant="h5">
                Category Manager
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        size="small"
                        id="name"
                        label="New Category Name"
                        name="name"
                        value={name}
                        onChange={handleTextFieldChange}
                        sx={{ width: '80%', pb: 1 }}
                    />
                    <Button
                    type="submit"
                    size="small"
                    fullWidth
                    variant="contained"
                    sx={{
                        background: 'green',
                        width: '40%',
                        ":hover": {
                            bgcolor: "#106B21",
                            color: "white" }
                        }}
                    >
                    Create New Category
                    </Button>
                </Box>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, mb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>       
                    <Autocomplete
                        multiple
                        size="small"
                        id="category-select"
                        options={allCategories}
                        getOptionLabel={(option) => option.name}
                        value={categoriesToRemove}
                        onChange={(event, newValue) => {
                            handleCategorySelect(event, newValue);
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        sx={{ width: "80%", mb: 2 }}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Categories To Remove"
                            placeholder="Categories"
                        />
                        )}
                    />
                    <Button
                        type="submit"
                        size="small"
                        fullWidth
                        variant="contained"
                        onClick={handleDeleteButtonClick}
                        sx={{ mb: 1,
                            background: '#E71837',
                            width: '40%',
                            ":hover": {
                                bgcolor: "#b9132c",
                                color: "white" }
                        }}
                    >
                        Delete Selected Categories
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default CategoryForm;