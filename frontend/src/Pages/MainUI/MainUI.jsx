import * as React from 'react';
import { styled, Box, CssBaseline, Divider, Toolbar, IconButton, Badge, Container, Grid, Paper, Link, List, Typography, Icon } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import logo2 from "../../assets/logo2.png";
import { MainListItems, SecondaryListItems } from './listItems'; // Import MainListItems and SecondaryListItems
import { ThemeContextProvider, useThemeContext } from '../../Contexts/ThemeContext'; // Adjust the import path as necessary
import AppController from '../../RoutesController/AppController';
import { useParams } from 'react-router-dom';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

function MainUIContent() {
  const { feature } = useParams();
  const { mode, toggleColorMode } = useThemeContext();
  const [open, setOpen] = React.useState(true);
  const features = ["learn", "quiz", "performance", "roadmap", "settings"]
  const [currentFeature, setCurrentFeature] = React.useState("");
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    if (feature) {
      if (features.includes(feature)) {
        setCurrentFeature(feature.charAt(0).toUpperCase() + feature.slice(1))
      }
    }
  }, [feature])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
          }}
        >

          <IconButton onClick={()=>{
            navigate('/')
          }} sx={{ marginRight: '50px', padding: 0 }}>
            <Avatar src={logo2} alt='logo' />
          </IconButton>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {currentFeature}
          </Typography>
          <IconButton color="inherit" onClick={toggleColorMode}>
            {mode === 'dark' ? <Icon>
              <LightModeIcon />
            </Icon> : <Icon>
              <DarkModeIcon />
            </Icon>}
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <MainListItems /> {/* Render MainListItems here */}
          <Divider sx={{ my: 1 }} />
          <SecondaryListItems /> {/* Render SecondaryListItems here */}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="xxl" sx={{ mt: 4, mb: 4 }}>

          {/**main content renders here */}

          <AppController />


        </Container>
      </Box>
    </Box>
  );
}

export default function MainUI() {
  return (
    <ThemeContextProvider>
      <MainUIContent />
    </ThemeContextProvider>
  );
}
