import React, {useState} from 'react';
import UserPostList from '../../components/posts/UserPostList'

const UserAlbum = props => {
    const [toggle, setToggle] = useState(false)

    const toggleAlert = () => {
        setToggle(true)
    }

    return (
        <div className='current-post'>
            {(props.location.state && props.location.state.newImg === 'new') && 
                <div className='custom-alert-container' style={{'display': toggle && 'none'}}>
                    <div className='custom-alert'>
                        <button onClick={toggleAlert}>X</button>
                        <p>Image Upload Successful!</p>
                    </div>
                </div>
            }
            <UserPostList/>
        </div>
    );
};

export default UserAlbum;
