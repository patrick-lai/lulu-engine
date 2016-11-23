import * as ActionTypes from '../constants/ActionTypes.js';

const initialState = {
  nowTime: new Date(),
  response: 'Please ask me a question about league of legends',
  responseData: null,
  question: 'What is lulu\'s best build',
  annyang_listen: true
};

export default (state = initialState, action) => {
    switch (action.type) {

        case ActionTypes.NEW_QUESTION:
          return Object.assign({}, state, {
            question: action.question
          });


        // When there is a new answer
        case ActionTypes.NEW_RESPONSE:
            return Object.assign({}, state, {
              response: action.response
            });

        // Annyang Listen
        case ActionTypes.ANNYANG_LISTEN:
            return Object.assign({}, state, {
              annyang_listen: true
            });

        // Annyang Ignore
        case ActionTypes.ANNYANG_IGNORE:
            return Object.assign({}, state, {
              annyang_listen: false
            });
        default:
            return state;
    }
}
