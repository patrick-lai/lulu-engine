import zepto from 'npm-zepto';

class LuluApi {

  constructor(){
    this.base = {
      api: 'https://lulu-league-assistant.herokuapp.com'
    }
    this.endpoints = {
      question: `${this.base.api}/question`
    }
  }

  sendQuestion(question, successFunction){
    var options = {
        method: 'POST',
        uri: this.endpoints.question,
        body: {
            question: question
        },
        json: true
    };

    $.ajax({
        url: this.endpoints.question,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          question: question
        }),
        success: successFunction
    });
  }

}

export default LuluApi;
