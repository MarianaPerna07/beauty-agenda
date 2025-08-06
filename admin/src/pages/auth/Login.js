import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
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
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1E9] p-4">
      {/* cartão */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* círculos de fundo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-8 left-8 w-24 h-24 rounded-full bg-[#a5bf99]/10" />
          <div className="absolute bottom-12 right-12 w-32 h-32 rounded-full bg-[#c0a080]/10" />
          <div className="absolute top-1/3 right-8 w-16 h-16 rounded-full bg-[#5c7160]/5" />
          <div className="absolute bottom-8 left-16 w-20 h-20 rounded-full bg-[#5c7160]/5" />
        </div>

        {/* conteúdo */}
        <div className="relative z-10 p-6 flex flex-col items-center">
          <img
            src={LOGO}
            alt="Your Moments"
            className="w-24 h-24 object-contain mb-4"
          />
          <p className="text-[#5c7160]/70 text-sm mb-6">Área Administrativa</p>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 mb-4 w-full bg-red-50 text-red-700 text-xs rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 flex-shrink-0"
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
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* botão Google centralizado e com largura máxima */}
          <div className="w-full flex justify-center mb-6">
            <div id="gsi-button" className="max-w-full" />
          </div>

          {!isAuthenticated ? (
            <p className="text-[0.65rem] text-[#5c7160]/70 text-center mb-6">
              Use o botão acima para autenticar.
            </p>
          ) : (
            <div className="w-full space-y-3 mb-6">
              <div className="text-xs text-green-600 text-center">
                Autenticado como administrador.
              </div>
              <button
                onClick={callProtected}
                disabled={loading}
                className="w-full py-2 bg-[#5c7160] text-white rounded-lg hover:bg-[#5c7160]/90 transition"
              >
                {loading ? "A processar…" : "Testar API Protegida"}
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-2 border border-[#c0a080] text-[#5c7160] rounded-lg hover:bg-[#f0ece6] transition"
              >
                Logout
              </button>
              <div className="text-[0.6rem] text-[#5c7160]/70 text-right">
                Último refresh:{" "}
                {lastRefresh
                  ? new Date(lastRefresh).toLocaleTimeString()
                  : "-"}
              </div>
            </div>
          )}

          {/* footer */}
          <div className="w-full border-t border-[#5c7160]/10 pt-4 text-center">
            <p className="text-[0.6rem] text-[#5c7160]/60">
              © {new Date().getFullYear()} Your Moments Estética
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;