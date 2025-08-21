import React, { useState, useMemo, useEffect, useCallback } from "react";
import Typography from "@material-ui/core/Typography";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/datepicker-custom.css";
import ptCustom from "./utils/datepicker-locale";
import { format, parse, compareAsc } from "date-fns";
import { useAuth } from "../AuthContext";
import { useHistory } from "react-router-dom";

registerLocale("pt-custom", ptCustom);

function DashboardPage() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [reservationsByDate, setReservationsByDate] = useState({});
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const { token, selectedWorker } = useAuth();
    const history = useHistory();

    useEffect(() => {
        if (!token) {
            history.replace("/login");
        }
    }, [token, history]);

    const fetchMonthlyReservations = useCallback(
    async (date) => {
      if (!token || !selectedWorker?.worker_id) return;

      const params = new URLSearchParams({
        scope: "monthly",
        worker_id: String(selectedWorker.worker_id),
        datetime_check: date.toISOString(),
        _ts: String(Date.now()), 
      });

      try {
        const res = await fetch(
          `http://127.0.0.1:5001/detailedReservations?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro a buscar reservas");

        // Agrupar por dia (yyyy-MM-dd)
        const grouped = {};
        (data.appointments || []).forEach((a) => {
          const dStr = format(new Date(a.datetime_service_start), "yyyy-MM-dd");

        const normalized = {
          ...a,
          time: format(new Date(a.datetime_service_start), "HH:mm"),
          client: a.client?.name || "",
          service: a.service?.name || "",
          confirmed: true,
        };
        (grouped[dStr] = grouped[dStr] || []).push(normalized);
      });

      setReservationsByDate(grouped);
    } catch (err) {
      console.error("Falha no fetch mensal:", err);
    }
  }, [token, selectedWorker]);

    useEffect(() => {
    fetchMonthlyReservations(today);
  }, [fetchMonthlyReservations]);

    useEffect(() => {
    const id = setInterval(() => {
      const base = selectedDate || today;
      fetchMonthlyReservations(base);
    }, 30000);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        const base = selectedDate || today;
        fetchMonthlyReservations(base);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [fetchMonthlyReservations, selectedDate]);

  const handleDateChange = (date) => setSelectedDate(date);

    // Chave formatada para buscar reservas
    const key = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
    const reservations =
        key && reservationsByDate[key] ? reservationsByDate[key] : [];

    // Próximas reservas
  const upcomingReservations = useMemo(() => {
    const items = [];
    Object.entries(reservationsByDate).forEach(([dateStr, arr]) => {
      const dateObj = parse(dateStr, "yyyy-MM-dd", new Date());
      if (dateObj >= startOfToday) {
        arr.forEach((r) => items.push({
          date: dateObj,
          time: r.time,                 // já normalizado
          client: r.client,
          service: r.service,
          confirmed: r.confirmed,
        }));
      }
    });
    items.sort((a, b) => {
      const cmpDate = compareAsc(a.date, b.date);
      return cmpDate !== 0 ? cmpDate : a.time.localeCompare(b.time);
    });
    return items.slice(0, 5);
  }, [reservationsByDate, startOfToday]);

    // Agrupar reservas por data
    const upcomingByDate = useMemo(() => {
    const groups = {};
    upcomingReservations.forEach((item) => {
      const dStr = format(item.date, "dd/MM/yyyy");
      (groups[dStr] = groups[dStr] || []).push(item);
    });
    return groups;
  }, [upcomingReservations]);

    // Renderiza o conteúdo dos dias no calendário
    const renderDayContents = (day, date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const hasReservations = !!(reservationsByDate[formattedDate]?.length);
    return (
      <div className="relative flex items-center justify-center">
        <span>{day}</span>
        {hasReservations && (
          <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#a5bf99]" />
        )}
      </div>
    );
  };

  // cinzento em dias passados
  const dayClassName = (date) => {
    const d0 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return d0 < startOfToday ? "rdp-past" : undefined;
  };

  // apagar reserva
  const handleDelete = async (appt) => {
    if (!selectedWorker?.worker_id) return;
    const when = new Date(appt.datetime_service_start);
    const ok = window.confirm(`Apagar reserva de ${appt.client || "cliente"} às ${appt.time}?`);
    if (!ok) return;

    const params = new URLSearchParams({
      worker_id: String(selectedWorker.worker_id),
      date: when.toISOString(),    // o teu backend espera ISO aqui
      _ts: String(Date.now()),
    });

    try {
      const res = await fetch(`http://127.0.0.1:5001/reservation?${params.toString()}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Falha ao apagar");

      // refaz fetch do mês da data selecionada (ou do “when” para garantir)
      const base = selectedDate || when;
      fetchMonthlyReservations(base);
    } catch (e) {
      alert(e.message || "Erro ao apagar reserva");
    }
  };


    return (
        <div className="px-4 py-8 w-full max-w-screen-xl mx-auto bg-[#F5F1E9]">
            <div className="mb-8">
                <Typography
                    variant="h4"
                    component="h1"
                    className="text-[#5c7160] font-light"
                >
                    AGENDA
                </Typography>
                <div className="w-16 h-1 bg-gradient-to-r from-[#c0a080]/60 via-[#e9d3a3] to-[#c0a080]/60 mt-2"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendário */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-[#5c7160]/5 w-full">
                    <h2 className="text-xl font-medium text-[#5c7160] mb-6 text-center">
                        Escolha a Data
                    </h2>
                    <div className="flex justify-center">
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            inline
                            locale="pt-custom"
                            calendarClassName="custom-calendar"
                            renderDayContents={renderDayContents}
                            dayClassName={dayClassName}
                            formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 3)}
                            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                                <div className="flex items-center justify-between px-4 py-2">
                                <button
                                    onClick={() => {
                                    const prev = new Date(date);
                                    prev.setMonth(prev.getMonth() - 1);
                                    decreaseMonth();
                                    fetchMonthlyReservations(prev);
                                    }}
                                    className="text-[#a5bf99] font-bold w-8 h-8 flex items-center justify-center hover:bg-[#a5bf99]/10 rounded-full"
                                >
                                    &lt;
                                </button>
                                <span className="text-[#5c7160] capitalize font-medium">
                                    {date.toLocaleDateString("pt-PT", { month: "long", year: "numeric" })}
                                </span>
                                <button
                                    onClick={() => {
                                    const next = new Date(date);
                                    next.setMonth(next.getMonth() + 1);
                                    increaseMonth();
                                    fetchMonthlyReservations(next);
                                    }}
                                    className="text-[#a5bf99] font-bold w-8 h-8 flex items-center justify-center hover:bg-[#a5bf99]/10 rounded-full"
                                >
                                    &gt;
                                </button>
                                </div>
                            )}
                            />
                    </div>
                    {/* Helper text */}
                    <div className="flex items-center justify-center mt-4 text-sm text-[#5c7160]/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#a5bf99] mr-2"></div>
                        <span>Dias com reservas</span>
                    </div>
                </div>

                {/* Reservas ou Próximas */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-[#5c7160]/5 w-full">
                    {selectedDate ? (
                        <>
                            <h2 className="text-xl font-medium text-[#5c7160] mb-6 text-center">
                                Reservas de {format(selectedDate, "dd/MM/yyyy")}
                            </h2>
                            {reservations.length > 0 ? (
                                <ul className="space-y-3">
                                    {reservations.map((r, i) => (
                                    <li key={i} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border-l-4 ${r.confirmed ? "border-l-[#a5bf99]" : "border-l-[#c0a080]"} bg-[#F5F1E9]/50`}>
                                        <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-[#5c7160]/10 flex items-center justify-center mr-3">
                                            <span className="text-[#5c7160] font-medium">
                                            {r.time?.split(":")[0]}
                                            <span className="text-xs">:{r.time?.split(":")[1]}</span>
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[#415140] font-medium">{r.client}</p>
                                            <p className="text-[#5c7160]/70 text-sm">{r.service}</p>
                                        </div>
                                        </div>

                                        <div className="flex items-center gap-3 ml-auto mt-2 sm:mt-0">
                                        <span className={`text-xs px-2 py-1 rounded-full ${r.confirmed ? "bg-[#a5bf99]/20 text-[#5c7160]" : "bg-[#c0a080]/20 text-[#c0a080]"}`}>
                                            {r.confirmed ? "Confirmado" : "Pendente"}
                                        </span>

                                        {/* Botão apagar */}
                                        <button
                                            aria-label="Apagar reserva"
                                            title="Apagar reserva"
                                            onClick={() => handleDelete(r)}
                                            className="p-2 rounded-full hover:bg-red-50"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0h8M10 4h4a1 1 0 011 1v2H9V5a1 1 0 011-1z" />
                                            </svg>
                                        </button>
                                        </div>
                                    </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 bg-[#F5F1E9] rounded-full flex items-center justify-center mb-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-[#5c7160]/40"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-[#5c7160]/70">
                                        Não há reservas para esta data.
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-medium text-[#5c7160] mb-6 text-center">
                                Próximas Reservas
                            </h2>
                            {upcomingReservations.length > 0 ? (
                                Object.entries(upcomingByDate).map(([d, items]) => (
                                    <div key={d} className="mb-6">
                                        <div className="flex items-center mb-3">
                                            <div className="w-2 h-2 rounded-full bg-[#c0a080] mr-2"></div>
                                            <h3 className="text-lg font-medium text-[#5c7160]">
                                                {d}
                                            </h3>
                                        </div>
                                        <ul className="space-y-2 ml-4">
                                            {items.map((item, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-center p-3 bg-[#F5F1E9]/80 rounded-lg border-l-2 border-[#a5bf99]/40"
                                                >
                                                    <div className="h-8 w-8 rounded-full bg-[#5c7160]/10 flex items-center justify-center mr-3">
                                                        <span className="text-[#5c7160] text-sm">
                                                            {item.time}
                                                        </span>
                                                    </div>
                                                    <span className="text-[#415140] font-medium">
                                                        {item.client}
                                                    </span>
                                                    <span className="ml-auto text-sm italic text-[#5c7160]/80">
                                                        {item.service}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 bg-[#F5F1E9] rounded-full flex items-center justify-center mb-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-[#5c7160]/40"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-[#5c7160]/70">Sem próximas reservas.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="fixed bottom-16 right-8 z-20">
            <button
                className="bg-[#5c7160] hover:bg-[#5c7160]/90 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
                title="Adicionar nova reserva"
                onClick={() => window.open("https://www.pernalix.pt/reservations", "_blank")}
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
                </svg>
            </button>
            </div>
                    </div>
                    
                );
            }

export default DashboardPage;
