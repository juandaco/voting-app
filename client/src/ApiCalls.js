function getPolls() {
  return fetch(`/api/polls`, {
    accept: 'application/json',
  })
    .then(checkStatus)
    .then(parseJSON);
}

function getUserPolls() {
  return fetch('/api/users/polls', {
    accept: 'application/json',
    credentials: 'include',
  })
    .then(checkStatus)
    .then(parseJSON);
}

function getPoll(id) {
  return fetch(`/api/polls/${id}`, {
    accept: 'application/json',
  })
    .then(checkStatus)
    .then(parseJSON);
}

function voteFor(option, pollID, userIdentifier) {
  const request = new Request(`/api/polls/${pollID}`, {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      name: option,
      userIdentifier,
    }),
    credentials: 'include',
  });
  return fetch(request).then(checkStatus).then(parseJSON);
}

function newPoll(poll) {
  const request = new Request(`/api/polls/`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(poll),
    credentials: 'include',
  });
  return fetch(request).then(checkStatus).then(parseJSON);
}

function getIP() {
  return fetch(`https://api.ipify.org?format=json`, {
    accept: 'application/json',
  })
    .then(checkStatus)
    .then(parseJSON);
}

function verifyUser() {
  return fetch(`/api/users/current`, {
    accept: 'application/json',
    credentials: 'include',
  })
    .then(checkStatus)
    .then(parseJSON);
}

function userLogout() {
  return fetch(`/api/users/logout`, {
    accept: 'application/json',
    credentials: 'include',
  })
    .then(checkStatus)
    .then(parseJSON);
}

function deletePoll(id) {
  return fetch(`/api/polls/${id}`, {
    method: 'DELETE',
    accept: 'application/json',
    credentials: 'include',
  })
    .then(checkStatus)
    .then(parseJSON);
}

/*
  Generic functions
*/
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

const ApiCalls = {
  getPolls,
  getUserPolls,
  getPoll,
  voteFor,
  newPoll,
  deletePoll,
  getIP,
  verifyUser,
  userLogout,
};

export default ApiCalls;
