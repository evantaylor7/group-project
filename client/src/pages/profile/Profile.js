import React, { useState, useContext, useEffect } from 'react';
import {confirmAlert} from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import UserContext from '../../context/userContext';
import FormContainer from '../../components/form/FormContainer';
import SetProfileImg from './SetProfileImg.js'
import SetBio from './SetBio.js'
import { deleteImage } from '../../firebase/firebase.js'

const Profile = () => {
    const userContext = useContext(UserContext);
    const {
        user: { username },
        currentProfile,
        createPost,
        currentUserPosts,
        getCurrentProfile,
        addProfileImg,
        addBio,
        posts,
        deleteUser
    } = userContext
    
    const [bioToggle, setBioToggle] = useState(false)

    useEffect(() => {
        getCurrentProfile()
        currentUserPosts()
    }, [])

    const handleDeleteData = () => {
        posts.forEach(post => deleteImage(post.img.imgRef))
        currentProfile.img && currentProfile.img.imgRef.length > 0 && deleteImage(currentProfile.img.imgRef)
        deleteUser()
    }

    const handleDeleteProfile = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm'>
                        <h2>Confirm Delete Profile</h2>
                        <p>Are you sure you want to delete your profile? <br/><br/>
                            This action cannot be undone.</p>
                        <button onClick={onClose} className='button'>No</button>
                        <button
                            className='button'
                            onClick={() => {
                                handleDeleteData()
                                onClose()
                            }}
                        >
                            Yes
                        </button>
                    </div>
                )
            }
        })
    }

    const handleToggle = () => {
        setBioToggle(!bioToggle)
    }

    return (
        <div className='profile'>
            <div className='profile-edit-container'>
                <button 
                    className='profile-delete-user-button button' 
                    onClick={handleDeleteProfile}
                >
                        Delete Profile
                </button>
                <div className='profile-edit'>
                    <SetProfileImg 
                        user={username} 
                        addProfileImg={addProfileImg} 
                        profile={currentProfile}
                    />
                    <div className='profile-edit-text'>
                        <h1 className='profile-username'>{username}</h1>
                        <p className='profile-postnum'>
                            <b>{posts.length}</b> post{(posts.length > 1 || posts.length === 0) && 's'}
                        </p>
                        {
                        bioToggle ?
                            <div>
                                <SetBio 
                                    addBio={addBio} 
                                    prevBio={currentProfile.bio} 
                                    handleToggle={handleToggle}
                                />
                                <button 
                                    className='profile-bio-button button' 
                                    onClick={() => handleToggle()}
                                >
                                    Cancel
                                </button>
                            </div>
                        :
                            <>
                                {
                                currentProfile && currentProfile.bio ?
                                    <div className='profile-bio'>
                                        <p className='bio-p'>{currentProfile.bio}</p>
                                        <button 
                                            className='profile-bio-button button' 
                                            onClick={() => handleToggle()}
                                        >
                                            Edit Bio
                                        </button>
                                    </div>
                                :
                                    <SetBio addBio={addBio} prevBio={currentProfile.bio}/>
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
            <div className='profile-post'>
                <h3>Create a new post</h3>
                <FormContainer 
                    createPost={ createPost }
                    user={ username }
                />
            </div>
        </div>
    )
}

export default Profile