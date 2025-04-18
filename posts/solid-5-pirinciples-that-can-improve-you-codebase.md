---
title: "SOLID 5 Pirinciples that can improve you codebase"
date: "2025-02-18"
timeToRead: 10
description: "SOLID intended to make mostly for OOP to make codebase more understandable, flexible, and maintainable."
image: "/image/blogs/default-thumbnail.webp"
production: true
---

# SOLID for Developers

In book Clean Code, Uncle Bob (Robert C. Martin) mentioned about SOLID principles. 

> Clean code always look like it was written by someone who cares.

Mean if you just coding without any care to world, your code will be messy and hard to maintain. altought you follow all principles in world. it will be probably messy. just look you old code or you hobby project. if you good developer, you hobby project will be clean code. but most of us, is not will be.

most of my project is messy, and it's good. because i learn a lot from it. i make like many projects that never finished. Hahaha like many developer often project is one way trow away we never use or touch again. that what i think. untill i came in where i need to use my old project. to my current interest.

when i open my old project, i feel like i'm looking at the ancient world that i cannot decode or understand my self. altought i know i'm the one who made it.
so i start remember how people always say clean code clean code. but i never understand why. until that moment. so i start to learn about clean code. and i found that clean code is not about following a set of rules. but it's about how you write code. it habits we build over time as developer.

## SOLID Principles

SOLID intended to make mostly for OOP to make codebase more understandable, flexible, and maintainable. but it can be applied to any language. i way mostly working as frontend developer, so i will not cover OOP part. but i will cover how to apply SOLID principles in frontend. the concept is powerfull and can be applied to any language and stack. 


## Single Responsibility Principle

Single Responsibility Principle like the name, a class or function should have only one responsibility. in react we can apply this principle by making a component that has only one responsibility.

## this is example of bad code

```javascript
{/* filePath: pages/UserProfile.jsx */}
import React, { useState } from 'react';

function UserProfile() {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [profilePic, setProfilePic] = useState(null);

    // handling the form submission and uploading the profile picture in the same component
    const handleSubmit = (e) => { 
        e.preventDefault();
        // code to upload profile picture
        const formData = new FormData(e.target);
        const profilePic = formData.get('profilePic');
        fetch('/api/uploadProfilePic', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setProfilePic(data);
        })
        .catch(error => {
            console.error('Error uploading profile picture:', error);
            setProfilePic(null);
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder='Age' />
            <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />
            <button type='submit'>Upload</button>
        </form>
    )
}

export default UserProfile;
```

### Issue with the Bad Example:
 - Multiple responsibilities: This component is managing both user input and file upload logic, which are distinct responsibilities.
 - Not reusable: The file upload logic is tightly coupled with the form, making it hard to reuse or test seperately.

## this is example of good code

```javascript 
{/* filePath: pages/UserProfile.jsx */}
import React, { useState } from 'react';
import ProfilePictureUpload from './ProfilePictureUpload';
import Fetching from './Fetching';

function UserProfile() {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // code to upload profile picture
        const formData = new FormData(e.target);
        const profilePic = formData.get('profilePic');
        const uploadedPic = Fetching.uploadProfilePic(profilePic);
        console.log(uploadedPic);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder='Age' />
            <ProfilePictureUpload onUpload={handleUpload} />
            <button type='submit'>Upload</button>
        </form>
    )
}

export default UserProfile;
```

```javascript 
{/* filePath: components/ProfilePictureUpload.jsx */}
import React from 'react';

const ProfilePictureUpload = ({ onUpload }) => {
    const [profilePic, setProfilePic] = useState(null);

    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0]);
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {profilePic && <p>File Selected: {profilePic.name}</p>}
        </div>
    )
};

export default ProfilePictureUpload;
```

```javascript 
{/* filePath: utils/Fetching.jsx */}
import endpoint from '@/utils/endpoint';

export const Fetching = {
    uploadProfilePic: (profilePic) => {
        fetch(endpoint.uploadProfilePic, {
            method: 'POST',
            body: profilePic
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error('Error uploading profile picture:', error);
            return null;
        });
    }
}
```
