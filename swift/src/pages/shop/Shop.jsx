import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponsiveAppBar from '../../component/Appbar';
import AvatarTheme from '../../component/Theme';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import { usePersonalInfo } from '../../context/PersonalInfoContext';  // Ensure this is imported

function Shop() {
    const { personalInfo } = usePersonalInfo();  // Get user info from context
    const [shopItems, setShopItems] = useState([]);
    const [userInventory, setUserInventory] = useState([]);

    // Fetch shop items and user inventory
    useEffect(() => {
        fetchShopItems();
        fetchUserInventory();
    }, []);

    // Fetch shop items
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

    // Fetch user inventory
    const fetchUserInventory = async () => {
        if (!personalInfo.userId) return;

        try {
            const response = await axios.get(`http://localhost:8080/api/inventory/getInventoryByUserId/${personalInfo.userId}`);
            if (Array.isArray(response.data)) {
                setUserInventory(response.data);
            } else {
                console.error('Error fetching inventory:', response.data);
            }
        } catch (error) {
            console.error('Error fetching user inventory:', error);
        }
    };

    const handleBuyClick = async (itemId) => {
        if (!personalInfo.userId) {
            alert('You must be logged in to purchase an item.');
            return;
        }

        try {
            // Find the item details
            const itemToBuy = shopItems.find(item => item.itemId === itemId);

            // Check if the user can afford the item (assuming you have a coins balance)
            // Assuming user has coins property, adjust if necessary
            const userCoins = personalInfo.coins; 
            if (userCoins < itemToBuy.itemCost) {
                alert('You do not have enough coins to buy this item.');
                return;
            }

            // Create inventory record
            const inventoryRecord = {
                userId: personalInfo.userId,
                itemId: itemToBuy.itemId,
                itemName: itemToBuy.itemName,
                itemCost: itemToBuy.itemCost,
                itemUrl: itemToBuy.itemUrl,
            };

            // Post the inventory record to backend to save the item in user's inventory
            await axios.post('http://localhost:8080/api/inventory/postInventoryRecord', inventoryRecord);

            // Update the coins balance (if needed)
            // Assuming there's a setCoins method in context or useState
            // setCoins(userCoins - itemToBuy.itemCost); 

            alert(`Successfully purchased ${itemToBuy.itemName} and added to your inventory.`);
            fetchUserInventory(); // Fetch updated inventory
        } catch (error) {
            console.error('Error purchasing item:', error);
            alert('Error purchasing item. Please try again.');
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" className="App">
            <ResponsiveAppBar />
            <AvatarTheme />
            <Box textAlign="center" mt={4} width="100%">
                <h2>Shop</h2>
                <div>
                    <h3>Shop Items</h3>
                    <Box sx={{ maxWidth: '100%', mx: 'auto', px: 10 }}>
                        <Grid container spacing={2} justifyContent="center">
                            {shopItems.map(item => (
                                <Grid item xs={12} sm={6} md={4} key={item.itemId}>
                                    <Box mx={10}>
                                        <Card sx={{ maxWidth: 345 }}>
                                            <CardMedia
                                                component="img"
                                                alt={item.itemName}
                                                height="140"
                                                image={`${process.env.PUBLIC_URL}/images/themes/${item.itemUrl}`}
                                            />
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {item.itemName}
                                                </Typography>
                                                <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
                                                    <Box
                                                        component="img"
                                                        src={`${process.env.PUBLIC_URL}/images/themes/coin.png`}
                                                        alt="Coin"
                                                        sx={{ width: 20, height: 20, marginRight: 0.5 }}
                                                    />
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                        {item.itemCost}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleBuyClick(item.itemId)}
                                                >
                                                    Buy
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </div>
            </Box>
        </Box>
    );
}

export default Shop;
