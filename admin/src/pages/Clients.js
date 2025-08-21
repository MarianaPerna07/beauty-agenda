import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedClient, setEditedClient] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const { token } = useAuth();

  // Fetch clients data
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:5001/clients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setClients(data.clients || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
      setError("Não foi possível carregar a lista de clientes.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setEditedClient({...client});
    setEditMode(false);
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
      setLoading(true);
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
      
      // Refresh the client list
      fetchClients();
      
    } catch (err) {
      console.error("Failed to update client:", err);
      setError("Não foi possível atualizar os dados do cliente.");
    } finally {
      setLoading(false);
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
    <div className="p-6 bg-[#F5F1E9] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-medium text-[#5c7160] mb-6">Gestor de clientes</h1>
        
        {/* Search Box */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cliente por nome, telefone ou email..."
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5c7160]"
              onChange={handleSearch}
            />
            <svg
              className="w-5 h-5 absolute left-3 top-3.5 text-gray-400"
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
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Clients List */}
          <div className="w-full md:w-1/2 bg-white p-5 rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl text-[#5c7160] mb-4 font-medium">Lista de clientes</h2>
            {loading && !filteredClients.length ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5c7160]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : !filteredClients.length ? (
              <div className="text-center py-4 text-gray-500">Nenhum cliente encontrado</div>
            ) : (
              <div className="overflow-y-auto max-h-[500px]">
                <table className="min-w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservas</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.map((client, index) => (
                      <tr
                        key={index}
                        onClick={() => handleClientSelect(client)}
                        className={`hover:bg-gray-100 cursor-pointer ${selectedClient?.phone === client.phone ? 'bg-[#5c7160]/10' : ''}`}
                      >
                        <td className="py-3 px-4">{client.name || 'N/A'}</td>
                        <td className="py-3 px-4">{client.phone || 'N/A'}</td>
                        <td className="py-3 px-4">{client.total_reservations || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Client Details */}
          <div className="w-full md:w-1/2 bg-white p-5 rounded-lg shadow-md">
            {selectedClient ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl text-[#5c7160] font-medium">Detalhes do Cliente</h2>
                  <div className="space-x-2">
                    {!editMode ? (
                      <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-[#5c7160] text-white rounded-md hover:bg-[#5c7160]/90 transition"
                      >
                        Editar
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-[#5c7160] text-white rounded-md hover:bg-[#5c7160]/90 transition"
                        >
                          Salvar
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Nome</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={editedClient.name || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5c7160]"
                      />
                    ) : (
                      <p className="text-gray-800">{selectedClient.name || 'N/A'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Telefone</label>
                    <p className="text-gray-800">{selectedClient.phone || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={editedClient.email || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5c7160]"
                      />
                    ) : (
                      <p className="text-gray-800">{selectedClient.email || 'N/A'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Data de Nascimento</label>
                    {editMode ? (
                      <input
                        type="date"
                        name="birthday"
                        value={editedClient.birthday ? editedClient.birthday.split('T')[0] : ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5c7160]"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {selectedClient.birthday 
                          ? format(new Date(selectedClient.birthday), 'dd/MM/yyyy', { locale: pt })
                          : 'N/A'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Data de Registro</label>
                    <p className="text-gray-800">
                      {selectedClient.registration_day
                        ? format(new Date(selectedClient.registration_day), 'dd/MM/yyyy', { locale: pt })
                        : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Total de Reservas</label>
                    <p className="text-gray-800">{selectedClient.total_reservations || 0}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <p>Selecione um cliente para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clients;