import AntDesign from "react-native-vector-icons/AntDesign"
import { Text, View, Alert, Image, TextInput, ActivityIndicator } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import { uploadToFirebase, writeImageData, fireBaseAuth } from '../../firebase-config';
import { TravelSnapContext, TravelSnapContextType } from "../hooks/MyContext";
import CustomButton from "../components/Button/CustomButton";
import CustomRoundButton from "../components/Button/CustomRoundButton";
import { v4 as uuid } from "uuid"
import { myNavigation } from "../hooks/myNavigation";
import * as Location from "expo-location"

export type UserImage = {
    uri: string
    fileName: string
}

const ImageUpLoad: React.FC = () => {
    const [name, setName] = useState<string>()
    const [tag, setTag] = useState<string | undefined>()
    const [tags, setTags] = useState<string[]>([])
    const [caption, setCaption] = useState<string | undefined>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [adress, setAdress] = useState<string | undefined>()
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [textInputNumber, setTextInputNumber] = useState<number>()
    const [latitude, setLatitude] = useState<number | undefined>()
    const [longitude, setLongitude] = useState<number | undefined>()
    const { updateChanges, cameraImage, currentUserData } = useContext(TravelSnapContext) as TravelSnapContextType
    const { goBack, navigate } = myNavigation()

    /*
    Når tags har blitt lest fra textInput, kjøres onTagsFinneshed som deler opp tagene på mellomrom eller komma
    og legger det i er array
    */
    useEffect(() => {
        onTagsFinnished()
    }, [tag])

    //Skaper et unikt bildenavn med UUID når komponenten rendres
    useEffect(() => {
        createUniqueImageName()
    }, [])
    //Hvis brukeren velger å skrive inn adresse, blir denne kodet om til latitude og longitude
    useEffect(() => {
        if (adress) {
            geoCodeFromString()
        }
    }, [adress])

    const handleUserData = (): boolean => {
        if (!tag) {
            Alert.alert("Du må legge til tagger")
            return false
        } else if (!caption) {
            Alert.alert("Bildetekst magler")
            return false
        } else if (!latitude && !longitude) {
            Alert.alert("Du må sette en lokasjon")
            return false
        } else {
            return true
        }
    }

    /*
    Her hentes den nåværedende lokasjonen til telefonen hvis brukeren velger dette
    isteden for å skrive inn adresse.
    */
    const getLocation = async () => {
        setIsLoading(true)
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status == 'granted') {
            console.log("permission granted")
        } else {
            console.log("Permission denied")
        }

        const location = await Location.getCurrentPositionAsync()
        setLatitude(location.coords.latitude)
        setLongitude(location.coords.longitude)
        setIsLoading(false)
        Alert.alert("Nåvværende lokasjon er satt")
    }

    const geoCodeFromString = async () => {
        const geoCodeLocation = await Location.geocodeAsync((adress as string))
        setLatitude(geoCodeLocation[0].latitude)
        setLongitude(geoCodeLocation[0].longitude)
    }

    const handleTextInputFocus = (isFocused: boolean, textInputNumber: number) => {
        setIsFocused(isFocused)
        setTextInputNumber(textInputNumber)
    }

    const createUniqueImageName = () => {
        const uniqueId = uuid()
        const smallId = uniqueId.slice(0, 6)
        const uniqueName = `image${smallId}`
        setName(uniqueName)
    }

    const uploadDataToDB = () => {
        const user = fireBaseAuth.currentUser
        writeImageData((name as string), (caption as string), 0, tags, (user?.uid as string), (currentUserData?.username as string), latitude as number, longitude as number)
    }

    const onTagsFinnished = () => {
        const newTags: string[] | undefined = tag?.split(/[ ,]+/)
        setTags(newTags!)
    }

    /*
    Her lastes bilde opp i databasen. Det sender med en callBack som
    visualiserer hvordan opplastningen går for meg i consoleloggen
    Kunne også brukt callbacken til å visualisere noe kult i UIet,
    men tiden strakk ikke til desverre
    */
    const upLoadPhoto = async () => {
        if (handleUserData()) {
            if (cameraImage != undefined) {
                const uploadResponse = await uploadToFirebase(cameraImage?.url, name, (v: any) => {
                    console.log(v)
                })
                console.log(uploadResponse)
                uploadDataToDB()
                updateChanges(true)
                navigate("MainPage")
            }
        }
    }

    const handleBackPress = () => {
        goBack()
    }
  
    return (
        <View className="bg-background h-full items-center justify-start flex flex-col space-y-1" >
            <Text className=" mt-20 mb-10 text-2xl font-bold text-secondary">Nytt Innlegg</Text>
            <View className="absolute top-16 p-3  left-0">
                <CustomRoundButton onPress={handleBackPress} variant={"disabled"} Icon={AntDesign} iconName="arrowleft" />
            </View>
            <View className=" border-b  border-outline flex w-full items-center justify-center flex-row space-x-2 ">
                <Image source={{ uri: cameraImage?.url }} className="h-40 w-40 rounded-lg " />
                <View className="flex flex-col mb-3 space-y-1 ">
                    <Text className={isFocused && textInputNumber == 1 ? "text-primary ml-2 font-bold" : "text-onBackground pl-1 font-bold"}>Bildetekst</Text>
                    <TextInput multiline={true} onBlur={() => setIsFocused(false)} onFocus={() => handleTextInputFocus(true, 1)} className=" pl-1  pt-2  text-onBackground border-t border-outline w-52 h-40  rounded-lg  focus:border-primary focus:text-onBackground" value={caption} placeholder="Skriv en bildetekst ..." placeholderTextColor={"#c1c9bf"} onChangeText={setCaption} />
                </View>
            </View>
            <View className="flex  p-5 w-full  items-center justify-center flex-col space-y-5 ">
                <View className="flex flex-col w-full space-y-0.5 ">
                    <Text className={isFocused && textInputNumber == 3 ? "text-primary ml-2 font-bold" : "text-onBackground pl-1 font-bold"}>Tagger</Text>
                    < TextInput onBlur={() => setIsFocused(false)} onFocus={() => handleTextInputFocus(true, 3)} className="bg-backgound text-onBackground border border-outline w-full p-3 rounded-lg focus:ring-primary focus:border-primary focus:text-onBackground" value={tag} placeholder="Del tagger med , eller mellomrom ..." placeholderTextColor={"#c1c9bf"} onChangeText={setTag} />
                </View>
                <View className="w-full flex flex-col items-center justify-center">
                    <View className="flex flex-col w-full space-y-0.5 ">
                        <Text className={isFocused && textInputNumber == 4 ? "text-primary ml-2 font-bold" : "text-onBackground pl-1 font-bold"}>Lokasjon</Text>
                        < TextInput onBlur={() => setIsFocused(false)} onFocus={() => handleTextInputFocus(true, 4)} className="bg-backgound text-onBackground border border-outline w-full p-3 rounded-lg focus:ring-primary focus:border-primary focus:text-onBackground" value={adress} placeholder="skriv inn adresse etterfugt av by ..." placeholderTextColor={"#c1c9bf"} onChangeText={setAdress} />
                    </View>
                    {isFocused && textInputNumber == 4 && <Text className="text-onBackground text-center mt-1 mb-5">Skriv inn adresse og by, eller bare by. Trykk på knappen under får å bruke nåværende lokasjon</Text>}
                    <View className="mt-5">
                        <CustomButton title={"Bruk nåværende lokasjon"} variant={"tertiary"} onPress={getLocation} />
                    </View>
                </View>
                {isLoading && <ActivityIndicator size={"small"} color={'#d6baff'} />}
            </View>
            <View className=" absolute bottom-40 flex items-center">
                <CustomButton title="Last opp bildet" onPress={upLoadPhoto} variant={"primary"} />
            </View>
        </View>
    )
}

export default ImageUpLoad
