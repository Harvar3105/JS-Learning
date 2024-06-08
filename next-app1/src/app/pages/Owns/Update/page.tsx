"use client"
import { IOwns } from "@/app/services/IOwns";
import OwnsService from "@/app/services/OwnsService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Update() {
    const router = useRouter();
    const [amount, setAmount] = useState(0);

    const query = new URLSearchParams(window.location.search);

    const handleSubmit = async () => {
       
        
            
            let id: string | null = query.get('id');

                const owns: IOwns = (await OwnsService.GetById(id!)).data!;
                owns.amount = amount;
                const response = await OwnsService.Update(owns);
                if(!response.errors){
                    router.push('/pages/Owns/')
                }
            
            
        
    };


    return (
        <div className="mb-1">
            <div className="form-floating mb-3">
                    <input value={amount}
                    id="email"
                    onChange={(e) => {setAmount(Number.parseInt(e.target.value));}}
                    className="form-control"/>
                    <label htmlFor="email" className="form-label">Amount</label>
                </div>

            
            <button onClick={handleSubmit}>Update</button>
            
        </div>

    
    );
}