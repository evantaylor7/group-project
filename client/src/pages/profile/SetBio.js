import React, { useState } from 'react'

const SetBio = props => {
    const {addBio, prevBio, handleToggle} = props

    const [bioInput, setBioInput] = useState(prevBio)

    const handleBioChange = e => {
        const {value} = e.target
        setBioInput(value)
    }

    const handleBioSubmit = e => {
        e.preventDefault()
        addBio(bioInput);
        handleToggle && handleToggle()
    }

    return (
        <form onSubmit={handleBioSubmit}>
            <div className='profile-bio'>
                <textarea 
                    value={bioInput} 
                    placeholder='About me' 
                    onChange={handleBioChange}
                    className='bio-textarea input'
                    maxLength={300}
                >
                </textarea>
            </div>
            <button className='set-bio-button button'>Set Bio!</button>
        </form>
    )
}

export default SetBio