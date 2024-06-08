"use client"
import AvatarService from "@/app/services/AvatarService";
import { IAvatar } from "@/app/services/IAvatar";
import { IItem } from "@/app/services/IItem";
import ItemService from "@/app/services/ItemService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Update() {
    const router = useRouter();

    const [file, setFile] = useState<File | undefined>();
    const [image64, setImage64] = useState<string>();
    const query = new URLSearchParams(window.location.search);

    const handleSubmit = async () => {
       
        if (file) {
            
            let id: string | null = query.get('id');
            await convertToBase64(file);

            if (id && image64){
                const item: IItem = (await ItemService.GetById(id)).data!;
                let img: string = image64;
                item.image = img.replace("data:image/png;base64,", "");
                const response = await ItemService.Update(item);
                if(!response.errors){
                    router.push('/pages/Items/')
                }
            }
            
        }
    };

    const convertToBase64 = async (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if(reader.result) {
                setImage64(reader.result as string);
            }
        }
    }

    function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
        const target = e.target as HTMLInputElement & {
            files: FileList;
        }
        setFile(target.files[0]);
    }



    return (
        <div className="mb-1">
            <div className="mb-3">
                <label htmlFor="formFile" className="form-label">Upload your image</label>
                <input className="form-control" accept="image/png, image/jpg/ image/jpeg" onChange={handleOnChange} type="file" id="formFile"></input>
            </div>

            
            <button onClick={handleSubmit}>Upload</button>
            
        </div>

    
    );
}