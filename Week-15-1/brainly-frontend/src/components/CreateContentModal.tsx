import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Buttons";
import { Input } from "./Input";
import axios from "axios";
// import { BACKEND_URL } from "../config";

enum ContentType{
    Youtube = "youtube",
    Twitter = "twitter"
}

export function CreateContentModal({open, onClose}: {open: boolean, onClose: () => void}){

    const titleRef = useRef<HTMLInputElement>()
    const linkRef = useRef<HTMLInputElement>()
    const [type, setType] = useState(ContentType.Youtube)

    async function addContent(){
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;

        await axios.post(`${import.meta.env.VITE_APP_API_URL}`+`/api/v1/content`,{
            link,
            type,
            title
        },{
            headers:{
                "Authorization": localStorage.getItem("token")
            }
        })
        onClose();
        alert("Content Added Successfully")
        window.location.reload()
    }

    return<div>
        {open && <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-md p-4 border-2 border-slate-100 w-1/2 h-1/2">
                <div className="flex justify-end" onClick={onClose}>
                    <CrossIcon/>
                </div>
                <h1 className="text-2xl font-bold">Add Content</h1>
                <div className="flex flex-col space-y-4 mt-16">
                    <Input reference={titleRef} placeholder="Title" />
                    <Input reference={linkRef} placeholder="Link"/>
                    <br />
                </div>
                <h1>Select Type of Content: </h1>
                <div className="flex gap-2">
                <Button size="md" text="Youtube" variant={type === ContentType.Youtube? "primary" : "secondary"} onClick={()=>{
                        setType(ContentType.Youtube)
                    }}></Button>
                    <Button size="md" text="Twitter" variant={type === ContentType.Twitter? "primary" : "secondary"} onClick={()=>{
                        setType(ContentType.Twitter)
                    }}></Button>
                    </div>
                <Button onClick={addContent} variant="primary" size="md" text="Add"/>
            </div>
            </div>}
    </div>

}