import React, { useState, useEffect, useCallback } from 'react';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';
import { usePersonalInfo } from '../../context/PersonalInfoContext';

function Shop() {
    const { personalInfo } = usePersonalInfo();
    const [shopItems, setShopItems] = useState([]);
    const [userInventory, setUserInventory] = useState([]);
    const [coinBalance, setCoinBalance] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch shop items
    const fetchShopItems = useCallback(async () => {
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
    }, []);

    // Fetch user inventory
    const fetchUserInventory = useCallback(async () => {
        if (!personalInfo?.userId) return;

        try {
            const response = await axios.get(`http://localhost:8080/api/inventory/purchased/${personalInfo.userId}`);
            if (Array.isArray(response.data)) {
                setUserInventory(response.data.map(item => item.itemId));
            } else {
                console.error('Error fetching inventory:', response.data);
            }
        } catch (error) {
            console.error('Error fetching user inventory:', error);
        }
    }, [personalInfo]);

    // Fetch coin balance
    const fetchCoinBalance = useCallback(async () => {
        if (!personalInfo?.userId) {
            console.error('User ID is required to fetch coin balance.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/user/${personalInfo.userId}/coin-balance`);
            setCoinBalance(response.data);
        } catch (error) {
            console.error('Error fetching coin balance:', error);
        }
    }, [personalInfo]);

    useEffect(() => {
        fetchShopItems();
        fetchUserInventory();
        fetchCoinBalance();
    }, [fetchShopItems, fetchUserInventory, fetchCoinBalance]);

    const handleBuyClick = (item) => {
        setSelectedItem(item);
        setDialogOpen(true);
    };

    const confirmPurchase = async () => {
        if (!selectedItem || !personalInfo?.userId) return;

        if (coinBalance < selectedItem.itemCost) {
            setErrorMessage('You do not have enough coins to purchase this item.');
            setErrorDialogOpen(true);
            setDialogOpen(false);
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/inventory/purchase', null, {
                params: {
                    userId: personalInfo.userId,
                    itemId: selectedItem.itemId,
                },
            });

            setErrorMessage('Item successfully purchased!');
            setErrorDialogOpen(true);
            setCoinBalance(coinBalance - selectedItem.itemCost);
            fetchUserInventory();
        } catch (error) {
            setErrorMessage('Error purchasing the item. It might already be owned.');
            setErrorDialogOpen(true);
        } finally {
            setDialogOpen(false);
        }
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setSelectedItem(null);
    };

    const closeErrorDialog = () => {
        setErrorDialogOpen(false);
        setErrorMessage('');
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
                            {shopItems.map(item => {
                                const alreadyOwned = userInventory.includes(item.itemId);
                                return (
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
                                                        onClick={() => handleBuyClick(item)}
                                                        disabled={alreadyOwned}
                                                    >
                                                        {alreadyOwned ? 'Owned' : 'Buy'}
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </div>
            </Box>

            {/* Confirmation Dialog */}
            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogTitle>Confirm Purchase</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedItem
                            ? `Are you sure you want to purchase "${selectedItem.itemName}" for ${selectedItem.itemCost} coins?`
                            : 'No item selected.'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={confirmPurchase} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Error/Notification Dialog */}
            <Dialog open={errorDialogOpen} onClose={closeErrorDialog}>
                <DialogTitle>Notice</DialogTitle>
                <DialogContent>
                    <DialogContentText>{errorMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeErrorDialog} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Shop;
