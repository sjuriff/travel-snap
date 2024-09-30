import { View, Text, Image } from "react-native"
import { myNavigation } from "../hooks/myNavigation"
import CustomButton from "../components/Button/CustomButton"
import { useContext, useEffect, useState } from "react"
import { ImageData, TravelSnapContext, TravelSnapContextType } from "../hooks/MyContext"
import { FireImage } from "./ImageList"
import { getDatabase, ref as dbRef, onValue, orderByChild, equalTo, query } from "firebase/database"
import { getApp } from 'firebase/app';
import { fireBaseAuth, getImageUrl, getProfilePictureUrl } from "../../firebase-config"
import { useIsFocused } from "@react-navigation/native"
import ProfileList from "../components/ProfileList"


const ProfilePage: React.FC = () => {
    const [profilePicture, setProfilePicture] = useState<FireImage | undefined>()
    const [userImagesData, setUserImagesData] = useState<ImageData[]>([])
    const [userImages, setUserImages] = useState<FireImage[] | undefined>()
    const { navigate } = myNavigation()
    const { currentUserData, currentUserImageData, listHasChanges, updateCheckLogin, checkLogin } = useContext(TravelSnapContext) as TravelSnapContextType
    const isFocused = useIsFocused()

    /*
    På denne siden hadde jeg store problemer med å hådntere duplikater i brukeren sine innlegg
    Jeg fikk håndtert det sånn nogen lunde til slutt, men koden ble ikke spesielt fin.
    Mye loops som jeg ikke har helt kontroll på, og skulle ønske jeg fikk håndtert det på en bedre måte
    */
    useEffect(() => {
        getProfilePicture()
    }, [currentUserData])

    useEffect(() => {
        if (isFocused) {
            getAllUserUrls()
        }
    }, [])

    useEffect(() => {
        getAllUserUrls()
    }, [listHasChanges])

    const getProfilePicture = async () => {
        getProfilePictureUrl((currentUserData?.profilePicture as string)).then((imageUrl: any) => {
            setProfilePicture({ name: (currentUserData?.profilePicture as string), url: imageUrl })
        })
    }
    
    const handlePress = () => {
        navigate("CreateProfilePage")
    }

    const readImageData = () => {
        let uniqueImagesData: ImageData[] = []
        const user = fireBaseAuth.currentUser
        const myApp = getApp()
        const db = getDatabase(myApp)
        const userImages = query(dbRef(db, `imageData`), orderByChild("userID"), equalTo((user?.uid as string)))
        
        onValue(userImages, (snapshot) => {
            snapshot.forEach((data) => {
                if (!uniqueImagesData.includes(data.val())) {
                    uniqueImagesData.push(data.val())
                }
            })


        })
        
        setUserImagesData(uniqueImagesData)
    }

    const getAllUserUrls = async () => {
        let uniqueImages: FireImage[] = []
        currentUserImageData?.map((imageData) => {
            getImageUrl(imageData.imageName).then((imageUrl: any) => {
                if (!uniqueImages.includes({ name: imageData.imageName, url: imageUrl }))
                    uniqueImages = [...uniqueImages, { name: imageData.imageName, url: imageUrl }]
                
                if (!userImages?.includes({ name: imageData.imageName, url: imageUrl }))
                    setUserImages(uniqueImages)
            })
        })
    }

    const logOut = async () => {
        await fireBaseAuth.signOut()
        if (checkLogin) {
            updateCheckLogin(false)
        } else {
            updateCheckLogin(true)
        }
    }

    return (
        <View className="w-full h-full flex items-center justify-start bg-background">
            <Text className="text-2xl font-bold text-secondary mt-20">{currentUserData?.username}</Text>
            <View className="mt-5">
                <Image className="h-40 w-40 rounded-full border border-outline" source={profilePicture ? { uri: profilePicture?.url } : { uri: "https://fakeimg.pl/300x300/191c19/c1c9bf?text=No+Image" }} />
            </View>
            <View className="flex bg-secondaryContainer flex-row w-full items-center justify-center ml-5 space-x-5  mt-5">
                <View className="flex-row space-x-1" >
                    <Text className="text-onSecondary font-bold">Navn:</Text>
                    <Text className="text-onSecondary">{currentUserData?.name}</Text>
                </View>
                <View className="flex-row space-x-1 ">
                    <Text className="text-onSecondary font-bold">Etternavn:</Text>
                    <Text className="text-onSecondary">{currentUserData?.surname}</Text>
                </View>
            </View>
            <View className="w-3/4 mt-5 flex items-center justify-center flex-col ">
                {currentUserData?.bio ? (<Text className="text-onBackground text-center">{currentUserData.bio}</Text>) : (<Text className="text-onBackground">Ingen bio enda</Text>)}
            </View>
            <View className=" mt-5">
                <CustomButton title={"rediger profil"} variant={"primary"} onPress={handlePress} />
            </View>
            <View className="flex flex-col w-full h-80  items-center">
                <View className="w-full border-b border-outline">
                    <Text className="text-lg text-secondary font-bold ml-2">Dine Innlegg</Text>
                </View>
                <ProfileList images={(userImages as FireImage[])} />
            </View>
            <View className="absolute top-16 p-3 h-22 left-0">
                <CustomButton title={"Logg ut"} variant={"error"} onPress={logOut} />
            </View>
        </View>
    )
}

export default ProfilePage