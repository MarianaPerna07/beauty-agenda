// src/LoginPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "./Login.css";

export default function LoginPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { setToken, setExpiresAt, setEmail, GOOGLE_CLIENT_ID} = useAuth();

    const handleCredentialResponse = useCallback(
        async (response) => {
            setError("");
            setLoading(true);
            try {
                const res = await fetch("http://127.0.0.1:5000/auth/google", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_token: response.credential }),
                });

                if (!res.ok) {
                    const payload = await res.json().catch(() => ({}));
                    setError(
                        `Login failed: ${payload.error || res.status}${
                        payload.details ? ` (${payload.details})` : ""
                        }`
                    );
                    return;
                }
                // Extract token and other data from response
                if (!res.headers.get("Content-Type")?.includes("application/json")) {
                    setError("Unexpected response format from backend.");
                    return;
                }
                const data = await res.json();
                if (!data.access_token || !data.expires_in || !data.email) {
                    setError("Invalid response from backend.");
                    return;
                }

                // Set auth context
                setToken(data.access_token);
                console.log("Access token set in context:", data.access_token);
                setExpiresAt(Date.now() + data.expires_in * 1000);
                setEmail(data.email);
                setError("Redirecting to admin page...");
                history.replace("/admin");
            } catch {
                setError("Error during login.");
            } finally {
                setLoading(false);
            }
        },
        [history]
    );

    useEffect(() => {
    /* global google */
    const initGoogle = () => {
        if (!window.google?.accounts?.id) {
            setError("Failed to load Google Identity Services.");
            return;
        }
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            ux_mode: "popup",
        });
        google.accounts.id.renderButton(
        document.getElementById("gsi-button"),
        { theme: "outline", size: "large" }
        );
    };

    if (!window.google || !window.google.accounts) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initGoogle;
        script.onerror = () => setError("Failed to load Google script.");
        document.head.appendChild(script);
    } else {
        initGoogle();
    }
    }, [handleCredentialResponse]);

    return (
    <div className="login-page min-h-screen flex flex-col items-center justify-center bg-[#F5F1E9]">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-[#a5bf99]/8"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-[#c0a080]/8"></div>
        <div className="absolute top-1/4 right-10 w-16 h-16 rounded-full bg-[#5c7160]/5"></div>
        <div className="absolute bottom-10 left-20 w-20 h-20 rounded-full bg-[#5c7160]/5"></div>
        </div>

        <div className="relative z-10 mb-2">
        <div className="w-16 h-16 flex items-center justify-center">
            <img
            src="/logo-gold.png"
            alt="Your Moments"
            className="w-full"
            onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='100%25' height='100%25' fill='%23f5f1e9'/%3E%3Ctext x='50%25' y='50%25' font-family='Quicksand, sans-serif' font-weight='300' font-size='24' fill='%23c0a080' text-anchor='middle' dominant-baseline='middle'%3EYM%3C/text%3E%3C/svg%3E";
            }}
            />
        </div>
        </div>

        <div className="relative z-10 w-full max-w-xs">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#c0a080]/60 via-[#e9d3a3] to-[#c0a080]/60"></div>
            <div className="px-5 py-5">
            <div className="text-center mb-4">
                <h2 className="text-xl font-light text-[#5c7160]">Your Moments</h2>
                <p className="text-[#5c7160]/70 mt-0.5 text-sm">
                Área Administrativa
                </p>
            </div>

            {error && (
                <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-lg text-xs flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>{error}</span>
                </div>
            )}

            <div className="space-y-3">
                <div className="text-center mb-2">
                <div id="gsi-button" className="mx-auto"></div>
                </div>
                {loading && (
                <div className="text-center text-sm text-[#5c7160]">
                    Signing in…
                </div>
                )}

                {!loading && (
                <div className="text-xs text-center text-[#5c7160]/70">
                    Use o botão do Google acima para autenticar. Apenas o email
                    permitido terá acesso.
                </div>
                )}
            </div>
            </div>

            <div className="bg-[#5c7160]/5 py-2 px-5 text-center">
            <p className="text-xs text-[#5c7160]/60">
                © {new Date().getFullYear()} Your Moments Estética
            </p>
            </div>
        </div>
        </div>

        <div className="absolute bottom-4 w-full flex justify-center z-0 opacity-30">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#c0a080] to-transparent"></div>
        </div>
    </div>
    );
}
