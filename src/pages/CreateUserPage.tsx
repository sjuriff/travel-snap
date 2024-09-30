import { useContext, useEffect, useState } from "react"
import { View , Alert, Text, TextInput} from "react-native"
import CustomButton from "../components/Button/CustomButton"
import CustomRoundButton from "../components/Button/CustomRoundButton"
import AntDesign from "react-native-vector-icons/AntDesign"
import { myNavigation } from "../hooks/myNavigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { fireBaseAuth } from "../../firebase-config"
import { writeUserData } from "../../firebase-config"

const CreateUserPage:React.FC = () =>{
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [name, setName] = useState<string>()
    const [surName, setSurName] = useState<string>()
    const [userName, setUserName] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [textInputNumber, setTextInputNumber] = useState<number>()
    const {goBack} = myNavigation()


    const auth = fireBaseAuth

    const handleTextInputFocus = (isFocused: boolean, textInputNumber: number) =>{
        setIsFocused(isFocused)
        setTextInputNumber(textInputNumber)

    }



    const handleBackPress =() =>{
        goBack()
    }

    const handeUserInput = (): boolean =>{
        if (!email){
            Alert.alert("Email mangler")
            return false
        }else if(!password){
            Alert.alert("Passord mangler")
            return false
        }else if(!name){
            Alert.alert("Navn mangler")
            return false
        }else if(!surName){
            Alert.alert("Etternavn mangler")
            return false
        }else if(!userName){
            Alert.alert("Brukernavn mangler")
            return false
        }else{
            return true
        }
    }

    const createUser = async () =>{
        setLoading(true)
        if(handeUserInput()){
        try{
            const response = await createUserWithEmailAndPassword(auth, email!, password!)
            console.log(response)
            writeUserData(name!, surName!, userName!)
            Alert.alert(`Bruker for email ${email} har blitt opprettet. Gå tilbake for å logge inn`)
        }catch(error: any){
            Alert.alert("Oppreting av bruker feilet:" + error.message)
        }finally{
            setLoading(false)
        }
    }
    }


    return(
        <View className=" h-full  bg-background w-full flex items-center justify-start flex-col">
            <View className="mt-20 mb-10">
                <Text className="text-2xl font-bold text-secondary">Create User</Text>
            </View>

            <View className="absolute top-16 p-3  left-0">
                <CustomRoundButton onPress={handleBackPress} variant={"disabled"} Icon={AntDesign} iconName="arrowleft"/>
            </View>

            <View className="w-3/4 flex flex-col items-center justify-center  space-y-5">
                <View className="flex w-full flex-col space-y-0.5">
                    <Text className= {isFocused && textInputNumber == 1? "text-primary ml-2 font-bold" : "text-onBackground pl-1 font-bold"}>Email</Text>
                    <TextInput onBlur={() => setIsFocused(false)}  onFocus={() => handleTextInputFocus(true, 1)} className="bg-backgound text-onBackground border border-outline w-full p-3 rounded-lg focus:ring-primary focus:border-primary focus:text-onBackground" value = {email} placeholder="Email" placeholderTextColor={"#c1c9bf"} onChangeText={setEmail}/>
                </View>
                <View className="flex flex-col w-full space-y-0.5 ">
                    <Text className= {isFocused && textInputNumber == 2? "text-primary ml-2 font-bold" : "text-onBackground pl-1 font-bold"}>Password</Text>
                    <TextInput onBlur={() => setIsFocused(false)}  onFocus={() => handleTextInputFocus(true, 2)} className="bg-backgound text-onBackground border border-outline w-full p-3 rounded-lg focus:ring-primary focus:border-primary focus:text-onBackground" value = {password} placeholder="Password" placeholderTextColor={"#c1c9bf"} onChangeText={setPassword}/>
                </View>
                <View className="flex flex-col w-full space-y-0.5 ">
                    <Text className= {isFocused && textInputNumber == 3? "text-primary ml-2 font-bold" : "text-onBackground pl-1 font-bold"}>Navn</Text>
                    <TextInput onBlur={() => setIsFocused(false)}  onFocus={() => handleTextInputFocus(true, 3)} className="bg-backgound text-onBackground border border-outline w-full p-3 rounded-lg focus:ring-primary focus:border-primary focus:text-onBackground" value = {name} placeholder="Navn" placeholderTextColor={"#c1c9bf"} onChangeText={setName}/>
                </View>
                <View className="flex flex-col w-full space-y-0.5 ">
                    <Text className= {isFocused && textInputNumber == 4? "text-primary ml-2 font-bold" : "text-onBackground pl-1 font-bold"}>Etternavn</Text>
                    <TextInput onBlur={() => setIsFocused(false)}  onFocus={() => handleTextInputFocus(true, 4)} className="bg-backgound text-onBackground border border-outline w-full p-3 rounded-lg focus:ring-primary focus:border-primary focus:text-onBackground" value = {surName} placeholder="Etternavn" placeholderTextColor={"#c1c9bf"} onChangeText={setSurName}/>
                </View>
                <View className="flex flex-col w-full space-y-0.5 ">
                    <Text className= {isFocused && textInputNumber == 5? "text-primary ml-2 font-bold" : "text-onBackground pl-1 font-bold"}>Brukernavn</Text>
                    <TextInput onBlur={() => setIsFocused(false)}  onFocus={() => handleTextInputFocus(true, 5)} className="bg-backgound text-onBackground border border-outline w-full p-3 rounded-lg focus:ring-primary focus:border-primary focus:text-onBackground" value = {userName} placeholder="Brukernavn" placeholderTextColor={"#c1c9bf"} onChangeText={setUserName}/>
                </View>
                
            </View>
            <View className="mt-10">
                    <CustomButton onPress={createUser} title={"Lag Bruker"} variant={"primary"}/>
                </View>

            
            
        </View>
    )

}

export default CreateUserPage