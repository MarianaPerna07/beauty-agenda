import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import Typography from '@material-ui/core/Typography';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useHistory } from 'react-router-dom';

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedClient, setEditedClient] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [saveStatus, setSaveStatus] = useState({ loading: false, success: false, error: null });
  
  const { token, selectedWorker } = useAuth();
  const history = useHistory();

  // Check if user has selected a worker
  useEffect(() => {
    if (!selectedWorker) {
      history.push('/choose-esthetician');
    }
  }, [selectedWorker, history]);

  // Fetch clients data
    const fetchClients = useCallback(async () => {
    if (!token || !selectedWorker?.worker_id) return;
    try {
        setLoading(true);
        setError(null);

        const response = await fetch(
        `http://127.0.0.1:5001/clients/worker/${selectedWorker.worker_id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setClients(data.clients || []);
    } catch (err) {
        console.error("Failed to fetch clients:", err);
        setError("Não foi possível carregar a lista de clientes.");
    } finally {
        setLoading(false);
    }
    }, [token, selectedWorker]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Quando trocar de worker, limpa seleção/estado
useEffect(() => {
  setSelectedClient(null);
  setEditMode(false);
  setEditedClient({});
  setSearchTerm('');
  setSaveStatus({ loading: false, success: false, error: null });
}, [selectedWorker?.worker_id]);

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setEditedClient({...client});
    setEditMode(false);
    setSaveStatus({ loading: false, success: false, error: null });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditedClient({...selectedClient});
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaveStatus({ loading: true, success: false, error: null });
      const response = await fetch(`http://127.0.0.1:5001/client/${selectedClient.phone}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedClient)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      setSelectedClient(editedClient);
      setEditMode(false);
      setSaveStatus({ loading: false, success: true, error: null });
      
      // Refresh the client list
      fetchClients();
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, success: false }));
      }, 3000);
      
    } catch (err) {
      console.error("Failed to update client:", err);
      setSaveStatus({ loading: false, success: false, error: "Não foi possível atualizar os dados do cliente." });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchTerm) || 
    client.phone?.includes(searchTerm) ||
    client.email?.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="px-4 py-8 w-full max-w-screen-xl mx-auto bg-[#F5F1E9] min-h-screen">
      {/* Header with page title */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Typography variant="h4" component="h1" className="text-[#5c7160] font-light">
            CLIENTES
          </Typography>
          <div className="w-16 h-1 bg-gradient-to-r from-[#c0a080]/60 via-[#e9d3a3] to-[#c0a080]/60 mt-2"></div>
        </div>
        
        {selectedWorker && (
          <div className="text-[#5c7160] text-right">
            <span className="block text-sm">Esteticista:</span>
            <span className="font-medium">{selectedWorker.name}</span>
          </div>
        )}
      </div>
      
      {/* Search Box */}
      <div className="mb-6 max-w-lg mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="w-full p-4 pl-14 rounded-full border border-[#c0a080]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[#5c7160]/30 shadow-sm transition-all"
            onChange={handleSearch}
            value={searchTerm}
          />
          <div className="absolute left-4 top-4 text-[#5c7160]">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients List Panel */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-md overflow-hidden border border-[#c0a080]/20">
          <div className="p-5 border-b border-[#c0a080]/20 bg-[#5c7160]/5">
            <h2 className="text-xl text-[#5c7160] font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Lista de Clientes
            </h2>
          </div>
          
          {loading && !filteredClients.length ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5c7160]"></div>
              <p className="mt-4 text-[#5c7160]/70">Carregando clientes...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="mt-4 text-red-500">{error}</p>
              <button 
                onClick={fetchClients}
                className="mt-4 px-4 py-2 bg-[#5c7160] text-white rounded-md hover:bg-[#5c7160]/90"
              >
                Tentar novamente
              </button>
            </div>
          ) : !filteredClients.length ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <svg className="w-16 h-16 text-[#5c7160]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="mt-4 text-[#5c7160]/70">
                {searchTerm ? "Nenhum cliente corresponde à pesquisa" : "Não há clientes registrados"}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden"> 
              <ul className="divide-y divide-[#c0a080]/10">
                {filteredClients.map((client, index) => (
                  <li
                    key={index}
                    onClick={() => handleClientSelect(client)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-[#5c7160]/5 flex items-center ${selectedClient?.phone === client.phone ? 'bg-[#5c7160]/10' : ''}`}
                  >
                    {/* Client circle avatar with first letter */}
                    <div className="h-12 w-12 rounded-full bg-[#a5bf99]/20 flex items-center justify-center text-[#5c7160] font-medium mr-3">
                      {client.name ? client.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium text-[#5c7160]">{client.name || 'Cliente sem nome'}</h3>
                      <div className="text-sm text-[#5c7160]/70 flex items-center space-x-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        <span>{client.phone}</span>
                      </div>
                    </div>
                    
                    <div className="px-2 py-1 bg-[#a5bf99]/10 rounded-full text-xs text-[#5c7160] font-medium">
                      {client.total_reservations || 0} reservas
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Client Details Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md overflow-hidden border border-[#c0a080]/20">
          <div className="p-5 border-b border-[#c0a080]/20 bg-[#5c7160]/5 flex items-center justify-between">
            <h2 className="text-xl text-[#5c7160] font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Detalhes do Cliente
            </h2>
            
            {selectedClient && !editMode && (
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-[#5c7160] text-white rounded-md hover:bg-[#5c7160]/90 transition"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                Editar
              </button>
            )}
          </div>
          
          {selectedClient ? (
            <div className="p-6">
              {saveStatus.success && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Cliente atualizado com sucesso!
                </div>
              )}
              
              {saveStatus.error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {saveStatus.error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`md:col-span-2 ${editMode ? '' : 'flex items-center'}`}>
                  <div className={`h-20 w-20 rounded-full bg-[#a5bf99]/30 flex items-center justify-center text-[#5c7160] text-3xl font-medium mr-5 ${editMode ? 'mx-auto mb-4' : ''}`}>
                    {selectedClient.name ? selectedClient.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  
                  {editMode ? (
                    <div className="w-full">
                      <label className="block text-sm font-medium text-[#5c7160]/70 mb-1">Nome</label>
                      <input
                        type="text"
                        name="name"
                        value={editedClient.name || ''}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7160]/30 focus:border-transparent"
                        placeholder="Nome do cliente"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl font-medium text-[#5c7160]">{selectedClient.name || 'Cliente sem nome'}</h3>
                      <p className="text-[#5c7160]/70">Cliente desde {selectedClient.registration_day ? format(new Date(selectedClient.registration_day), 'dd/MM/yyyy', { locale: pt }) : 'N/A'}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#5c7160]/70 mb-1">Telefone</label>
                  <div className="flex items-center p-3 bg-[#5c7160]/5 rounded-lg">
                    <svg className="w-5 h-5 text-[#5c7160] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span className="font-medium text-[#5c7160]">{selectedClient.phone || 'N/A'}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#5c7160]/70 mb-1">Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={editedClient.email || ''}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7160]/30 focus:border-transparent"
                      placeholder="email@exemplo.com"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-[#5c7160]/5 rounded-lg">
                      <svg className="w-5 h-5 text-[#5c7160] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      <span className="font-medium text-[#5c7160]">{selectedClient.email || 'N/A'}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#5c7160]/70 mb-1">Data de Nascimento</label>
                  {editMode ? (
                    <input
                      type="date"
                      name="birthday"
                      value={editedClient.birthday ? editedClient.birthday.split('T')[0] : ''}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7160]/30 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-[#5c7160]/5 rounded-lg">
                      <svg className="w-5 h-5 text-[#5c7160] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className="font-medium text-[#5c7160]">
                        {selectedClient.birthday 
                          ? format(new Date(selectedClient.birthday), 'dd/MM/yyyy', { locale: pt })
                          : 'Não definido'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#5c7160]/70 mb-1">Data de Registro</label>
                  <div className="flex items-center p-3 bg-[#5c7160]/5 rounded-lg">
                    <svg className="w-5 h-5 text-[#5c7160] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="font-medium text-[#5c7160]">
                      {selectedClient.registration_day
                        ? format(new Date(selectedClient.registration_day), 'dd/MM/yyyy', { locale: pt })
                        : 'Não definido'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#5c7160]/70 mb-1">Histórico de Reservas</label>
                  <div className="flex items-center p-3 bg-[#5c7160]/5 rounded-lg">
                    <svg className="w-5 h-5 text-[#5c7160] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="font-medium text-[#5c7160]">{selectedClient.total_reservations || '0'} reservas realizadas</span>
                  </div>
                </div>
              </div>

              {editMode && (
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saveStatus.loading}
                    className="px-5 py-2.5 bg-[#5c7160] text-white rounded-lg hover:bg-[#5c7160]/90 transition-colors flex items-center"
                  >
                    {saveStatus.loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
              <div className="h-24 w-24 rounded-full bg-[#5c7160]/10 flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-[#5c7160]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#5c7160] mb-2">Nenhum cliente selecionado</h3>
              <p className="text-[#5c7160]/70">
                Selecione um cliente da lista para visualizar seus detalhes
              </p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default Clients;