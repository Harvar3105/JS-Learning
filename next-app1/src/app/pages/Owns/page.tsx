"use client"

import Link from "next/link";
import { AppContext } from "../../state/AppContext";
import AccountService from "../../services/AccountService";
import { IResultObject } from "@/app/services/IResultObject";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IOwns } from "@/app/services/IOwns";
import OwnsService from "@/app/services/OwnsService";


export default function Owns() {
    const [owns, setOwns] = useState<IOwns[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState("");

    const router = useRouter();

    useEffect(() => {
        async function fetchOwns() {
          let userId: string | null = localStorage.getItem("userId");
            try {
                const result: IResultObject<IOwns[]> = await OwnsService.GetAllOwns();
                if (result.data) {
                    setOwns(result.data);
                } else if (result.errors) {
                    setError("No owns found");
                }
            } catch (err: any) {
                console.error(err);
                setError("Failed to fetch owns.");
            } finally {
                setLoading(false);
            }
        }

        fetchOwns();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div> <div role="alert" className="text-danger">Error: {error}</div>
        <Link href={"http://localhost:3000/pages/Owns/Create"}>Create</Link></div>;
    }


    const handleAvatarClick = (avatar: IOwns) => {
        router.push(`/pages/Owns/Update?id=${avatar.id}`);
    }

    const handleDelete = async (ownsId: string) => {
        if((await OwnsService.Delete(ownsId)).errors === null){
            setValidationError("Cannot delete");
        }else{
            router.push('');
        }
        
    }

    const handleCreate = () => {
        router.push(`/pages/Owns/Create`);
    }

    return (
        <div>
            {owns.length > 0 ? (
                 <table className="table table-striped">
                 <thead>
                     <tr>
                         <th>ID</th>
                         <th>AvatarId</th>
                         <th>ItemId</th>
                         <th>Amount</th>
                         <th></th>
                     </tr>
                 </thead>
                 <tbody>
                     {owns.map((own) => (
                         <tr key={own.id}>
                             <td onClick={() => handleAvatarClick(own)}>
                                {own.id}
                             </td>
                             <td>{own.avatarId}</td>
                             <td>{own.itemId}</td>
                             <td>{own.amount}</td>
                             <td><button onClick={() => handleDelete(own.id!)}>Delete</button></td>
                         </tr>
                     ))}
                 </tbody>
             </table>): (
                <div>No owns found.</div>
            )}
            <button onClick={handleCreate}>Create New</button>
            <div role="alert" className="text-danger">
                    {validationError}
            </div>
        </div>
    );
}