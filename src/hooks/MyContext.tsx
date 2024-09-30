import React, { createContext, useState, useEffect } from "react"
import { FireImage } from "../pages/ImageList"
import { fireBaseAuth } from "../../firebase-config"
import { getApp } from "firebase/app"
import { getDatabase, query, ref as dbRef, orderByChild, equalTo, onValue } from "firebase/database"
import { Comment } from "../pages/ImageDetails"


export type TravelSnapContextType = {
    dbImages: FireImage[]
    currentImage: FireImage | undefined
    cameraImage: FireImage | undefined
    currentImageData: ImageData | undefined
    listHasChanges: boolean
    numberOfColumns: number
    isColumns: boolean
    checkLogin: boolean
    currentUserData: UserData | undefined
    currentUserImageData: ImageData[] | undefined
    readCurrentUserImageData: () => void
    updateChanges: (hasChanges: true | false) => void
    updateCurrentImage: (image: FireImage | undefined) => void
    updateCurrentImageData: (imageData: ImageData | undefined) => void
    updateCameraImage: (image: FireImage | undefined) => void
    updateNumberOfColumns: () => void
    updateCheckLogin: (value: boolean) => void
    updateCurrentUserData: (user: UserData | undefined) => void
}

export type ImageData = {
    imageName: string
    caption: string
    click: number
    tags: string[]
    userID: string
    userName: string
    latitude: number
    longitude: number
    comments?: Comment[]
}

export type UserData = {
    name: string
    surname: string
    username: string
    bio?: string
    profilePicture?: string
}

export const TravelSnapContext = createContext<TravelSnapContextType | null>(null)
const TravelSnapProvider = ({ children }: { children: React.ReactNode }) => {
    const [dbImages, setDbImages] = useState<FireImage[]>([])
    const [currentImage, setCurrentImage] = useState<FireImage | undefined>()
    const [cameraImage, setCameraImage] = useState<FireImage | undefined>()
    const [currentImageData, setCurrentImageData] = useState<ImageData | undefined>()
    const [listHasChanges, setListHasChanges] = useState<boolean>(false)
    const [numberOfColumns, setNumberOfColumns] = useState<number>(1)
    const [isColumns, setIsColumns] = useState<boolean>(false)
    const [checkLogin, setCheckLogin] = useState(false)
    const [currentUserData, setCurrentUserData] = useState<UserData | undefined>()
    const [currentUserImageData, setCurrentUserImageData] = useState<ImageData[] | undefined>()

    useEffect(() => {
        handleIsColumns()
    }, [numberOfColumns])

    const handleIsColumns = () => {
        if (numberOfColumns == 2) {
            setIsColumns(true)
        } else {
            setIsColumns(false)
        }
    }

    const updateChanges = (hasChanges: true | false) => {
        setListHasChanges(hasChanges)
    }

    const updateCurrentImage = (image: FireImage | undefined) => {
        setCurrentImage(image)
    }

    const updateCurrentImageData = (imageData: ImageData | undefined) => {
        setCurrentImageData(imageData)
    }

    const updateCameraImage = (image: FireImage | undefined) => {
        setCameraImage(image)
    }

    const updateCurrentUserData = (user: UserData | undefined) => {
        setCurrentUserData(user)
    }

    const updateNumberOfColumns = () => {
        if (numberOfColumns == 2) {
            setNumberOfColumns(1)
        } else {
            setNumberOfColumns(2)
        }
    }

    const updateCheckLogin = (value: boolean) => {
        setCheckLogin(value)
    }

    const readCurrentUserImageData = () => {
        let uniqueImageData: ImageData[] = []
        const user = fireBaseAuth.currentUser
        const myApp = getApp()
        const db = getDatabase(myApp)
        const userImagesData = query(dbRef(db, `imageData`), orderByChild("userID"), equalTo((user?.uid as string)))
        onValue(userImagesData, (snapShot) => {
            snapShot.forEach((data) => {
                if (!uniqueImageData.includes(data.val())) {
                    uniqueImageData.push(data.val())
                }
            })
        })

        setCurrentUserImageData(uniqueImageData)
    }
    return (
        <TravelSnapContext.Provider value={{ dbImages, currentImage, cameraImage, currentImageData, currentUserData, currentUserImageData, listHasChanges, numberOfColumns, isColumns, checkLogin, updateChanges, updateCurrentImage, updateCurrentImageData, updateCameraImage, updateNumberOfColumns, updateCheckLogin, updateCurrentUserData, readCurrentUserImageData }}>
            {children}
        </TravelSnapContext.Provider>
    )
}

export default TravelSnapProvider