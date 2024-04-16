// UserDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';

const UserDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [changeRole, setChangeRole] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {

    axios.get(`user/id/${id}`,
      { headers: { 'authorization': `Bearer ${auth?.accessToken}` } },
      { withCredentials: true })

      .then(response => {
        setUser(response.data.user[0]);
        setRole(response.data.user[0].role);
      })
      .catch(error => {
        alert(error.response.data.message);

        if (error.response.status === 401) {
          navigate('/login', { state: { from: location }, replace: true });
        }
      });
  }, [id]);

  useEffect(() => {
    if (changeRole) {
      const newUser = { ...user };

      newUser.role = role;

      setUser(newUser);
    }
  }, [changeRole]);

  return (
    <section>
      <p className={changeRole ? "successmsg" : "offscreen"}>User role changed succesfully!</p>
      <h2>User Details</h2>
      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <section><h3>Details:</h3>
            <p /><b>Email:</b> {user.email}
            <p /><b>Address</b> {user.address ? user.address : 'No address registered'}
            <p /><b>Pay capacity:</b> {user.pay ? '$ ' + user.pay + '/ month' : 'No pay registered'}
            <p /><b>Phone:</b> {user.phone ? '+503 ' + user.phone : 'No phone registered'}
            <p /><b>Program:</b>{user.program ? user.program : 'No program registered'}
            <p /><b>Scholarship elegibility:</b>{user.scholarship ? 'Asked for a scholarship' : 'Is either not interested in a scholarship or has not registerd'}

            {
              (auth.roles === "sysadmin")
                ?
                (
                  <form onSubmit={(e) => {

                    e.preventDefault();

                    try {

                      axios.patch(`user/role/${id}`,
                        { role: role },
                        {
                          headers: {
                            'authorization': `Bearer ${auth?.accessToken}`,
                          }
                        },
                        { withCredentials: true })

                        .then(response => {
                          setChangeRole(true);
                        })

                        .catch(e => {
                          console.error(e);
                        })

                    } catch (error) {
                      console.error(error.response.message);
                    }

                  }}
                  >
                    <p /><b>Change user role:</b>
                    <select
                      placeholder='Change user role'
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      Select a program
                      <option value="user">Usuario normal</option>
                      <option value="admin">Usuario administrativo</option>
                    </select>

                    <button className='enabled-button'>Change</button>

                  </form>
                )
                :
                (<></>)
            }

            <Link to="/admin">Back to Admin</Link>

          </section>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
};

export default UserDetails;
