import React, { useEffect, useState } from 'react';
import Submission from './Submission';

function SubredditSubmissions(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [submissions, setSubmissions] = useState(null);

  const subredditRequest =
    '/api/subreddit/' +
    props.name +
    '/' +
    props.sortType +
    '/' +
    props.sortTime +
    '/' +
    props.amount;

  useEffect(() => {
    fetch(subredditRequest)
      .then((res) => res.json())
      .then((json) => {
        setSubmissions(json);
        setIsLoaded(true);
      });
  }, []);

  if (isLoaded) {
    const submissionList = submissions.map((submission) => {
      return <Submission key={submission.id} submission={submission} />;
    });
    return <div>{submissionList}</div>;
  } else {
    return <h1>Loading...</h1>;
  }
}

export default SubredditSubmissions;
