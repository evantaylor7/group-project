import React from 'react';
import {Link} from 'react-router-dom'

const UserPost = props => {
    const {_id, img} = props

    return (
        <div className='user-post'>
            <Link to={`/detail/${ _id }`}>
                {img && <img className='user-post-img' src={ img.imgUrl } alt='' />}
            </Link>
        </div>
    )
};

export default UserPost;
