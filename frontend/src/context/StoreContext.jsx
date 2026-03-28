import { createContext,useContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [role, setRole] = useState(localStorage.getItem("role") || "");

    
      
    useEffect(() => {
      async function loadData() {
        // await fetchFoodList();
        if (localStorage.getItem("token")) {
          setToken(localStorage.getItem("token"));
          await loadCartData(localStorage.getItem("token"));
        }
      }
      loadData();
    }, []);
    
      
      const [showLogin, setShowLogin] = useState(false);
    

      const login = async (email, password) => {
        try {
            const res = await axios.post(`${url}/login`, { email, password });
            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", res.data.role); // Store role
                setToken(res.data.token);
                setRole(res.data.role);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error("Login Error", error);
        }
    };
    

    const contextValue = {
        showLogin,
        setShowLogin,
        url,
        token,
        setToken,
        login,
      };
    
      return (
        <StoreContext.Provider value={contextValue}>
          {props.children}
        </StoreContext.Provider>
      );
    };
    
export default StoreContextProvider;