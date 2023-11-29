import { MenuOutlined } from "@mui/icons-material";
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import React, { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";

interface LayoutProps { }

const HeaderComponent: React.FC<LayoutProps> = ({ }) => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleGoToGallery = () => {
        handleCloseNavMenu();
        navigate('/');
    }

    const handleGoToChatbot = () => {
        handleCloseNavMenu();
        navigate('/chatbot');
    }

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                        >
                            <MenuOutlined />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem onClick={handleGoToGallery}>
                                <Typography textAlign="center">Gallery</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleGoToChatbot}>
                                <Typography textAlign="center">Chatbot</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    <img src="logo.svg" alt="logo" width="100px" height="100px" />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        TaoTensor
                    </Typography>                    
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        TaoTensor
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'end' } }}>
                        <Button
                            onClick={handleGoToGallery}
                            sx={{ my: 2, color: 'black', display: 'block' }}
                        >
                            Gallery
                        </Button>
                        <Button
                            onClick={handleGoToChatbot}
                            sx={{ my: 2, color: 'black', display: 'block' }}
                        >
                            Chatbot
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default HeaderComponent;