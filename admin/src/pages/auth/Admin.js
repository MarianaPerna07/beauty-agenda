// src/AdminPage.jsx
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../AuthContext";

export default function AdminPage() {
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const history = useHistory();
    const { token, expiresAt, setToken, setEmail, setExpiresAt } = useAuth();

    const callProtected = async () => {
        setError("");
        setResult(null);

        if (!token) {
            window.alert("You must be logged in to access this page.");
            setError("You must be logged in to access this page.");
            history.replace("/login");
            return;
        }

        // if (Date.now() >= expiresAt) {
        //     setError("Your session has expired. Please log in again.");
        //     history.replace("/login");
        //     return;
        // }

        try {
            const res = await fetch("http://127.0.0.1:5000/protected-api", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) {
                if (res.status === 401) {
                    window.alert("Unauthorized—token expired or invalid. Please log in again.");
                    setToken(null);
                    setEmail(null);
                    setExpiresAt(null);
                    history.replace("/login");
                } else {
                    const payload = await res.json().catch(() => ({}));
                    setError(payload.error || `Error ${res.status}`);
                }
                return;
            }
            const { message } = await res.json()
            setResult(JSON.stringify(message, null, 2));
        } catch {
            setError("Network error calling protected API.");
        }
    };

    const handleLogout = () => {
        // clear the in-memory token and go back to login
        setToken(null);
        setEmail(null);
        setExpiresAt(null);
        history.replace("/login");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F1E9] p-4">
            <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
                <h2 className="text-xl font-light text-[#5c7160] mb-4 text-center">
                    Admin Dashboard
                </h2>

                <button
                    onClick={callProtected}
                    className="w-full py-2 mb-3 bg-[#5c7160] text-white rounded-lg hover:bg-[#5c7160]/90 transition"
                >
                    Call Protected API
                </button>

                {error && (
                    <div className="mb-3 p-2 bg-red-50 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                {result && (
                    <pre className="p-3 rounded text-xs overflow-x bg-[#f0ece6] text-[#5c7160]">
                        {result}
                    </pre>
                )}

                <button
                    onClick={handleLogout}
                    className="mt-6 w-full py-2 border border-[#c0a080] text-[#5c7160] rounded-lg hover:bg-[#f0ece6] transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
