
import {NavigationContainer} from '@react-navigation/native'
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabs from './BottomTabs';
import { TravelSnapContext, TravelSnapContextType } from '../hooks/MyContext';
import ImageDetails from '../pages/ImageDetails';
import { NativeWindStyleSheet } from 'nativewind';
import ImageUpLoad from '../pages/ImageUpload';
import { useContext, useEffect, useState } from 'react';
import LoginPage from '../pages/LoginPage';
import CreateUserPage from '../pages/CreateUserPage';
import { User} from 'firebase/auth';
import { fireBaseAuth } from '../../firebase-config';
import CreateProfilePage from '../pages/CreateProfilePage';
import Map from '../pages/Map';

NativeWindStyleSheet.setOutput({
  default: "native"
})


const LoggedInStack = createStackNavigator()
const Stack = createStackNavigator()
//Lager to stacks, en for å håndtere navigationen når bruker er pålogget, og en for å håndtere navigasjon når bruker ikke er pålogget
const LoggedInLayout:React.FC = () =>{
  return(
    <LoggedInStack.Navigator>
      <LoggedInStack.Screen options = {{headerShown: false}} name='MainPage' component={BottomTabs}/>
      <LoggedInStack.Screen options={{headerShown: false}} name="UploadImage" component={ImageUpLoad}/>
      <LoggedInStack.Screen options={{headerShown: false}} name="ImageDetail" component={ImageDetails}/>
      <LoggedInStack.Screen options={{headerShown: false}} name="CreateProfilePage" component={CreateProfilePage}/>
      <LoggedInStack.Screen options={{headerShown: false}} name="Map" component={Map}/>
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

const MainNavigation: React.FC = () =>{


  

  const [user, setUser] = useState<User | null>(null)
  //Henter checkLogin fra contexten min, den blir tiggra fra LoginPage.
  //Useeffecten under har en dependency til checkLogin, og vil kjøre når den blir satt i LoginPage
  const {checkLogin} = useContext(TravelSnapContext) as TravelSnapContextType

  useEffect(()=>{
    const checkUser = fireBaseAuth.currentUser
    if(checkUser){
      setUser(checkUser)
      console.log("checkUser" + checkUser)
    }else{
      setUser(null)
    }
  }, [checkLogin])


  return (
    
      <NavigationContainer >
      <Stack.Navigator initialRouteName='LoginPage'>
        {user? (<Stack.Screen name='LoggedIn' options={{headerShown: false}} component={LoggedInLayout}/>) : (
              <Stack.Screen name='NotLoggedIn' options={{headerShown: false}} component={NotLoggedInLayout}/>
        )}
            </Stack.Navigator>
      </NavigationContainer>
  
  
  );
}

export default MainNavigation