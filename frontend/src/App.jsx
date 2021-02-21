import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/test')
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setData(json.data);
      });
  });

  return (
    <div className='container'>
      <h1>MERN</h1>
      <h2>{data}</h2>
    </div>
  );
}

export default App;
