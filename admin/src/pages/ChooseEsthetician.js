// src/pages/ChooseEsthetician.js
import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ChooseEsthetician() {
  const history = useHistory();
  const { token, setSelectedWorker } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!token) {
      history.replace("/login");
      return;
    }
  }, [token, history]);

  const loadWorkers = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await fetch("http://127.0.0.1:5001/workers");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setWorkers(Array.isArray(data.workers) ? data.workers : []);
    } catch (e) {
      console.error(e);
      setErr("Não foi possível carregar as profissionais.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkers();
  }, [loadWorkers]);

  const initials = (name = "") =>
    name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const pickWorker = (w) => {
    // Store the minimum we need everywhere in the app
    setSelectedWorker({
      worker_id: w.worker_id,
      name: w.name || "Profissional",
      email: w.email || "",
    });
    history.replace("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1E9] p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* bg circles (match Login vibe) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#a5bf99]/10" />
          <div className="absolute bottom-16 right-16 w-40 h-40 rounded-full bg-[#c0a080]/10" />
          <div className="absolute top-1/3 right-12 w-20 h-20 rounded-full bg-[#5c7160]/5" />
          <div className="absolute bottom-12 left-20 w-24 h-24 rounded-full bg-[#5c7160]/5" />
        </div>

        <div className="relative z-10 p-8">
          <h1 className="text-2xl text-center font-medium text-[#5c7160] mb-2">
            Escolha a Profissional
          </h1>
          <p className="text-center text-[#5c7160]/70 mb-8">
            Selecione quem está a entrar no sistema.
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5c7160]"></div>
            </div>
          ) : err ? (
            <div className="text-center text-red-600 py-8">{err}</div>
          ) : workers.length === 0 ? (
            <div className="text-center text-[#5c7160]/70 py-16">
              Nenhuma profissional encontrada.
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-6 py-6">
              {workers.map((w) => (
                <button
                  key={w.worker_id}
                  onClick={() => pickWorker(w)}
                  className="group relative flex flex-col items-center focus:outline-none"
                  title={w.name}
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#5c7160] text-white flex items-center justify-center text-2xl font-semibold shadow-lg transition transform group-hover:scale-105">
                    {initials(w.name)}
                  </div>
                  <div className="mt-2 text-[#415140] font-medium text-center px-2">
                    {w.name}
                  </div>
                  {w.email ? (
                    <div className="text-xs text-[#5c7160]/70">{w.email}</div>
                  ) : null}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-[0.75rem] text-[#5c7160]/60">
              © {new Date().getFullYear()} Your Moments Estética
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
