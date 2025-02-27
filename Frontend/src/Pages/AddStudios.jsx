import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {app} from '../firebase'
import { Button, Alert, TextInput, FileInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AddStudio = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        services: [],
        images: Array(4).fill(''),
        mainImage: '',
      
    });
    const [files, setFiles] = useState(Array(4).fill(null));
    const [imageUploadProgress, setImageUploadProgress] = useState(Array(4).fill(null));
    const [imageUploadError, setImageUploadError] = useState(Array(4).fill(null));
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (index, file) => {
        const newFiles = [...files];
        newFiles[index] = file;
        setFiles(newFiles);
        const newErrors = [...imageUploadError];
        newErrors[index] = null;
        setImageUploadError(newErrors);
    };

    const handleUploadImage = (index) => {
        const file = files[index];
        if (!file) {
            const newErrors = [...imageUploadError];
            newErrors[index] = 'Please select an image';
            setImageUploadError(newErrors);
            return;
        }

        const storage = getStorage(app);
        const fileName = `${new Date().getTime()}-${file.name}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                const newProgress = [...imageUploadProgress];
                newProgress[index] = progress.toFixed(0);
                setImageUploadProgress(newProgress);
            },
            (error) => {
                console.error(error);
                const newErrors = [...imageUploadError];
                newErrors[index] = 'Image upload failed';
                setImageUploadError(newErrors);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                const newImages = [...formData.images];
                newImages[index] = downloadURL;
                setFormData({
                    ...formData,
                    images: newImages,
                    mainImage: newImages[mainImageIndex],
                });
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/studios/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
            navigate(`/`);
        } catch (error) {
            setPublishError('Something went wrong');
            console.error(error);
        }
    };

    return (
        <div className="p-4 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">Add Studio</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <TextInput placeholder='Title' required onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                <ReactQuill theme="snow" placeholder="Description..." className="h-52 mb-12" onChange={(value) => setFormData({ ...formData, description: value.replace(/<[^>]*>?/gm, '') })} />
                <TextInput type='number' placeholder='Price' required onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                {formData.images.map((image, index) => (
                    <div key={index} className='flex gap-4 items-center border-4 border-teal-500 border-dotted p-3'>
                        <FileInput type='file' accept='image/*' onChange={(e) => handleFileChange(index, e.target.files[0])} />
                        <Button onClick={() => handleUploadImage(index)} type='button' size='sm'>Upload Image {index + 1}</Button>
                        {imageUploadProgress[index] && <CircularProgressbar value={imageUploadProgress[index]} text={`${imageUploadProgress[index]}%`} />}
                    </div>
                ))}
                <Button type='submit' className="bg-slate-400">Add Studio</Button>
                {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
            </form>
        </div>
    );
};

export default AddStudio;
