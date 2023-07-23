
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
// import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from 'firebase/auth';
// import GoogleCalendarSync from "../../components/GoogleCalendarSync";


export default function SyncEventsScreen() {
  
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  
  // GoogleSignin.configure({
  //   webClientId: ''
  // });
  
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  
  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return subscriber;
  // });
  
  // const onGoogleButtonPress = async () => {
  //   // Get the users ID token
  //   const { idToken } = await GoogleSignin.signIn();
    
  //   // Create a Google credential with the token
  //   const googleCredential = auth.GoogleAuthProvider.credential();
    
  //   // Sign in the user with the credential
  //   const user_sign_in = auth().signInWithCredential(googleCredential);
  //   user_sign_in.then((user) => {
  //     console.log(user);
  //   }).catch((error) => {
  //     console.log(error);
  //   })
  // };

  // const signOut = async () => {
  //   try {
  //     await GoogleSignin.revokeAccess();
  //     await GoogleSignin.signOut();
  //     setloggedIn(false);
  //     setuserInfo([]);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  
  if (initializing) return null;
  
  return(
    <View style={styles.container}>
      <GoogleSigninButton
        style={{ width: 300, height: 65, marginTop: 300}}
        onPress={onGoogleButtonPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});






// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import retrieveEventsFromGoogleCalendar from '../../utils/GoogleCalendar';


// const SyncEventsScreen = () => {
//   const handleSyncEvents = () => {
//     // Call the retrieveEventsFromGoogleCalendar function
//     retrieveEventsFromGoogleCalendar();
//   };

//   return (
//     <View>
//       <TouchableOpacity onPress={handleSyncEvents}>
//         <Text>Sync Events</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default SyncEventsScreen;

// const styles = StyleSheet.create({

  //   container: {
    //     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
// });

// export default function SyncEventsScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>
//         Still in progress...
//       </Text>
//     </View>
//   );
// }




// import React from 'react';
// import { View, Button, Text } from 'react-native';
// import * as AuthSession from 'expo-auth-session';

// const config = {
//   authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
//   clientId: '154626395460-84mivo0l62uuavcuji9pkbfflicq8kkf.apps.googleusercontent.com',
//   scopes: ['https://www.googleapis.com/auth/calendar.events.readonly'],
// };

// export default function SyncEventsScreen() {


  // const [isAuthenticating, setIsAuthenticating] = React.useState(false);

  // const handleSignIn = async () => {
  //   try {
  //     setIsAuthenticating(true);
  //     const redirect_uris = 'https://auth.expo.io/@Mina933/progresspal'
  //     const { params } = await AuthSession.startAsync({
  //       authUrl: `${config.authUrl}?client_id=${config.clientId}&redirect_uris=${encodeURIComponent(redirect_uris)}&response_type=token&scope=${config.scopes.join(
  //         '%20'
  //       )}`,
  //     });

  //     if (params && params.access_token) {
  //       const accessToken = params.access_token;
  //       fetchEvents(accessToken);
  //     } else {
  //       console.log('Google sign-in cancelled or failed.');
  //     }
  //   } catch (e) {
  //     console.log('Error with Google sign-in: ', e);
  //   } finally {
  //     setIsAuthenticating(false);
  //   }
  // };

  // const fetchEvents = async (accessToken) => {
  //   try {
  //     const response = await fetch(
  //       'https://www.googleapis.com/calendar/v3/calendars/primary/events',
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //     // Process and display the retrieved events data in your app
  //   } catch (e) {
  //     console.log('Error fetching events: ', e);
  //   }
  // };

  // return (
  //   <View>
  //     <Button
  //       title="Sync with Google Calendar"
  //       onPress={handleSignIn}
  //       disabled={isAuthenticating}
  //     />
  //   </View>
  // );
// }


