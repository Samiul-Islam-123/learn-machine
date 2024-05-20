import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Quiz from '../Pages/Quiz/Quiz'
import Performance from '../Pages/Performance/Performance'
import Roadmap from '../Pages/Roadmap/Roadmap'
import Settings from '../Pages/Settings/Settings'
import Material from '../Pages/Material/Material'
import Doubts from '../Pages/Doubts/Doubts'

function AppController() {
  return (
    <>
        <Routes>
            <Route exact path='/material' element = {<Material />} />
            <Route exact path='/doubts' element = {<Doubts />} />
            
            <Route exact path='/quiz' element = {<Quiz />} />
            <Route exact path='/performance' element = {<Performance />} />
            <Route exact path='/roadmap' element = {<Roadmap />} />
            <Route exact path='/settings' element = {<Settings />} />
            
            
            
        </Routes>
    </>
  )
}

export default AppController