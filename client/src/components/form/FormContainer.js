import React, { useState, useEffect, useContext } from 'react';
import FormComponent from './FormComponent';
import {imageUpload, firebaseOn, firebaseOff} from '../../firebase/firebase.js'
import userContext from '../../context/userContext';

const FormContainer = props => {
    const { createPost, user } = props;

    const {posts} = useContext(userContext)

    const createDate = () => {
        const month = new Date().toLocaleString('default', { month: 'long' })
        const dateArr = Date().split(' ')
        return `${month} ${dateArr[2]}, ${dateArr[3]}`
    }

    const initialInputs = {
        img: {
            imgUrl: '',
            imgRef: ''
        },
        user: user,
        description: '',
        likes: '',
        dateAdded: createDate()
    };
    
    const [inputs, setInputs] = useState(initialInputs);
    const [img, setimg] = useState([]);
    const [showProgressBar, setShowProgressBar] = useState(false)
    const [btnDisable, setBtnDisable] = useState(false)
    
    const [firebaseId, setFirebaseId] = useState('')
    const [uploadProgress, setUploadProgress] = useState(0)
    
    useEffect(() => {
        const id = firebaseOn(progress => {
            setUploadProgress(progress)
        })
        setFirebaseId(id)
        return function cleanUp(){
            firebaseOff(firebaseId)
        }
    }, [])

    const handleChange = e => {
        const { name, value } = e.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        })
    )};

    const onDrop = img => {
        setimg(img);
    };

    const handleSubmit = e => {
        e.preventDefault();
        const newName = img[0].name
        const prevNameArr = posts.map(post => post.img.imgRef.split('/')[1])

        if(img.length === 0){
            alert("You must choose a picture") 
        } else if(prevNameArr.includes(newName)){
            alert("A file with that name has already been uploaded. Please rename the file and try again.")
        } else {
            imageUpload(img, user, setUrl)
            setShowProgressBar(true)
            setBtnDisable(true)
        }
    };

    const setUrl = (url, path) => {
        setInputs(prevInputs => ({
            ...prevInputs, 
            img: {
                imgUrl: url,
                imgRef: path
            }
        }))
        const inputsWithImgUrl = {...inputs, img: {imgUrl: url, imgRef: path}}
        finalizeSubmit(inputsWithImgUrl)
    }

    const finalizeSubmit = inputs => {
        createPost(inputs)
        setInputs(initialInputs)
    }

    return (
        <FormComponent 
            handleChange={ handleChange }
            handleSubmit={ handleSubmit }
            onDrop={ onDrop }
            inputs={ inputs }
            buttonText='Submit'
            btnDisable={btnDisable}
            showProgressBar={showProgressBar}
            uploadProgress={uploadProgress}
        />
    );
};

export default FormContainer;