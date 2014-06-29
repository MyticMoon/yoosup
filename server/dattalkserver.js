Questions = new Meteor.Collection("questions");
Messages = new Meteor.Collection("messages");

Meteor.startup(function () {
    
});

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
		console.log("Add chat");
		console.log(messageObject);
		var messageID = Messages.insert(
			{	'name': messageObject.name,
				'message': messageObject.message,
				'time': messageObject.time}
			);

		console.log(messageID);
		// console.log(Messages);
		// Messages.insert({
		// 	name: params[0],
		// 	message: params[1],
		// 	time: params[2]
		// });
	}
});

