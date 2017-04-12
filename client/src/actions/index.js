export const FETCH_POLLS = 'FETCH_POLLS';
export const RECEIVE_POLLS = 'RECEIVE_POLLS';
export const NEW_POLL = 'NEW_POLL';
export const NEW_OPTION = 'NEW_OPTION';
export const DELETE_POLL = 'DELETE_POLL';
export const VOTE_FOR = 'VOTE_FOR';

export const voteFor = (pollID, option) => ({
  type: VOTE_FOR,
  pollID,
  option,
});

export const createPoll = (title, options) => ({
  type: NEW_POLL,
  title,
  options,
});

export const newOption = (pollID, option) => ({
  type: NEW_OPTION,
  
});