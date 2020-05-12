import React, {useEffect, useContext, useState} from 'react'
import {useParams} from 'react-router-dom'
import userContext from '../../context/userContext'
import PostList from '../../components/posts/PostList.js'
import DefaultAvatar from '../../media/blank-avatar.png'

const UserDetail = () => {
    const {username} = useParams()
    const {selectedUser, getProfile, profile, posts} = useContext(userContext)

    const [albumView, setAlbumView] = useState(false)

    useEffect(() => {
        selectedUser(username)
        getProfile(username)
    }, [])

    const handleAlbumToggle = () => {
        setAlbumView(!albumView)
    }

    return(
        <div className='user-detail'>
            <div className='user-detail-info'>
                <div 
                    className={'user-detail-icon'} 
                    style={{
                        'backgroundImage': `url(${profile.img && profile.img.imgUrl ? 
                            profile.img.imgUrl 
                        : 
                            DefaultAvatar})`
                    }}
                >
                </div>
                <div className='user-detail-text'>
                    <h2>{ username }</h2>
                    <p className='user-detail-post-num'>
                        <b>{posts.length}</b> post{(posts.length > 1 || posts.length === 0) && 's'}
                    </p>
                    {profile.bio && <p className='user-posts-bio'>{profile.bio}</p>}
                </div>
            </div>
            <div className='toggle-album-button-container'>
                <button 
                    className={`button toggle-album-button${albumView ? '-active' : ''}`} 
                    onClick={handleAlbumToggle}
                >
                    Album View
                </button>
            </div>
            <PostList userPage={true} albumView={albumView}/>
        </div>
    )
}

export default UserDetail