import React, { useEffect, useState } from 'react';

function Submission(props) {
  const [title, setTitle] = useState(props.title);
  const [score, setScore] = useState(props.score);
  const [text, setText] = useState(props.text);

  useEffect(() => {
    const submission = props.submission;
    setTitle(submission.title);
    setScore(submission.score);
    setText(submission.selftext);
    console.log(submission);
  });

  return (
    <div>
      <h4>
        {title} ({score})
      </h4>
      <p>{text}</p>
    </div>
  );
}

export default Submission;
