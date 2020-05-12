import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {confirmAlert} from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import CommentForm from './CommentForm.js'
import DefaultAvatar from '../../media/blank-avatar.png'

function Comment(props){
    const {comment, commentId, postedBy, userImg, removeComment, user, editComment} = props
    const [toggle, setToggle] = useState(false)

    const toggleEditComment = () => {
        setToggle(prevToggle => !prevToggle)
    }

    const handleDeleteComment = (commentId) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm'>
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete your comment?</p>
                        <button onClick={onClose} className='button'>No</button>
                        <button
                            className='button'
                            onClick={() => {
                                removeComment(commentId)
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

    return(
        <div>
            {
            user === postedBy &&
                <div className='comment-buttons'>
                    <button className='button' onClick={() => toggleEditComment()}>{toggle ? 'Cancel' : 'Edit'}</button>
                    {!toggle && <button className='button' onClick={() => handleDeleteComment(commentId)}>X</button>}
                </div>
            }
            <div className='comment'>
                <div className='comment-user'>
                    <Link className='comment-icon-link' to={`/user/${ postedBy }`}>
                        <div 
                            className={'comment-icon'} 
                            style={{'backgroundImage': `url(${userImg ? userImg : DefaultAvatar})`}}
                        >
                        </div>
                    </Link>
                </div>
                {
                toggle ? 
                    <>
                        <CommentForm 
                            addOrEditComment={editComment} 
                            commentBtnText='Save' 
                            btnType='comment-save-button'
                            postOrCommentId={commentId}
                            toggle={toggleEditComment}
                            prevComment={comment}
                            formType='edit-comment-input'
                        />
                    </>
                    :
                    <p className='user-comment-box'>
                        <Link className='comment-username-link' to={`/user/${ postedBy }`}>
                            <b className='comment-username'>{postedBy}</b>
                        </Link>
                        {comment}
                    </p>
                }
            </div>
        </div>
    )
}

export default Comment
