import { useNavigation, NavigationProp } from "@react-navigation/native"

type RouteList = {
    UploadImage: undefined
    ImageList: undefined
    MainPage: undefined
    ImageDetail: undefined
    LoginPage: undefined
    CreateUserPage: undefined
    CreateProfilePage: undefined
    ProfilePage: undefined
    Map: undefined
}

type pictureNavigationProps = NavigationProp<RouteList>

export const myNavigation = () => {
    const navigation = useNavigation<pictureNavigationProps>()

    const navigate = (path: keyof RouteList) => {
        navigation.navigate(path)
    }

    return { navigate, goBack: navigation.goBack }
}