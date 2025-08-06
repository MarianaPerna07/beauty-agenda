// src/LoginPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import LOGO from "../../assets/images/Slogan-YourMoments.png"; 

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
                history.replace("/dashboard");
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
        <div className="min-h-screen flex items-center justify-center bg-[#F5F1E9] p-4">
          {/* cartão */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden min-h-[520px]">
            {/* círculos de fundo */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#a5bf99]/10" />
              <div className="absolute bottom-16 right-16 w-40 h-40 rounded-full bg-[#c0a080]/10" />
              <div className="absolute top-1/3 right-12 w-20 h-20 rounded-full bg-[#5c7160]/5" />
              <div className="absolute bottom-12 left-20 w-24 h-24 rounded-full bg-[#5c7160]/5" />
            </div>
    
            {/* conteúdo */}
            <div className="relative z-10 p-8 flex flex-col items-center">
              <img
                src={LOGO}
                alt="Your Moments"
                className="w-82 h-28 object-contain mb-6"
              />
              <p className="text-[#5c7160]/70 text-2xl mb-8">Área Administrativa</p>
    
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 mb-6 w-full bg-red-50 text-red-700 text-sm rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 flex-shrink-0"
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
    
                <p className="text-s text-[#5c7160]/70 text-center mb-6">
                  Use o botão acima para autenticar.
                </p>
    
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
