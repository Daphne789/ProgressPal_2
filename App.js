const React = require('react');
import './config/firebase';
import RootNavigation from './navigation';
import { registerRootComponent } from 'expo';

export default function App() {
  return (
    <RootNavigation />
  );
}
registerRootComponent(App);
