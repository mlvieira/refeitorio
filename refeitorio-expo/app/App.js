import React from 'react';
import { registerRootComponent } from 'expo';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import '../global.css';

export function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

registerRootComponent(App);
