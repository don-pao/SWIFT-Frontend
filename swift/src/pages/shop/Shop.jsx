import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResponsiveAppBar from '../../component/Appbar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AvatarTheme from '../../component/Theme';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

function Shop() {
    const [shopItems, setShopItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemName, setItemName] = useState('');
    const [itemCost, setItemCost] = useState('');
    const [itemUrl, setItemUrl] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchShopItems();
    }, []);

    const fetchShopItems = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/shop/getAllShop');
            if (Array.isArray(response.data)) {
                setShopItems(response.data);
            } else {
                console.error('Expected an array, but got:', response.data);
            }
        } catch (error) {
            console.error('Error fetching shop items:', error);
        }
    };

    const handleAddOrUpdate = async () => {
        if (!itemName || !itemCost || !itemUrl) {
            console.error('All fields are required');
            return;
        }
        try {
            const newItem = { itemName, itemCost, itemUrl };
            if (selectedItem) {
                const response = await axios.put(`http://localhost:8080/api/shop/putShopDetails/${selectedItem}`, newItem);
                setShopItems(shopItems.map(item => (item.itemId === selectedItem ? response.data : item)));
            } else {
                const response = await axios.post('http://localhost:8080/api/shop/postShopRecord', newItem);
                setShopItems([...shopItems, response.data]);
            }
            clearFields();
            handleCloseDialog();
        } catch (error) {
            console.error('Error adding/updating item:', error);
        }
    };

    const handleDelete = async (itemId) => {
        try {
            await axios.delete(`http://localhost:8080/api/shop/deleteShopDetails/${itemId}`);
            setShopItems(shopItems.filter(item => item.itemId !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleEditClick = (item) => {
        setSelectedItem(item.itemId);
        setItemName(item.itemName);
        setItemCost(item.itemCost);
        setItemUrl(item.itemUrl);
        setOpenDialog(true);
    };

    const clearFields = () => {
        setSelectedItem(null);
        setItemName('');
        setItemCost('');
        setItemUrl('');
    };

    const handleOpenDialog = () => {
        clearFields();
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" className="App">
            <ResponsiveAppBar />
            <AvatarTheme />
            <Box textAlign="center" mt={4}>
                <h2>Shop</h2>
                <Button variant="outlined" onClick={handleOpenDialog}>Add Item</Button>
                <div>
                    <h3>Shop Items</h3>
                    <Grid container spacing={2} justifyContent="center">
                        {shopItems.map(item => (
                            <Grid item xs={12} sm={6} md={4} key={item.itemId}>
                                <Box mx={8}> {/* Add horizontal margin */}
                                    <Card sx={{ maxWidth: 345 }}>
                                        <CardMedia
                                            component="img"
                                            alt={item.itemName}
                                            height="140"
                                            image={`${process.env.PUBLIC_URL}/themes/${item.itemUrl}`} // Use the item URL here
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {item.itemName}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Cost: {item.itemCost}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" onClick={() => handleEditClick(item)}>Edit</Button>
                                            <Button size="small" onClick={() => handleDelete(item.itemId)}>Delete</Button>
                                        </CardActions>
                                    </Card>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Box>

            {/* Dialog for Adding/Editing Items */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the details of the item.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Item Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Item Cost"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={itemCost}
                        onChange={(e) => setItemCost(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Item URL"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={itemUrl}
                        onChange={(e) => setItemUrl(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddOrUpdate} color="primary">
                        {selectedItem ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Shop;
