import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

//icons
import SchoolIcon from '@mui/icons-material/School';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import BarChartIcon from '@mui/icons-material/BarChart';
import RouteIcon from '@mui/icons-material/Route';

import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const MainListItems = () => {
  const navigate = useNavigate(); // Use useNavigate hook
  
  return (
    <React.Fragment>
      <ListItemButton onClick={() => navigate('/app/learn')}>
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="Learn Today" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/app/quiz')}>
        <ListItemIcon>
          <VideogameAssetIcon />
        </ListItemIcon>
        <ListItemText primary="Quiz" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/app/performance')}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Performance" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/app/roadmap')}>
        <ListItemIcon>
          <RouteIcon />
        </ListItemIcon>
        <ListItemText primary="Roadmap" />
      </ListItemButton>
    </React.Fragment>
  );
};

const SecondaryListItems = () => {
  const navigate = useNavigate(); // Use useNavigate hook
  
  return (
    <React.Fragment>
      <ListItemButton onClick={() => navigate('/app/settings')}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/app/logout')}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </React.Fragment>
  );
};

export { MainListItems, SecondaryListItems };
