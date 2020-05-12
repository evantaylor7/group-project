import React, { useState } from 'react';
import UserContext from './userContext';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const UserProvider = props => {
    const initialState = {
        user: JSON.parse(localStorage.getItem('user')) || {},
        token: localStorage.getItem('token') || '',
        currentProfile: {
            img: {
                imgUrl: '',
                imgRef: ''
            },
            bio: ''
        },
        profile: {
            img: {
                imgUrl: '',
                imgRef: ''
            },
            bio: ''
        },
        posts: [],
        currentPost: {
            img: {
                imgUrl: '',
                imgRef: ''
            },
            postedBy: '',
            userImg: '',
            description: '',
            votes: ''
        },
        comments: [],
        loading: true,
        errMsg: ''
    }
    const [userState, setUserState] = useState(initialState);
    const { goBack, push } = useHistory();

    // USER AUTH:
    const signup = credentials => {
        axios.post('/auth/signup', credentials)
            .then(res => {
                const { user, token } = res.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setUserState({
                    ...initialState,
                    user,
                    token,
                    success: true
                });
            })
            .catch(err => {
                if(err.response){
                    handleAuthErr(err.response.data.errMsg);
                    console.error(err);
                }
        });
    };

    // delete user (deletes user / user's profile, posts, comments, and other's comments on user's posts)
    const deleteUser = () => {
        userAxios.delete('/api/users/delete-user')
            .then(res => {
                console.log(res)
                logout()
            })
            .catch(err => {
                console.log(err)
            })
    }

    // login
    const login = credentials => {
        axios.post('/auth/login', credentials)
            .then(res => {
                const { user, token } = res.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                getProfile(user.username);
                setUserState({
                    ...initialState,
                    user,
                    token,
                    success: true
                });
            })
            .catch(err => {
                if(err.response){
                    handleAuthErr(err.response.data.errMsg);
                    console.error(err);
                }
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUserState(prevUserState => ({
            ...prevUserState,
            user: '',
            token: '',
            currentProfile: {
                img: {
                    imgUrl: '',
                    imgRef: ''
                },
                bio: ''
            }
        }))
    };

    const handleAuthErr = errMsg => {
        setUserState(prevUserState => ({
            ...prevUserState,
            errMsg
        })
    )};

    const resetAuthErr = () => {
        setUserState(prevUserState => ({
            ...prevUserState,
            errMsg: ''
        })
    )};

    // PROFILE:
    // get logged in user's profile
    const getCurrentProfile = () => {
        const {user: {username}} = userState
        userAxios.get(`/api/profile/${username}`)
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    currentProfile: res.data
                }))
            })
            .catch(err => {
                console.error(err)
            })
    }

    // get other user's profile
    const getProfile = username => {
        axios.get(`/profile/${username}`)
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    profile: res.data
                }))
            })
            .catch(err => {
                console.error(err)
            })
    }

    const addProfileImg = img => {
        const {imgUrl} = img
        editPostIcons(imgUrl)
        editCommentIcons(imgUrl)
        userAxios.put('/api/profile/img', img)
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    currentProfile: res.data
                }))
            })
            .catch(err => {
                console.error(err)
            })
    }

    const addBio = bio => {
        userAxios.put(`/api/profile/bio`, {data: bio})
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    currentProfile: res.data
                }))
            })
            .catch(err => {
                console.error(err)
            })
    }

    // POSTS:
    // new post
    const createPost = newPost => {
        userAxios.post('/api/posts', newPost)
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    posts: [res.data, ...prevUserState.posts]
                }));
                push('/current-user', {newImg: 'new'})
            })
            .catch(err => {
                console.error(err);
        });
    };

    // get all posts:
    const getPosts = () => {
        axios.get('/posts')
            .then(res => {
                setUserState(prevUserState => ({ 
                    ...prevUserState,
                    posts: res.data.reverse(),
                    loading: false
                }));
            })
            .catch(err => {
                console.error(err);
        });
    };

    // get (logged in) user's posts
    const currentUserPosts = () => {
        userAxios.get(`/api/posts/current-user`)
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    posts: res.data.reverse(),
                    loading: false
                }));
            })
            .catch(err => {
                console.error(err);
        });
    };

    // get (other) user's posts
    const selectedUser = username => {
        axios.get(`/posts/user/${username}`)
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    posts: res.data.reverse(),
                    loading: false
                }));
            })
            .catch(err => {
                console.error(err);
        });
    };

    // get one post
    const postDetail = postId => {
        axios.get(`/posts/detail/${postId}`)
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    currentPost: res.data
                }));
            })
            .catch(err => {
                console.error(err);
        });
    };

    // delete post
    const removePost = postId => {
        userAxios.delete(`/api/posts/${postId}`)
            .then(() => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    posts: prevUserState.posts.filter(post => post._id !== postId)
                }));
                goBack();
            })
            .catch(err => { 
                console.error(err);
        });
    };

    // edit post
    const editPost = (postId, description) => {
        const editedPost = {
            ...userState.currentPost,
            description: description
        }
        userAxios.put(`/api/posts/${postId}`, editedPost)
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    currentPost: res.data
                }));
            })
            .catch(err => {
               console.error(err);
        });
    };

    // add profile pictures to posts
    const editPostIcons = userImg => {
        userAxios.put(`/api/posts/profile/${userState.user.username}`, {data: userImg})
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.error(err)
            })
    }

    // UP/DOWN VOTING:
    const upvotePost = postId => {
        userAxios.put(`/api/vote/upvote/${postId}`)
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState, 
                    posts: prevUserState.posts.map(post => (
                        post._id === postId ? res.data : post)),
                    currentPost: res.data
                }));
            })
            .catch(err => { 
                console.error(err)
                alert('You can only vote once per post')
        })
    };

    const downvotePost = postId => {
        userAxios.put(`/api/vote/downvote/${postId}`)
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState, 
                    posts: prevUserState.posts.map(post => (
                        post._id === postId ? res.data : post))
                }));
            })
            .catch(err => { 
                console.error(err)
                alert('You can only vote once per post');
        });
    };

    // COMMENTS:
    const getComments= postId => {
        axios.get(`/comments/${postId}`)
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    comments: [...res.data.reverse()]
                }))
            })
            .catch(err => { 
                console.error(err) 
        })
    }

    const createComment = (postId, newComment) => {
        userAxios.post(`/api/comments/post/${postId}`, newComment)
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    comments: [res.data, ...prevUserState.comments]
                }))
            })
            .catch(err => { 
                console.error(err) 
        })
    }

    const removeComment = commentId => {
        userAxios.delete(`/api/comments/${commentId}`)
            .then(() => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    comments: prevUserState.comments.filter(comment => comment._id !== commentId)
                }))
            })
            .catch(err => { 
                console.error(err) 
            })
    }

    const editComment = (commentId, updatedComment) => {
        userAxios.put(`/api/comments/${commentId}`, updatedComment)
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    comments: prevUserState.comments.map(comment => (
                        comment._id !== commentId ? comment : res.data
                    ))
                }))
            })
            .catch(err => { 
                console.error(err) 
        });
    };

    // add profile icons to comments
    const editCommentIcons = userImg => {
        userAxios.put(`/api/comments/profile/${userState.user.username}`, {data: userImg})
            .then(res => {
                setUserState(prevUserState => ({
                    ...prevUserState,
                    comments: prevUserState.comments.map(comment => 
                        (comment.postedBy === prevUserState.user.username ? res.data : comment))
                }))
            })
            .catch(err => {
                console.error(err)
            })
    }

    return (
        <UserContext.Provider 
            value={{ 
                ...userState,
                signup,
                deleteUser,
                login,
                logout,
                resetAuthErr,
                getCurrentProfile,
                getProfile,
                addProfileImg,
                addBio,
                getPosts,
                currentUserPosts,
                selectedUser,
                postDetail,
                createPost,
                removePost,
                editPost,
                upvotePost,
                downvotePost,
                getComments,
                createComment,
                removeComment,
                editComment
            }} 
        >
            { props.children }
        </UserContext.Provider>
    );
};

export default UserProvider;