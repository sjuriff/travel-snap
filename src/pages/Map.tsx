import { useContext } from "react";
import { View } from "react-native"
import MapView, { Marker } from 'react-native-maps';
import AntDesign from "react-native-vector-icons/AntDesign"
import { TravelSnapContext, TravelSnapContextType } from "../hooks/MyContext";
import CustomRoundButton from "../components/Button/CustomRoundButton";
import { myNavigation } from "../hooks/myNavigation";

const Map: React.FC = () =>{
    const {goBack} = myNavigation()
    const handleBackPress = () =>{
        goBack()
    }
    const {currentImageData} = useContext(TravelSnapContext) as TravelSnapContextType
    return(
        <View className="w-full h-full flex justify-center items-center bg-background">
            <MapView region={{latitude: currentImageData?.latitude as number, longitude: currentImageData?.longitude as number, latitudeDelta: 0.0922, longitudeDelta: 0.0421}} className="h-2/3 w-full mt-10" >
                <Marker coordinate={{latitude: currentImageData?.latitude as number , longitude: currentImageData?.longitude as number}}>

                </Marker>
            </MapView>

            <View className="absolute top-48 left-5">
                <CustomRoundButton onPress={handleBackPress} iconName="arrowleft" Icon={AntDesign} variant={"disabled"}/>
            </View>
            
        </View>
    )
}

export default Map