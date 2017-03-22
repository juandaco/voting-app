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

const ApiCalls = { getPolls, getPoll };

export default ApiCalls;
