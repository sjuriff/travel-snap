import * as ImagePicker from "expo-image-picker"
import AntDesign from "react-native-vector-icons/AntDesign"
import { StyleSheet, Text, View, TouchableOpacity, Button, Alert, Image, TextInput} from 'react-native';
import CustomButton from "../components/Button/CustomButton";
import { TravelSnapContext, TravelSnapContextType } from "../hooks/MyContext";
import { useEffect, useRef, useState, useContext } from 'react';
import { FireImage } from "./ImageList";
import CustomRoundButton from "../components/Button/CustomRoundButton";
import { myNavigation } from "../hooks/myNavigation";




const ChooseImage: React.FC = () =>{
    const [permission, requestPermission] = ImagePicker.useCameraPermissions()
    const [pickPermission, requestPickPermission] = ImagePicker.useMediaLibraryPermissions()
    const {updateCameraImage} = useContext(TravelSnapContext) as TravelSnapContextType
    const [image, setImage] = useState<FireImage | undefined>()
    const [isPicked, setIsPicked] = useState<boolean>(false)
    const {navigate} = myNavigation()
    //Prøver å holde alle statene som useEffecter skal ha en depedency til sitt startpunkt som undefined
    //Dette gjør jeg for at useEffecten ikke skal kjøre når siden rendres, slik som den ville gjort 
    //hvis image var et tomt object fra start. Da får jeg mer kontroll på koden min
    useEffect(() =>{
        if(image != undefined && image.url != ""){
            setIsPicked(true)
        }else{
            setIsPicked(false)
        }

    }, [image])



    const takePhoto = async () =>{
        try{
            const cameraResponse = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1
            });
            if(!cameraResponse.canceled){
            console.log(cameraResponse.assets[0].uri)
            const {uri} = cameraResponse.assets[0]
            const fileName = uri.split("/").pop()
            console.log(`filename: ${fileName}`)
            setImage({url: uri, name: (fileName as string)})
            updateCameraImage({url: uri, name: (fileName as string)})
            }
        
        } catch(e: any){
            console.log(e.message)
            console.log(e)
            Alert.alert("Error:" + e.message)
        }
    }

    const pickPhoto = async () =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })

        if(!result.canceled){
            setImage({name: (result.assets[0].fileName as string), url: result.assets[0].uri})
            updateCameraImage({name: (result.assets[0].fileName as string), url: result.assets[0].uri})
        }
    }

    const handleBackPress = () =>{
        setIsPicked(false)
        setImage(undefined)
        updateCameraImage(undefined)
        
    }

    const handleNextPress = () =>{
        if(image != undefined){
            navigate("UploadImage")
            setImage(undefined)
        }else{
            Alert.alert("Du må velge et bilde først!")
        }
    }
    console.log(image)
       
    if (permission?.status !== ImagePicker.PermissionStatus.GRANTED && pickPermission?.status != ImagePicker.PermissionStatus.GRANTED){
        return(
            <View className="flex h-full w-full items-center justify-center flex-col space-y-3 bg-background">
        
                <Text className="text-error text-xl">Permission not grandted -  {permission?.status}</Text>
                <CustomButton title="gi tilgang" variant={"primary"} onPress={() => {requestPermission; requestPickPermission;}}/>
                
        
            </View>
    
        )
    }
    return(
        <View className="flex h-full w-full items-center justify-start bg-background ">
            <View className=" absolute top-48 z-10  left-12">
                <CustomRoundButton onPress={handleBackPress} variant={isPicked? "error" : "disabled"} changeVariant = {isPicked} Icon={AntDesign}iconName={"close"}/>
            </View>
            {isPicked &&
            <View className="absolute top-16 py-3  w-20  z-10 right-2  ">
                <CustomButton title={"Neste"} onPress={handleNextPress} variant={ isPicked? "primary" : "disabled"} /*changeVariant = {isPicked}*/  Icon={AntDesign} iconName="arrowright"/>
            </View>
            }
            <View className="w-1/2 flex items-center  justify-center mt-20">
                <Text className="text-2xl font-bold text-secondary ">Nytt Innlegg</Text>
            </View>
            <View className="w-full flex-col items-center justify-center space-y-12 mt-16">
                <Image     source={isPicked ? {uri: image?.url} : {uri: "https://fakeimg.pl/300x300/191c19/c1c9bf?text=No+Image"}} className="h-80 z-0 w-80 rounded-lg border-2 border-outline"/>
                <View className="flex flex-row w-full px-10  justify-between">
                    <CustomButton title={"Ta Bilde"} variant={"secondary"} onPress={takePhoto} Icon={AntDesign} iconName="camera"/>
                    
                    <CustomButton title={"Kamerarull"} variant={"secondary"} onPress={pickPhoto} Icon={AntDesign} iconName="picture"/>
                </View>
            </View>

        </View>
    )
}

export default ChooseImage