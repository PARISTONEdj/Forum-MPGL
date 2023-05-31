import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Verif from './pages/Verif';
import Attente from './pages/Attente';
import Changepass from './pages/Changepass';
import { UserProvider } from "./components/UserProvider"
import Publish from './pages/Publish';
import Mespublications from './pages/Mespublications';
import Detail from './pages/Detail';
import Profiles from './pages/Profiles';
import Recherche from './pages/Recherche';
import Liste from './pages/Liste';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
              <Route path='/home' element={<Home/>}/>
              <Route path='/user/verify/:id/:uniqueString' element={<Verif/>}/>
              <Route path='/user/mail' element={<Attente/>}/>
              <Route path='/user/change/:id/:email' element={<Changepass/>}/>
              <Route path='/publish' element={<Publish/>}/>
              <Route path='/mespub' element={<Mespublications/>}/>
              <Route path='/detail/:id' element={<Detail/>}/>
              <Route path='/profile' element={<Profiles/>}/>
              <Route path='/recherche' element={<Recherche/>}/>
              <Route path='/liste' element={<Liste/>}/>



        </Routes>
      </BrowserRouter>
    </UserProvider>

  );
};

export default App;