"use client"

import { useState } from "react";
import { AppContext, IUserContext, IUserInfo } from "../state/AppContext";

export default function AppState({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    
    const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

    return (
        <AppContext.Provider value= {{userInfo, setUserInfo}}>
        {children}
        </AppContext.Provider>
    );
}