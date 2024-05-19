import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Learn from '../Pages/Learn/Learn'
import Quiz from '../Pages/Quiz/Quiz'
import Performance from '../Pages/Performance/Performance'
import Roadmap from '../Pages/Roadmap/Roadmap'
import Settings from '../Pages/Settings/Settings'

function AppController() {
  return (
    <>
        <Routes>
            <Route exact path='/learn' element = {<Learn />} />
            <Route exact path='/quiz' element = {<Quiz />} />
            <Route exact path='/performance' element = {<Performance />} />
            <Route exact path='/roadmap' element = {<Roadmap />} />
            <Route exact path='/settings' element = {<Settings />} />
            
            
            
        </Routes>
    </>
  )
}

export default AppController