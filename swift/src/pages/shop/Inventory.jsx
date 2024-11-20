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

function InventoryUI() {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [currentTheme, setCurrentTheme] = useState('default');
    const [themeUrl, setThemeUrl] = useState(`${process.env.PUBLIC_URL}/images/themes/theme.png`);

    useEffect(() => {
        fetchInventoryItems();
    }, []);

    const fetchInventoryItems = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/inventory/getAllInventory');
            if (Array.isArray(response.data)) {
                const updatedInventory = response.data.map((item, index) => {
                    return {
                        ...item,
                        itemUrl: index === 0 && !item.itemUrl ? 'theme.png' : item.itemUrl, // Default 'theme.png' for first card
                        totalCoins: item.totalCoins || 0, // Default 0 if totalCoins is missing
                    };
                });
                setInventoryItems(updatedInventory);
            } else {
                console.error('Expected an array, but got:', response.data);
            }
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };

    const handleThemeApply = (themeName, themeImageUrl) => {
        setCurrentTheme(themeName);
        setThemeUrl(themeImageUrl);
        localStorage.setItem('currentTheme', themeName);
        localStorage.setItem('themeUrl', themeImageUrl);
        console.log(`Applied theme: ${themeName}`);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" className="App">
            <ResponsiveAppBar />
            <AvatarTheme theme={themeUrl} /> {/* Pass themeUrl as a prop */}
            <Box textAlign="center" mt={4} width="100%">
                <h2>Inventory</h2>
                <Box sx={{ maxWidth: '100%', mx: 'auto', px: 10 }}>
                    <Grid container spacing={2} justifyContent="center">
                        {inventoryItems.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.inventoryId}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        component="img"
                                        alt={item.itemList}
                                        height="140"
                                        image={`${process.env.PUBLIC_URL}/images/themes/${item.itemUrl || 'theme.png'}`} // Fallback to theme.png
                                    />
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {item.itemList}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Coins Spent: {item.totalCoins}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={() =>
                                                handleThemeApply(
                                                    item.itemList,
                                                    `${process.env.PUBLIC_URL}/images/themes/${item.itemUrl || 'theme.png'}`
                                                )
                                            }
                                            disabled={currentTheme === item.itemList}
                                        >
                                            {currentTheme === item.itemList ? 'Used' : 'Use'}
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

export default InventoryUI;
