import { View, TouchableOpacity, Text, GestureResponderEvent } from "react-native"
import { useEffect, useState } from "react"
import { SvgProps } from "react-native-svg"



type CustomButtonProps = {
    title: String
    variant: "primary" | "secondary" | "tertiary" | "error" | "disabled",
    Icon?: React.ElementType
    iconName?: string,
    onPress?: (event: GestureResponderEvent) => void
    changeVariant?: boolean
   
}
// en custom knapp som kan brukes om igjen, Kansje litt dumt å håndtere endring av variant i en useeffect
//hadde en console.log inne i useeffectene og registrete at de kjørte ganske så ofte
const CustomButton: React.FC<CustomButtonProps> = ({title, Icon, onPress, variant, iconName, changeVariant}) =>{
    const [currentVariant, setCurrentVariant] = useState<string>()
    const [textColor, setTextColor] = useState<string>()
    const [iconColor, setIconColor] = useState<string>()
    useEffect (() =>{
        console.log("button useEffect")
        handleVariant()

    }, [currentVariant])

    useEffect (() =>{
        console.log("Roundedbutton useEffect")
        handleVariant()
        

    }, [changeVariant])

    const handleVariant = () => {
        switch (variant) {
            case "primary":
                setCurrentVariant("bg-primary")
                setTextColor("text-onPrimary")
                setIconColor("text-onPrimary")
                break;
        
            case "secondary":
                setCurrentVariant("bg-secondary")
                setTextColor("text-onSecondary")
                setIconColor("text-onSecondary")
                break;
            case "tertiary":
                setCurrentVariant("bg-tertiary")
                setTextColor("text-onTertary")
                setIconColor("text-onTertary")
                break;
            case "error":
                setCurrentVariant("bg-error")
                setTextColor("text-onError")
                setIconColor("text-onError")
                break;
            case "disabled":
                setCurrentVariant("bg-disabled")
                setTextColor("text-background")
                setIconColor("text-background")
        }
    }

    return(
        <TouchableOpacity onPress={onPress} className={`py-3 px-5 flex-row items-center justify-center space-x-1 rounded-2xl ${currentVariant}`}>
            <Text className={` font-semibold ${textColor}`}>{title}</Text>
             {Icon && <Icon className = {`${iconColor}`} name={iconName} size = {15}/>}
        </TouchableOpacity>

    )
}

export default CustomButton