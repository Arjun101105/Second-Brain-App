import { ReactElement } from "react";

export const SidebarItem = ({text,icon}:{
    text: string;
    icon: ReactElement})=>{
        return <div className="flex">
            <div className="p-2"> {icon}</div>
            <div className="p-2 text-xl bold font-medium"> {text}</div>
        </div>
}