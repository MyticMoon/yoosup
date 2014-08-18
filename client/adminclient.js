// Template.adminmessages.messages = function(messageObject) {
// 	console.log("Inside admin message");
// 	console.log(messageObject);
// 	return Conversations.find({$or: [{name:"admin"},{receiver:"admin"}], session_id: messageObject.receiver_sessionid}, {sort: { time: 1}});
// }