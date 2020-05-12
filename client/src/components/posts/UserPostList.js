import React, { useEffect, useContext } from 'react';
import UserPost from './UserPost';
import userContext from '../../context/userContext';

const UserPostList = () => {    
    const {currentUserPosts, posts, loading} = useContext(userContext)

    useEffect(() => {
        currentUserPosts()
    }, [])

    return (
        <div className='current-user-posts-page'>
            { loading && <div className='loader' /> }
            <h3 className='current-user-title'> 
                You have { posts.length } post{(posts.length > 1 || posts.length === 0) && 's'}! 
            </h3> 
            <div className='user-post-list'>
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
        </div>
    );
};

export default UserPostList;
