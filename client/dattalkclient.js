Questions = new Meteor.Collection("questions");
Messages = new Meteor.Collection("messages");  //old
AdminConversations = new Meteor.Collection("adminconversations");  //obsolete
Conversations = new Meteor.Collection("conversations");

if(Meteor.isClient) {
  Template.admin.conversations = function () {
    return AdminConversations.find({}, {sort: {time: 1}});
  }

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
        //var name = document.getElementById('name');
        var message = document.getElementById('message');

        //if(name.value != '' && message.value != ''){
          console.log(Session.get('sender'));
        if(message.value != ''){
          //var messageObject = {'name': name.value,
          var messageObject = {
                     'sender': Session.get('sender'),
          					 'message': message.value,
          					 'time': Date.now(),
                     'receiver': Session.get('receiver'),
      		};
        }
        console.log(Meteor.user().profile.name);
      	Meteor.call("addMessage", messageObject);
        Meteor.call("addConversation", messageObject);
        	
      	console.log(Messages.findOne());
          //name.value = '';
        var chatDiv = document.getElementById("conversation");  
        chatDiv.scrollTop = chatDiv.scrollHeight - 50;
          message.value = '';
        
       }
      }
    });

  Template.messages.messages = function(){
      return Messages.find({}, { sort: { time: 1 }});
  }

  Template.messages.newmessages = function() {
      var sender = Session.get('sender');
      var receiver = Session.get('receiver');
      console.log(sender);
      console.log(receiver);
      return Conversations.find({$or: [{name:sender},{receiver:sender}]}, {sort: { time: 1}});
  }

  Meteor.Router.add('/' , 'homepage');
  Meteor.Router.add('/chatwindow' , 'chatwindow');

  Meteor.Router.add({
      '/chatwindow/:sender/:receiver': function(sender, receiver){
       Session.set('sender', sender);
       Session.set('receiver', receiver);
       return 'chatwindow';
    }
  });

  Meteor.Router.add('/admin' , 'admin');

//register handle bar for session:
  Handlebars.registerHelper('session', function(input) {
    return Session.get(input);
  });  
}



