import { Link } from 'react-router-dom';

const Missing = () => {
    return (
        <div>
            <h1>Route Not Found</h1>
            <p>The requested page does not exist.</p>
            <div className="missing">
                <Link to="/">Visit our homepage</Link>
            </div>
        </div>
    );
}

export default Missing;
