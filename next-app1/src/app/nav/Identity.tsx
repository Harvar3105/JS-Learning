"use client"

import { AppContext, IUserInfo } from "@/app/state/AppContext";
import Link from "next/link";
import { UserInfo } from "os";
import { useContext, useEffect } from "react";
import AccountService from "../services/AccountService";

export default function Identity() {

    const {userInfo, setUserInfo} = useContext(AppContext)!;

    useEffect(() => {
        const autoLogin = async () => {
            const storedJwt = localStorage.getItem('jwt');
            const storedRefreshToken = localStorage.getItem('refreshToken');
            if(storedJwt && storedRefreshToken) {
                try {
                    const response = await AccountService.refreshJwt();
                    if(response?.data) {
                        setUserInfo(response.data);
                    }else{
                        localStorage.removeItem('userId');
                        localStorage.removeItem('jwt');
                        localStorage.removeItem('refreshToken');
                    }
                } catch(error: any){
                    console.error('Auto login failed: ', error);
                }
            }
        }
        autoLogin();
    }, [])

    return userInfo ? <LoggedIn/> : <LoggedOut/>;

    
}

const LoggedOut = ( ) => {
    return (<ul className="navbar-nav">
    <li>
        <Link href="/register" className="nav-link uiTextColor">Register</Link>
    </li>
    <li>
        <Link href="/login" className="nav-link uiTextColor">Login</Link>
    </li>
</ul>);
}

const LoggedIn = () => {
    const {userInfo, setUserInfo} = useContext(AppContext)!;


    const doLogout = () => {
        setUserInfo(null);
    }

    return (<ul className="navbar-nav">
        <li>
            <Link href="/" className="nav-link text-white">Hello {userInfo?.userId}</Link>
        </li>
        <li>
            <Link onClick={(e) => doLogout()} href="/" className="nav-link text-white">Logout</Link>
        </li>
    </ul>
);
}



