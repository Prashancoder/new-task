import { Routes, Route } from 'react-router-dom'
import { TaskProvider } from './context/TaskContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AddTask from './pages/AddTask'
import EditTask from './pages/EditTask'

function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddTask />} />
            <Route path="/edit/:id" element={<EditTask />} />
          </Routes>
        </main>
      </div>
    </TaskProvider>
  )
}

export default App 