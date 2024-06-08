"use client"

import Link from "next/link";
import AvatarService from "@/app/services/AvatarService";
import { IResultObject } from "@/app/services/IResultObject";
import { IAvatar } from "@/app/services/IAvatar";
import { useEffect, useState } from "react";
import Image from 'next/image'
import blankpfp from './/blankpfp.png';
import { useRouter } from 'next/navigation';


export default function Avatar() {
    const [avatars, setAvatars] = useState<IAvatar[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState("");

    const router = useRouter();

    useEffect(() => {
        async function fetchAvatars() {
            let userId: string | null = localStorage.getItem("userId");
            try {
                const result: IResultObject<IAvatar[]> = await AvatarService.GetAll();
                if (result.data) {
                    setAvatars(result.data);
                } else if (result.errors) {
                    setError("No avatars found");
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
        <Link href={"http://localhost:3000/pages/Avatar/Create"}>Create</Link></div>;
    }


    const handleAvatarClick = (avatar: IAvatar) => {
        router.push(`/pages/Avatar/Update?id=${avatar.id}`);
    }

    const handleDelete = async (avatarId: string) => {
        if((await AvatarService.Delete(avatarId)).errors === null){
            setValidationError("Cannot delete");
        }else{
            router.push('');
        }
        
    }

    const handleCreate = () => {
        router.push(`/pages/Avatar/Create`);
    }

    return (
        <div>
            {avatars.length > 0 ? (
                 <table className="table table-striped">
                 <thead>
                     <tr>
                         <th>Picture</th>
                         <th>ID</th>
                         <th>Health</th>
                         <th>Stamina</th>
                         <th>Hunger</th>
                         <th>Stress</th>
                         <th>Strength</th>
                         <th>Dexterity</th>
                         <th>Intelligence</th>
                         <th>Money</th>
                         <th>Sex</th>
                         <th>Level</th>
                         <th>Experience</th>
                         <th></th>
                     </tr>
                 </thead>
                 <tbody>
                     {avatars.map((avatar) => (
                         <tr key={avatar.id}>
                             <td>
                                {avatar.image ? (
                                     <img
                                        key={avatar.id}
                                        onClick={() => handleAvatarClick(avatar)}
                                        src={`data:image/png;base64,${avatar.image}`}
                                        alt="avatar"
                                        className="avatar-image"
                                 />
                                ) : (
                                    <Image onClick={() => handleAvatarClick(avatar)} src={blankpfp} alt="blank pfp" className="avatar-image" />
                                )}
                             </td>
                             <td>{avatar.id}</td>
                             <td>{avatar.health}</td>
                             <td>{avatar.stamina}</td>
                             <td>{avatar.hunger}</td>
                             <td>{avatar.stress}</td>
                             <td>{avatar.strength}</td>
                             <td>{avatar.dexterity}</td>
                             <td>{avatar.intelligence}</td>
                             <td>{avatar.money}</td>
                             <td>{avatar.sex == 0 ? <p>Male</p>: <p>Female</p>}</td>
                             <td>{avatar.level}</td>
                             <td>{avatar.exp}</td>
                             <td><button onClick={() => handleDelete(avatar.id)}>Delete</button></td>
                         </tr>
                     ))}
                 </tbody>
             </table>): (
                <div>No avatars found.</div>
            )}
            <button onClick={handleCreate}>Create New</button>
            <div role="alert" className="text-danger">
                    {validationError}
            </div>
        </div>
    );
}