import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import InputManager from './InputManager';

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
