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

function voteFor(option, id) {
  const request = new Request(`/api/polls/${id}`, {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      name: option,
    }),
    credentials: 'include',
  });
  return fetch(request).then(checkStatus).then(parseJSON);
}

function newPoll(poll) {
  poll.options = poll.options.split(/\n/).map(option => {
    return {
      name: option,
      votes: 0,
    };
  });

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
  verifyUser,
  userLogout,
};

export default ApiCalls;
