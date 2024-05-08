import Image from "next/image";
import {useEffect, useState} from "react";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database} from "@/types/supabase";
import ModelSelector from "@/components/Create/Design/ModelSelect";
import NewFiles from "@/components/Create/Design/NewFile";

import React from 'react'
import {AdvancedImage} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";

// Import required actions.
import {sepia} from "@cloudinary/url-gen/actions/effect";

const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'your_upload_preset'); // replace with your upload preset

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Error uploading the image', error);
        throw error;
    }
};


export default function History({model, setModel}) {

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'demo'
        }
    });

    // Use the image with public ID, 'front_face'.
    const myImage = cld.image('front_face');

    // Apply the transformation.
    myImage
        .effect(sepia());  // Apply a sepia effect.

    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (imageFile) {
            try {
                const url = await uploadImageToCloudinary(imageFile);
                setImageUrl(url);
                console.log('Image URL:', url); // You can remove this line if not needed
            } catch (error) {
                console.error('Error uploading the image', error);
            }
        }
    };

    // Render the transformed image in a React component.
    return (
        <div>
            <AdvancedImage cldImg={myImage}/>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Image</button>
            {imageUrl && <p>Image URL: {imageUrl}</p>}
        </div>
    )
}
