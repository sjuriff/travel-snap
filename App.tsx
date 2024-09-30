
import { StyleSheet, Text, View, TouchableOpacity, Button, Alert, Image, TextInput} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabs from './src/routes/BottomTabs';
import TravelSnapProvider, { TravelSnapContext, TravelSnapContextType } from './src/hooks/MyContext';
import ImageDetails from './src/pages/ImageDetails';
import * as dotenv from "react-native-dotenv"
import { NativeWindStyleSheet } from 'nativewind';

import ImageUpLoad from './src/pages/ImageUpload';
import { memo, useContext, useEffect, useState } from 'react';
import LoginPage from './src/pages/LoginPage';
import CreateUserPage from './src/pages/CreateUserPage';
import { User, onAuthStateChanged } from 'firebase/auth';
import { fireBaseAuth } from './firebase-config';
import MainNavigation from './src/routes/MainNavigation';

NativeWindStyleSheet.setOutput({
  default: "native"
})

    const LoggedInStack = createStackNavigator()
    const Stack = createStackNavigator()

    const LoggedInLayout:React.FC = () =>{
      return(
        <LoggedInStack.Navigator>
          <LoggedInStack.Screen options = {{headerShown: false}} name='MainPage' component={BottomTabs}/>
          <LoggedInStack.Screen options={{headerShown: false}} name="UploadImage" component={ImageUpLoad}/>
          <LoggedInStack.Screen options={{headerShown: false}} name="ImageDetail" component={ImageDetails}/>
        </LoggedInStack.Navigator>
      )
    }

    const NotLoggedInLayout:React.FC = () =>{
      return(
        <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name='LoginPage' component={LoginPage}/>
            <Stack.Screen options={{headerShown: false}} name='CreateUserPage' component={CreateUserPage}/>
        </Stack.Navigator>
        
      )
    }

export default function  App(){
 

  const {Navigator, Screen} = createStackNavigator()

  const [user, setUser] = useState<User | null>(null)




  /*useEffect(()=>{
    onAuthStateChanged(fireBaseAuth, (user) =>{
      console.log(user)
      if (user == fireBaseAuth.currentUser)
      setUser(user)
    })

  })
  */

  



  return (
    <TravelSnapProvider>
      <MainNavigation/>
    </TravelSnapProvider>
  
  );
}

/*
 <TravelSnapProvider>
      <NavigationContainer >
      <Stack.Navigator initialRouteName='LoginPage'>
        {user? (<Stack.Screen name='LoggedIn' options={{headerShown: false}} component={LoggedInLayout}/>) : (
            
             <Stack.Screen name='NotLoggedIn' options={{headerShown: false}} component={NotLoggedInLayout}/>
              
              
        )}
            </Stack.Navigator>
      </NavigationContainer>
    </TravelSnapProvider>
*/


const styles = StyleSheet.create({
  container: {
    //alignSelf: "center",
    borderWidth: 2,
    borderColor: "black",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    //flexDirection: "column",
    //color: "red",
    

    

  
  },
  containerTwo: {
    display: "flex",
    borderWidth: 2,
    borderColor: "black",
    height: "70%",
    alignItems: "center",
    justifyContent: "center",
    

  
  },
  wrapper: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    //borderWidth: 2,
    //borderColor: "black",

  
  },
  textFieldWrapper:{
    display: "flex",
    height: "30%",
    alignItems: "center",
    justifyContent: "space-around",
  },

  image:{
    height: 100,
    width: 100,
    borderWidth: 2,
    borderColor: "black",

  }
});
