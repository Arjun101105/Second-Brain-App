import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const useContent = () => {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetchContents = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/v1/content`, { 
            headers: {
              "Authorization": localStorage.getItem("token")
            },
          });
          console.log("Fetched contents:", response.data);
          setContents(response.data);
        } catch (error) {
          console.error("Error fetching contents:", error);
        }
      };
      

    fetchContents();
  }, []);

  return contents;
};
