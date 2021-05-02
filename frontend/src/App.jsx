import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import InputManager from './InputManager';
import './App.css';

function App() {
  return (
    <div className='container'>
      <div className='row justify-content-center mt-5'>
        <h1>MERN</h1>
      </div>
      <div className='mt-5 mb-5'>
        <InputManager />
      </div>
    </div>
  );
}

export default App;
