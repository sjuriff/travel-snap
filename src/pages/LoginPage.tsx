import { useContext, useEffect, useState } from "react"
import { View, Text, TextInput, Alert, ActivityIndicator } from "react-native"
import MaterielCom from "react-native-vector-icons/MaterialCommunityIcons"
import CustomButton from "../components/Button/CustomButton"
import { myNavigation } from "../hooks/myNavigation"
import { fireBaseAuth } from "../../firebase-config"
import { signInWithEmailAndPassword } from "firebase/auth"
import { TravelSnapContext, TravelSnapContextType, UserData } from "../hooks/MyContext"
import { getApp } from "firebase/app"
import { getDatabase, ref as dbRef, onValue } from "firebase/database"

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [textInputNumber, setTextInputNumber] = useState<number>()
    const [fieldIsEmpty, setFieldIsEmpty] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const { updateCheckLogin, checkLogin, updateCurrentUserData } = useContext(TravelSnapContext) as TravelSnapContextType
    const auth = fireBaseAuth
    const { navigate } = myNavigation()

    const logIn = async () => {
        setLoading(true)
        try {
            const response = await signInWithEmailAndPassword(auth, email!, password!)
            handleUserData()
            if (checkLogin) {
                updateCheckLogin(false)
            } else {
                //Her settes checkLogin slik at useEffecten i mainNavigation kjøres
                updateCheckLogin(true)
            }
        } catch (error: any) {
            Alert.alert("Inloggin feilet: Feil email eller passord")
        } finally {
            setLoading(false)
        }
    }

    /*
    Her håndteres det om feltene er tomme eller ikke.
    Usefeccet kjører på endringer av email og passord.
    Dette gjøres for å håndtere fargene på knappene mine
    hvis email eller passord er tom, er lag bruker knappen primary
    hvis begge fletene er fylt, er log in knappen primary.
    */
    useEffect(() => {
        handleFieldIsEmpty()
    }, [email, password])

    const handleTextInputFocus = (isFocused: boolean, textInputNumber: number) => {
        setIsFocused(isFocused)
        setTextInputNumber(textInputNumber)
    }

    const handleFieldIsEmpty = () => {
        if (email && password) {
            setFieldIsEmpty(false)
        } else {
            setFieldIsEmpty(true)
        }
    }

    const handleUserData = () => {
        const user = fireBaseAuth.currentUser
        readUserData((user?.uid as string))
    }

    const readUserData = (userId: string) => {
        const myApp = getApp()
        const db = getDatabase(myApp)
        const userDataRef = dbRef(db, `userData/${userId}`)

        onValue(userDataRef, (snapshot) => {
            updateCurrentUserData(snapshot.val())
        })
    }

    const handleCreateUserPress = () => {
        navigate("CreateUserPage")
    }

    return (
        <View className="h-full w-full flex items-center justify-start flex-col bg-background space-y-10">
            <View className='items-center flex w-3/4 justify-center border-b border-secondary  flex-row  mt-28  '>
                <Text className=' opacity-100  text-secondary text-4xl font-bold '>Travel Snap</Text>
                <View className='pb-3'>
                    <MaterielCom name='palm-tree' size={50} color={"#81d997"} />
                </View>
            </View>
            <View className="bg-secondary p-3  rounded-2xl">
                <Text className="text-onSecondary text-m font-semibold">Welcome to travel-snap! Log in or create a new user</Text>
            </View>
            <View className="w-3/4 flex flex-col items-center justify-center  space-y-5">
                <View className="flex w-full flex-col space-y-0.5">
                    <Text className={isFocused && textInputNumber == 1 ? "text-primary ml-2 font-bold" : "text-onBackground pl-1 font-bold"}>Email</Text>
                    <TextInput onBlur={() => setIsFocused(false)} onFocus={() => handleTextInputFocus(true, 1)} className="bg-backgound text-onBackground border border-outline w-full p-3 rounded-lg focus:ring-primary focus:border-primary focus:text-onBackground" value={email} placeholder="Email" placeholderTextColor={"#c1c9bf"} onChangeText={setEmail} />
                </View>
                <View className="flex flex-col w-full space-y-0.5 ">
                    <Text className={isFocused && textInputNumber == 2 ? "text-primary ml-2 font-bold" : "text-onBackground pl-1 font-bold"}>Password</Text>
                    <TextInput secureTextEntry={true} onBlur={() => setIsFocused(false)} onFocus={() => handleTextInputFocus(true, 2)} className="bg-backgound text-onBackground border border-outline w-full p-3 rounded-lg focus:ring-primary focus:border-primary focus:text-onBackground" value={password} placeholder="Password" placeholderTextColor={"#c1c9bf"} onChangeText={setPassword} />
                </View>
            </View>
            <View className="w-3/4 flex flex-col items-center justify-center  space-y-5">
                {loading && <ActivityIndicator size={"large"} color={"#81d997"} />}
                <View>
                    <CustomButton title={"Log Inn"} onPress={logIn} variant={fieldIsEmpty ? "disabled" : "primary"} changeVariant={fieldIsEmpty} />
                </View>
                <View>
                    <CustomButton title={"Create New User"} variant={fieldIsEmpty ? "primary" : "disabled"} onPress={handleCreateUserPress} changeVariant={fieldIsEmpty} />
                </View>
            </View>
        </View>
    )
}

export default LoginPage