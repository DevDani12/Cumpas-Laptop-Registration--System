import {
BrowserRouter,
Routes,
Route
}
from "react-router-dom";


import Login from "./pages/Login";

import VerifyQR from "./pages/VerifyQR";

import Dashboard from "./pages/Dashboard";

import Register from "./pages/Register";

import Verify from "./pages/Verify";

import History from "./pages/History";

import AuditLog from "./pages/AuditLog";

import AiChat from "./pages/AiChat";

import ProtectedRoute from "./routes/ProtectedRoute";

import DashboardLayout from "./layouts/DashboardLayout";



function App(){


return (

<BrowserRouter>


<Routes>


<Route
path="/login"
element={<Login/>}
/>

<Route
path="/verify-qr/:id"
element={<VerifyQR/>}
/>


<Route
path="/"
element={

<ProtectedRoute>

<DashboardLayout>

<Dashboard/>

</DashboardLayout>

</ProtectedRoute>

}

/>



<Route
path="/register"
element={

<ProtectedRoute>

<DashboardLayout>

<Register/>

</DashboardLayout>

</ProtectedRoute>

}
/>


<Route
path="/verify"
element={

<ProtectedRoute>

<DashboardLayout>

<Verify/>

</DashboardLayout>

</ProtectedRoute>

}
/>


<Route
path="/history"
element={

<ProtectedRoute>

<DashboardLayout>

<History/>

</DashboardLayout>

</ProtectedRoute>

}
/>

<Route
path="/audit"
element={

<ProtectedRoute>

<DashboardLayout>

<AuditLog/>

</DashboardLayout>

</ProtectedRoute>

}
/>

<Route
path="/ai"
element={

<ProtectedRoute>

<DashboardLayout>

<AiChat/>

</DashboardLayout>

</ProtectedRoute>

}
/>


</Routes>


</BrowserRouter>

)

}



export default App;