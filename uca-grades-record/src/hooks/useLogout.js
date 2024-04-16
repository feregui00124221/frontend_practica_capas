import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { auth, setAuth } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            await axios('auth/logout', {
                headers: { Authorization: `Bearer ${auth.accessToken}` }
             },
            {withCredentials: false});
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout