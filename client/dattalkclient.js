Questions = new Meteor.Collection("questions");
Messages = new Meteor.Collection("messages");

Template.addquestion.events({
	'click input.add-question' : function(event){
		event.preventDefault();
		var questionText = document.getElementById("questionText").value;
		if(questionText != "") {
			Meteor.call("addQuestion", questionText, function(error, questionId){
			console.log('added question with id ..'+questionId);
		});
		document.getElementById("questionText").value = "";	
		}
	}
});
 
Template.questions.items = function(){
    return Questions.find({},{sort:{'submittedOn':-1}});
};

Template.question.events({
 
    'click': function () {
        Session.set("selected_question", this._id);
    },
 
    'click a.yes' : function (event) {
      event.preventDefault();
      if(Meteor.userId()){
        var questionId = Session.get('selected_question');
        console.log('updating yes count for questionId '+questionId);
        Meteor.call("incrementYesVotes",questionId);
 
      }
    },
 
    'click a.no': function(event){
      event.preventDefault();
      if(Meteor.userId()){
        var questionId = Session.get('selected_question');
        console.log('updating no count for questionId '+questionId);
        Meteor.call("incrementNoVotes",questionId);
      }
    }
 });

Template.entryfield.events({
  "keydown #message": function(event){
    if(event.which == 13){
      // Submit the form
      var name = document.getElementById('name');
      var message = document.getElementById('message');

      if(name.value != '' && message.value != ''){
      //   Messages.insert({
      //     name: name.value,
      //     message: message.value,
      //     time: Date.now()
      //   });
        var messageObject = {'name': name.value,
        					 'message': message.value,
        					 'time': Date.now()
    						};
    	Meteor.call("addMessage", messageObject);
      	
    	console.log(Messages.findOne());
        name.value = '';
        message.value = '';
      }
     }
    }
  });

Template.messages.messages = function(){
    return Messages.find({}, { sort: { time: -1 }});
}

Meteor.Router.add('/' , 'homepage');
Meteor.Router.add('/chatwindow' , 'chatwindow');