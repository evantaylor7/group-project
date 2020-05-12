import firebase from 'firebase/app'
import 'firebase/storage'

let progress
const progressArr = []

const dotENV = require('dotenv')
dotENV.config()
const apiKey = process.env.API_KEY

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "image-bucket-4e572.firebaseapp.com",
    databaseURL: "https://image-bucket-4e572.firebaseio.com",
    projectId: "image-bucket-4e572",
    storageBucket: "image-bucket-4e572.appspot.com",
    messagingSenderId: "15521326526",
    appId: "1:15521326526:web:1e2fb596d1b954e7e7c5ef",
    measurementId: "G-QRZNJJGDP6"
}

firebase.initializeApp(firebaseConfig)

const imageUpload = (img, user, setUrl) => {
    const imgFile = img[0]
    const imgName = img[0].name
    
    const storage = firebase.storage()
    const storageRef = storage.ref()

    const path = `${user}/${imgName}`
    const imgRef = storageRef.child(path);
    
    if(imgFile === ''){
        console.error(`not an image, the image file is a ${typeof(imgFile)}`)
    }

    // uploads picture 
    const uploadTask = imgRef.put(imgFile)

    // listens for state changes, errors, and completion of upload
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
            // task progress
            progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            for(let i = 0; i < progressArr.length; i++){
                progressArr[i].callback(progress)
            }
            console.log(`Upload is ${progress}% done`)

            switch(snapshot.state){
                case firebase.storage.TaskState.PAUSED:
                    console.log('Upload is paused')
                    break
                case firebase.storage.TaskState.RUNNING:
                    console.log('Upload is running')
                    break
            }
            console.log(snapshot)
        }, error => {
            // full list of error codes: https://firebase.google.com/docs/storage/web/handle-errors
            switch(error.code){
                case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break
                case 'storage/canceled':
                // User canceled the upload
                break
                case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break
            }
            console.log(error)
        }, () => {
        // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL()
                .then(firebaseUrl => {
                    const url = firebaseUrl
                    setUrl(url, path)
                })
        }
    )
}

const firebaseOn = callback => {
    const id = Date.now()
    progressArr.push({callback, id})
    return id
}

const firebaseOff = id => {
    progressArr.filter(item => item.id !== id)
}

const deleteImage = ref => {
    // Create a reference to the file to delete
    const storage = firebase.storage()
    const storageRef = storage.ref()
    const thisImg = storageRef.child(ref)
    
    // Delete the file
    thisImg.delete().then(() => {
        console.log('image deleted successfully')
    }).catch(error => {
        console.log(error)
    })
}

export {imageUpload, firebaseOn, firebaseOff, deleteImage}