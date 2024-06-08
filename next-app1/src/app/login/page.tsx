"use client"
import { useContext, useState } from "react";
import { AppContext } from "../state/AppContext";
import AccountService from "../services/AccountService";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("admin@eesti.ee");
    const [pwd, setPwd] = useState("Kala.maja1");

    const [validationError, setValidationError] = useState("");

    const {userInfo, setUserInfo} = useContext(AppContext)!;


    const validateAndLogin = async () => {
        if(email.length < 5 || pwd.length < 6){
            setValidationError("Invalid input lengths");
            return;
        }

        const response = await AccountService.login(email, pwd);
        if (response.data) {
            setUserInfo(response.data);
            router.push("/");
        }
        if (response.errors && response.errors.length > 0) {
            setValidationError(response.errors[0]);
        }
    }

    return (
        <div className="row">
            <div className="col-md-5">
                <h2>Log in</h2>
                <hr/>
                <div role="alert" className="text-danger">
                    {validationError}
                </div>
                <div className="form-floating mb-3">
                    <input value={email}
                    id="email"
                    onChange={(e) => {setEmail(e.target.value); setValidationError("")}}
                    type="email" className="form-control" autoComplete="email" placeholder="name@example.com"/>
                    <label htmlFor="email" className="form-label">Email</label>
                </div>
                <div className="form-floating mb-3">
                    <input 
                    value={pwd}
                    onChange={(e) => {setPwd(e.target.value); setValidationError("")}}
                    id="password" type="password" className="form-control" autoComplete="password" placeholder="password"/>
                    <label htmlFor="password" className="form-label">Password</label>
                </div>
                <div>
                    <button onClick={(e) => validateAndLogin()} className="w-100 btn btn-lg btn-primary">Log in</button>
                </div>
                <pre>
                    {JSON.stringify(userInfo, null, 4)}
                </pre>
            </div>

            

        </div>



    );
  }