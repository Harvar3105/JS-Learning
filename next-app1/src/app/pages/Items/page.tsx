"use client"

import Link from "next/link";
import { AppContext } from "../../state/AppContext";
import AccountService from "../../services/AccountService";
import AvatarService from "@/app/services/AvatarService";
import { IResultObject } from "@/app/services/IResultObject";
import { IAvatar } from "@/app/services/IAvatar";
import { useEffect, useState } from "react";
import Image from 'next/image'
import blankpfp from './/blankpfp.png';
import { useRouter } from 'next/navigation';
import { IItem } from "@/app/services/IItem";
import ItemService from "@/app/services/ItemService";


export default function Items() {
    const [items, setItems] = useState<IItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState("");

    const router = useRouter();

    useEffect(() => {
        async function fetchAvatars() {
          let userId: string | null = localStorage.getItem("userId");
            try {
                const result: IResultObject<IItem[]> = await ItemService.GetAll();
                if (result.data) {
                    setItems(result.data);
                } else if (result.errors) {
                    setError("No items found");
                }
            } catch (err: any) {
                console.error(err);
                setError("Failed to fetch avatars.");
            } finally {
                setLoading(false);
            }
        }

        fetchAvatars();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div> <div role="alert" className="text-danger">Error: {error}</div>
        <Link href={"http://localhost:3000/pages/Items/Create"}>Create</Link></div>;
    }


    const handleItemClick = (item: IItem) => {
        router.push(`/pages/Items/Update?id=${item.id}`);
    }

    const handleDelete = async (itemId: string) => {
        if((await ItemService.Delete(itemId)).errors === null){
            setValidationError("Cannot delete");
        }else{
            location.reload();
        }
        
    }

    const handleCreate = () => {
        router.push(`/pages/Items/Create`);
    }

    return (
        <div>
            {items.length > 0 ? (
                 <table className="table table-striped">
                 <thead>
                     <tr>
                         <th>Picture</th>
                         <th>ID</th>
                         <th>Name</th>
                         <th>Description</th>
                         <th></th>
                     </tr>
                 </thead>
                 <tbody>
                     {items.map((item) => (
                         <tr key={item.id}>
                             <td>
                                {item.image ? (
                                     <img
                                        key={item.id}
                                        onClick={() => handleItemClick(item)}
                                        src={`data:image/png;base64,${item.image}`}
                                        alt="item"
                                        className="avatar-image"
                                 />
                                ) : (
                                    <Image onClick={() => handleItemClick(item)} src={blankpfp} alt="blank item" className="avatar-image" />
                                )}
                             </td>
                             <td>{item.id}</td>
                             <td>{item.name}</td>
                             <td>{item.description}</td>
                             <td><button onClick={() => handleDelete(item.id)}>Delete</button></td>
                         </tr>
                     ))}
                 </tbody>
             </table>): (
                <div>No items found.</div>
            )}
            <button onClick={handleCreate}>Create New</button>
            <div role="alert" className="text-danger">
                    {validationError}
            </div>
        </div>
    );
}