import { useState } from "react";
import "../App.css";
import { Button } from "../components/Buttons";
import { Card } from "../components/Card";
import { CreateContentModal } from "../components/CreateContentModal";
import { Sidebar } from "../components/Sidebar";
import { PlusIcon } from "../icons/Plusicon";
import { ShareIcon } from "../icons/Shareicon";
import { useContent } from "../hooks/useContent";
import axios from "axios";


const VITE_APP_API_URL = import.meta.env.VITE_APP_API_URL;

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const contents = useContent();
  console.log(contents)


  return (
    <div>
      <Sidebar />
      <div className="p-4 ml-96"> 
        <CreateContentModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
          />
        <div className="flex justify-end gap-4">
          <Button onClick={async () => {
            const response = await axios.post(`${VITE_APP_API_URL}/api/v1/brain/share`, {
                share: true
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
              const shareLink = `${response.data.shareLink}`
              alert(`Share Link: ${shareLink}`)
            }}
            startIcon={<ShareIcon size="md" />}
            size="md"
            variant="secondary"
            text="Share Brain"
          />
          <Button
            onClick={() => {
              setModalOpen(true);
            }}
            startIcon={<PlusIcon size="md" />}
            size="md"
            variant="primary"
            text="Add Content"
          />
        </div>
          <h1 className="text-2xl font-bold">All Notes</h1><br />
        <div className="flex space-x-8 justify-center max-w-7xl">
          <div className="flex justify-between gap-12 flex-wrap">
            {contents.map(({type, link, title})=><Card
            type={type}
            link={link}
            title={title}
            />  
        )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
