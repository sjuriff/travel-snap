import { FlatList } from "react-native"
import { useContext } from "react";
import { Image, TouchableOpacity } from "react-native";
import { myNavigation } from "../hooks/myNavigation";
import { FireImage } from "../pages/ImageList";
import { TravelSnapContext, TravelSnapContextType } from "../hooks/MyContext";
import { getDatabase, ref as dbRef, set, onValue } from "firebase/database"
import { getApp } from 'firebase/app';
import { ItemProp } from "./MyList";

type ProfileListProp = {
    images: FireImage[]
}

const Item: React.FC<ItemProp> = ({ image }) => {
    const { updateCurrentImage, updateCurrentImageData } = useContext(TravelSnapContext) as TravelSnapContextType
    const { navigate } = myNavigation()
    /*Jeg hadde som mål å håndtere alle funksjoner som hadde med skriving eller lesing fra firebase
    i firebase config filen, men nådde ikke det målet.
    Måtte flytte funksjonen ut hit får å rekke og oppdatere staten raskt nok, da det bare er lov
    å ta i bruk provideren i componenter/plasser der jsx returneres
    */
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

    return (
        <TouchableOpacity onPress={() => handleImagePress(image)}>
            <Image className="w-28 h-28 m-2 " resizeMode="stretch" source={{ uri: image.url }}></Image>
        </TouchableOpacity>
    )
}

const ProfileList: React.FC<ProfileListProp> = ({ images }) => {
    return (
        <FlatList
            data={images}
            numColumns={3}
            renderItem={({ item }) => <Item image={item} />}
            keyExtractor={(item) => item.name} />
    )
}

export default ProfileList