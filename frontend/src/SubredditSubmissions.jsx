import React, { useEffect, useState } from 'react';
import Submission from './Submission';
import TimePeriodSelect from './TimePeriodSelect';

function SubredditSubmissions(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [submissions, setSubmissions] = useState(null);
  const [sortTime, setSortTime] = useState(props.sortTime || 'day');

  const subredditRequest =
    '/api/subreddit/' +
    props.name +
    '/' +
    props.sortType +
    '/' +
    sortTime +
    '/' +
    props.amount;

  useEffect(() => {
    console.log('fetching data from Reddit');
    fetch(subredditRequest)
      .then((res) => res.json())
      .then((json) => {
        setSubmissions(json);
        setIsLoaded(true);
      });
  }, [sortTime]);

  function onChangeSortTime(event) {
    setSortTime(event.target.value);
    return props.onChangeSortTime(props.name, event);
  }

  if (isLoaded) {
    const submissionList = submissions.map((submission) => {
      return <Submission key={submission.id} data={submission} />;
    });
    return (
      <div>
        <TimePeriodSelect
          timePeriod={sortTime}
          postHandleChange={onChangeSortTime.bind(this)}
        />
        {submissionList}
      </div>
    );
  } else {
    return <h1>Loading...</h1>;
  }
}

export default SubredditSubmissions;
