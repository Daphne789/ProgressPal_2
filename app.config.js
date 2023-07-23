require('dotenv').config();

export default {
  "expo": {
    "name": "progresspal",
    "slug": "progresspal",
    "version": "1.0.0",
    "orientation": "portrait",
    "entryPoint": "./App.js",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "detach": {
      "scheme": "progresspal"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "googleServicesFile": "./google-services.json",
      "package": "com.Mina933.progresspal",
      "permissions": [
        "READ_CALENDAR",
        "WRITE_CALENDAR"
      ],
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "progresspal",
              "host": "exp.host",
              "pathPrefix": "/@mina933/progresspal"
            }
          ],
          "category": [
            "BROWSABLE",
            "DEFAULT"
          ]
        }
      ],
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      "eas": {
        "projectId": "a7d5d9fa-23b2-43be-99d2-0c0a457c32b9"
      },
      "oauth": {
        "clientId": "154626395460-84mivo0l62uuavcuji9pkbfflicq8kkf.apps.googleusercontent.com"
      }
    },
    "plugins": ["@react-native-google-signin/google-signin"]
  }
}