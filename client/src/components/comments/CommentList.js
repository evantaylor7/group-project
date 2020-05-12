import React, {useContext} from 'react'
import Comment from './Comment.js'
import userContext from '../../context/userContext.js'

function CommentList(){
    const {comments, removeComment, user: {username}, editComment} = useContext(userContext)

    return(
        <div className='comments-list'>
            {comments.map(comment => 
                <Comment 
                    {...comment} 
                    key={comment._id}
                    commentId={comment._id}
                    removeComment={removeComment}
                    user={username}
                    editComment={editComment}
                />
            )}
        </div>
    )
}

export default CommentList
