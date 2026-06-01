import { Routes, Route } from 'react-router-dom'
import Top from './pages/Top'
import Diagnosis from './pages/Diagnosis'
import Result from './pages/Result'
import Dragon from './pages/Dragon'
import Message from './pages/Message'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Top />} />
      <Route path="/diagnosis" element={<Diagnosis />} />
      <Route path="/result" element={<Result />} />
      <Route path="/dragon" element={<Dragon />} />
      <Route path="/message" element={<Message />} />
    </Routes>
  )
}

export default App
