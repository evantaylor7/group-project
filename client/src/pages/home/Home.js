import React from 'react';
import PostList from '../../components/posts/PostList';

const Home = () => {
    return (
        <div className='home'>
            <PostList albumView={false}/>
        </div>
    );
};

export default Home;
