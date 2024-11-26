import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponsiveAppBar from '../../component/Appbar';
import AvatarTheme from '../../component/Theme';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import { usePersonalInfo } from '../../context/PersonalInfoContext';  // Ensure this is imported

function InventoryUI() {
    const { personalInfo } = usePersonalInfo();  // Get user info from context
    const [purchasedItems, setPurchasedItems] = useState([]);

    useEffect(() => {
        if (personalInfo?.userId) {
            fetchPurchasedItems();
        } else {
            console.log('Waiting for personalInfo to populate...');
        }
    }, [personalInfo]);

    const fetchPurchasedItems = async () => {
        if (!personalInfo?.userId) {
            console.error('User ID is required to fetch purchased items.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/inventory/purchased/${personalInfo.userId}`);
            if (Array.isArray(response.data)) {
                setPurchasedItems(response.data.map(item => ({
                    itemId: item.itemId,
                    itemName: item.itemName,
                    itemUrl: item.itemUrl
                })));
            } else {
                console.error('Expected an array, but got:', response.data);
            }
        } catch (error) {
            console.error('Error fetching purchased items:', error);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" className="App">
            <ResponsiveAppBar />
            <AvatarTheme />
            <Box textAlign="center" mt={4} width="100%">
                <h2>My Inventory</h2>
                <Box sx={{ maxWidth: '100%', mx: 'auto', px: 10 }}>
                    <Grid container spacing={2} justifyContent="center">
                        {purchasedItems.map(item => (
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
                                    </CardContent>
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
