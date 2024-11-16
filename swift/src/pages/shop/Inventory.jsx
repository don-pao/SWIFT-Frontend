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
    const [currentTheme, setCurrentTheme] = useState("default");
    const [themeUrl, setThemeUrl] = useState(`${process.env.PUBLIC_URL}/images/themes/theme.png`);

    useEffect(() => {
        fetchInventoryItems();
    }, []);

    const fetchInventoryItems = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/inventory/getAllItems');
            if (Array.isArray(response.data)) {
                setInventoryItems(response.data);
            } else {
                console.error('Expected an array, but got:', response.data);
            }
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };

    const handleBuyClick = (item) => {
        if (item.quantity > 0) {
            const updatedItems = inventoryItems.map(invItem =>
                invItem.itemId === item.itemId ? { ...invItem, quantity: invItem.quantity - 1 } : invItem
            );
            setInventoryItems(updatedItems);
        } else {
            console.log(`Item ${item.itemName} is out of stock`);
        }
    };

    const handleThemeApply = (themeName, themeImageUrl) => {
        setCurrentTheme(themeName);
        setThemeUrl(themeImageUrl);
        localStorage.setItem("currentTheme", themeName);
        localStorage.setItem("themeUrl", themeImageUrl);
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
                        {inventoryItems.map(item => (
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
                                                    src={`${process.env.PUBLIC_URL}/images/themes/coin.jpg`}
                                                    alt="Coin"
                                                    sx={{ width: 20, height: 20, marginRight: 0.5 }}
                                                />
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {item.itemCost}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Quantity: {item.quantity > 0 ? item.quantity : "Out of stock"}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button 
                                                size="small" 
                                                onClick={() => handleBuyClick(item)}
                                                disabled={item.quantity <= 0}
                                            >
                                                {item.quantity > 0 ? "Buy" : "Out of Stock"}
                                            </Button>
                                            <Button 
                                                size="small"
                                                onClick={() => handleThemeApply(item.itemName, `${process.env.PUBLIC_URL}/images/themes/${item.itemUrl}`)}
                                                disabled={currentTheme === item.itemName}
                                                sx={{ color: currentTheme === item.itemName ? "grey" : "primary.main" }}
                                            >
                                                {currentTheme === item.itemName ? "Used" : "Use"}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Box>
                            </Grid>
                        ))}
                        <Grid item xs={12} sm={6} md={4}>
                            <Box mx={10}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        component="img"
                                        alt="Default Theme"
                                        height="140"
                                        image={`${process.env.PUBLIC_URL}/images/themes/theme.png`}
                                    />
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            Default Theme
                                        </Typography>
                                        <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
                                            <Box
                                                component="img"
                                                src={`${process.env.PUBLIC_URL}/images/themes/coin.png`}
                                                alt="Coin"
                                                sx={{ width: 20, height: 20, marginRight: 0.5 }}
                                            />
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                0 (Free)
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <Button 
                                            size="small"
                                            onClick={() => handleThemeApply("default", `${process.env.PUBLIC_URL}/images/themes/theme.png`)}
                                            disabled={currentTheme === "default"}
                                            sx={{ color: currentTheme === "default" ? "grey" : "primary.main" }}
                                        >
                                            {currentTheme === "default" ? "Used" : "Use"}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}

export default InventoryUI;
