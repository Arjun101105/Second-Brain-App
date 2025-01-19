import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YouTubeIcon";
import { SidebarItem } from "./SidebarItem";

export const Sidebar = () => {
  return <div className=" box-shadow-md w-1/5 p-4 bg-white fixed top-0 left-0 h-screen border-r-2 border-slate-100">
    <div className="flex">
    <img className="h-8 w-8" src="/brainly-icon.png" alt="second brain logo" />
    <h1 className="text-2xl font-bold">Second Brain</h1>
    </div>
    <div className="pt-24">
      <SidebarItem text="Twitter" icon={<TwitterIcon/>} />
      <SidebarItem text="YouTube" icon={<YoutubeIcon/>} />
    </div>
  </div>;
};