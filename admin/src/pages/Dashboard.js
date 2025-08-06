import React, { useState, useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/datepicker-custom.css';
import ptCustom from './utils/datepicker-locale';
import { format, parse, compareAsc } from 'date-fns';

// Register Portuguese locale with custom settings
registerLocale('pt-custom', ptCustom);

// Simulação de reservas por dia (chave: yyyy-MM-dd)
const reservationsByDate = {
  '2025-08-12': [
    { time: '09:00', client: 'Alice Silva', service: 'Limpeza Facial', confirmed: true },
    { time: '10:30', client: 'Maria Costa', service: 'Massagem Relaxante', confirmed: true },
    { time: '14:00', client: 'João Pereira', service: 'Depilação', confirmed: false }
  ],
  '2025-08-13': [
    { time: '08:30', client: 'Carla Sousa', service: 'Design de Sobrancelhas', confirmed: true },
    { time: '11:00', client: 'Rita Gomes', service: 'Peeling Químico', confirmed: true }
  ],
  // ... adiciona mais datas conforme necessidade
};

function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const today = new Date();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Chave formatada para buscar reservas
  const key = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const reservations = key && reservationsByDate[key] ? reservationsByDate[key] : [];

  // Próximas reservas (flatten + sort)
  const upcomingReservations = useMemo(() => {
    const items = [];
    Object.entries(reservationsByDate).forEach(([dateStr, arr]) => {
      const dateObj = parse(dateStr, 'yyyy-MM-dd', new Date());
      if (dateObj >= today) arr.forEach(r => items.push({ date: dateObj, ...r }));
    });
    items.sort((a, b) => {
      const cmpDate = compareAsc(a.date, b.date);
      return cmpDate !== 0 ? cmpDate : a.time.localeCompare(b.time);
    });
    return items.slice(0, 5);
  }, [today]);

  // Agrupar reservas por data
  const upcomingByDate = useMemo(() => {
    const groups = {};
    upcomingReservations.forEach(item => {
      const dStr = format(item.date, 'dd/MM/yyyy');
      (groups[dStr] = groups[dStr] || []).push(item);
    });
    return groups;
  }, [upcomingReservations]);

  // Renderiza o conteúdo dos dias no calendário
  const renderDayContents = (day, date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const hasReservations = reservationsByDate[formattedDate] && reservationsByDate[formattedDate].length > 0;
    
    return (
      <div className="relative flex items-center justify-center">
        <span>{day}</span>
        {hasReservations && (
          <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#a5bf99]"></div>
        )}
      </div>
    );
  };

  return (
    <div className="px-4 py-8 w-full max-w-screen-xl mx-auto bg-[#F5F1E9] min-h-screen">
      <div className="mb-8">
        <Typography variant="h4" component="h1" className="text-[#5c7160] font-light">
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
              minDate={today}
              locale="pt-custom"
              calendarClassName="custom-calendar"
              renderDayContents={renderDayContents}
              formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 3)}
              renderCustomHeader={({ 
                date, 
                decreaseMonth, 
                increaseMonth, 
                prevMonthButtonDisabled, 
                nextMonthButtonDisabled 
              }) => (
                <div className="flex items-center justify-between px-4 py-2 bg-transparent">
                  <button 
                    onClick={decreaseMonth} 
                    disabled={prevMonthButtonDisabled} 
                    className="text-[#a5bf99] font-bold w-8 h-8 flex items-center justify-center hover:bg-[#a5bf99]/10 rounded-full transition-colors"
                  >
                    &lt;
                  </button>
                  <span className="text-[#5c7160] capitalize font-medium">
                    {date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </span>
                  <button 
                    onClick={increaseMonth} 
                    disabled={nextMonthButtonDisabled} 
                    className="text-[#a5bf99] font-bold w-8 h-8 flex items-center justify-center hover:bg-[#a5bf99]/10 rounded-full transition-colors"
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
                Reservas de {format(selectedDate, 'dd/MM/yyyy')}
              </h2>
              {reservations.length > 0 ? (
                <ul className="space-y-3">
                  {reservations.map((r, i) => (
                    <li key={i} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border-l-4 ${r.confirmed ? 'border-l-[#a5bf99]' : 'border-l-[#c0a080]'} bg-[#F5F1E9]/50`}>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-[#5c7160]/10 flex items-center justify-center mr-3">
                          <span className="text-[#5c7160] font-medium">{r.time.split(':')[0]}<span className="text-xs">:{r.time.split(':')[1]}</span></span>
                        </div>
                        <div>
                          <p className="text-[#415140] font-medium">{r.client}</p>
                          <p className="text-[#5c7160]/70 text-sm">{r.service}</p>
                        </div>
                      </div>
                      <div className="ml-auto mt-2 sm:mt-0">
                        <span className={`text-xs px-2 py-1 rounded-full ${r.confirmed ? 'bg-[#a5bf99]/20 text-[#5c7160]' : 'bg-[#c0a080]/20 text-[#c0a080]'}`}>
                          {r.confirmed ? 'Confirmado' : 'Pendente'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-[#F5F1E9] rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5c7160]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-[#5c7160]/70">Não há reservas para esta data.</p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl font-medium text-[#5c7160] mb-6 text-center">Próximas Reservas</h2>
              {upcomingReservations.length > 0 ? (
                Object.entries(upcomingByDate).map(([d, items]) => (
                  <div key={d} className="mb-6">
                    <div className="flex items-center mb-3">
                      <div className="w-2 h-2 rounded-full bg-[#c0a080] mr-2"></div>
                      <h3 className="text-lg font-medium text-[#5c7160]">{d}</h3>
                    </div>
                    <ul className="space-y-2 ml-4">
                      {items.map((item, idx) => (
                        <li key={idx} className="flex items-center p-3 bg-[#F5F1E9]/80 rounded-lg border-l-2 border-[#a5bf99]/40">
                          <div className="h-8 w-8 rounded-full bg-[#5c7160]/10 flex items-center justify-center mr-3">
                            <span className="text-[#5c7160] text-sm">{item.time}</span>
                          </div>
                          <span className="text-[#415140] font-medium">{item.client}</span>
                          <span className="ml-auto text-sm italic text-[#5c7160]/80">{item.service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-[#F5F1E9] rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5c7160]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[#5c7160]/70">Sem próximas reservas.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Botão flutuante para adicionar nova reserva - positioned higher */}
      <div className="fixed bottom-16 right-8 z-20">
        <button 
          className="bg-[#5c7160] hover:bg-[#5c7160]/90 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
          title="Adicionar nova reserva"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
