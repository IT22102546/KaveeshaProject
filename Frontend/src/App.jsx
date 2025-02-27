import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateRoute';
import Header from './Components/Header';
import PrivateRoute from './Components/PrivateRoute';
import DashBoard from './Pages/DashBoard';
import AddStudio from './Pages/AddStudios';


export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        

        <Route element={<PrivateRoute/>}/>
          <Route path="/dashboard" element={<DashBoard/>}/>
          
        <Route/>

        <Route element={<OnlyAdminPrivateRoute/>}>
           <Route path="/addstudios" element={<AddStudio/>}/>
        </Route>

      </Routes>



     


    </BrowserRouter>
  )
}
