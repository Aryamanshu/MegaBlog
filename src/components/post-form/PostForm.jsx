import React, {useCallback} from 'react'
import { useForm } from 'react-hook-form'
import {Button, Input, Select, RTE} from '../index'
import appwriteService from "../../appwrite/config"
import {  useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function PostForm( {post} ) {

     const {register, handleSubmit, watch, setValue, control, getValues} =useForm({
        defaultValues: {
            title: post ?.title || '',
            slug: post ?.slug|| '',
            content: post ?.content || '',
            status: post ?.status || 'active',
  
             
        },
     })

     const navigate = useNavigate()
     const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        if(post) {
           const file =  data.image[0] ? appwriteService.uploadFile(data.image[0]) : null   //agar image h toh kuch kro wrna null kro
        
            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }

        } else {
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

   
   // ye interview me bhi kam ayega  // khi bhi agar user space deta hai toh space ko convert krna h _ me
    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")   // ab replace method k ander aap koi bhi pattern match kr skte hai
                .replace(/\s/g, "-");

        return "";
    }, []);

    
    
    // ye hai interview ques ka answer // ye bhut complex h smjah aye toh thk wrna koi ni
    
    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue])  // [] iske ander jo kuch bhi h vo dependancy array hai

    
    
    
    return (   // ye form bna rhe hai jisme ye fform 2 part me divided hai 
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">   { /* left side form 2/3 part le rha h */}
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            
            { /* right side wala form */}
            <div className="w-1/3 px-2">   { /* right side form 1/3 part le rha h */}
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
