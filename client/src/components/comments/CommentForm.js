import React, {useState} from 'react'

function CommentForm(props){
    const {
        addOrEditComment, 
        postOrCommentId, 
        commentBtnText, 
        toggle, 
        prevComment, 
        formType, 
        btnType
    } = props
    const [comment, setComment] = useState({comment: prevComment || ''})

    function handleChange(e){
        const {value} = e.target
        setComment({comment: value})
    }

    function handleSubmit(e){
        e.preventDefault()
        addOrEditComment(postOrCommentId, comment)
        setComment({comment: ''})
        toggle && toggle()
    }

    return(
        <div className='comment-form'>
            <form onSubmit={handleSubmit}>
                <textarea 
                    onChange={handleChange} 
                    type='text' 
                    value={comment.comment} 
                    placeholder='Add a comment'
                    rows={1} 
                    cols={60}
                    className={`input comment-input ${formType}`}
                    maxLength={200}
                />
                <button className={`button comment-form-button ${btnType}`}>{commentBtnText}</button>
            </form>
        </div>
    )
}

export default CommentForm
