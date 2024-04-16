import React from 'react';
import { Link } from 'react-router-dom'; // If using React Router for navigation

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header>
        <h1>Welcome to Universidad Centroamericana Jose Simeon Cañas</h1>
      </header>
      <main>
        <section className="registration-presentation">
          <h2>Register as a new alumnus</h2>
          <p>Join our alumni network and apply to our alma mater.</p>
          <Link to="/register" className="cta-button">
            Register now
          </Link>
        </section>
        <section className="signing-presentation">
          <h2>Sign in as a registered alumnus</h2>
          <p>Check the status of your application to our university.</p>
          <Link to="/login" className="cta-button">
            Sign in
          </Link>
        </section>
      </main>
      <footer>
        <p align='center'>&copy; UCA Jose Simeon Cañas. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
