"use client"

import { useState } from "react";
import Avatar from "../page";
import AvatarService from "@/app/services/AvatarService";
import { useRouter } from "next/navigation";
import { Libre_Baskerville } from "next/font/google";
import { IItem } from "@/app/services/IItem";
import ItemService from "@/app/services/ItemService";

export default function Create() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [rarity, setRarity] = useState("0");
    const [price, setPrice] = useState("10");
    const [file, setFile] = useState<File | undefined>();
    const [image64, setImage64] = useState<string>("");
    const [error, setError] = useState("");

    const router = useRouter();

    const convertToBase64 = async(file: File) => {
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
    }

    const Create = async() => {
        if(file)
        {
            await convertToBase64(file);

            let image: string = image64;
            image = image.replace("data:image/png;base64,", "");
            const item: IItem = {
            id: "",
            name: name,
            image: image,
            itemRarity: rarity,
            description: description,
            price: price,
            };
            if((await ItemService.Create(item))){
                router.push('http://localhost:3000/pages/Items');
            }else{
                setError("Error creating");
            }
        }
            

        

        
        
        
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRarity(e.target.value)
    }

    return (
        <div className="mb-3">
            
                <div className="form-floating mb-3">
                    <input value={name}
                    onChange={(e) => {setName(e.target.value)}}
                    className="form-control"/>
                    <label className="form-label">Name</label>
                </div>
                <div className="form-floating mb-3">
                    <input 
                    value={description}
                    onChange={(e) => {setDescription(e.target.value)}}
                    className="form-control"/>
                    <label className="form-label">Description</label>
                </div>
                <div className="form-floating mb-3">
                    <input 
                    value={price}
                    onChange={(e) => {setPrice(e.target.value)}}
                    className="form-control"/>
                    <label className="form-label">Price</label>
                </div>

            <label>Choose item rarity</label>
            <select className="form-select" value={rarity} onChange={handleSelectChange} aria-label="Default select example">
                <option defaultValue={"0"} value="0">Common</option>
                <option value="1">Rare</option>
                <option value="2">Mythical</option>
                <option value="3">Legendary</option>
            </select>


            <label htmlFor="formFile" className="form-label">Upload item image</label>
            <input className="form-control" accept="image/png, image/jpg/ image/jpeg" onChange={handleOnChange} type="file" id="formFile"></input>

            <button onClick={Create}>Upload</button>

            <div role="alert" className="text-danger">
                    {error}
            </div>
        </div>
    );
}