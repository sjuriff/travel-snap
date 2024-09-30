
import {FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_PROJECT_ID, FIREBASE_AUTH_DOMAIN, FIREBASE_STORAGE_BUCKET, FIREBASE_URL, FIREBASE_SENDER_ID, FIREBASE_MEASUREMENT_ID  } from "@env"
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase,  ref as dbRef, set, onValue, push, update, child } from "firebase/database"
import {getAuth} from "firebase/auth"
import { UserData } from "./src/hooks/MyContext";
import { Comment } from "./src/pages/ImageDetails";




console.log(FIREBASE_API_KEY)
  //FIREBASE_URL
//'https://fir-test-aefcf-default-rtdb.europe-west1.firebasedatabase.app'
//Sender ID
// 907424841904"
//Measure ID
//"G-CWKNKZMV8B"


//Her configureres firebase
//Alle nøklene har jeg lagt i en .env fil
//Dette gjøres for å å holde nøklene utenfor applikasjonen
//slik at ingen ubydene gjester skal få tak i viktig informasjon
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID 
};

if(getApps().length === 0){
initializeApp(firebaseConfig);
}

const cameraApp = getApp()
const appStorage = getStorage()
const dataBase = getDatabase(cameraApp)


const fireBaseAuth = getAuth(initializeApp(firebaseConfig))


const uploadToFirebase = async (uri: any, name: any, onProgress: any) =>{
  const fetchResponse = await fetch(uri)
  const theBlob = await fetchResponse.blob()

  const imageRef = ref(getStorage(),`images/${name}`);

  const uploadTask = uploadBytesResumable(imageRef, theBlob);

  return new Promise((resolve, reject) =>{
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    
        onProgress && onProgress(progress)
  
    
      }, 
      (error) => {
        // on unsuccessful
        console.log(error)
        reject(error)
      }, 
      //on sucesss
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
        resolve({
          downloadUrl, 
          metadata: uploadTask.snapshot.metadata
        })
      }
    )
  });
}

const uploadProfilePictureToFirebase = async (uri: any, name: any, onProgress: any) =>{
  const fetchResponse = await fetch(uri)
  const theBlob = await fetchResponse.blob()

  const imageRef = ref(getStorage(),`profileImages/${name}`);

  const uploadTask = uploadBytesResumable(imageRef, theBlob);

  return new Promise((resolve, reject) =>{
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    
        onProgress && onProgress(progress)
  
    
      }, 
      (error) => {
        console.log(error)
        reject(error)
      }, 
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
        resolve({
          downloadUrl, 
          metadata: uploadTask.snapshot.metadata
        })
      }
    )
  });
}

const listFiles = async () =>{
  const storage = getStorage();

// Create a reference under which you want to list
  const listRef = ref(storage, 'images/');

// Find all the prefixes and items.
  const listResponse = await listAll(listRef)
  return listResponse.items

}

const getImageUrl = async (name: string) =>{
  const storage = getStorage();
  const imageRef = ref(storage, `images/${name}`)
  const url = await getDownloadURL(imageRef)
   
  return url
}

const getProfilePictureUrl = async(name: string) =>{
  const storage = getStorage();
  const imageRef = ref(storage, `profileImages/${name}`)
  const url = await getDownloadURL(imageRef)
  return url
}



const writeImageData = ( name: string, caption: string, clicks: number, tags: string[], userID: string, userName:string, latitude: number, longitude: number) => {
  const db = getDatabase(cameraApp);
  set(dbRef(db, `imageData/${name}`), {
    imageName: name,
    caption: caption,
    click: clicks,
    tags: tags,
    userID: userID,
    userName: userName,
    latitude: latitude,
    longitude: longitude
    
  });
}

const writeUserData = ( name: string, surName: string, userName: string) => {
  const db = getDatabase(cameraApp);
  const user = fireBaseAuth.currentUser
  set(dbRef(db, `userData/${user?.uid}`), {
    name: name,
    surname: surName,
    username: userName,
    
  });
}



const updateLikesToDB = (name: string, likes: number) => {
  const myApp = getApp()
  const db = getDatabase(myApp)
  update(dbRef(db, `imageData/${name}`), {
    click: likes
  });
}

const updateUserData = (userId: string, bio: string|undefined, profilePicture: string|undefined) =>{
  if(profilePicture && !bio){
    update(dbRef(dataBase, `userData/${userId}`), {
    profilePicture: profilePicture

    })
}if(profilePicture && bio){
  update(dbRef(dataBase, `userData/${userId}`), {
    bio: bio,
    profilePicture: profilePicture

    })
}if(bio  && !profilePicture  ){
  update(dbRef(dataBase, `userData/${userId}`), {
    bio: bio

    })
}
}

const likedByUser = (name: string, likedByUsers: string[]) =>{
  const user = fireBaseAuth.currentUser
 
  if(!likedByUsers.includes((user?.uid as string))){
      likedByUsers.push((user?.uid as string))
  }
  update(dbRef(dataBase, `imageData/${name}`), {
    likedBy: likedByUsers

    })
}

const updateComments = (name: string, comments: Comment[]) =>{
  const myApp = getApp()
  const db = getDatabase(myApp)
  update(dbRef(db, `imageData/${name}`), {
    comments: comments
  });
}

const removeLikedByUserConfig = async (name: string, likedByUsers: string[]) =>{
  const user = fireBaseAuth.currentUser
    if(likedByUsers.includes(user?.uid as string)){
      likedByUsers.filter((userID) => userID != user?.uid)
      
    }

    await update(dbRef(dataBase, `imageData/${name}`), {
      likedBy: likedByUsers
  
      })
    

}


//IKKE TESTET ENDA, Kansje det må være et arrau
const addCommentsToDB = (name: string, comments: string) => {
  const myApp = getApp()
  const db = getDatabase(myApp)
  update(dbRef(db, `imageData/${name}`), {
    comment: comments
  });
}



const readImageDataConfig = (name: string) =>{

  const db = getDatabase(cameraApp)
  const imageDataRef = dbRef(db, `imageData/${name}`)
  let imageData: ImageData | undefined
  onValue(imageDataRef,(snapshot) =>{
      imageData = snapshot.val()
  })

  return imageData!
}

const readUserDataConfig = (userId: string) =>{
  const userDataRef = dbRef(dataBase, `userData/${userId}` )
  let userData: UserData | undefined
  onValue(userDataRef, (snapshot) =>{
    userData = snapshot.val()
  })

  return userData
}

const readNumberOfLikesConfig = (name: string) =>{
  const db = getDatabase(cameraApp)
  const imageDataRef = dbRef(db, `imageData/${name}/click`)
  let likes: number = 0
  onValue(imageDataRef, (snapShot) =>{
    likes = snapShot.val()

  })
  return likes
}
export{
    cameraApp,
    appStorage,
    fireBaseAuth,
    uploadToFirebase,
    listFiles,
    getImageUrl,
    writeImageData,
    updateLikesToDB,
    writeUserData,
    updateUserData,
    uploadProfilePictureToFirebase,
    getProfilePictureUrl,
    likedByUser,
    removeLikedByUserConfig,
    updateComments
  
  
}
