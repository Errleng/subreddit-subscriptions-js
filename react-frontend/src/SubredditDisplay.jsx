import React, { useState, useEffect } from 'react';
import Subreddit from './Subreddit';
import InputManager from './InputManager';

function SubredditDisplay(props) {
  const [subredditNames, setSubredditNames] = useState([]);
  const [subredditList, setSubredditList] = useState([]);
  const [sortTimes, setSortTimes] = useState({});

  useEffect(() => {
    const sortTimesJson = localStorage.getItem('subredditSortTimes');
    const sortTimesData = JSON.parse(sortTimesJson);
    if (sortTimesData !== null) {
      setSortTimes(sortTimesData);
    }

    const subredditNamesJson = localStorage.getItem('subscribedSubreddits');
    const storedSubredditNames = JSON.parse(subredditNamesJson);
    if (storedSubredditNames !== null) {
      setSubredditNames(storedSubredditNames);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'subscribedSubreddits',
      JSON.stringify(subredditNames)
    );
  }, [subredditNames]);

  useEffect(() => {
    localStorage.setItem('subredditSortTimes', JSON.stringify(sortTimes));
  }, [sortTimes]);

  useEffect(() => {
    setSubredditList(
      subredditNames.map((name) => {
        return (
          <Subreddit
            key={name}
            name={name}
            sortTime={sortTimes[name]}
            onChangeSortTime={onChangeSortTime.bind(this)}
          />
        );
      })
    );
  }, [subredditNames, sortTimes]);

  function invalidSubreddit(subredditName) {
    alert(`Could not get data for subreddit r/${subredditName}`);
  }

  function addSubreddit(subredditName) {
    if (!subredditNames.includes(subredditName)) {
      fetch(`/api/valid/subreddit/${subredditName}`).then((res) => {
        if (res.ok) {
          setSubredditNames(subredditNames.concat(subredditName));

          const newSortTimes = { ...sortTimes };
          newSortTimes[subredditName] = 'day';
          setSortTimes(newSortTimes);
        } else {
          invalidSubreddit(subredditName);
        }
      });
    } else {
      alert(`Subreddit ${subredditName} is already added`);
    }
  }

  function removeSubreddit(removedSubredditName) {
    const newSubredditNames = subredditNames.filter(
      (subredditName) => subredditName !== removedSubredditName
    );
    setSubredditNames(newSubredditNames);

    const newSubredditList = subredditList.filter(
      (sub) => sub.props.name !== removedSubredditName
    );
    setSubredditList(newSubredditList);

    const newSortTimes = { ...sortTimes };
    delete newSortTimes[removedSubredditName];
    setSortTimes(newSortTimes);
  }

  function onChangeSortTime(subredditName, event) {
    setSortTimes((sortTimes) => ({
      ...sortTimes,
      [subredditName]: event.target.value,
    }));
  }

  function download(content, fileName, contentType) {
    var a = document.createElement('a');
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  function saveSubredditNames() {
    const jsonData = JSON.stringify(subredditNames);
    download(jsonData, 'subreddit-names.json', 'application/json');
  }

  function loadSubredditNames(file) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setSubredditNames(JSON.parse(reader.result));
    };
  }

  if (subredditNames.length === 0) {
    return (
      <div>
        <InputManager addSubreddit={addSubreddit.bind(this)} />
        <div className='d-flex justify-content-end'>
          <button
            type='button'
            className='btn btn-primary mr-1'
            onClick={saveSubredditNames}
          >
            Export
          </button>
          <label
            htmlFor='subredditNamesFile'
            className='btn btn-primary no-margins'
          >
            Import
          </label>
          <input
            onChange={(e) => loadSubredditNames(e.target.files[0])}
            id='subredditNamesFile'
            type='file'
            className='hide'
          />
        </div>
      </div>
    );
  } else {
    const subredditNameList = subredditNames.map((subredditName) => {
      return (
        <li>
          <button
            type='button'
            className='btn btn-outline-secondary'
            onClick={() => removeSubreddit(subredditName)}
          >
            X
          </button>{' '}
          r/{subredditName}
        </li>
      );
    });

    return (
      <div>
        <InputManager addSubreddit={addSubreddit.bind(this)} />
        <div className='d-flex justify-content-end'>
          <button
            type='button'
            className='btn btn-primary mr-1'
            onClick={saveSubredditNames}
          >
            Export
          </button>
          <label
            htmlFor='subredditNamesFile'
            className='btn btn-primary no-margins'
          >
            Import
          </label>
          <input
            onChange={(e) => loadSubredditNames(e.target.files[0])}
            id='subredditNamesFile'
            type='file'
            className='hide'
          />
        </div>
        <div>
          <h4>Subscribed subreddits</h4>
          <ol>{subredditNameList}</ol>
          {subredditList}
        </div>
      </div>
    );
  }
}

export default SubredditDisplay;
