import firebase from 'firebase' 

const config = {
  apiKey: "AIzaSyCWT64kxYunCLAlVDytHbODFcRDh_m1TPk",
  authDomain: "influencermarketing-2cbc9.firebaseapp.com",
  databaseURL: "https://influencermarketing-2cbc9.firebaseio.com",
  projectId: "influencermarketing-2cbc9",
  storageBucket: "influencermarketing-2cbc9.appspot.com",
  messagingSenderId: "449326046825",
  appId: "1:449326046825:web:c923d324f724d45248ccf8"
};

const settings = { timestampsInSnapshots: true };
firebase.initializeApp(config);
// sessionの永続性の指定
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
firebase.firestore().settings(settings);

export default firebase