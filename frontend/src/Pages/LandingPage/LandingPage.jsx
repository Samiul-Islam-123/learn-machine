import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppAppBar from '../../Components/AppAppBar';
import Hero from '../../Components/Hero';
import LogoCollection from '../../Components/LogoCollection';
import Highlights from '../../Components/Highlights';
import Pricing from '../../Components/Pricing';
import Features from '../../Components/Features';
import Testimonials from '../../Components/Testimonials';
import FAQ from '../../Components/FAQ';
import Footer from '../../Components/Footer';
import ToggleCustomTheme from './ToggleCustomTheme';
import { ThemeContextProvider, useThemeContext } from '../../Contexts/ThemeContext';
import LocomotiveScroll from 'locomotive-scroll';


export default function LandingPage() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <LandingPageContent />
    </ThemeContextProvider>
  );
}

function LandingPageContent() {
  const { mode, toggleColorMode, showCustomTheme, toggleCustomTheme } = useThemeContext();
  document.addEventListener("DOMContentLoaded", () => {
    const scroll = new LocomotiveScroll({
      el: document.querySelector('wrapper'),
      smooth: true
    });
  });

  return (
    <div className='wrapper'>
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Hero />
      <Box sx={{ bgcolor: 'background.default' }}>

        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </Box>
    </div>
  );
}
