import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import userContext from '../../context/userContext';
import DefaultAvatar from '../../media/blank-avatar.png'

const Post = props => {
    const { 
        _id,
        img,
        dateAdded,
        votes,
        usersWhoHaveVoted,
        postedBy,
        userImg,
        upvotePost, 
        downvotePost, 
        userPage
    } = props;
    const { user: { username, _id: userId }, token } = useContext(userContext);

    return (
        <div className='card'>
            {
            !userPage &&
                <div className='card-user'>
                    <div className='card-user-icon-box'>
                        <Link to={`/user/${ postedBy }`}>
                            <div 
                                className={'card-user-icon'} 
                                style={{'backgroundImage': `url(${userImg ? userImg : DefaultAvatar})`}}
                            >
                            </div>
                        </Link>
                    </div>
                    <Link className='card-username-link' to={`/user/${ postedBy }`}>
                        <p className='card-username'>{ postedBy }</p>
                    </Link>
                </div>
            }
            {!userPage && <p className='card-date'>{dateAdded}</p>}
            <Link to={`/detail/${ _id }`}>
                {img && <img className='card-image' alt='' src={img.imgUrl}/>}
            </Link>
            <div className='card-info'>
                <div className='card-post-section'>
                    {userPage && <p className='user-detail-date'>{dateAdded}</p>}
                    <p className='card-votes'> votes: { votes }</p>
                    {username !== postedBy && token &&
                        <div className='vote-buttons'>
                            <button 
                                className='button' 
                                onClick={ () => upvotePost(_id) }
                                disabled={usersWhoHaveVoted.includes(userId) && true}
                            >
                                Upvote
                            </button>
                            <button 
                                className='button' 
                                onClick={ () => downvotePost(_id) }
                                disabled={usersWhoHaveVoted.includes(userId) && true}
                            >
                                Downvote
                            </button>
                        </div>
                    }
                </div>
                <br />
            </div>
        </div>
    );
};

export default Post;
