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
import { usePersonalInfo } from '../../context/PersonalInfoContext';

function InventoryUI() {
    const { personalInfo } = usePersonalInfo();
    const userID = personalInfo?.userId;

    const [inventoryItems, setInventoryItems] = useState([]);
    const [currentTheme, setCurrentTheme] = useState('default');
    const [themeUrl, setThemeUrl] = useState(`${process.env.PUBLIC_URL}/images/themes/theme.png`);

    useEffect(() => {
        const savedTheme = localStorage.getItem('currentTheme') || 'default';
        const savedThemeUrl = localStorage.getItem('themeUrl') || `${process.env.PUBLIC_URL}/images/themes/theme.png`;
        setCurrentTheme(savedTheme);
        setThemeUrl(savedThemeUrl);

        fetchInventoryItems();
    }, []);

    const fetchInventoryItems = async () => {
        try {
            if (!userID) {
                console.error("User ID is undefined");
                return;
            }
            const response = await axios.get(`http://localhost:8080/api/inventory/getInventoryByUserId/${userID}`);
            
            if (Array.isArray(response.data)) {
                const updatedInventory = response.data.map((item) => {
                    const itemData = item.item || {}; // Fallback to an empty object if item.item is undefined
                    return {
                        ...item,
                        itemUrl: itemData.itemUrl || 'theme.png', // Default to 'theme.png' if itemUrl is missing
                        itemCost: itemData.itemCost || 0, // Default to 0 if itemCost is missing
                        itemName: itemData.itemName || 'Unknown Item', // Default name if itemName is missing
                    };
                });
                setInventoryItems(updatedInventory);
            } else {
                console.error('Expected an array, but got:', response.data);
            }
        } catch (error) {
            console.error('Error fetching inventory items:', error.response?.data || error.message);
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
            <AvatarTheme theme={themeUrl} />
            <Box textAlign="center" mt={4} width="100%">
                <h2>Inventory</h2>
                <Box sx={{ maxWidth: '100%', mx: 'auto', px: 10 }}>
                    <Grid container spacing={2} justifyContent="center">
                        {inventoryItems.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.inventoryId}>
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
                                                    item.itemName,
                                                    `${process.env.PUBLIC_URL}/images/themes/${item.itemUrl}`
                                                )
                                            }
                                            disabled={currentTheme === item.itemName}
                                        >
                                            {currentTheme === item.itemName ? 'Used' : 'Use'}
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
