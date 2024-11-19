import React, { useEffect, useState } from 'react';
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

function ShopUI() {
    const [shopItems, setShopItems] = useState([]);

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

    const handleBuyClick = async (item) => {
        const newInventoryItem = {
            inventoryId: 0, // Backend will auto-generate ID
            itemList: item.itemName,
            totalCoins: item.itemCost,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/inventory/postInventoryRecord', newInventoryItem);
            console.log('Item added to inventory:', response.data);
            alert(`${item.itemName} added to your inventory!`);
        } catch (error) {
            console.error('Error adding item to inventory:', error);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" className="App">
            <ResponsiveAppBar />
            <AvatarTheme />
            <Box textAlign="center" mt={4} width="100%">
                <h2>Shop</h2>
                <Box sx={{ maxWidth: '100%', mx: 'auto', px: 10 }}>
                    <Grid container spacing={2} justifyContent="center">
                        {shopItems.map(item => (
                            <Grid item xs={12} sm={6} md={4} key={item.itemId}>
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
                                    <CardActions>
                                        <Button size="small" onClick={() => handleBuyClick(item)}>
                                            Buy
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}

export default ShopUI;
