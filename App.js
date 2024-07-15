import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import Home from './components/Home';
import MyPage from './components/MyPage';
import Diagnosis from './components/Diagnosis';
import Notification from './components/Notification';
import History from './components/History';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home" 
      component={Home} 
      options={{
        title: '' ,
        headerShadowVisible: false
       }} // ヘッダーの下の線を非表示に設定
    />
    <Stack.Screen 
      name="Diagnosis" 
      component={Diagnosis} 
      options={{ title: 'Diagnosis' }} // タイトルを設定
    />
    <Stack.Screen 
      name="Notification" 
      component={Notification} 
      options={{ title: 'Notification' }} // タイトルを設定
    />
    <Stack.Screen 
      name="History" 
      component={History} 
      options={{ title: 'History' }} // タイトルを設定
    />
  </Stack.Navigator>
);

const MyPageStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="MyPage" 
      component={MyPage} 
      options={{ title: 'My Page' }} // タイトルを設定
    />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ tabBarShowLabel: false }}>
        <Tab.Screen 
          name="Hometab" 
          component={HomeStack} 
          options={{ 
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? require('./assets/home.png') : require('./assets/home.png')}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
            ),
          }} 
        />
        <Tab.Screen 
          name="MyPage" 
          component={MyPageStack} 
          options={{ 
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? require('./assets/profile.png') : require('./assets/profile.png')}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
            ),
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;