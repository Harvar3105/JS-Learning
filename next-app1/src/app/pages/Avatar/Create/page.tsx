"use client"

import { useState } from "react";
import Avatar from "../page";
import AvatarService from "@/app/services/AvatarService";
import { useRouter } from "next/navigation";
import { Libre_Baskerville } from "next/font/google";

export default function Create() {
    const [sex, setSex] = useState("0");
    const [file, setFile] = useState<File | undefined>();
    const [image64, setImage64] = useState<string>("");
    const [error, setError] = useState("");

    const router = useRouter();

    const convertToBase64 = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if(reader.result) {
                setImage64(reader.result as string);
            }
        }
    }

    async function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
        const target = e.target as HTMLInputElement & {
            files: FileList;
        }
        setFile(target.files[0]);
        if(file){
            convertToBase64(file);
        }
    }

    const Create = async() => {
        if(image64){
            if(((await AvatarService.Create(sex, image64)).data)){
                router.push('http://localhost:3000/pages/Avatar');
            }else{
                setError("Error creating");
            }
        }
        
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSex(e.target.value)
    }

    return (
        <div className="mb-3">
            
            <label>Choose your sex</label>
            <select className="form-select" value={sex} onChange={handleSelectChange} aria-label="Default select example">
                <option defaultValue={"Male"} value="Male">Male</option>
                <option value="Female">Female</option>
            </select>

            <label htmlFor="formFile" className="form-label">Upload your avatar image</label>
            <input className="form-control" accept="image/png, image/jpg/ image/jpeg" onChange={handleOnChange} type="file" id="formFile"></input>

            <button onClick={Create}>Upload</button>

            <div role="alert" className="text-danger">
                    {error}
            </div>
        </div>
    );
}