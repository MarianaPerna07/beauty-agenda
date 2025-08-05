import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./Login.css";
import LOGO from "../../assets/images/Slogan-YourMoments.png"; 

const GOOGLE_CLIENT_ID = "157557598338-t2pqe9snt3v728v541h9oh6rcp5ifqjp.apps.googleusercontent.com";

function LoginPage() {
const [error, setError] = useState("");
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [accessToken, setAccessToken] = useState(null);
const [loading, setLoading] = useState(false);
const [lastRefresh, setLastRefresh] = useState(null);

let history = useHistory();
let location = useLocation();
let { from } = location.state || { from: { pathname: "/dashboard" } };

// Handle redirect after full login
const redirectAfterLogin = useCallback(() => {
    history.replace(from);
}, [from, history]);

// Initialize Google Identity Services
useEffect(() => {
    /* global google */
    const onLoad = () => {
    if (!window.google?.accounts?.id) {
        setError("Google Identity Services failed to load.");
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
    // optional prompt
    google.accounts.id.prompt();
    };

    // load script if not already
    if (!window.google || !window.google.accounts) {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = onLoad;
    script.onerror = () => setError("Failed to load Google script.");
    document.head.appendChild(script);
    } else {
    onLoad();
    }
}, []);

// Exchange the ID token with backend
const handleCredentialResponse = async (response) => {
    setError("");
    setLoading(true);
    try {
    const res = await fetch("http://127.0.0.1:5000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: response.credential }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(
        `Login failed: ${err.error || res.status} ${
            err.details ? "- " + err.details : ""
        }`
        );
        setIsAuthenticated(false);
        return;
    }



    const data = await res.json();
    setAccessToken(data.access_token);
    setIsAuthenticated(true);
    setLastRefresh(Date.now());

    //   redirectAfterLogin();
    } catch (e) {
    setError("Network error during login.");
    } finally {
    setLoading(false);
    }
    //Dummy response for testing
    // setTimeout(() => {
    //   setAccessToken("dummy-access-token");
    //   setIsAuthenticated(true);
    //   setLastRefresh(Date.now());
    //   redirectAfterLogin();
    //   setLoading(false);
    // }, 1000);
};

// Refresh access token using session cookie
const refreshAccessToken = async () => {
    try {
    const res = await fetch("http://127.0.0.1:5000/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
        setIsAuthenticated(false);
        setAccessToken(null);
        return false;
    }
    const data = await res.json();
    setAccessToken(data.access_token);
    setLastRefresh(Date.now());
    return true;
    } catch {
    setIsAuthenticated(false);
    setAccessToken(null);
    return false;
    }
};

// Call protected API with automatic refresh
const callProtected = async () => {
    if (!accessToken) {
    setError("Not authenticated.");
    return;
    }
    setError("");
    setLoading(true);
    try {
    let res = await fetch("http://127.0.0.1:5000/protected-api", {
        method: "GET",
        headers: {
        Authorization: `Bearer ${accessToken}`,
        },
    });

    if (res.status === 401) {
        // try refresh once
        const refreshed = await refreshAccessToken();
        if (refreshed) {
        res = await fetch("http://127.0.0.1:5000/protected-api", {
            method: "GET",
            credentials: "include",
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        });
        }
    }

    if (!res.ok) {
        const text = await res.text();
        setError(`Protected call failed: ${res.status} ${text}`);
    } else {
        const data = await res.json();
        alert("Protected response: " + JSON.stringify(data));
    }
    } catch (e) {
    setError("Network error calling protected API.");
    } finally {
    setLoading(false);
    }
};

const handleLogout = async () => {
    await fetch("http://127.0.0.1:5000/auth/logout", {
    method: "POST",
    credentials: "include",
    });
    setAccessToken(null);
    setIsAuthenticated(false);
    setError("");
};

return (
    <div className="login-page min-h-screen flex flex-col items-center justify-center bg-[#F5F1E9]">
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-[#a5bf99]/8"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-[#c0a080]/8"></div>
        <div className="absolute top-1/4 right-10 w-16 h-16 rounded-full bg-[#5c7160]/5"></div>
        <div className="absolute bottom-10 left-20 w-20 h-20 rounded-full bg-[#5c7160]/5"></div>
    </div>

    <div className="relative z-10 mb-2">
    <div className="w-22 mx-auto flex items-center justify-center">
        <img
        src={LOGO}
        alt="Your Moments"
        className="max-w-full max-h-full object-contain"
        onError={(e) => { e.target.onerror = null; }}
        />
    </div>
    </div>


    <div className="relative z-10 w-full max-w-xs">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#c0a080]/60 via-[#e9d3a3] to-[#c0a080]/60"></div>

        <div className="px-5 py-5">
            <div className="text-center mb-4">
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
            {/* Legacy email/password kept hidden or could be removed */}
            <div className="text-center mb-2">
                <div id="gsi-button" className="mx-auto"></div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
                {isAuthenticated && (
                <>
                    <div className="text-xs text-green-600">
                    Autenticado como administrador.
                    </div>
                    <button
                    type="button"
                    onClick={callProtected}
                    disabled={loading}
                    className="w-full py-2 bg-[#5c7160] text-white rounded-lg hover:bg-[#5c7160]/90 transition-all shadow-sm"
                    >
                    {loading
                        ? "A processar..."
                        : "Chamar API protegida (testar)"}
                    </button>
                    <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-2 border border-[#c0a080] text-[#5c7160] rounded-lg hover:bg-[#f0ece6] transition-all"
                    >
                    Logout
                    </button>
                    <div className="text-[10px] mt-1 text-[#5c7160]/70">
                    Último refresh:{" "}
                    {lastRefresh
                        ? new Date(lastRefresh).toLocaleTimeString()
                        : "-"}
                    </div>
                </>
                )}
            </div>

            {!isAuthenticated && (
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

export default LoginPage;
