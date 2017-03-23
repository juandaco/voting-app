/* eslint-disable no-undef */

function getPolls() {
  return fetch(`http://localhost:3001/api/polls`, {
    accept: 'application/json'
  })
    .then(checkStatus)
    .then(parseJSON);
}

function getPoll(id) {
  return fetch(`http://localhost:3001/api/polls/${id}`, {
    accept: 'application/json'
  })
    .then(checkStatus)
    .then(parseJSON);
}

function voteFor(option, id) {
  const request = new Request(`http://localhost:3001/api/polls/${id}`, {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      name: option
    })
  });
  return fetch(request).then(checkStatus).then(parseJSON);
}

function newPoll(poll) {
  poll.options = poll.options.split(/\n/).map(option => {
    return {
      name: option,
      votes: 0
    };
  });

  const request = new Request(`http://localhost:3001/api/polls/`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(poll)
  });
  return fetch(request).then(checkStatus).then(parseJSON);
}

function loginUser() {
  return fetch(`http://localhost:3001/auth/github`)
    .then(checkStatus)
    // .then(parseJSON)
    .then(resp => console.log('Resp', resp));
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

const ApiCalls = { getPolls, getPoll, voteFor, newPoll, loginUser };

export default ApiCalls;
