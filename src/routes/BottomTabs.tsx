import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IonIcon from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import ImageList from '../pages/ImageList';
import ChooseImage from '../pages/ChooseImage';
import ProfilePage from '../pages/ProfilePage';


const BottomTabs:React.FC = () =>{
    const Tab = createBottomTabNavigator()
    const screenOptions = {
        headerShown: false,
        tabBarStyle:{
            borderColor: "#8b938a",
            backgroundColor: "black",
            padding: 10,
            height: 90,
        },
        tabBarActiveTintColor: "#ffb1c2",
        tabBarInactiveTintColor: "#c1c9bf",
    }

    const iconStyle =(isFocused: Boolean) =>({
        color: isFocused? "#81d997" : "#c1c9bf",
        opacity: isFocused? 1: 0.5,
        marginBottom: isFocused ? 6 : 0
    
    
    })
    return(
        <Tab.Navigator  initialRouteName='ImageList'>
            <Tab.Screen name='Hjem' component={ImageList} options={{...screenOptions, tabBarLabelStyle: { fontSize: 13, fontWeight: "700"} ,tabBarIcon: ({focused}) => <AntDesign name='home' size={25} style = {iconStyle(focused)}/>}}></Tab.Screen>
            <Tab.Screen  name='Innlegg' component={ChooseImage} options={{...screenOptions, tabBarLabelStyle: { fontSize: 13, fontWeight: "700"}, tabBarIcon: ({focused}) => <AntDesign name='plussquareo' size={25} style = {iconStyle(focused)}/>}}></Tab.Screen>
            <Tab.Screen  name='Profil' component={ProfilePage} options={{...screenOptions, tabBarLabelStyle: { fontSize: 13, fontWeight: "700"}, tabBarIcon: ({focused}) => <IonIcon name='person-outline' size={25} style = {iconStyle(focused)}/>}}></Tab.Screen>
        </Tab.Navigator>

    )
}

export default BottomTabs