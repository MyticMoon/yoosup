Questions = new Meteor.Collection("questions");
Messages = new Meteor.Collection("messages");
AdminConversations = new Meteor.Collection("adminconversations");
Conversations = new Meteor.Collection("conversations");
ActiveConversations = new Meteor.Collection("activeconversations");

Meteor.startup(function () {
    
});

// AdminConversations.allow({
// 	'insert': function () {
// 		return true;
// 	}
// })

Meteor.methods({
 	addQuestion: function(questionText){
 		console.log('Adding Question');
 		var questionId = Questions.insert({
 			'questionText': questionText,
 			'submittedOn': new Date(),
 			'submittedBy': Meteor.userId()
 		});
 		return questionId;
 	},

 	incrementYesVotes : function(questionId){
	    console.log(questionId);
	    Questions.update(questionId,{$inc : {'yes':1}});
	},
	 
	incrementNoVotes : function(questionId){
	    console.log(questionId);
	    Questions.update(questionId,{$inc : {'no':1}});
	},

	addMessage: function(messageObject){
		var messageID = Messages.insert(
			{	'name': messageObject.sender,
				'message': messageObject.message,
				'time': messageObject.time}
			);
		console.log(messageID);
	},

	addConversation: function(messageObject){
		console.log("Add chat");
		console.log(messageObject);
		var messageID = Conversations.insert(
			{	'name': messageObject.sender,
				'message': messageObject.message,
				'time': messageObject.time,
				'receiver': messageObject.receiver,
				'session_id': messageObject.session_id,
			});		
		console.log(messageID);
	},

	addActiveConversation: function(activeObject) {
		console.log("Active messages");
		ActiveConversations.insert({
			'session_id': activeObject.session_id,
			'username': activeObject.username,
			'receiver': activeObject.receiver,
		});
	}
});

