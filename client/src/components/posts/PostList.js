import React, { useContext, useEffect } from 'react';
import UserContext from '../../context/userContext';
import Post from './Post';
import UserPost from './UserPost.js'

const PostList = props => {
    const userContext = useContext(UserContext);
    const { 
        getPosts, 
        posts,
        getProfile,
        profile,
        loading, 
        upvotePost, 
        downvotePost
        } = userContext;
    const { userPage, albumView } = props;

    useEffect(() => {
        if(!userPage){
            getPosts();
            getProfile(profile.user)
        }
    }, [loading]);

    return (
        <div className='posts'>
            {
            !loading ? 
            <>
                {
                albumView ?
                    <div className='user-detail-album'>
                        <div className='post-column-1'>
                            {posts.map((post, i) => 
                                i % 2 === 0 &&
                                    <UserPost 
                                        { ...post } 
                                        key={ i }
                                    />
                            )}
                        </div>
                        <div className='post-column-2'>
                            {posts.map((post, i) => 
                                i % 2 === 1 &&
                                    <UserPost 
                                        { ...post } 
                                        key={ i }
                                    /> 
                            )}
                        </div>
                    </div>
                :
                    <div className='posts-grid-container'>
                        {
                        posts.map((post, i) => {
                            return (
                                <Post 
                                    key={ i }
                                    { ...post }
                                    upvotePost={ upvotePost } 
                                    downvotePost={ downvotePost }
                                    userPage={ userPage }
                                    id={ post._id }
                                />
                            )
                        })
                        }
                    </div>
                }
                </>
            :
                <div>Loading...</div>
            }
        </div>
    );
};

export default PostList;
