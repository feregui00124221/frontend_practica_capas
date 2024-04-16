import axios from '../../api/axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const WHOAMI_URL = 'user/whoami';
const PROFILE_URL = 'user/';

const NAME_REGEX = /^[A-Za-z\s'-]{3,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com)$/;
const ADDRESS_REGEX = /^[A-Za-z ]{1,25}$/;
const PHONE_REGEX = /^\d{8}$/;
const PAY_REGEX = /^[0-9]*\.?[0-9]+$/;
const PROGRAMS_REGEX = [
    { name: 'Ingenieria' },
    { name: 'Ciencias Sociales' },
    { name: 'Ciencias Juridicas' },
    { name: 'Ciencias Economicas' }
];

const LinkPage = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { auth } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    const [isEditable, setIsEditable] = useState(false);

    const userRef = useRef(null);
    const errRef = useRef(null);

    const [user, setUser] = useState({});

    const [name, setName] = useState(user.name || '');
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [email, setEmail] = useState(auth.user);
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [program, setProgram] = useState(user.program || '');
    const [validProgram, setValidProgram] = useState(false);
    const [programFocus, setProgramFocus] = useState(false);

    const [pay, setPay] = useState(user.pay || '');
    const [validPay, setValidPay] = useState(false);
    const [payFocus, setPayFocus] = useState(false);

    const [address, setAddress] = useState(user.address || '');
    const [validAddress, setValidAddress] = useState(false);
    const [addressFocus, setAddressFocus] = useState(false);

    const [phone, setPhone] = useState(user.phone || '');
    const [validPhone, setValidPhone] = useState(false);
    const [phoneFocus, setPhoneFocus] = useState(false);

    const [beca, setBeca] = useState(user.scholarship || false);
    const [validBeca, setValidBeca] = useState(false);
    const [becaFocus, setBecaFocus] = useState(false);

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
        setValidProgram(PROGRAMS_REGEX.some(obj => obj.name === program));
    }, [program])

    useEffect(() => {
        setValidPay((PAY_REGEX.test(pay) && pay >= 25));
    }, [pay])

    useEffect(() => {
        setValidAddress(ADDRESS_REGEX.test(address));
    }, [address])

    useEffect(() => {
        setValidPhone(PHONE_REGEX.test(phone));
    }, [phone])

    useEffect(() => {

        axios.get(WHOAMI_URL,
            { headers: { 'authorization': `Bearer ${auth?.accessToken}` } },
            { withCredentials: true })

            .then(response => {

                setUser(response.data.user[0] || {});
                setName(response.data.user[0].name || '');
                setEmail(response.data.user[0].email || '');
                setProgram(response.data.user[0].program || '');
                setPay(response.data.user[0].pay || '');
                setPhone(response.data.user[0].phone || '');
                setBeca(response.data.user[0].scholarship || false);
                setAddress(response.data.user[0].address || '');
                setSuccess(true);
                setIsEditable(true);
            })
            .then(() => setIsLoading(false))
            .then(() => setIsEditable(false))
            .catch(error => {
                alert(error.response.data.message);
                settingError(error.response.data.message);
                
                if(error.response.status === 401) {
                    navigate('/login', { state: { from: location }, replace: true });
                }
            });
    }, []);

    function settingError(error) {
        setErrMsg(error);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const v0 = EMAIL_REGEX.test(email);
        const v1 = PROGRAMS_REGEX.some(obj => obj.name === program);
        const v2 = (PAY_REGEX.test(pay) && pay >= 25);
        const v3 = ADDRESS_REGEX.test(address);
        const v4 = PHONE_REGEX.test(phone);

        if (!v0 || !v1 || !v2 || !v3 || !v4) {
            settingError('Invalid input. Please check your data and try again.');
            return;
        }

        try {
            await axios.patch(PROFILE_URL,
                { name: name, email: email, programId: program, pay: pay, address: address, phone: phone, scholarship: beca },
                { headers: { 'authorization': `Bearer ${auth?.accessToken}` } },
                { withCredentials: true }
            ).then(setSuccess(true));

        } catch (err) {
            if (!err?.response) {
                settingError(err.response.message);
            }

            errRef.current.focus();
        }
    }

    return (
        <>
            {success ?
                (
                    <section>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <h1>Application form for freshman</h1>
                        <form>
                            <section>
                                Profile section
                                <label htmlFor="name">
                                    Name:
                                </label>
                                <input
                                    readOnly
                                    placeholder='No name registered'
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
                                />
                            </section>

                            <section>
                                Application form section
                                <label htmlFor="email">
                                    Email:
                                </label>
                                <input
                                    readOnly
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
                                />

                                <label htmlFor="program">
                                    Program:
                                </label>
                                <input
                                    readOnly
                                    type='text'
                                    placeholder='No program registered'
                                    id="program"
                                    value={program}
                                    onChange={(e) => setProgram(e.target.value)}
                                    required
                                    aria-invalid={validProgram ? "false" : "true"}
                                    aria-describedby="programnote"
                                    onFocus={() => setProgramFocus(true)}
                                    onBlur={() => setProgramFocus(false)}
                                >
                                </input>


                                <label htmlFor="pay">
                                    Pay:
                                </label>
                                <input
                                    readOnly
                                    placeholder='No pay registered'
                                    type="number"
                                    id="pay"
                                    autoComplete="off"
                                    onChange={(e) => setPay(e.target.value)}
                                    value={pay}
                                    required
                                    aria-invalid={validPay ? "false" : "true"}
                                    aria-describedby="paynote"
                                    onFocus={() => setPayFocus(true)}
                                    onBlur={() => setPayFocus(false)}
                                />

                                <label htmlFor="address">
                                    Address:
                                </label>
                                <input
                                    readOnly
                                    placeholder='NO address registered'
                                    type="text"
                                    id="address"
                                    autoComplete="off"
                                    onChange={(e) => setAddress(e.target.value)}
                                    value={address}
                                    required
                                    aria-invalid={validAddress ? "false" : "true"}
                                    aria-describedby="addressnote"
                                    onFocus={() => setAddressFocus(true)}
                                    onBlur={() => setAddressFocus(false)}
                                />

                                <label htmlFor="phone">
                                    Phone:
                                </label>
                                <input
                                    readOnly
                                    placeholder='No phone registered'
                                    type="phone"
                                    id="phone"
                                    autoComplete="off"
                                    onChange={(e) => setPhone(e.target.value)}
                                    value={phone}
                                    required
                                    aria-invalid={validPhone ? "false" : "true"}
                                    aria-describedby="phonenote"
                                    onFocus={() => setPhoneFocus(true)}
                                    onBlur={() => setPhoneFocus(false)}
                                />

                                <label htmlFor="beca">
                                    Would you like to be considered for a scholarship?
                                    <input
                                        readOnly
                                        placeholder='NO scholarship registered'
                                        type="text"
                                        id="beca"
                                        autoComplete="off"
                                        onChange={(e) => setBeca(e.target.value)}
                                        value={beca ? "Yes" : "No"}
                                        required
                                        aria-invalid={validAddress ? "false" : "true"}
                                        aria-describedby="addressnote"
                                        onFocus={() => setBecaFocus(true)}
                                        onBlur={() => setBecaFocus(false)}
                                    />
                                </label>
                            </section>
                        </form>

                        <button
                            className="enabled-button"
                            onClick={() => {
                                setName('');
                                setAddress('');
                                setProgram('');
                                setPay('');
                                setPhone('');
                                setBeca(false);
                                setSuccess(false);
                            }
                            }>
                            Edit
                        </button>
                    </section>
                )
                :
                (
                    <section>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <h1>Application form for freshman</h1>


                        <form onSubmit={handleSubmit}>

                            <section>
                                Profile section
                                <label htmlFor="name">
                                    Name:
                                </label>
                                <input
                                    placeholder='No name registered'
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
                                    This is the designated field for your name. Must be greater than 3 letters
                                </p>

                            </section>

                            <section>
                                Application form section
                                <label htmlFor="email">
                                    Email:
                                </label>
                                <input
                                    readOnly
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
                                />
                                <p id="uidnote" className={emailFocus || (email && !validEmail) ? "instructions" : "offscreen"}>
                                    This is the designated field for your email address.<br />
                                    It can not be modified once it has been created.
                                </p>

                                <label htmlFor="program">
                                    Program:
                                </label>
                                <select
                                    placeholder='No program registered'
                                    id="program"
                                    value={program}
                                    onChange={(e) => setProgram(e.target.value)}
                                    required
                                    aria-invalid={validProgram ? "false" : "true"}
                                    aria-describedby="programnote"
                                    onFocus={() => setProgramFocus(true)}
                                    onBlur={() => setProgramFocus(false)}
                                    className={program ? (!validProgram ? "invalid" : "valid") : "empty"}
                                >
                                    Select a program
                                    <option value="Ingenieria">Ingenieria</option>
                                    <option value="Ciencias Sociales">Ciencias Sociales</option>
                                    <option value="Ciencias Juridicas">Ciencias Juridicas</option>
                                    <option value="Ciencias Economicas">Ciencias Economicas</option>
                                </select>


                                <label htmlFor="pay">
                                    Pay:
                                </label>
                                <input
                                    placeholder='No pay registered'
                                    type="number"
                                    id="pay"
                                    autoComplete="off"
                                    onChange={(e) => setPay(e.target.value)}
                                    value={pay}
                                    required
                                    aria-invalid={validPay ? "false" : "true"}
                                    aria-describedby="paynote"
                                    onFocus={() => setPayFocus(true)}
                                    onBlur={() => setPayFocus(false)}
                                    className={pay ? (!validPay ? "invalid" : "valid") : "empty"}
                                />
                                <p id="paynote" className={payFocus || (pay && !validPay) ? "instructions" : "offscreen"}>
                                    This is the designated field for your pay capacity. It must be a minimum amount of $25 a month. Insert the amount only, not the '$' symbol.
                                </p>

                                <label htmlFor="address">
                                    Address:
                                </label>
                                <input
                                    placeholder='NO address registered'
                                    type="text"
                                    id="address"
                                    autoComplete="off"
                                    onChange={(e) => setAddress(e.target.value)}
                                    value={address}
                                    required
                                    aria-invalid={validAddress ? "false" : "true"}
                                    aria-describedby="addressnote"
                                    onFocus={() => setAddressFocus(true)}
                                    onBlur={() => setAddressFocus(false)}
                                    className={address ? (!validAddress ? "invalid" : "valid") : "empty"}
                                />
                                <p id="addressnote" className={addressFocus || (address && !validAddress) ? "instructions" : "offscreen"}>
                                    This is the designated field for your address. Write your city of residence ONLY. It shall not be more than 25 characters.
                                </p>

                                <label htmlFor="phone">
                                    Phone:
                                </label>
                                <input
                                    placeholder='No phone registered'
                                    type="phone"
                                    id="phone"
                                    autoComplete="off"
                                    onChange={(e) => setPhone(e.target.value)}
                                    value={phone}
                                    required
                                    aria-invalid={validPhone ? "false" : "true"}
                                    aria-describedby="phonenote"
                                    onFocus={() => setPhoneFocus(true)}
                                    onBlur={() => setPhoneFocus(false)}
                                    className={phone ? (!validPhone ? "invalid" : "valid") : "empty"}
                                />

                                <p id="phonenote" className={phoneFocus || (phone && !validPhone) ? "instructions" : "offscreen"}>
                                    This is the designated field for your phone. It shall be 8 digits long.
                                </p>

                                <label htmlFor="beca">
                                    Would you like to be considered for a scholarship?
                                    <input
                                        type="checkbox"
                                        id="beca"
                                        checked={beca}
                                        onChange={(e) => {
                                            setBeca(e.target.checked)
                                        }
                                        }
                                        aria-invalid={validBeca ? "false" : "true"}
                                        aria-describedby="becanote"
                                        onFocus={() => setBecaFocus(true)}
                                        onBlur={() => setBecaFocus(false)}
                                        className={beca ? (!validBeca ? "invalid" : "valid") : "empty"}
                                    />
                                    <p id="becanote" className={becaFocus && beca && !validBeca ? "instructions" : "offscreen"}>
                                        This is the designated field for your beca.
                                    </p>
                                </label>
                            </section>

                            <button
                                className={(!validName || !validEmail || !validAddress || !validPay || !validPhone || !validProgram) ? "disabled-button" : "enabled-button"}
                                disabled={(!validName || !validEmail || !validAddress || !validPay || !validPhone || !validProgram) ? true : false}>
                                Send form!
                            </button>
                        </form>

                    </section>
                )}
        </>
    );

}

export default LinkPage