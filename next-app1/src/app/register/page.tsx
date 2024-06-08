"use client"

import { useRouter } from "next/navigation"
import { useState, useContext } from "react";
import { AppContext } from "../state/AppContext";
import AccountService from "../services/AccountService";


export default function Register(){
    const router = useRouter();
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [pwdC, setPwdC] = useState("");

    const [validationError, setValidationError] = useState("");

    const {userInfo, setUserInfo} = useContext(AppContext)!;

    const register = async() => {
        if(nickname.length < 3 || nickname.length > 30){
            setValidationError("Invalid login input length");
            return;
        }
        if(email.length < 5 || email.length > 30){
            setValidationError("Invalid email input length");
            return;
        }
        if(pwd != pwdC){
            setValidationError("The password and confirmation do not match.");
            return;
        }
        if(!(pwd.toLowerCase() !== pwd)){
            setValidationError("Password mush have at least one uppercase character");
            return;
        }
        if(/^[a-zA-Z0-9]+$/.test(pwd)) {
            setValidationError("Password must have at least one symbol");
            return;
        }
        if(!(/\d+/.test(pwd))) {
            setValidationError("Password must have at least one digit");
            return;
        }

        const res = await AccountService.register(nickname, email, pwd);
        if(res.data){
            const { jwt, refreshToken} = res.data;
            localStorage.setItem("jwt", jwt);
            localStorage.setItem("refreshToken", refreshToken);
            setUserInfo(res.data);
            router.push("/");
        }

        if(res.errors && res.errors.length > 0){
            setValidationError("Something went wrong...");
            return;
        }

    }

    return (
        <div  className="container-fluid">
            <main  role="main" className="pb-3">
                
        <h1>Register</h1>

        <div className="row">
            <div className="col-md-4">
                    <h2>Create a new account.</h2>
                    <hr />
                    
                    <div className="form-floating mb-3">
                        <input value={nickname}
                                onChange={(e) => {setNickname(e.target.value); setValidationError("");}}
                        className="form-control"  aria-required="true" placeholder="NickName" type="text" 
                                id="Input_NickName" name="Input.NickName" />
                        <label htmlFor="Input_NickName">Nickname</label>
                    </div>
                    
                    <div className="form-floating mb-3">
                        <input value={email} onChange={(e) => {setEmail(e.target.value); setValidationError("")}}
                         className="form-control" aria-required="true"
                          placeholder="name@example.com" type="email"
                          id="Input_Email" name="Input.Email"/>
                        <label htmlFor="Input_Email">Email</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input className="form-control" value={pwd} onChange={(e) => {
                            setPwd(e.target.value);
                            setValidationError("");
                        }}
                                aria-required="true" placeholder="password" type="password" name="Input.Password" />
                        <label htmlFor="Input_Password">Password</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input className="form-control" value={pwdC}
                        onChange={(e) => {
                            setPwdC(e.target.value);
                            setValidationError("");
                        }}
                            aria-required="true" placeholder="password" type="password"id="Input_ConfirmPassword" name="Input.ConfirmPassword" />
                        <label htmlFor="Input_ConfirmPassword">Confirm password</label>
                    </div>
                    
                    <button onClick={(e) => register()} id="registerSubmit" type="submit" className="w-100 btn btn-lg btn-primary">Register</button>
            </div>
        </div>


            </main>
        </div>

    )
};