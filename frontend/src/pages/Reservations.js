import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import scrollToTop from '../helpers/scrollToTop'
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt';
import "../styles/datepicker-custom.css";
import ptCustom from '../utils/datepicker-locale';
import mariaImg from '../images/maria.png'
import laraImg  from '../images/lara.png'
import bannerImage from '../images/banner-image.png'

// Registrar o idioma português personalizado
registerLocale('pt-custom', ptCustom);

// Componente para a Etapa 5: Confirmação e Dados do Cliente
function ConfirmationStep({
  selectedService,
  selectedProfessional,
  selectedDate,
  selectedTime,
  selectedSalon, // Adicione esta linha
  customerInfo,
  errors,
  handleCustomerInfoChange,
  prevStep,
  handleSubmit
}) {
  // Formata a data para exibição
  const formattedDate = selectedDate 
    ? new Date(selectedDate).toLocaleDateString('pt-PT', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : '';
  
  return (
    <div className="animate-fadeIn flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto">
        <h3 className="text-2xl font-light text-[#5c7160] mb-6">Confirme a sua Reserva</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 w-full">
            <h4 className="text-lg font-medium text-[#5c7160] mb-4 border-b border-[#5c7160]/20 pb-2">Detalhes da Reserva</h4>
            
            <div className="space-y-3">
              <div className="flex">
                <div className="w-1/3 text-[#5c7160]/70">Serviço:</div>
                <div className="w-2/3 font-medium text-[#5c7160]">{selectedService?.name}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-[#5c7160]/70">Duração:</div>
                <div className="w-2/3 text-[#5c7160]">{selectedService?.duration}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-[#5c7160]/70">Preço:</div>
                <div className="w-2/3 font-medium text-[#c0a080]">{selectedService?.price}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-[#5c7160]/70">Profissional:</div>
                <div className="w-2/3 text-[#5c7160]">{selectedProfessional?.name}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-[#5c7160]/70">Salão:</div>
                <div className="w-2/3 text-[#5c7160]">{selectedSalon?.name}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-[#5c7160]/70">Data:</div>
                <div className="w-2/3 text-[#5c7160]">{formattedDate}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-[#5c7160]/70">Hora:</div>
                <div className="w-2/3 text-[#5c7160]">{selectedTime}</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg p-6 w-full">
            <h4 className="text-lg font-medium text-[#5c7160] mb-4 border-b border-[#5c7160]/20 pb-2">Os Seus Dados</h4>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm text-[#5c7160]/80 mb-1">Nome Completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleCustomerInfoChange}
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className={`w-full bg-[#F5F1E9] px-4 py-2.5 border ${errors.name ? 'border-red-400' : 'border-[#5c7160]/20'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5bf99]/50 focus:border-[#a5bf99]`}
                  placeholder="Seu nome completo"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm text-[#5c7160]/80 mb-1">Email (Opcional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleCustomerInfoChange}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className={`w-full bg-[#F5F1E9] px-4 py-2.5 border ${errors.email ? 'border-red-400' : 'border-[#5c7160]/20'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5bf99]/50 focus:border-[#a5bf99]`}
                  placeholder="Seu email"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm text-[#5c7160]/80 mb-1">Telefone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleCustomerInfoChange}
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className={`w-full bg-[#F5F1E9] px-4 py-2.5 border ${errors.phone ? 'border-red-400' : 'border-[#5c7160]/20'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5bf99]/50 focus:border-[#a5bf99]`}
                  placeholder="Seu número de telefone"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              
              {/* <div className="pt-2">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 text-[#5c7160]"
                    required
                  />
                  <span className="ml-2 text-sm text-[#5c7160]/80">
                    Concordo com a <a href="#" className="text-[#5c7160] underline">política de privacidade</a> e os <a href="#" className="text-[#5c7160] underline">termos de serviço</a>.
                  </span>
                </label>
              </div> */}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 w-full max-w-md mx-auto">
          <button
            onClick={prevStep}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-[#5c7160] text-[#5c7160] rounded-full hover:bg-[#5c7160]/10 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Anterior</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !customerInfo.name || 
              !customerInfo.phone || 
              errors.name || 
              errors.email || 
              errors.phone
            }
            className={`w-full sm:w-auto px-6 py-3 rounded-full flex items-center justify-center ${
              customerInfo.name && customerInfo.phone && !errors.name && !errors.email && !errors.phone
                ? "bg-[#5c7160] text-white hover:bg-[#5c7160]/90"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span>Confirmar Reserva</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function Reservations() {

  // Dados de exemplo (no futuro poderão vir de uma API)
  const serviceCategories = [
    { id: 'manicure', name: 'Manicure' },
    { id: 'pedicure', name: 'Pedicure' },
    { id: 'depilacao_mulher', name: 'Depilação a Cera Mulher' },
    { id: 'depilacao_homem', name: 'Depilação a Cera Homem' },
    { id: 'sobrancelhas', name: 'Sobrancelhas' },
    { id: 'depilacao_laser', name: 'Depilação a Laser' },
    { id: 'pestanas', name: 'Extensão de Pestanas' },
    { id: 'destaques', name: 'Especializados' }
  ]

  const services = {
    manicure: [
      { id: 1, name: 'Manicure Simples', duration: '30 min', price: '7.00€' },
      { id: 2, name: 'Manicure simples com pintura', duration: '45 min', price: '8.50€' },
      { id: 3, name: 'Verniz Gel', duration: '60 min', price: '15.00€' },
      { id: 4, name: '1ª Manutenção de Gel sobre a unha', duration: '90 min', price: '25.00€' },
      { id: 5, name: 'Manutenção de Gel', duration: '90 min', price: '20.00€' },
      { id: 6, name: 'Manutenção de Acrygel', duration: '90 min', price: '25.00€' },
      { id: 7, name: '1ª Aplicação De gel com extensão', duration: '90 min', price: '30.00€' },
      { id: 8, name: '1ª aplicação acrygel com extensão', duration: '90 min', price: '35.00€' },
      { id: 9, name: 'Unha partida', duration: '15 min', price: '2.00€' },
      { id: 10, name: 'Remoção Verniz Gel, acrygel', duration: '45 min', price: '10.00€' }
    ],
    pedicure: [
      { id: 11, name: 'Pedicure simples', duration: '30 min', price: '10.00€' },
      { id: 12, name: 'Pedicure simples com verniz', duration: '45 min', price: '10.50€' },
      { id: 13, name: 'Pedicure completa', duration: '60 min', price: '17.00€' },
      { id: 14, name: 'Pedicure completa com verniz', duration: '75 min', price: '17.50€' },
      { id: 15, name: 'Pintura com verniz gel', duration: '40 min', price: '15.00€' },
      { id: 16, name: 'Pedicure com verniz gel', duration: '90 min', price: '22.50€' }
    ],
    depilacao_mulher: [
      { id: 17, name: 'Buço', duration: '10 min', price: '3.00€' },
      { id: 18, name: 'Sobrancelha', duration: '15 min', price: '5.00€' },
      { id: 19, name: 'Mento', duration: '10 min', price: '3.00€' },
      { id: 20, name: 'Axilas', duration: '10 min', price: '4.00€' },
      { id: 21, name: 'Virilha cavada', duration: '20 min', price: '6.00€' },
      { id: 22, name: 'Virilha completa', duration: '20 min', price: '9.00€' },
      { id: 23, name: 'Braços completos', duration: '30 min', price: '8.00€' },
      { id: 24, name: 'Meia perna', duration: '20 min', price: '7.00€' },
      { id: 25, name: 'Perna inteira', duration: '40 min', price: '12.00€' },
      { id: 26, name: 'Perna inteira + virilha + axila', duration: '60 min', price: '22.00€' }
    ],
    depilacao_homem: [
      { id: 27, name: 'Peito/Abdómen', duration: '20 min', price: '12.00€' },
      { id: 28, name: 'Costas', duration: '15 min', price: '10.00€' },
      { id: 29, name: 'Glúteos', duration: '15 min', price: '5.00€' },
      { id: 30, name: 'Virilha', duration: '20 min', price: '8.00€' },
      { id: 31, name: 'Axilas', duration: '10 min', price: '5.00€' },
      { id: 32, name: 'Pernas', duration: '30 min', price: '14.00€' },
      { id: 33, name: 'Braços completos', duration: '30 min', price: '8.00€' }
    ],
    depilacao_laser: [
      { id: 34, name: '1 zona', duration: '15 min', price: '15.00€' },
      { id: 35, name: '2 zonas', duration: '30 min', price: '20.00€' },
      { id: 36, name: '3 zonas', duration: '45 min', price: '30.00€' },
      { id: 37, name: '4 zonas', duration: '40 min', price: '40.00€' },
      { id: 38, name: '5 zonas', duration: '55 min', price: '50.00€' },
      { id: 39, name: 'Corpo inteiro', duration: '90 min', price: '70.00€' }
    ],
    pestanas: [
      { id: 40, name: '1ª aplicação de pestanas brasileiras', duration: '90 min', price: '30.00€' },
      { id: 41, name: 'Aplicação pestanas Egípcia', duration: '90 min', price: '30.00€' },
      { id: 42, name: 'Aplicação De pestanas Híbridas', duration: '90 min', price: '30.00€' },
      { id: 43, name: 'Manutenção (3 em 3 semanas)', duration: '90 min', price: '25.00€' }
    ],
    sobrancelhas: [
      { id: 44, name: 'Brown Lamination', duration: '60 min', price: '25.00€' },
      { id: 45, name: 'Henna', duration: '60 min', price: '15.00€' },
      { id: 46, name: 'Microblading (inclui 2 manutenções)', duration: '90 min', price: '150.00€' }
    ],
    destaques: [
      { id: 47, name: 'Micropigmentação', duration: '120 min', price: '180.00€' },
      { id: 48, name: 'Eyeliner', duration: '90 min', price: '100.00€' },
      { id: 49, name: 'Microagulhamento', duration: '60 min', price: 'Sob consulta' },
      { id: 50, name: 'Micropigmentação Labial', duration: '120 min', price: '240.00€' },
      { id: 51, name: 'Microblading', duration: '90 min', price: '150.00€' }
    ]
  }

  const professionals = [
    {
      id: 1,
      name: 'Maria Cardoso',
      specialty: 'Estética Avançada',
      image: mariaImg,
    },
    {
      id: 2,
      name: 'Lara Almeida',
      specialty: 'Manicure e Pedicure',
      image: laraImg,
    },
  ]

  const salons = [
    { 
      id: 1, 
      name: 'Principio Ativo', 
      address: 'Rua Júlio Dinis n.38, Gafanha da Nazaré', 
      phone: '234 567 890',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3029.506977302153!2d-8.714771684599639!3d40.6088909793428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd23981f7f843abd%3A0xbf2d8e74e1a1b2a!2sR.%20J%C3%BAlio%20Dinis%2038%2C%20Gafanha%20da%20Nazar%C3%A9!5e0!3m2!1spt-PT!2spt!4v1595268867362!5m2!1spt-PT!2spt'
    },
    { 
      id: 2, 
      name: 'Flora Coutinho | Cabeleireiro, Estética e Barbearia', 
      address: 'Av. José Estevão, 290, Gafanha da Nazaré, Portugal', 
      phone: '234 123 456',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3029.4093107372146!2d-8.751661224069252!3d40.63123994846108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2398456e92e8c9%3A0xa02ec9af9448e498!2sAv.%20Jos%C3%A9%20Est%C3%A9v%C3%A3o%20290%2C%203830-556%20Gafanha%20da%20Nazar%C3%A9!5e0!3m2!1spt-PT!2spt!4v1690823715893!5m2!1spt-PT!2spt'
    }
  ]

  // Estados para controlar as etapas e seleções
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedService, setSelectedService] = useState(services[0])
  const [selectedProfessional, setProfessional] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedSalon, setSelectedSalon] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Buscar parâmetros da URL
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const serviceFromUrl = searchParams.get('service');
  
  // Configurar estados com valores iniciais da URL
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl ? serviceCategories.find(cat => cat.id === categoryFromUrl) : serviceCategories[0]
  );
  
  // Encontrar o serviço correspondente quando a página carrega
  useEffect(() => {
    if (categoryFromUrl && serviceFromUrl && services[categoryFromUrl]) {
      const foundService = services[categoryFromUrl].find(
        service => service.name === serviceFromUrl
      );
      
      if (foundService) {
        setSelectedService(foundService);
        
        // Após selecionar o serviço, avançar para a próxima etapa
        if (currentStep === 1) {
          nextStep();
        }
      }
    }
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }, [categoryFromUrl, serviceFromUrl]);


  // Gerador de horários disponíveis
  const generateAvailableTimeSlots = (date) => {
    // Aqui você poderia implementar uma lógica para verificar os horários realmente disponíveis
    const timeSlots = [];
    const startHour = 9; // 9 AM
    const endHour = 19; // 7 PM
    
    for (let hour = startHour; hour <= endHour; hour++) {
      // Adiciona slots a cada 15 minutos (00, 15, 30, 45)
      const formattedHour = hour.toString().padStart(2, '0');
      
      if (hour < endHour) {
        timeSlots.push({ time: `${formattedHour}:00`, available: Math.random() > 0.2 });
        timeSlots.push({ time: `${formattedHour}:15`, available: Math.random() > 0.2 });
        timeSlots.push({ time: `${formattedHour}:30`, available: Math.random() > 0.2 });
        timeSlots.push({ time: `${formattedHour}:45`, available: Math.random() > 0.2 });
      } 

    }

    // Disable the hours that are already past
    const currentHour = new Date().getHours();

    let currentDateTomorrow = new Date();
    // currentDateTomorrow.setDate(currentDateTomorrow.getDate() + 1);
    // console.log('Current Date:', currentDateTomorrow);

    //DEBUG
    // let currentHour = 10;
    console.log('Current Hour:', currentHour);
    if (date && new Date(date).getDate() === currentDateTomorrow.getDate()) {
      timeSlots.forEach(slot => {
        console.log('Slot Time:', slot.time);
        if (parseInt(slot.time.split(':')[0]) < currentHour) {
          slot.available = false; // Disable past hours
        }
      });
    }

    //Disable the minutes that are already past
    const currentMinutes = new Date().getMinutes();
    // let currentMinutes = 0;
    // console.log('Current Minutes:', currentMinutes);
    if (date && new Date(date).getDate() === currentDateTomorrow.getDate()) {
      timeSlots.forEach(slot => {
        const [hour, minute] = slot.time.split(':').map(Number);
        if (hour === currentHour && minute <= currentMinutes - 15) {
          slot.available = false; // Disable past minutes
        }
      });
    }
    
    return timeSlots;
  }

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  
  // Atualizar horários disponíveis quando a data for alterada
  useEffect(() => {
    if (selectedDate) {
      setAvailableTimeSlots(generateAvailableTimeSlots(selectedDate));
    }
  }, [selectedDate]);

  // Funções para navegação entre etapas
  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      // Limpar dados do passo atual antes de voltar
      if (currentStep === 5) {
        // Se estiver saindo da etapa de Confirmação, limpar dados do cliente
        setCustomerInfo({
          name: '',
          email: '',
          phone: ''
        });
      } else if (currentStep === 4) {
        // Se estiver saindo da etapa de Data/Hora, limpar seleções
        setSelectedDate('');
        setSelectedTime('');
        setAvailableTimeSlots([]);
      } else if (currentStep === 3) {
        // Se estiver saindo da etapa de Salão, não é necessário limpar nada
      } else if (currentStep === 2) {
        // Se estiver saindo da etapa de Profissional, limpar seleção
        setProfessional(null);
      }
      
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const goToStep = (step) => {
    // Só permite navegar para passos anteriores ou o atual
    if (step <= currentStep) {
      // Se estiver indo para um passo anterior, limpar dados dos passos subsequentes
      if (step <= 1) {
        // Voltar para o início - limpar tudo exceto a categoria de serviço
        setProfessional(null);
        setSelectedDate('');
        setSelectedTime('');
        setAvailableTimeSlots([]);
        setCustomerInfo({
          name: '',
          email: '',
          phone: ''
        });
      } else if (step <= 2) {
        // Voltar para seleção de profissional - limpar datas e cliente
        setSelectedDate('');
        setSelectedTime('');
        setAvailableTimeSlots([]);
        setCustomerInfo({
          name: '',
          email: '',
          phone: ''
        });
      } else if (step <= 3) {
        // Voltar para seleção de salão - limpar datas e cliente
        setSelectedDate('');
        setSelectedTime('');
        setAvailableTimeSlots([]);
        setCustomerInfo({
          name: '',
          email: '',
          phone: ''
        });
      } else if (step <= 4) {
        // Voltar para seleção de data/hora - limpar cliente
        setCustomerInfo({
          name: '',
          email: '',
          phone: ''
        });
      }
      
      // Atualizar o passo atual
      setCurrentStep(step);
      //Scroll to a specific height on the page
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handleServiceCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedService(null); // Reset service selection when changing category
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleProfessionalSelect = (professional) => {
    setProfessional(professional);
  };

  const handleSalonSelect = (salon) => {
    setSelectedSalon(salon);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleTimeSelect = (time) => {
    // Só permite selecionar horários disponíveis
    setSelectedTime(time);
    //allow disselecting the same time
    if (selectedTime === time) {
      setSelectedTime('');
    }
  };

  const validateField = (name, value) => {
    let errorMessage = '';
    
    switch (name) {
      case 'email':
        // Regex para validar email
        if (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errorMessage = 'Por favor, insira um email válido';
          }
        }
        break;
        
      case 'phone':
        // Regex para telefone português: começa com 9 e tem 9 dígitos
        const phoneRegex = /^[0-9]{9}$/;
        if (!phoneRegex.test(value)) {
          errorMessage = 'Por favor, insira um número válido';
        }
        break;
        
      case 'name':
        // Nome com pelo menos 3 caracteres
        if (value.length < 2) {
          errorMessage = 'Por favor, insira um nome válido';
        }
        break;
        
      default:
        break;
    }
    
    return errorMessage;
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    
    // Atualizar o valor do campo
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validar o campo após digitação
    if(name === 'email') {
      // Se for email, validar apenas se o campo não estiver vazio
      if (value.trim() === '') {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
        return;
      }
    }
    const errorMessage = validateField(name, value);
    
    // Atualizar estado de erros
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Criar string ISO para o datetime da reserva que preserva o fuso horário local
    const timeComponents = selectedTime.split(':');
    const hour = parseInt(timeComponents[0]);
    const minute = parseInt(timeComponents[1]);
    
    // Extrair componentes da data
    const [year, month, day] = selectedDate.split('-');
    
    // Construir manualmente uma string ISO com timezone local (UTC+01:00 para Portugal)
    const reservationTimeISO = `${year}-${month}-${day}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00+01:00`;
    
    // Criar objeto simplificado com os dados da reserva
    const reservationData = {
      service_id: selectedService.id,
      location_id: selectedSalon.id,
      worker_id: selectedProfessional.id,
      reservation_time: reservationTimeISO,
      client_name: customerInfo.name, 
      client_email: customerInfo.email,
      client_phone: customerInfo.phone
    };
    
    // Simular envio para o backend com console.log
    console.log("DADOS DA RESERVA:");
    console.log(JSON.stringify(reservationData, null, 2));
    
    // Em vez do alerta básico, mostrar o modal de confirmação
    setShowConfirmation(true);
  };

  // Componente para a Etapa 1: Seleção de Serviço
  const ServiceSelectionStep = () => (
    <div className="animate-fadeIn flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-8">
          <h3 className="text-2xl font-light text-[#5c7160] mb-4">Selecione a Categoria</h3>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleServiceCategorySelect(category)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory?.id === category.id
                    ? "bg-[#a5bf99] text-white shadow-md"
                    : "bg-white text-[#5c7160] border border-[#5c7160]/30 hover:bg-[#a5bf99]/20"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {selectedCategory && (
          <>
            <h3 className="text-2xl font-light text-[#5c7160] mb-4">Selecione o Serviço</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
              {services[selectedCategory.id].map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[120px] ${
                    selectedService?.id === service.id
                      ? "bg-[#a5bf99] text-white shadow-lg"
                      : "bg-white text-[#5c7160] border border-[#5c7160]/20 hover:border-[#5c7160] hover:shadow"
                  }`}
                >
                  <h4 className="text-lg font-medium mb-2 flex-grow">{service.name}</h4>
                  <div className="flex justify-between text-base mt-auto">
                    <span>{service.duration}</span>
                    <span className={selectedService?.id === service.id ? "font-bold" : "font-bold text-[#c0a080]"}>
                      {service.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 w-full max-w-md mx-auto">
          <button
            onClick={prevStep}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-[#5c7160] text-[#5c7160] rounded-full hover:bg-[#5c7160]/10 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Anterior</span>
          </button>
          <button
            onClick={nextStep}
            disabled={!selectedService}
            className={`w-full sm:w-auto px-6 py-3 rounded-full flex items-center justify-center ${
              selectedService
                ? "bg-[#5c7160] text-white hover:bg-[#5c7160]/90"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span>Próximo</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  // Componente para a Etapa 2: Seleção de Profissional
  const ProfessionalSelectionStep = () => (
    <div className="animate-fadeIn flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl mx-auto">
        <h3 className="text-2xl font-light text-[#5c7160] mb-6">Escolha a Profissional</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
          {professionals.map((professional) => (
            <div
              key={professional.id}
              onClick={() => handleProfessionalSelect(professional)}
              className={` rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-300 ${
                selectedProfessional?.id === professional.id ? "bg-[#a5bf99] transform scale-[1.02]" : "hover:shadow-lg bg-white "
              }`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={professional.image}
                  alt={professional.name}
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h4 className={` text-xl font-medium ${
                selectedProfessional?.id === professional.id ? "text-white" : "text-[#5c7160]"
              }` }>{professional.name}</h4>
                <p className={` ${
                selectedProfessional?.id === professional.id ? "text-white" : "text-[#5c7160]"
              }` }>{professional.specialty}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 w-full max-w-md mx-auto">
          <button
            onClick={prevStep}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-[#5c7160] text-[#5c7160] rounded-full hover:bg-[#5c7160]/10 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Anterior</span>
          </button>
          <button
            onClick={nextStep}
            disabled={!selectedProfessional}
            className={`w-full sm:w-auto px-6 py-3 rounded-full flex items-center justify-center ${
              selectedProfessional
                ? "bg-[#5c7160] text-white hover:bg-[#5c7160]/90"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span>Próximo</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  // Componente para a Etapa 3: Seleção de Salão
  const SalonSelectionStep = () => {
    // Ao entrar neste passo, selecione automaticamente o primeiro salão se nenhum estiver selecionado
    useEffect(() => {
      if (!selectedSalon && salons.length > 0) {
        setSelectedSalon(salons[0]);
      }
    }, []);

    // Função para criar URL do Google Maps a partir do endereço
    const getGoogleMapsUrl = (address) => {
      const encodedAddress = encodeURIComponent(address);
      return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    };

    return (
      <div className="animate-fadeIn flex flex-col items-center">
        <div className="w-full max-w-3xl mx-auto">
          <h3 className="text-2xl font-light text-[#5c7160] mb-6">Escolha o Salão</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
            {salons.map((salon) => (
              <div
                key={salon.id}
                onClick={() => handleSalonSelect(salon)}
                className={`rounded-lg shadow-md cursor-pointer transition-all duration-300 flex flex-col ${
                  selectedSalon?.id === salon.id 
                    ? "bg-[#a5bf99]" 
                    : "hover:shadow-lg bg-white"
                }`}
              >
                <div className="p-5 flex flex-col flex-grow">
                  {/* Título com altura fixa */}
                  <div className="h-14 flex items-center">
                    <h4 className={`text-xl font-medium ${
                      selectedSalon?.id === salon.id ? "text-white" : "text-[#5c7160]"
                    }`}>{salon.name}</h4>
                  </div>
                  
                  {/* Conteúdo */}
                  <div className="flex-grow">
                    {/* Endereço */}
                    <div className="flex items-start mt-4">
                      <div className={`rounded-full p-3 mr-4 ${
                        selectedSalon?.id === salon.id ? "bg-white/20" : "bg-[#5c7160]/10"
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
                          selectedSalon?.id === salon.id ? "text-white" : "text-[#5c7160]"
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-sm mb-1 ${
                          selectedSalon?.id === salon.id ? "text-white/70" : "text-[#5c7160]/70"
                        }`}>Morada</p>
                        <p className={`text-lg ${
                          selectedSalon?.id === salon.id ? "text-white" : "text-[#5c7160]"
                        }`}>{salon.address}</p>
                      </div>
                    </div>
                    
                    {/* Telefone */}
                    <div className="flex items-start mt-4">
                      <div className={`rounded-full p-3 mr-4 ${
                        selectedSalon?.id === salon.id ? "bg-white/20" : "bg-[#5c7160]/10"
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
                          selectedSalon?.id === salon.id ? "text-white" : "text-[#5c7160]"
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-sm mb-1 ${
                          selectedSalon?.id === salon.id ? "text-white/70" : "text-[#5c7160]/70"
                        }`}>Telefone</p>
                        <p className={`text-lg ${
                          selectedSalon?.id === salon.id ? "text-white" : "text-[#5c7160]"
                        }`}>{salon.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botão Google Maps - Posicionado no final do card */}
                  <div className="mt-6">
                    <a 
                      href={getGoogleMapsUrl(salon.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center py-3 px-4 rounded-full w-full transition-all duration-300
                        ${selectedSalon?.id === salon.id 
                          ? "bg-white/20 hover:bg-white/30 text-white" 
                          : "bg-[#5c7160]/10 hover:bg-[#5c7160]/20 text-[#5c7160]"
                        }`}
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que clicar no botão selecione o salão
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>Ver no Google Maps</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 w-full max-w-md mx-auto">
            <button
              onClick={prevStep}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-[#5c7160] text-[#5c7160] rounded-full hover:bg-[#5c7160]/10 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Anterior</span>
            </button>
            <button
              onClick={nextStep}
              disabled={!selectedSalon}
              className={`w-full sm:w-auto px-6 py-3 rounded-full flex items-center justify-center ${
                selectedSalon
                  ? "bg-[#5c7160] text-white hover:bg-[#5c7160]/90"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span>Próximo</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Componente para a Etapa 4: Seleção de Data e Hora
  const DateTimeSelectionStep = () => {
    // Calcula a data mínima (hoje)
    const today = new Date();

    // If today is after 7 PM, set minimum date to tomorrow
    if (today.getHours() >= 19) {
      today.setDate(today.getDate() + 1);
    }
    
    // Agrupa os horários disponíveis em períodos do dia
    const morningSlots = availableTimeSlots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      return hour >= 9 && hour < 12;
    });
    
    const afternoonSlots = availableTimeSlots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      return hour >= 12 && hour < 17;
    });
    
    const eveningSlots = availableTimeSlots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      return hour >= 17;
    });
    
    // Função para manipular a mudança de data
    const handleDateChange = (date) => {
      const localDate = new Date(date);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      
      // Formato com data e hora (meia-noite)
      const formattedDate = `${year}-${month}-${day}T00:00:00+01:00`;
      
      // Simular requisição GET para backend
      console.log("VERIFICAR DISPONIBILIDADE:");
      console.log(JSON.stringify({
        date: formattedDate,
        location_id: selectedSalon?.id || salons[0].id,
        service_id: selectedService?.id || "todos",   
        worker_id: selectedProfessional?.id || "todos"
      }, null, 2));
      
      // Para o seletor de data, continuamos usando apenas a parte da data
      handleDateSelect(`${year}-${month}-${day}`);
    };
    
    const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
    
    // Renderizar conteúdo dos dias
    const renderDayContents = (day) => {
      return <span className="font-medium">{day}</span>;
    };
    
    return (
      <div className="animate-fadeIn flex flex-col items-center">
        <div className="w-full max-w-3xl mx-auto">
          <h3 className="text-2xl font-light text-[#5c7160] mb-6 text-center">Escolha a Data e Hora</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center w-full">
              {/* Container que centraliza e mantém largura consistente */}
              <div className="flex flex-col items-center w-full">
              <h4 className="text-lg font-medium text-[#5c7160] mb-3 text-center">Data</h4>
                <div className="custom-datepicker-wrapper mb-4 w-full max-w-[360px]">
                  <DatePicker
                    selected={selectedDateObj}
                    onChange={handleDateChange}
                    minDate={today}
                    locale="pt-custom"
                    dateFormat="dd/MM/yyyy"
                    renderDayContents={renderDayContents}
                    formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 3)}
                    dayClassName={() => "custom-day"}
                    className="w-full px-4 py-3 border border-[#5c7160]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a5bf99]/50 focus:border-[#a5bf99]"
                    calendarClassName="custom-calendar"
                    showPopperArrow={false}
                    inline
                    showMonthYearPicker={false}
                    renderCustomHeader={({
                      date,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled
                    }) => (
                      <div className="custom-header">
                        <span className="month-year">
                          {date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </span>
                        <div className="navigation">
                          <button 
                            onClick={decreaseMonth} 
                            disabled={prevMonthButtonDisabled}
                            className="prev-month"
                          >
                            &lt;
                          </button>
                          <button 
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                            className="next-month"
                          >
                            &gt;
                          </button>
                        </div>
                      </div>
                    )}
                  />
                </div>
                
                {/* Seção de ajuda com a mesma largura que o datepicker */}
                <div className="bg-[#F5F1E9] border border-[#5c7160]/20 rounded-lg p-4 shadow-sm mt-2 w-full max-w-[360px]">
                  <div className="flex items-center">
                    <div className="bg-[#5c7160]/10 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5c7160]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[#5c7160] font-medium text-sm">Precisa de Ajuda?</div>
                      <div className="text-[#5c7160] font-bold">965593794</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedDate && (
              <div className="flex flex-col items-center w-full">
                <h4 className="text-lg font-medium text-[#5c7160] mb-3 text-center">Hora</h4>
                
                <div className="w-full flex flex-col items-center">
                  {availableTimeSlots.length > 0 ? (
                    <>
                      {availableTimeSlots.length > 0 && (
                        <div className="w-94 flex justify-center">
                          {/* <div className="flex flex-wrap justify-center gap-8 w-full"> */}
                          <div className="grid grid-cols-4 gap-2 w-full place-items-center">
                            {availableTimeSlots.map((slot) => (
                              <button
                                key={slot.time}
                                onClick={() => slot.available && handleTimeSelect(slot.time)}
                                disabled={!slot.available}
                                className={`
                                  px-3 py-2 rounded-md transition-all w-[85px] h-[40px] flex items-center justify-center
                                  ${!slot.available
                                    ? "text-white cursor-not-allowed border border-gray-100"
                                    : selectedTime === slot.time
                                      ? "bg-[#a5bf99] text-white"
                                      : "bg-white border border-[#a5bf99]/30 text-[#a5bf99] hover:border-[#a5bf99]"
                                  }
                                `}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {selectedTime && (
                        <div className="mt-4 bg-[#a5bf99]/20 p-3 rounded-lg w-full">
                          <div className="flex items-center text-[#5c7160]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Horário selecionado: {selectedTime}</span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-4 bg-[#F5F1E9]/50 rounded-lg text-center text-[#5c7160] max-w-md w-full">
                      <p>Não há horários disponíveis para esta data.</p>
                      <p className="text-sm mt-2">Por favor, selecione outra data.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 w-full max-w-md mx-auto">
            <button
              onClick={prevStep}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-[#5c7160] text-[#5c7160] rounded-full hover:bg-[#5c7160]/10 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Anterior</span>
            </button>
            <button
              onClick={nextStep}
              disabled={!selectedDate || !selectedTime}
              className={`w-full sm:w-auto px-6 py-3 rounded-full flex items-center justify-center ${
                selectedDate && selectedTime
                  ? "bg-[#5c7160] text-white hover:bg-[#5c7160]/90"
                  : "bg-gray-100 text-white cursor-not-allowed"
              }`}
            >
              <span>Próximo</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };


  // Renderizar a etapa atual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ServiceSelectionStep />;
      case 2:
        return <ProfessionalSelectionStep />;
      case 3:
        return <SalonSelectionStep />;
      case 4:
        return <DateTimeSelectionStep />;
      case 5:
        return (
          <ConfirmationStep
            selectedService={selectedService}
            selectedProfessional={selectedProfessional}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedSalon={selectedSalon} // Adicione esta linha
            customerInfo={customerInfo}
            errors={errors}
            handleCustomerInfoChange={handleCustomerInfoChange}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return <ServiceSelectionStep />;
    }
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    // Reset all states to initial values
    setCurrentStep(1);
    setSelectedService(null);
    setProfessional(null);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedSalon(null);
    setCustomerInfo({
      name: '',
      email: '',
      phone: ''
    });
    setErrors({
      name: '',
      email: '',
      phone: ''
    });
  };

  return (
    <div className='min-h-screen bg-[#F5F1E9]' id='banner'>
      {/* Hero Section */}
      <div className='relative'>
        <img 
          className='object-cover h-[30vh] w-full' 
          src={bannerImage}
          alt="Agendamento de serviços"
        />
        <div className='absolute inset-0 bg-gradient-to-b from-[#c0a080]/40 to-[#c0a080]/70'></div>
        <div className='absolute inset-0 flex items-center justify-center px-4'>
  <h2 className="text-[#F5F1E9] text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">
    Agende o seu Serviço
  </h2>
</div>
        
        {/* Wave shape at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-16" id="wave-shape">
          <svg viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,60 V30 C150,50 350,40 500,35 C650,30 750,25 900,30 C1050,35 1200,45 1200,45 V60 H0 Z" fill="#F5F1E9"/>
          </svg>
        </div>
      </div>
      
      {/* Stepper */}
      <div className="pt-8 pb-4 px-6 relative" id="stepper">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center relative px-2 sm:px-8">
            {/* Linha de fundo (não completado) */}
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-[#5c7160]/10"></div>
            
            {/* Linha de progresso (completado) */}
            <div 
              id='progress-line'
              className="absolute left-0 top-5 h-0.5 bg-[#a5bf99]"
              style={{ 
                width: `${((currentStep - 1) / 4) * 100}%`,
                transition: 'width 0.3s ease-in-out' 
              }}
            ></div>
            
            {/* Pontos do stepper */}
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div 
                  onClick={() => goToStep(step)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === step 
                      ? "bg-[#5c7160] text-white" 
                      : currentStep > step 
                        ? "bg-[#a5bf99] text-white cursor-pointer" 
                        : "bg-white text-[#5c7160] border border-[#5c7160]/20"
                  }`}
                  style={step < currentStep ? { cursor: 'pointer' } : {}}
                >
                  {currentStep > step ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <span className={`text-xs mt-2 hidden md:block ${
                  currentStep === step 
                    ? "text-[#5c7160] font-medium" 
                    : "text-[#5c7160]/60"
                }`}>
                  {step === 1 && "Serviço"}
                  {step === 2 && "Profissional"}
                  {step === 3 && "Salão"}
                  {step === 4 && "Data/Hora"}
                  {step === 5 && "Confirmação"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          {renderStep()}
        </div>
      </section>

      {/* Modal de Confirmação */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-[#F5F1E9] rounded-lg shadow-xl p-6 max-w-md w-full animate-fadeIn">
            <div className="flex flex-col items-center text-center">
              {/* Ícone de sucesso */}
              <div className="bg-[#a5bf99] rounded-full p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Título e mensagem */}
              <h3 className="text-2xl font-light text-[#5c7160] mb-2">Reserva Confirmada</h3>
              <p className="text-[#5c7160]/80 mb-6">
                A sua reserva foi realizada com sucesso!
              </p>
              
              {/* Informações da reserva */}
              <div className="bg-white rounded-lg p-4 mb-6 w-full">
                <div className="flex justify-between mb-2">
                  <span className="text-[#5c7160]/70">Serviço:</span>
                  <span className="font-medium text-[#5c7160]">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[#5c7160]/70">Profissional:</span>
                  <span className="text-[#5c7160]">{selectedProfessional?.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[#5c7160]/70">Data:</span>
                  <span className="text-[#5c7160]">{selectedDate ? new Date(selectedDate).toLocaleDateString('pt-PT') : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5c7160]/70">Hora:</span>
                  <span className="text-[#5c7160]">{selectedTime}</span>
                </div>
              </div>
              
              {/* Botão de OK */}
              <button 
                onClick={handleCloseConfirmation}
                className="px-6 py-3 bg-[#5c7160] text-white rounded-full hover:bg-[#5c7160]/90 transition-colors w-full sm:w-auto min-w-[150px]"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reservations