import Layout from './components/Layout/Layout';
import LandingPage from './components/Landing/LandingPage';
import RegisterPage from './components/Register/Register';
import LoginPage from './components/Login/Login';
import Missing from './components/Missing/Missing';
import Unauthorized from './components/Unauthorized/Unauthorized';
import Home from './components/Home/Home';
import Admin from './components/Admin/Admin';
import LinkPage from './components/Link_page/Link_page';
import PersistLogin from './components/PersistLogin/PersistLogin';
import UserDetails from './components/Users/UserDetails/UserDetails';

import RequireAuth from './components/RequireAuth/RequireAuth';
import { Routes, Route } from 'react-router-dom';

const ROLES = {
  'User': 'user',
  'Editor': 'admin',
  'Admin': 'sysadmin'
}

function App() {
  return (
    <Routes>

      <Route path="/" element={<Layout />}>

        {/* public routes */}
        <Route path="landing" element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="linkpage" element={<LinkPage />} />

        <Route element={<PersistLogin />}>
          {/* we want to protect these routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]} />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Editor]} />}>
            <Route path="admin" element={<Admin />} />
            <Route path="user/:id" element={<UserDetails/>} />
          </Route>

          <Route path="*" element={<Missing />} />

        </Route>

      </Route>
    </Routes>
  );
}

export default App;