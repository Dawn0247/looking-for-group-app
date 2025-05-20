import React, { useState, useRef, useEffect } from 'react';
import { register } from '../api';

function RegisterModal({ onRegisterSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerError, setRegisterError] = useState(false);

    // Add useRef for the modal
    const modalRef = useRef(null);

    const handleRegister = (event) => {
        event.preventDefault();
        setRegisterError(false); // Reset error state before registration attempt
        register(username, password)
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        // Save the token to localStorage
                        localStorage.setItem('token', data.token);

                        // Call the onRegisterSuccess function to update the welcome message
                        if (onRegisterSuccess) {
                            onRegisterSuccess();
                        }

                        // Close the modal using Bootstrap's JavaScript API
                        const closeButton = modalRef.current.querySelector('[data-bs-dismiss="modal"]');
                        if (closeButton) {
                            closeButton.click(); // Simulate a click to close the modal
                        }
                    });
                } else {
                    setRegisterError(true);
                }
            });
    };

    useEffect(() => {
        const modalElement = modalRef.current;

        // Add event listeners for Bootstrap modal lifecycle events
        const handleModalShown = () => {
            console.log('Register Modal is shown');
        };

        const handleModalHidden = () => {
            console.log('Register Modal is hidden');
            setUsername(''); // Reset username
            setPassword(''); // Reset password
            setRegisterError(false); // Reset error state
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
        <div
            className="modal fade"
            id="registerModal"
            tabIndex="-1"
            aria-labelledby="registerModalLabel"
            aria-hidden="true"
            ref={modalRef}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="registerModalLabel">
                            Register
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleRegister} id="registerForm">
                            <div className="mb-3">
                                <label htmlFor="usernameRegister" className="form-label">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="usernameRegister"
                                    placeholder="Enter your username"
                                    value={username} // Bind the input value to the username state
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="passwordRegister" className="form-label">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="passwordRegister"
                                    placeholder="Enter your password"
                                    value={password} // Bind the input value to the password state
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        {registerError && (
                            <p id="registerError" className="text-danger me-auto mb-0">
                                Registration failed. Please try again.
                            </p>
                        )}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            form="registerForm"
                            onSubmit={handleRegister}
                        >
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterModal;