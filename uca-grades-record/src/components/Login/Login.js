import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../../api/axios';
const LOGIN_URL = 'auth/login';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com)$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,24}$/;

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || '/';

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [user, password])

  useEffect(() => {
    setIsLoading(false);
  }, [errMsg])

  function settingError(error) {
    setErrMsg(error);
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page from reloading

    setIsLoading(true);

    try {
      const v1 = EMAIL_REGEX.test(user);
      const v2 = PASSWORD_REGEX.test(password);

      if (!v1 || !v2) {
        settingError('Check the format of your email and password')
        return;
      }

      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ email: user, password: password }),
        {
          headers: { 'Content-Type': 'application/json' },

          withCredentials: true
        }
      );

      const accessToken = response?.data?.token;
      localStorage.setItem('token', persist ? accessToken : null);
      const roles = response?.data?.role;
      
      setAuth({ user, password, roles, accessToken });
      setUser('');
      setPassword('');
      navigate(from, { replace: true });

    } catch (err) {
      settingError(err.response.data.message);
      errRef.current.focus();
    }
  }

  const togglePersist = () => {
    setPersist(prev => !prev);
  }

  useEffect(() => {
    localStorage.setItem('persist', persist);
  }, [persist])

  return (
    isLoading
      ?
      (
        <section>

          <section>
            <p>Loading...</p>
          </section>

          <section className={errMsg ? "errmsg" : "offscreen"}>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          </section>

          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Email:</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button
              className={!user || !password ? "disabled-button" : "enabled-button"}>
              Login!
            </button>

            <div className="persistCheck">
              <input
                type="checkbox"
                id="persist"
                onChange={togglePersist}
                checked={persist}
              />
              <label htmlFor="persist">Trust This Device</label>
            </div>
          </form>
          <p>
            New around here? <Link to="/register">Sign up</Link>
          </p>
        </section>
      )
      :
      (
        <section>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Email:</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button
              className={!user || !password ? "disabled-button" : "enabled-button"}>
              Login!
            </button>

            <div className="persistCheck">
              <input
                type="checkbox"
                id="persist"
                onChange={togglePersist}
                checked={persist}
              />
              <label htmlFor="persist">Trust This Device</label>
            </div>
          </form>
          <p>
            New around here? <Link to="/register">Sign up</Link>
          </p>
        </section>
      )
  )
}

export default Login