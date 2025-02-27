import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from "react-router-dom";


export default function AddStudio() {
  
  const [files, setFiles] = useState([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);
  const [imageUploadProgress, setImageUploadProgress] = useState([null, null, null, null]);
  const [imageUploadError, setImageUploadError] = useState([null, null, null, null]);
  const [formData, setFormData] = useState({ images: [], services: [] });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const handleFileChange = (index, file) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);

    // Generate a preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const newPreviews = [...imagePreviews];
      newPreviews[index] = previewUrl;
      setImagePreviews(newPreviews);
    }
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
    const fileName = new Date().getTime() + '-' + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const newProgress = [...imageUploadProgress];
        newProgress[index] = progress.toFixed(0);
        setImageUploadProgress(newProgress);
      },
      (error) => {
        const newErrors = [...imageUploadError];
        newErrors[index] = 'Image upload failed';
        setImageUploadError(newErrors);
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const newImages = [...formData.images];
          newImages[index] = downloadURL;
          setFormData({ ...formData, images: newImages });
        });
      }
    );
  };

  const addService = () => {
    setFormData({ ...formData, services: [...formData.services, ""] });
  };

  const removeService = (index) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: updatedServices });
  };

  const handleServiceChange = (index, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = value;
    setFormData({ ...formData, services: updatedServices });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/studios/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          mainImage: formData.images[mainImageIndex],  // Pass the main image
        }),
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
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Add Studio</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput type='text' placeholder='Title' required onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        <ReactQuill theme="snow" placeholder="Description..." className="h-52 mb-12" onChange={(value) => setFormData({ ...formData, description: value.replace(/<[^>]*>?/gm, "") })} />
        <TextInput type="number" placeholder="Price" required onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
        
        <h2 className="text-xl font-semibold">Services</h2>
        {formData.services.map((service, index) => (
          <div key={index} className="flex gap-3 items-center">
            <TextInput type='text' value={service} onChange={(e) => handleServiceChange(index, e.target.value)} placeholder='Enter service' />
            <Button type='button' onClick={() => removeService(index)} className="bg-red-500">Remove</Button>
          </div>
        ))}
        <Button type='button' onClick={addService} className="bg-teal-500">Add Service</Button>
        
        {/* Image Upload */}
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className='flex gap-4 items-center border-4 border-teal-500 border-dotted p-3'>
            <FileInput type='file' accept='image/*' onChange={(e) => handleFileChange(index, e.target.files[0])} />
            
            {/* Image Preview */}
            {imagePreviews[index] && (
              <img src={imagePreviews[index]} alt="Preview" className="w-20 h-20 object-cover rounded" />
            )}

            <Button onClick={() => handleUploadImage(index)} type='button' size='sm' disabled={imageUploadProgress[index]} className="bg-slate-400">
              {imageUploadProgress[index] ? <CircularProgressbar 
  value={imageUploadProgress[index]} 
  text={`${imageUploadProgress[index] || 0}%`}
  styles={{
    path: { stroke: `rgba(62, 152, 199, ${imageUploadProgress[index] / 100})` },
    text: { fontSize: '20px' }, // Reduce font size here
  }} 
/> : 'Upload Image'}
            </Button>

            <Button onClick={() => setMainImageIndex(index)} type='button' size='sm' className={mainImageIndex === index ? 'bg-teal-500' : 'bg-slate-400'}>
              {mainImageIndex === index ? 'Main Image' : 'Set Secondary'}
            </Button>
          </div>
        ))}

        <Button type='submit' className="bg-slate-400">Add Studio</Button>
        {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
      </form>
    </div>
  );
}
