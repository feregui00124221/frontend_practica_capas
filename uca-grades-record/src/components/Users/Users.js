import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";

const USERADMIN_ROUTE = 'user/all';
const USER_ROUTE = 'user/';

const Users = () => {
    const { auth } = useAuth();
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get((auth.roles === "admin" ? USER_ROUTE : USERADMIN_ROUTE), {
                    signal: controller.signal,
                });

                isMounted && setUsers(response.data.users);

            } catch (err) {
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            isMounted && controller.abort()
        }
    }, [])

    return (
        <>
            {users?.length
                ? (
                    <>
                        {users.map((user, i) => 
                            <section className='section-user' key={i}>
                                <Link to={`/user/${user.id}`}>
                                    <p/>{user.name}
                                    <p/>{user.email}
                                    <p/>{user.role}
                                </Link>
                            </section>
                        )}
                    </>
                ) : <p>No users to display</p>
            }
        </>
    );
};

export default Users;