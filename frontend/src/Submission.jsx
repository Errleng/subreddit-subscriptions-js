import React from 'react';

function Submission(props) {
  // const [title, setTitle] = useState(props.title);
  // const [score, setScore] = useState(props.score);
  // const [text, setText] = useState(props.text);

  // useEffect(() => {
  //   const submission = props.submission;
  //   setTitle(submission.title);
  //   setScore(submission.score);
  //   setText(submission.selftext);
  // });

  const submission = props.submission;
  const { title, score } = submission;
  const text = submission.selftext;

  return (
    <div>
      <h5 className='text-center'>
        {title} ({score})
      </h5>
      <p>{text}</p>
    </div>
  );
}

export default Submission;
