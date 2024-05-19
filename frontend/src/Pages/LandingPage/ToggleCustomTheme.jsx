// ToggleCustomTheme.js
import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useThemeContext } from '../../Contexts/ThemeContext';
export default function ToggleCustomTheme() {
  const { showCustomTheme, toggleCustomTheme } = useThemeContext();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100dvw',
        position: 'fixed',
        bottom: 24,
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Platform"
        sx={{
          backgroundColor: 'background.default',
          '& .Mui-selected': {
            pointerEvents: 'none',
          },
        }}
      >
        <ToggleButton value>
          <AutoAwesomeRoundedIcon sx={{ fontSize: '20px', mr: 1 }} />
          Custom theme
        </ToggleButton>
        <ToggleButton value={false}>Material Design 2</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
