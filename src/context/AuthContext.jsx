import {
createContext,
useContext,
useState
}
from "react";


const AuthContext =
createContext();



export const AuthProvider=({children})=>{


const [guard,setGuard]
=
useState(
JSON.parse(
localStorage.getItem("guard")
)
|| null
);



const [token,setToken]
=
useState(
localStorage.getItem("token")
);



const login=(data)=>{


localStorage.setItem(
"token",
data.token
);


localStorage.setItem(
"guard",
JSON.stringify(data.guard)
);


setToken(data.token);

setGuard(data.guard);


};



const logout=()=>{


localStorage.removeItem("token");

localStorage.removeItem("guard");


setToken(null);

setGuard(null);


};



return (

<AuthContext.Provider
value={{
guard,
token,
login,
logout,
isAuthenticated:
!!token
}}
>

{children}

</AuthContext.Provider>

)

};



export const useAuth=()=>{

return useContext(AuthContext);

};