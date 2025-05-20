import React, { useState, useRef, useEffect } from 'react';
import { login } from '../api';

function LoginModal( { onLoginSuccess } ) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);

    // Add useRef for the modal
    const modalRef = useRef(null);

    const handleLogin = (event) => {
        event.preventDefault();
        setLoginError(false); // Reset error state before login attempt
        console.log(`Username: ${username}, Password: ${password}`);
        login(username, password)
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        localStorage.setItem('token', data.token);
                        onLoginSuccess();

                        // Close the modal using Bootstrap's JavaScript API
                        const closeButton = modalRef.current.querySelector('[data-bs-dismiss="modal"]');
                        if (closeButton) {
                            closeButton.click(); // Simulate a click to close the modal
                        }
                    });
                } else {
                    setLoginError(true);
                }
            });
    };

    useEffect(() => {
        const modalElement = modalRef.current;

        // Add event listeners for Bootstrap modal lifecycle events
        const handleModalShown = () => {
            console.log('Modal is shown');
        };

        const handleModalHidden = () => {
            console.log('Modal is hidden');
            setUsername(''); // Reset username
            setPassword(''); // Reset password
            setLoginError(false); // Reset error state
        };

        if (modalElement) {
            modalElement.addEventListener('shown.bs.modal', handleModalShown);
            modalElement.addEventListener('hidden.bs.modal', handleModalHidden);
        }

        return () => {
            if (modalElement) {
                modalElement.removeEventListener('shown.bs.modal', handleModalShown);
                modalElement.removeEventListener('hidden.bs.modal', handleModalHidden);
            }
        };
    }, []);

    return (
        <div id="loginModal" className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Login</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleLogin} id="loginForm">
                            <div className="form-group mb-3">
                                <label htmlFor="usernameLogin" className="form-label">
                                    Username:
                                </label>
                                <input
                                    type="text"
                                    id="usernameLogin"
                                    name="username"
                                    className="form-control"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="passwordLogin" className="form-label">
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    id="passwordLogin"
                                    name="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        {loginError && (
                            <p id="loginError" className="text-danger me-auto mb-0">
                                Login failed. Please try again.
                            </p>
                        )}
                        <button
                            type="button"
                            className="btn btn-secondary me-2"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            form="loginForm"
                            onSubmit={handleLogin}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;