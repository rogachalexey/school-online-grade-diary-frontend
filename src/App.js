import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Welcome from './components/auth/Welcome'
import Login from './components/auth/Login'
import RequireAuth from './components/auth/RequireAuth'
import Chats from './components/Chats'
import Classes from './components/Classes'
import Gradebook from './components/Gradebook'
import Profile from './components/Profile'
import Teacher from './components/Teacher'
import Student from './components/Student'
import Schedule from './components/Schedule'
import Teachers from './components/Teachers'
import ClassMembers from './components/ClassMembers'
import Lesson from './components/Lesson'
import Chat from './components/Chat'
import Manager from './components/Manager'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='login' element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path='/' element={<Layout />}>
            <Route index element={<Welcome />} />
            <Route path='chats' element={<Chats />} />
            <Route path='classes' element={<Classes />} />
            <Route path='gradebook' element={<Gradebook />} />
            <Route path='schedule' element={<Schedule />} />
            <Route path='teachers' element={<Teachers />} />
            <Route path='student/:id' element={<Student />} />
            <Route path='teacher/:id' element={<Teacher />} />
            <Route path='profile' element={<Profile />} />
            <Route path='class/:id' element={<ClassMembers />} />
            <Route path='lesson/:lessonId' element={<Lesson />} />
            <Route path='chat/:chatId' element={<Chat />} />
            <Route path='manager' element={<Manager />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
