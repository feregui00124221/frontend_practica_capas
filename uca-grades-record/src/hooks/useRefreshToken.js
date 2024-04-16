import axios from '../api/axios';
import useAuth from './useAuth';

const REFRESH_ROUTE = 'auth/refresh';

const useRefreshToken = () => {

    const { auth, setAuth } = useAuth();

    const refresh = async () => {

        const response = await axios.get(REFRESH_ROUTE, 
            { headers: { 'authorization': `Bearer ${auth?.accessToken}` }}, 
            { withCredentials: true });

        setAuth(prev => {
            return { ...prev, accessToken: response.data.accessToken }
        });
        
        return response.data.accessToken;
    }

    return refresh;
};

export default useRefreshToken;