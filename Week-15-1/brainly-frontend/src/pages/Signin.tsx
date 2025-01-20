import { useRef } from "react";
import { Button } from "../components/Buttons";
import { Input } from "../components/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export function Signin(){
    const usernameRef = useRef<any>()
    const passwordRef = useRef<any>()
    const navigate = useNavigate()

    async function signin(){
        const username = usernameRef.current?.value
        const password = passwordRef.current?.value
        try{
            const response = await axios.post(`/api/v1/signin`,{username,password})
            const jwt = response.data.token;
            localStorage.setItem("token", jwt)
            navigate("/dashboard")
        }catch(e){
            alert("Invalid Credentials");
            console.log(e)
        }
    }

    return <div className="h-screen w-screen flex justify-center items-center">
        <div className="flex-row ">
        <h1 className="text-2xl font-bold ">Login</h1> <br />
        <div className="bg-white rounded-xl border p-8">
            <Input reference={usernameRef} placeholder="Username"/>
            <Input reference={passwordRef} placeholder="Password" type="password"/>
            <div className="flex justify-center pt-4">
            <Button onClick={signin} text="Sign-In" variant="primary" size="md" />
            </div>
        </div>
        </div>
    </div>
}