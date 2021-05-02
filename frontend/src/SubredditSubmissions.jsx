import React, { useEffect, useState } from 'react';
import Submission from './Submission';
import TimePeriodSelect from './TimePeriodSelect';

function SubredditSubmissions(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [submissions, setSubmissions] = useState(null);
  const [sortTimePeriod, setSortTimePeriod] = useState(props.sortTime);

  function onChangeTimePeriod(event) {
    setSortTimePeriod(event.target.value);
  }

  const subredditRequest =
    '/api/subreddit/' +
    props.name +
    '/' +
    props.sortType +
    '/' +
    sortTimePeriod +
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
  }, [sortTimePeriod]);

  if (isLoaded) {
    const submissionList = submissions.map((submission) => {
      return <Submission key={submission.id} data={submission} />;
    });
    return (
      <div>
        <TimePeriodSelect
          timePeriod={sortTimePeriod}
          postHandleChange={onChangeTimePeriod.bind(this)}
        />
        {submissionList}
      </div>
    );
  } else {
    return <h1>Loading...</h1>;
  }
}

export default SubredditSubmissions;
