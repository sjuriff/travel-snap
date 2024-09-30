import { View, Image, Alert, Text, TextInput } from "react-native"
import CustomButton from "../components/Button/CustomButton"
import { useEffect, useState } from "react"
import CustomRoundButton from "../components/Button/CustomRoundButton"
import AntDesign from "react-native-vector-icons/AntDesign"
import { myNavigation } from "../hooks/myNavigation"
import * as ImagePicker from "expo-image-picker"
import { FireImage } from "./ImageList"
import { v4 as uuid } from "uuid"
import { fireBaseAuth, updateUserData, uploadProfilePictureToFirebase } from "../../firebase-config"

const CreateProfilePage: React.FC = () => {
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [textInputNumber, setTextInputNumber] = useState<number>()
    const [image, setImage] = useState<FireImage | undefined>()
    const [imageName, setImageName] = useState<string | undefined>()
    const [bio, setBio] = useState<string | undefined>()
    const [pickPermission, requestPickPermission] = ImagePicker.useMediaLibraryPermissions()
    const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions()
    const [isPicked, setIsPicked] = useState<boolean>(false)
    const { goBack } = myNavigation()

    useEffect(() => {
        if (image != undefined && image.url != "") {
            setIsPicked(true)
        } else {
            setIsPicked(false)
        }
    }, [image])

    useEffect(() => {
        createUniqueImageName()
    }, [])

    const handleTextInputFocus = (isFocused: boolean, textInputNumber: number) => {
        setIsFocused(isFocused)
        setTextInputNumber(textInputNumber)
    }

    const createUniqueImageName = () => {
        const uniqueId = uuid()
        const smallId = uniqueId.slice(0, 6)
        const uniqueName = `profileImage${smallId}`
        setImageName(uniqueName)
    }

    const takePhoto = async () => {
        try {
            const cameraResponse = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 1
            });
            if (!cameraResponse.canceled) {
                console.log(cameraResponse.assets[0].uri)
                const { uri } = cameraResponse.assets[0]
                const uriToUse = cameraResponse.assets[0].uri
                const fileName = uri.split("/").pop()
                console.log(`filename: ${fileName}`)
                setImage({ url: uri, name: (fileName as string) })
            }
        } catch (e: any) {
            console.log(e.message)
            console.log(e)
            Alert.alert("Error:" + e.message)
        }
    }

    const updateUserDataToDb = () => {
        const user = fireBaseAuth.currentUser
        if (!image) {
            updateUserData((user?.uid as string), bio, undefined)
        } else {
            updateUserData((user?.uid as string), bio, imageName)
        }
    }

    const upLoadPhoto = async () => {
        if (image) {
            const uploadResponse = await uploadProfilePictureToFirebase(image?.url, imageName, (v: any) => {
                console.log(v)
            })
            console.log(uploadResponse)
        }
        updateUserDataToDb()
    }

    const pickPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })

        if (!result.canceled) {
            setImage({ name: (result.assets[0].fileName as string), url: result.assets[0].uri })
        }
    }

    return (
        <View className=" h-full  bg-background w-full flex items-center justify-start flex-col">
            <View className="mt-20 mb-10">
                <Text className="text-2xl font-bold text-secondary">Rediger Profil</Text>
            </View>
            <View className="absolute top-16 p-3  left-0">
                <CustomRoundButton onPress={goBack} variant={"disabled"} Icon={AntDesign} iconName="arrowleft" />
            </View>
            <View className="w-full flex flex-col items-center justify-center mb-5">
                <Image className="h-40 w-40 rounded-full border border-outline" source={isPicked ? { uri: image?.url } : { uri: "https://fakeimg.pl/300x300/191c19/c1c9bf?text=No+Image" }} />
                <Text className="text-onBackground mt-2">Oppdater profilbildet</Text>
            </View>
            <View className="w-full flex flex-row items-center justify-center space-x-10 mb-10">
                <View>
                    {cameraPermission?.status != ImagePicker.PermissionStatus.GRANTED ? (<CustomButton title={"Tillatt Kamera"} onPress={requestCameraPermission} variant={"secondary"} />) : (<CustomButton title={"Ta Bilde"} variant={"secondary"} onPress={takePhoto} Icon={AntDesign} iconName="camera" />)}
                </View>
                <View>
                    {pickPermission?.status != ImagePicker.PermissionStatus.GRANTED ? (<CustomButton title={"Gi tilgang til kamerarull"} onPress={requestPickPermission} variant={"secondary"} />) : (<CustomButton title={"Kamerarull"} onPress={pickPhoto} variant={"secondary"} Icon={AntDesign} iconName="picture" />)}
                </View>
            </View>

            <View className="w-full flex flex-col   items-center  space-y-5">
                <View className=" w-3/4  flex-col space-y-0.5">
                    <Text className={isFocused && textInputNumber == 1 ? "text-primary ml-4 font-bold" : "text-onBackground text-left ml-2 font-bold"}>Bio</Text>
                    <TextInput blurOnSubmit={true} value={bio} onChangeText={setBio} multiline={true} onBlur={() => setIsFocused(false)} onFocus={() => handleTextInputFocus(true, 1)} className="w-full bg-backgound text-onBackground border-t h-20 border-outline  p-2 rounded-lg focus:ring-primary focus:border-primary focus:text-onBackground" placeholder="Skriv en bio" placeholderTextColor={"#c1c9bf"} />
                </View>
            </View>
            <View className="mt-10">
                <CustomButton onPress={upLoadPhoto} title={"Oppdater Profil"} variant={"primary"} />
            </View>
        </View>
    )
}

export default CreateProfilePage