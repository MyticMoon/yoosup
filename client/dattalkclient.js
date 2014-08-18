Questions = new Meteor.Collection("questions");
Messages = new Meteor.Collection("messages");  //old
AdminConversations = new Meteor.Collection("adminconversations");  //obsolete
Conversations = new Meteor.Collection("conversations");
ActiveConversations = new Meteor.Collection("activeconversations");

if(Meteor.isClient) {
  Template.admin.conversations = function () {
    return ActiveConversations.find({}, {sort: {time: 1}});
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

  Template.admininputfield.events({
    "keydown": function(event){
      var inputid = event.currentTarget.id;
      if(event.which == 13) {
        var message = document.getElementById(inputid);
        var session_id = inputid.substring(7);
        var receiver = document.getElementById("receiver"+session_id).value;
        if(message.value != '') {
          var messageObject = {
            'time': Date.now(),
            'message': message.value,
            'session_id': session_id,
            'receiver': receiver,
            'sender': 'admin',
          };  
          Meteor.call("addConversation", messageObject);
          message.value ='';
        }
      }
    }
  });

  Template.entryfield.events({
    "keydown #message": function(event){
        if(event.which == 13){
            // Submit the form
            //var name = document.getElementById('name');
            var message = document.getElementById('message');
            //console.log(Session.get('sender'));
            if(message.value != ''){
              var messageObject = {
                'sender': Session.get('sender'),
          		  'message': message.value,
          		  'time': Date.now(),
                'receiver': Session.get('receiver'),
                'session_id': Meteor.connection._lastSessionId,
        		  };
            }
            // console.log(Meteor.user().profile.name);
          	// Meteor.call("addMessage", messageObject);
            Meteor.call("addConversation", messageObject);
          	// console.log(Messages.findOne());
            // name.value = '';
            var chatDiv = document.getElementById("conversation");  
            chatDiv.scrollTop = chatDiv.scrollHeight - 50;
            message.value = '';
        }
    },

    "keydown #username": function(event) {
      //can be marked as read or unread
        if(event.which == 13) {
            console.log('enter hit');
            var username = document.getElementById('username');
            if(username.value != ''){
                Session.set('sender', username.value);
                var activeObject = {
                    'username': username.value,
                    'session_id': Meteor.connection._lastSessionId,
                    'receiver': Session.get('admin_id'),
                };
                Meteor.call("addActiveConversation", activeObject);    
            }     
        }
    }
  });

  Template.messages.newmessages = function() {
    var sender = Session.get('sender');
    var receiver = Session.get('receiver');
    console.log(sender);
    console.log(receiver);
    return Conversations.find({$or: [{name:sender},{receiver:sender}], session_id: Meteor.connection._lastSessionId}, {sort: { time: 1}});
  }

  Template.adminmessages.messages = function(context, options) {
    var session_id = context.hash.receiver_session_id;
    console.log(session_id);
  
    return Conversations.find({session_id: session_id});
  }

  Meteor.Router.add('/' , 'newhomepage');
  Meteor.Router.add('/chatwindow' , 'chatwindow');  //old
  Meteor.Router.add('/admin' , 'admin');  //old

  //register handle bar for session:
  Handlebars.registerHelper('session', function(input) {
      return Session.get(input);
  });  

  Meteor.Router.add({
      '/chatwindow/client/:admin_id' : function (admin_id) {
          Session.set('admin_id', admin_id );
          return 'chatwindow';
      }
  });

  Meteor.Router.add({
      '/chatwindow/admin/:admin_id': function () {
          return 'admin';
      }
  });

//////////////////////////////////////////////////////////////////////////////

// New code

    Template.entryfield.activeusername = function () {
        console.log(Session.get('sender'));
        return (Session.get('sender') !== 'undefined' &&  Session.get('sender'));
    }
}