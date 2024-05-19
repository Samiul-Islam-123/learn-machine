import logo from './logo.svg';
import './App.css';
import {Container, Typography} from "@mui/material"
import LandingPage from './Pages/LandingPage/LandingPage';
import { Route, Routes } from 'react-router-dom';
import MainUI from './Pages/MainUI/MainUI';

function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<LandingPage />} />
        <Route exact path='/app/:feature' element={<MainUI />} />
      </Routes>
    </>
  );
}

export default App;
