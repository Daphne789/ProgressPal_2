import { auth } from '../config/firebase';
import * as AppAuth from 'expo-google-app-auth';

const retrieveEventsFromGoogleCalendar = async () => {
    try {
      // Get the current user
      const currentUser = auth.currentUser;
  
      // Check if the user is authenticated
      if (currentUser) {
        // Get the authentication token from Firebase
        const token = await currentUser.getIdToken();
  
        // Configure Google API credentials
        const config = {
          iosClientId: '154626395460-66qd8mbjg2hp6a9g57d63cuioqiv9bnc.apps.googleusercontent.com',
          androidClientId: '154626395460-84mivo0l62uuavcuji9pkbfflicq8kkf.apps.googleusercontent.com',
          scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
          behavior: 'web',
        };
  
        // Retrieve the Google access token
        const { accessToken } = await AppAuth.logInAsync(config);
  
        // Make API request to Google Calendar API
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        if (response.ok) {
          // Events retrieved successfully
          const events = await response.json();
          console.log('Events:', events);
        } else {
          // Error occurred while retrieving events
          console.log('Error retrieving events:', response.status);
        }
      } else {
        // User not authenticated
        console.log('User not authenticated');
      }
    } catch (error) {
      // Handle error
      console.log('Error retrieving events:', error);
    }
  };
  
  export default retrieveEventsFromGoogleCalendar;


