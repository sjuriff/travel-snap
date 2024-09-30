import { TouchableOpacity, GestureResponderEvent } from "react-native"
import { useEffect, useState } from "react"

type CustomRoundButtonProps = {
    variant: "primary" | "secondary" | "tertiary" | "error" | "disabled",
    Icon: React.ElementType
    iconName?: string,
    onPress?: (event: GestureResponderEvent) => void
    changeVariant?: boolean
}

const CustomRoundButton: React.FC<CustomRoundButtonProps> = ({ variant, Icon, iconName, onPress, changeVariant }) => {
    const [iconColor, setIconColor] = useState<string>()
    const [currentVariant, setCurrentVariant] = useState<string>()

    useEffect(() => {
        handleVariant()
    }, [])

    useEffect(() => {
        handleVariant()
    }, [changeVariant])


    const handleVariant = () => {
        switch (variant) {
            case "primary":
                setCurrentVariant("bg-primary")
                setIconColor("text-onPrimary")
                break;

            case "secondary":
                setCurrentVariant("bg-secondary")
                setIconColor("text-onSecondary")
                break;
            case "tertiary":
                setCurrentVariant("bg-tertiary")
                setIconColor("text-onTertary")
                break;
            case "error":
                setCurrentVariant("bg-error")
                setIconColor("text-onError")
                break;
            case "disabled":
                setCurrentVariant("bg-disabled")
                setIconColor("text-background")
        }
    }
    
    return (
        <TouchableOpacity onPress={onPress} className={`py-3 px-3 items-center justify-center rounded-3xl ${currentVariant}`}>
            <Icon className={`${iconColor}`} name={iconName} size={15} />
        </TouchableOpacity>
    )
}

export default CustomRoundButton