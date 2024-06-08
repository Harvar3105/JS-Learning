"use client"

import { useEffect, useState } from "react";
import Avatar from "../page";
import AvatarService from "@/app/services/AvatarService";
import { useRouter } from "next/navigation";
import { Libre_Baskerville } from "next/font/google";
import { IOwns } from "@/app/services/IOwns";
import Owns from "../page";
import OwnsService from "@/app/services/OwnsService";
import ItemService from "@/app/services/ItemService";
import { IItem } from "@/app/services/IItem";
import { IAvatar } from "@/app/services/IAvatar";

export default function Create() {
    const [amount, setAmount] = useState<number>(0);
    const [items, setItems] = useState<IItem[]>([]);
    const [avatars, setAvatars] = useState<IAvatar[]>([]);
    const [error, setError] = useState("");

    const [selectedAvatarId, setSelectedAvatarId] = useState<string | undefined>();
    const [selectedItemId, setSelectedItemId] = useState<string | undefined>();

    const [loading, setLoading] = useState(true);

    const router = useRouter();


    useEffect(() => {
        const fetchData = async() => {
            try {
                setLoading(true);
                const itemsResponse = await ItemService.GetAll();
                const avatarsResponse = await AvatarService.GetAll();
                setItems(itemsResponse.data!);
                setAvatars(avatarsResponse.data!);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }


    const Create = async() => {
        if(selectedAvatarId && selectedItemId){

            const owns: IOwns = {
                id: "",
                itemId: selectedItemId,
                avatarId: selectedAvatarId,
                amount: amount,
                isEquiped: false,
            }
            if((await OwnsService.Create(owns))){
                router.push('http://localhost:3000/pages/Owns');
            }else{
                setError("Error creating");
            }
        }
    }

    return (
        <div className="mb-3">
            
            
                <div className="form-floating mb-3">
                    <input value={amount} type="number"
                    onChange={(e) => {setAmount(Number.parseInt(e.target.value));}}
                    className="form-control"/>
                    <label className="form-label">How many items avatar will have</label>
                </div>


                <select 
                className="form-select" 
                aria-label="Default select example" 
                onChange={(e) => setSelectedAvatarId(e.target.value)}>
                <option selected disabled>Choose avatar</option>
                {avatars.map(avatar => (
                    <option key={avatar.id} value={avatar.id}>
                        {avatar.id}, {avatar.level} lvl
                    </option>
                ))}
            </select>

                <br></br>
                <select 
                className="form-select" 
                aria-label="Default select example" 
                onChange={(e) => setSelectedItemId(e.target.value)}>
                <option selected disabled>Choose item</option>
                {items.map(item => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
                </select>


            <button onClick={Create}>Create</button>

            <div role="alert" className="text-danger">
                    {error}
            </div>

            <div>
                Selected Avatar ID: {selectedAvatarId}
            </div>
            <div>
                Selected Item ID: {selectedItemId}
            </div>
        </div>
    );
}