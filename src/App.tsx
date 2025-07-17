import { useState } from 'react'
import Chatroom from './components/Chatroom'
import Login from './components/Login'
import './App.css'
import {BrowserRouter as Router, Routes} from 'react-router'
import { Navigate, Route, useLocation, useNavigate } from "react-router";

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
         <Route
          path="/chat"
          element={<Chatroom />}
        />
      </Routes>
    </Router>
      {/* <Login /> */}
    </>
  )
}

export default App
