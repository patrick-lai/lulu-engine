import * as ActionTypes from '../constants/ActionTypes';
import LuluApi from '../LuluApi';
import store from '../main';

const handleResponse = (response) => {

  // Start listening after 3 seconds
  setTimeout(function(){
    store.dispatch({
        type: ActionTypes.ANNYANG_LISTEN,
        annyang_listen: true
    });
  },3000);

  store.dispatch({
      type: ActionTypes.NEW_RESPONSE,
      response: response.text,
      responseData: response.data,
      annyang_listen: false
  });

}

export function sendQuestion(question) {

    const luluApi = new LuluApi();

    luluApi.sendQuestion(question, handleResponse);

    return {
        type: ActionTypes.NEW_RESPONSE,
        response: "Fetching please wait...",
        annyang_listen: false
    };
}

export function newQuestion(question) {
    return {
        type: ActionTypes.NEW_QUESTION,
        question: question
    };
}

export function newResponse(resposne) {
    return {
        type: ActionTypes.NEW_RESPONSE,
        resposne: resposne
    };
}
