import { Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-800 to-gray-900 flex items-center justify-center realtive overflow-hidden">
      <FloatingShape color="bg-red-500" size="w-96 h-96" top="-5%" left="10%" delay={0} />
      <FloatingShape color = "bg-red-500" size="w-48 h-48" top="70% " left="80%" delay={5}/>
      <FloatingShape color = "bg-rose-500" size="w-32 h-32" top="40% " left="-10%" delay={2}/>
    

    <Routes>
      <Route path='/' element={"Home"}/>
      <Route path='/signup' element={<SignUpPage />}/>
      <Route path='/' element={<LoginPage />}/>
    </Routes>
    </div>
  )
}
export default App;

