import './config/firebase';
import { registerRootComponent } from 'expo';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/authStack';
import UserStack from './navigation/userStack';
import { useAuthentication } from './utils/userAuthentication';

function App() {
  const { user } = useAuthentication();

  return (
    <NavigationContainer>
      <PaperProvider>
        {user ? <UserStack /> : <AuthStack />}
      </PaperProvider>
    </NavigationContainer>
  );
}

registerRootComponent(App);
