import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Submission from './Submission';

function App() {
  const [testData, setTestData] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);

  useEffect(() => {
    fetch('/api/test')
      .then((res) => res.json())
      .then((json) => {
        setTestData(json.data);
      });

    fetch('/api/subreddit/copypasta')
      .then((res) => res.json())
      .then((json) => {
        setSubmissionData(json[0]);
      });
  }, []);

  if (submissionData) {
    return (
      <div className='container'>
        <h1>MERN</h1>
        <h2>{testData}</h2>
        <Submission submission={submissionData} />
      </div>
    );
  } else {
    return (
      <div className='container'>
        <h1>MERN</h1>
        <h2>{testData}</h2>
      </div>
    );
  }
}

export default App;
