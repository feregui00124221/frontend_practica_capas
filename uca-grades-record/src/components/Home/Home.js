import { useNavigate, Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";

const Home = () => {
    const logout = useLogout();
    const navigate = useNavigate();

    const signout = async () => {
        await logout();
        navigate('/landing');
    }

    return (
        <section>
            <h1>Home</h1>
            <br />
            <p>You are logged in!</p>
            <br />
            <Link to="/admin">Go to the Admin page</Link>
            <br />
            <Link to="/linkpage">Go to the application page</Link>
            <button className="enabled-button" onClick={signout}>Sign Out</button>
        </section>
    )
}

export default Home