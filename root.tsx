import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './Screens/Settings';
import Main from './Screens/Main';


export default function Root() {
  const Stack = createNativeStackNavigator();
  const noHeader = { headerShown: false };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="main" component={Main} options={noHeader} />
        <Stack.Screen name="settings" component={Settings} options={noHeader} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}