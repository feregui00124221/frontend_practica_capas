import { useRef, useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';

const REGISTRO_URL = 'auth/register';

const NAME_REGEX = /^[A-Za-z\s'-]{3,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com)$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,24}$/;

const Register = () => {

    const userRef = useRef(null);
    const errRef = useRef(null);

    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatchPassword, setValidMatchPassword] = useState(false);
    const [matchPasswordFocus, setMatchPasswordFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(NAME_REGEX.test(name));
    }, [name])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
        setValidMatchPassword(password === matchPassword);
    }, [password, matchPassword])

    useEffect(() => {
        setErrMsg('');
    }, [name, email, password, matchPassword])

    function settingError(error) {
        setErrMsg(error);
        alert(error);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v0 = NAME_REGEX.test(name);
        const v1 = EMAIL_REGEX.test(email);
        const v2 = PASSWORD_REGEX.test(password);

        if (!v0 || !v1 || !v2) {
            settingError('Invalid input. Please check your data and try again.');
            return;
        }

        try {
            await axios.post(REGISTRO_URL,
                JSON.stringify({ email: email, name: name, password: password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            setSuccess(true);

            setName('');
            setEmail('');
            setPassword('');
            setMatchPassword('');

        } catch (err) {
            if (!err?.response) {
                settingError('Server error. Wait a few minutes and try again.');
            } else if (err.response?.status === 409) {
                settingError('Email already registered.');
            } else {
                settingError('Registration failed.')
            }

            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <Link to="/login">Now you can sign in!</Link>
                    </p>
                </section>
            ) : (
                <section className='register-section'>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>

                        <label htmlFor="email">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                            className={email ? (!validEmail ? "invalid" : "valid") : "empty"}
                        />
                        <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            This is the designated field for your email address.<br />
                            Must be a valid email address (only authorized domains: Gmail and Outlook).<br />
                            Otherwise, you will not be able to register.
                        </p>

                        <label htmlFor="name">
                            Name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setNameFocus(true)}
                            onBlur={() => setNameFocus(false)}
                            className={name ? (!validName ? "invalid" : "valid") : "empty"}
                        />
                        <p id="uidnote" className={nameFocus ? "instructions" : "offscreen"}>
                            This is the designated field for your name.
                        </p>

                        <label htmlFor="password">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPassword ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                            className={password ? (!validPassword ? "invalid" : "valid") : "empty"}
                        />
                        <p id="pwdnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                            This is the designated field for your password.<br />
                            Must be 8-24 characters long.<br />
                            Must contain at least one uppercase letter, one lowercase letter, one number, and one special character (ASCII only).<br />
                        </p>


                        <label htmlFor="confirm_password">
                            Confirm password:
                        </label>
                        <input
                            type="password"
                            id="confirm_password"
                            onChange={(e) => setMatchPassword(e.target.value)}
                            value={matchPassword}
                            required
                            aria-invalid={validMatchPassword ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchPasswordFocus(true)}
                            onBlur={() => setMatchPasswordFocus(false)}
                            className={matchPassword ? (!validMatchPassword ? "invalid" : "valid") : "empty"}
                        />
                        <p id="confirmnote" className={matchPasswordFocus && !validMatchPassword ? "instructions" : "offscreen"}>
                            Must match the password input field.
                        </p>

                        <button
                            className={!validName || !validEmail || !validPassword || !validMatchPassword ? "disabled-button" : "enabled-button"}
                            disabled={!validName || !validEmail || !validPassword || !validMatchPassword ? true : false}>
                            Sign up!
                        </button>
                    </form>
                    <p>
                        Already registered? <Link to="/login">Sign In</Link>
                    </p>
                </section>
            )
            }
        </>
    );
}

export default Register;