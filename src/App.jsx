import { BrowserRouter, Routes, Route } from "react-router-dom"

import Sidebar from "./components/Sidebar"

import Home from "./pages/Home"
import Mood from "./pages/Mood"
import Habits from "./pages/Habits"
import Journal from "./pages/Journal"
import AIChat from "./pages/AIChat"
import Profile from "./pages/Profile"

function App() {
  return (
    <BrowserRouter>

      <div className="flex bg-[#0B1120] min-h-screen">

        {/* Sidebar */}

        <Sidebar />

        {/* Main Content */}

        <div className="ml-[260px] w-full p-8">

          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/mood" element={<Mood />} />

            <Route path="/habits" element={<Habits />} />

            <Route path="/journal" element={<Journal />} />

            <Route path="/chat" element={<AIChat />} />

            <Route path="/profile" element={<Profile />} />

          </Routes>

        </div>

      </div>

    </BrowserRouter>
  )
}

export default App