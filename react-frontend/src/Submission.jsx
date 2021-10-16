import React from 'react';
import ImageComponent from './ImageComponent';

function Submission(props) {
  const { id, title, score, upvote_ratio, imageUrls } = props.data;

  const shortlink = `https://redd.it/${id}`;
  const info = [score, `${upvote_ratio * 100}%`].filter(Boolean).join(', ');

  const imageElements =
    imageUrls === undefined
      ? null
      : imageUrls.map((preview) => {
        return <ImageComponent key={preview} image_link={preview} />;
      });

  return (
    <div id={`post-${id}`}>
      <hr className='submission-divider' />
      <a
        className='App-link'
        href={shortlink}
        rel='noopener noreferrer'
        target='_blank'
      >
        <h3>
          {title} ({info})
        </h3>
        {imageElements}
      </a>
    </div>
  );
}

export default Submission;
