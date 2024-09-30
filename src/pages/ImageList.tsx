import { Text, View, TouchableOpacity } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import { listFiles, getImageUrl } from '../../firebase-config';
import MyImagesList from '../components/MyList';
import { TravelSnapContext, TravelSnapContextType } from '../hooks/MyContext';
import MaterielCom from "react-native-vector-icons/MaterialCommunityIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome5"

export type File = {
    name: String
}

export type FireImage = {
    name: string
    url: string
}

const ImageList: React.FC = () => {
    const [files, setFilses] = useState<File[]>([])
    const [images, setImages] = useState<FireImage[]>([])
    const { listHasChanges, updateChanges, updateNumberOfColumns, isColumns, updateCurrentUserData, readCurrentUserImageData } = useContext(TravelSnapContext) as TravelSnapContextType
  
    //Henter filnavnene og tilhørende data når kompnenten rendres.
    useEffect(() => {
        readCurrentUserImageData()
    }, [])

    useEffect(() => {
        getAllFiles()
    }, [])
    /*
    Henter data tilhørende bildene når listHasChanges endrer seg, dette skjer når bilder lastes opp i firebase.
    Dette gjør jeg for å oppdatere data når det legges til nye bilder til i applikasjonen
    */
    useEffect(() => {
        readCurrentUserImageData()
    }, [listHasChanges])

    /*
    Jeg henter alle tilhørende URLer til bildene basert på filnavnene på bildene i storage.
    Usefeccten kjøren når listen med filnavn har endringer
    */
    useEffect(() => {
        console.log("url useEffect")
        getAllUrls()
    }, [files])

    //Filnavnene henter på nytt hvis nye bilder blir lagt til i applikajonen
    useEffect(() => {
        if (listHasChanges) {
            getAllFiles()
            updateChanges(false)
        }
    }, [listHasChanges])

    //her oppdateres antall kolonner som skal vises i flatlisten
    const handleNumberOfColumns = () => {
        updateNumberOfColumns()
    }

    const getAllFiles = () => {
        listFiles().then((listResponse) => {
            const files = (listResponse).map((value: any) => {
                const newName = value.fullPath.split("/").pop()
                return { name: newName }
            })
            setFilses(files)
        })
    }

    const getAllUrls = async () => {
        let uniqueImages: FireImage[] = []
        files!.map((file: any) => {
            const imageUrls = getImageUrl(file.name).then((imageUrl: any) => {
                const url = { url: imageUrl }
                uniqueImages = [...uniqueImages, { name: file.name, url: imageUrl }]
                console.log(uniqueImages.length)
                setImages(uniqueImages)
            })
        })
    }

    return (
        <View className='bg-background h-full flex flex-col items-center justify-center'>
            <View className='items-center flex w-3/4 justify-center border-b border-secondary  flex-row  mt-16  '>
                <Text className=' opacity-100  text-secondary text-4xl font-bold  font-serif'>Travel Snap</Text>
                <View className='pb-3'>
                    <MaterielCom name='palm-tree' size={50} color={"#81d997"} />
                </View>
            </View>
            <View className='flex flex-row w-3/4 mt-2 mb-2  items-center justify-around'>
                <TouchableOpacity onPress={handleNumberOfColumns} >
                    <FontAwesome name='image' size={30} color={isColumns ? "#c1c9bf" : "#81d997"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNumberOfColumns} >
                    <FontAwesome name='images' size={30} color={isColumns ? "#81d997" : "#c1c9bf"} />
                </TouchableOpacity>
            </View>
            <View className="w-full h-[77%] flex items-center  justify-center ">
                <MyImagesList files={images} />
            </View>
        </View>
    )
}

export default ImageList
