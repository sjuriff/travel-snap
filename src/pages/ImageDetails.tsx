import { Text, View, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { TravelSnapContext, TravelSnapContextType } from '../hooks/MyContext';
import { useContext, useEffect, useState } from 'react';
import { myNavigation } from '../hooks/myNavigation';
import { getDatabase, ref as dbRef, set, onValue, update } from "firebase/database"
import { getApp } from 'firebase/app';
import * as Location from "expo-location"
import AntDesign from "react-native-vector-icons/AntDesign"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import IonIcons from "react-native-vector-icons/Ionicons"
import CustomRoundButton from '../components/Button/CustomRoundButton';
import CustomButton from '../components/Button/CustomButton';
import { updateComments } from '../../firebase-config';

export type Comment = {
  userName: string
  comment: string
}

const ImageDetails: React.FC = () => {
  const { currentImage, currentImageData, currentUserData, updateCurrentImage, updateCurrentImageData, updateChanges } = useContext(TravelSnapContext) as TravelSnapContextType
  const { goBack, navigate } = myNavigation()
  const [city, setCity] = useState<string | undefined>()
  const [country, setCountry] = useState<string | undefined>()
  const [district, setDistrict] = useState<string | undefined>()
  const [comment, setComment] = useState<string | undefined>()
  const [comments, setComments] = useState<Comment[]>([])
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [isComments, setIsComments] = useState<boolean>(false)
  const [showComments, setShowComments] = useState<boolean>(false)
  const [textInputNumber, setTextInputNumber] = useState<number>()
  
  useEffect(() => {
    geoCodeFromLatLong()
    readComments(currentImageData?.imageName as string)
    handleEmptyComments()
  }, [])

  const handleEmptyComments = () => {
    if (currentImageData?.comments != undefined && currentImageData.comments.length > 0) {
      setIsComments(true)
    } else {
      setIsComments(false)
    }
  }

  const postComment = () => {
    updateComments(currentImageData?.imageName as string, comments)
  }

  const handleDeleteComment = (commentToDelete: Comment) => {
    const newArray = currentImageData?.comments?.filter((comment) => comment != commentToDelete)
    updateComments(currentImageData?.imageName as string, newArray as Comment[])
  }

  const handleShowComments = () => {
    if (showComments) {
      setShowComments(false)
    } else {
      setShowComments(true)
    }
  }

  const handleTextInputFocus = (isFocused: boolean, textInputNumber: number) => {
    setIsFocused(isFocused)
    setTextInputNumber(textInputNumber)
  }

  const handleComments = () => {
    let newArray = comments.slice()
    newArray.push({ userName: currentUserData?.username as string, comment: comment as string })
    setComments(newArray)
  }

  const readComments = (name: string) => {
    const myApp = getApp()
    const db = getDatabase(myApp)
    const imageDataRef = dbRef(db, `imageData/${name}/comments`)

    onValue(imageDataRef, (snapShot) => {
      if (snapShot.val() != null)
        setComments(snapShot.val())
    })
  }

  const handleBackPress = () => {
    updateCurrentImage(undefined)
    updateCurrentImageData(undefined)
    updateChanges(false)
    goBack()
  }

  const handleButtonPress = () => {
    navigate("Map")
  }

  const geoCodeFromLatLong = async () => {
    const loc = { latitude: currentImageData?.latitude as number, longitude: currentImageData?.longitude as number }
    const geoCodeLocation = await Location.reverseGeocodeAsync(
      loc
    )
    setCity(geoCodeLocation[0].city as string)
    setCountry(geoCodeLocation[0].country as string)
    setDistrict(geoCodeLocation[0].district as string)
  }

  return (
    <View className='flex h-full flex-col items-center justify-center w-full bg-background'>
      <Text className='font-bold  mb-2  text-secondary text-2xl'>{currentImageData?.userName}</Text>
      <Image className='w-80 h-80 mt-2' source={{ uri: currentImage?.url }} />
      <View className=' flex w-full flex-col'>
        <View className='flex ml-2 mt-2 mb-2 flex-row  w-full items-center  space-x-2'>
          <AntDesign name="hearto" size={30} color={"#8b938a"} />
          <Text className='font-semibold text-onBackground'>{currentImageData?.click}</Text>
        </View>
        <View className='flex flex-col'>
          <View className='flex flex-row items-center justify-between'>
            <Text className=' ml-2 text-onBackground flex-1 flex-wrap font-semibold'>{currentImageData?.caption}</Text>
            <View className='flex-row items-center mr-2 '>
              <IonIcons name='location-outline' size={25} color={"#ffb1c2"} />
              <Text className='text-onBackground'>{city}, </Text>
              <Text className='text-onBackground'>{country}  </Text>
              <Text className='text-onBackground'>{district}</Text>
            </View>
          </View>
          <View className='w-full mt-1 mb-1 flex-row '>
            {currentImageData?.tags.map((tag) => (
              <Text className='ml-2 text-onBackground' key={tag}>{`#${tag}`}</Text>
            ))}
          </View>
        </View>
        <View className='w-full flex justify-end items-center flex-row'>
          <TouchableOpacity onPress={handleShowComments} className='mr-5 flex flex-row items-center'>
            <Text className='text-onBackground mr-2'> se kommentarer</Text>
            <FontAwesome name='comment' size={20} color={"#81d997"} />
          </TouchableOpacity>
        </View>
        <View className='h-40 flex  justify-center w-full'>
          {!showComments && <View className="flex flex-col mb-3 space-y-1 ">
            <Text className={isFocused && textInputNumber == 1 ? "text-primary ml-2 font-bold" : "text-onBackground pl-1 font-bold"}>Legg igjen en kommentar</Text>
            <TextInput blurOnSubmit={true} multiline={true} onBlur={handleComments} onFocus={() => handleTextInputFocus(true, 1)} className=" pl-1  pt-2  text-onBackground border-t border-outline w-full border-b h-28  rounded-lg  focus:border-primary focus:text-onBackground" value={comment} placeholder="Skriv en bildetekst ..." placeholderTextColor={"#c1c9bf"} onChangeText={setComment} />
          </View>}
          {showComments &&
            <View className='flex flex-col items-center justify-center w-96'>
              <ScrollView>
                {currentImageData?.comments?.map((comment) => (
                  <View className='flex flex-col w-60 p-2 rounded-xl items-center border border-outline mb-3'>
                    <Text className='font-bold text-lg text-secondary'>{comment.userName}</Text>
                    <Text className='text-onBackground  '>{comment.comment}</Text>
                    {comment.userName == currentUserData?.username ? <TouchableOpacity onPress={() => handleDeleteComment(comment)}><FontAwesome name='trash' size={20} color={"#93000a"} /></TouchableOpacity> : <></>}
                  </View>
                ))}
              </ScrollView>
            </View>}
        </View>
        <View className='flex w-full items-center justify-around flex-row'>
          <View>
            <CustomButton onPress={postComment} title={"Legg til kommentar"} variant={"primary"} />
          </View>
          <View>
            <CustomButton onPress={handleButtonPress} title={"Se Kart"} variant={"primary"} />
          </View>
        </View>
      </View>
      <View className='absolute top-16 p-2 left-0'>
        <CustomRoundButton onPress={handleBackPress} Icon={AntDesign} iconName='arrowleft' variant={"disabled"} />
      </View>
    </View>
  )
}

export default ImageDetails



