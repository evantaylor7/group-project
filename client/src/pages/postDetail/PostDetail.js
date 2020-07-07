import React, {useState, useContext, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import {confirmAlert} from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import userContext from '../../context/userContext'
import {deleteImage} from '../../firebase/firebase.js'
import CommentList from '../../components/comments/CommentList.js'
import CommentForm from '../../components/comments/CommentForm.js'
import DefaultAvatar from '../../media/blank-avatar.png'

const PostDetail = () => {
    const {postId} = useParams()
    const {
        user: { username, _id: userId },
        token,
        currentPost, 
        postDetail, 
        getProfile,
        editPost, 
        removePost, 
        getComments,
        createComment,
        upvotePost,
        downvotePost
    } = useContext(userContext);

    const {
        img: {
            imgUrl,
            imgRef
        },
        userImg,
        description, 
        postedBy, 
        dateAdded, 
        usersWhoHaveVoted,
        votes, 
        _id
    } = currentPost
    
    const [toggle, setToggle] = useState(false)
    const [resize, setResize] = useState(false)

    const [descriptionInput, setDescriptionInput] = useState(description)

    useEffect(() => {
        postDetail(postId)
        getProfile(username)
        getComments(postId)
    }, [])

    const toggleEdit = () => {
        setToggle(!toggle)
        setDescriptionInput(description)
    }

    const handleChange = e => {
        const {value} = e.target
        setDescriptionInput(value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        editPost(_id, descriptionInput)
        setToggle(!toggle)
    }

    const handleDelete = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm'>
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete your image?</p>
                        <button onClick={onClose} className='button'>No</button>
                        <button
                            className='button'
                            onClick={() => {
                                deleteImage(imgRef)
                                removePost(_id)
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

    const handleResize = () => {
        window.matchMedia("(min-width: 740px)").matches && setResize(!resize)
    }

    return(
        <div className='post-detail-container'>
            <div className='post-detail'>
                <div className='detail-top-box'>
                    <div className='detail-user'>
                        <Link to={`/user/${ postedBy }`}>
                            <div 
                                className={'detail-icon'} 
                                style={{'backgroundImage': `url(${userImg ? userImg : DefaultAvatar})`}}
                            >
                            </div>
                        </Link>
                        <Link className='detail-username' to={`/user/${ postedBy }`}>
                            <p className='detail-username-text'>{ postedBy }</p>
                        </Link>
                    </div>
                {
                postedBy === username &&
                    <button className='delete-button button' onClick={handleDelete}>Delete Post</button>
                }
                {
                postedBy !== username &&
                    <div className='image-flag-container'>
                        <a 
                            className='image-flag'
                            href={`mailto:evantaylor667@gmail.com?subject=Image%20Flag&body=Image%20id%20is%20${_id}`}
                            target='_blank'
                        >
                            Flag Image
                        </a>
                    </div>
                }
                </div>
                <p className='detail-date'>{dateAdded}</p>
                <div 
                    className={resize ? 'resize-background' : ''}
                    onClick={handleResize}
                >
                    <div className={resize ? 'detail-image-large-container' : ''}>
                        <img 
                            className={`detail-image ${resize ? 'detail-image-large' : ''}`} 
                            src={imgUrl} alt='' 
                            onClick={handleResize}
                        />
                    </div>
                </div>
                <p className='detail-votes'>votes: {votes}</p>
                {
                username !== postedBy && token &&
                    <div className='vote-buttons'>
                        <button 
                            className='button' 
                            onClick={ () => upvotePost(_id) }
                            disabled={usersWhoHaveVoted && usersWhoHaveVoted.includes(userId) && true}
                        >
                            Upvote
                        </button>
                        <button 
                            className='button' 
                            onClick={ () => downvotePost(_id) }
                            disabled={usersWhoHaveVoted && usersWhoHaveVoted.includes(userId) && true}
                        >
                            Downvote
                        </button>
                    </div>
                }
                {
                postedBy === username &&
                    <>
                        <button 
                            className='button detail-description-button' 
                            onClick={toggleEdit}
                        >
                            {toggle ? 'Cancel' : description ? 'Edit Description' : 'Add Description'}
                        </button>
                    </>
                }
                {
                toggle ? 
                    <>
                        <br/>
                        <form className='detail-description-input' onSubmit={handleSubmit}>
                            <textarea 
                                className='input post-description-textarea'
                                onChange={handleChange} 
                                value={descriptionInput} 
                                cols={50} 
                                rows={3}
                                maxLength={300}
                            />
                            <button className='button detail-save-description'>Save</button>
                        </form>
                    </>
                    :
                    <p className='detail-description'>{description}</p>
                }
                <div className='comments-box'>
                    {
                    token &&
                        <CommentForm 
                            addOrEditComment={createComment} 
                            commentBtnText='Comment' 
                            postOrCommentId={_id}
                        />
                    }
                    <CommentList/>
                </div>
            </div>
        </div>
    )
} 

export default PostDetail