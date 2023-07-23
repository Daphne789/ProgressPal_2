// import React, { useEffect } from 'react';
// import { View, Text } from 'react-native';
// import { google } from 'googleapis';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import axios from 'axios';

// const GoogleCalendar = () => {

//     const configureGoogleSignIn = async () => {
//         await GoogleSignin.configure({
//             webClientId: 'YOUR_WEB_CLIENT_ID',
//             offlineAccess: true,
//             scopes: ['https://www.googleapis.com/auth/calendar'],
//         });
//     };
    
//     useEffect(() => {
//         configureGoogleSignIn();
//     }, []);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const calendar = google.calendar('v3');
//     const accessToken = 'YOUR_ACCESS_TOKEN'; // Replace with the access token obtained after Google Sign-In

//     try {
//       const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       const events = response.data.items;
//       console.log('Events:', events);
//     } catch (error) {
//       console.log('Error fetching events:', error);
//     }
//   };

//   return (
//     <View>
//       <Text>Google Calendar Integration</Text>
//     </View>
//   );
// };

// export default GoogleCalendar;