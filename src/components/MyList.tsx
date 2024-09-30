import { useContext, useRef, useEffect, useState, useCallback } from "react";
import { FlatList, Text, View, Image, TouchableOpacity } from "react-native";
import { myNavigation } from "../hooks/myNavigation";
import { FireImage } from "../pages/ImageList";
import { TravelSnapContext, TravelSnapContextType } from "../hooks/MyContext";
import { getDatabase, ref as dbRef, set, onValue, update } from "firebase/database"
import { getApp } from 'firebase/app';
import AntDesign from "react-native-vector-icons/AntDesign"
import { fireBaseAuth, likedByUser, updateLikesToDB } from "../../firebase-config";
import * as Animatable from "react-native-animatable"
import { useIsFocused } from "@react-navigation/native"


export type ItemProp = {
    image: FireImage
}

type ImageListProp = {
    files: any
}

const MyImagesList: React.FC<ImageListProp> = ({ files }) => {
    const { navigate } = myNavigation()
    const { updateCurrentImage, updateCurrentImageData, numberOfColumns } = useContext(TravelSnapContext) as TravelSnapContextType

    const readImageData = (name: string) => {
        const myApp = getApp()
        const db = getDatabase(myApp)
        const imageDataRef = dbRef(db, `imageData/${name}`)
        onValue(imageDataRef, (snapshot) => {
            updateCurrentImageData(snapshot.val())
        })
    }

    const handleImagePress = (image: FireImage) => {
        readImageData(image.name)

        updateCurrentImage(image)
        navigate("ImageDetail")
    }
    /*Her hadde jeg er bug i koden som jeg slet lenge med.
    Hvis jeg navigete meg fra bildene i flatlisten og inn til imageDetail ville 
    bildene re-rednre når likes ble oppdatert. Jeg klarte til slutt å løse det med å
    wrappe hele koden inn i useCallBack. Prøvde med Memo og useMemo først.
    Skjønner foratt ikke hvorfor koden oppførte seg sånn
    */
    const Item: React.FC<ItemProp> = useCallback(({ image }) => {
        const [likes, setLikes] = useState<number>(0)
        const [caption, setCaption] = useState<string>("No Caption Needed!")
        const [userName, setUserName] = useState<string | undefined>()
        const [isLiked, setIsLiked] = useState<boolean>(false)
        const [likedByUsers, setLikedByUsers] = useState<string[]>([])
        const [isRedHeart, setIsReadHeart] = useState<boolean>(false)
        const startAnimation = useRef<Animatable.View & View>(null)
        const isFocused = useIsFocused()
        const { isColumns } = useContext(TravelSnapContext) as TravelSnapContextType
        
        useEffect(() => {
            if (isFocused) {
                console.log("readLikes and cap useEffect")
                readNumberOfLikes(image.name)
                readCaption(image.name)
                readUserName(image.name)
                readLikedByUsers(image.name)
                checkIfLiked()
            }
        }, [isFocused])

        useEffect(() => {
            checkIfLiked()
        }, [likedByUsers])

        const readNumberOfLikes = (name: string) => {
            const myApp = getApp()
            const db = getDatabase(myApp)
            const imageDataRef = dbRef(db, `imageData/${name}/click`)

            onValue(imageDataRef, (snapShot) => {
                setLikes(snapShot.val())
            })
        }

        const readLikedByUsers = (name: string) => {
            const myApp = getApp()
            const db = getDatabase(myApp)
            const imageDataRef = dbRef(db, `imageData/${name}/likedBy`)

            onValue(imageDataRef, (snapShot) => {
                if (snapShot.val() != null)
                    setLikedByUsers(snapShot.val())
            })
        }

        const removeLikedByUser = async (name: string) => {
            const userIdArray: string[] = likedByUsers
            const user = fireBaseAuth.currentUser
            const myApp = getApp()
            const db = getDatabase(myApp)
            const newUserIdArray = likedByUsers.filter((userID) => userID != user?.uid as string)
            
            setLikedByUsers(newUserIdArray)

            await update(dbRef(db, `imageData/${name}`), {
                likedBy: newUserIdArray

            })
        }
        
        const handleAnimation = () => {
            if (startAnimation.current) {
                startAnimation.current.animate("tada")
            }
        }

        const handleUnlikeAnimation = () => {
            if (startAnimation.current) {
                startAnimation.current.animate("rubberBand")
            }
        }

        const updateLikes = () => {
            if (!isLiked) {
                const newLikes = likes + 1
                updateLikesToDB(image.name, newLikes)
                likedByUser(image.name, likedByUsers)
                setLikes(newLikes)
                setIsLiked(true)
                setIsReadHeart(true)
                handleAnimation()
            } else if (isLiked) {
                if (likes > 0) {
                    const newLikes = likes - 1
                    updateLikesToDB(image.name, newLikes)
                    removeLikedByUser(image.name)
                    setLikes(newLikes)
                    setIsLiked(false)
                    setIsReadHeart(false)
                    handleUnlikeAnimation()
                }
            }
        }

        const checkIfLiked = () => {
            const user = fireBaseAuth.currentUser?.uid
            if (likedByUsers.includes(user!)) {
                setIsLiked(true)
                setIsReadHeart(true)

            } else {
                setIsLiked(false)
                setIsReadHeart(false)
            }
        }

        /*
        Her håndteres masse databasekode utenfor firebase config filen. 
        Skulle ønske jeg fikk holdt alt innenfor den filen, men fikk ikke
        oppdatert staten raskt nok da. Sikkert en bedre måte å løse det på,
        men tiden strakk ikke til.
        */
        const readCaption = (name: string) => {
            const myApp = getApp()
            const db = getDatabase(myApp)
            const imageDataRef = dbRef(db, `imageData/${name}/caption`)

            onValue(imageDataRef, (snapShot) => {
                setCaption(snapShot.val())
            })
        }

        const readUserName = (name: string) => {
            const myApp = getApp()
            const db = getDatabase(myApp)
            const imageDataRef = dbRef(db, `imageData/${name}/userName`)

            onValue(imageDataRef, (snapShot) => {
                setUserName(snapShot.val())
            })
        }

        if (isColumns) {
            return (
                <TouchableOpacity onPress={() => handleImagePress(image)}>
                    <Image className="w-40 h-40 m-3" resizeMode="stretch" source={{ uri: image.url }}></Image>
                </TouchableOpacity>
            )
        } else {
            return (
                <View className="mb-5">
                    <Text className="font-bold ml-2  text-onBackground text-2xl">{userName}</Text>
                    <TouchableOpacity onPress={() => handleImagePress(image)}>
                        <Image className="w-96 h-96 mb-5 mt-2" resizeMode="stretch" source={{ uri: image.url }}></Image>
                    </TouchableOpacity>
                    <View className="flex ml-2 flex-row items-center w-1/2 justify-start space-x-3">
                        <TouchableOpacity onPress={updateLikes}>
                            <Animatable.View ref={startAnimation} useNativeDriver={true}>
                                {isRedHeart ? <AntDesign name="heart" size={30} color={"red"} /> : <AntDesign className="" name="hearto" size={30} color={"#8b938a"} />}
                            </Animatable.View>
                        </TouchableOpacity>
                        <Text className="text-onBackground text-xl">{likes}</Text>
                    </View>
                    <View className="w-full flex items-start ml-2 flex-row justify-start space-x-3">
                        <Text className="text-primary text-lg font-bold mt-2 ">{userName}</Text>
                        <Text className="w-20 flex-wrap flex-1 text-onBackground text-lg  mt-2">{caption}</Text>
                    </View>
                </View>
            )
        }
    }, [numberOfColumns])


    return (
         <FlatList
            data={files}
            key={numberOfColumns}
            numColumns={numberOfColumns}
            renderItem={({ item }) => <Item image={item} />}
            keyExtractor={(item) => item.name}
        />
    )
}

export default MyImagesList