import React, {useState, useEffect} from 'react'
import {imageUpload, firebaseOn, firebaseOff, deleteImage} from '../../firebase/firebase.js'
import DefaultAvatar from '../../media/blank-avatar.png'

const SetProfileImg = props => {
    const {user, addProfileImg, profile} = props

    const [firebaseId, setFirebaseId] = useState('')
    const [showProgressBar, setShowProgressBar] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        const id = firebaseOn(progress => {
            setUploadProgress(progress)
        })
        setFirebaseId(id)
        return function cleanUp(){
            firebaseOff(firebaseId)
        }
    }, [])

    const handleImgSubmit = e => {
        setErrMsg('')
        const img = e.target.files
        if(img.length > 0 && checkMimeType(img) && checkFileSize(img)){
            const path = `${user}/profile`
            profile && profile.img && profile.img.imgRef && deleteImage(profile.img.imgRef)
            imageUpload(img, path, setUrl)
            setShowProgressBar(true)
        }
    }

    const checkMimeType = img => {
        let err = ''
        const types = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg', 'image/tiff']
        for(let i = 0; i < img.length; i++){
            if(types.every(type => img[i].type !== type)){
                err += `${img[i].type} is not a supported format`
                setErrMsg(err)
            }
        }
        if(err !== ''){
            console.log(err)
            setErrMsg(err)
            return false
        }
        return true
    }

    const checkFileSize = img => {
        let size = 5000000
        let err = ""
        if (img[0].size > size){
            err += 'Image is too large, please pick a smaller file'
            setErrMsg(err)
        }
        if (err !== '') {
            console.log(err)
            setErrMsg(err)
            return false
        }
        return true
    }

    const setUrl = (url, path) => {
        const img = {imgUrl: url, imgRef: path}
        addProfileImg(img)
        setUploadProgress(0)
        setShowProgressBar(false)
    }

    return (
        <div>
            <div 
                className={'set-profile-pic'} 
                style={{
                    'backgroundImage': `url(${profile.img && profile.img.imgUrl ? 
                        profile.img.imgUrl 
                    : 
                        DefaultAvatar})`
                }}
            >
                <input 
                    className='profile-pic-input' 
                    name='image' 
                    type='file'
                    accept='image/*'
                    id='image'
                    onChange={handleImgSubmit}
                />
                <label 
                    className='profile-pic-label' 
                    htmlFor='image' 
                    name='image'
                >
                    <div className='label-styling'>
                        {profile ? 'Change profile picture' : 'Choose a profile picture'}
                        <p className='size-limit'>(max file size: 5mb)</p>
                    </div>
                </label>
            </div>
            <div className={
                showProgressBar ? 
                    'upload-progress-active' 
                : 
                    'upload-progress'
            }>
                <div className='loading-bar-container'>
                    <div 
                        className='loading-bar' 
                        style={{'width': `${uploadProgress}%`}}
                    >
                        {Math.round(uploadProgress, 2)}%
                    </div>
                </div>
            </div>
            <p className='profile-upload-error'>{errMsg}</p>
        </div>
    )
}

export default SetProfileImg