const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();




// For sending topic notification to subscribed user on Firestore document create
// name the function anyway you want, here: "sendTopicNotificationToUser"
// this particular function gets triggered when a document is created in "reports" collection in firebase
// customize this the way you want
exports.sendTopicNotificationToUser = functions.firestore.document('reports/{docID}').onCreate((snapshot,context)=>{

    const newAlert = snapshot.data(); // the entire report here, or the document
    // send the notification
    sendPushFor(newAlert);
});



// For sending topic notification to subscribed user on RTDB node create
exports.appendrecordtospreadsheet = functions.database.ref(`/reports/{docID}`).onCreate(
    (snap) => {
      const newAlert = snap.val(); // the entire child under docID
      // now do the sending 
      sendPushFor(newAlert);
});



// This function actually does the sending for you
function sendPushFor(newAlert){
  
      const payload = {
        notification: {
          title: 'New Alert for '+newAlert.reason, // "reason" was a field of my document, access any field using dot notation, same goes for RTDB child node
          body: newAlert.notes, // "notes" was also a field of my document, access RTDB child node the same way
        }
      };
  
  
    // "topic" was a topic in my doc, like the above
  // use any String value here, based on your use case
  // it is not mandatory to add this with the document, for my use case, it was pretty handy
    admin.messaging().sendToTopic(newAlert.topic,payload)
      .then(response => {
        return console.log('Successfully sent message',response)
      })
      .catch(error => {
        console.log('Error sending message',error)
      })
  
  
}

