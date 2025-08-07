import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo
} from "react";
import { useSearchParams } from "react-router-dom";
import scrollToTop from "../helpers/scrollToTop";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptCustom from "../utils/datepicker-locale";
import "../styles/datepicker-custom.css";
import mariaImg from "../images/maria.png";
import laraImg from "../images/lara.png";
import bannerImage from "../images/banner-image.png";

// Registrar o idioma português personalizado
registerLocale('pt-custom', ptCustom);

// Helper para gerar slug de categoria
const slugify = (str) =>
  str.toLowerCase().replace(/\s+/g, "_").replace(/ç/g, "c");

// -----------------
// CategoryBar
// -----------------
const CategoryBar = memo(
  ({ serviceCategories, selectedCategory, onCategorySelect }) => {
    const scrollContainerRef = useRef(null);

    // centraliza botão ativo
    useEffect(() => {
      if (!scrollContainerRef.current || !selectedCategory) return;
      const btn = Array.from(scrollContainerRef.current.children).find(
        (b) => b.dataset.categoryId === selectedCategory.id
      );
      if (!btn) return;
      const raw =
        btn.offsetLeft -
        scrollContainerRef.current.clientWidth / 2 +
        btn.clientWidth / 2;
      scrollContainerRef.current.scrollTo({
        left: raw,
        behavior: "smooth",
      });
    }, [selectedCategory]);
  
  const handleCategoryClick = useCallback((e, category) => {
    e.preventDefault();
    
    const container = scrollContainerRef.current;
    const button = e.currentTarget;
    
    if (!container || !button) return;
  
    // Calcular a posição de rolagem
    const rawTarget = button.offsetLeft
      - (container.clientWidth / 2)
      + (button.clientWidth / 2);
  
    // Limitar dentro dos limites do container
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const targetScrollLeft = Math.min(Math.max(rawTarget, 0), maxScrollLeft);
  
    // Animar a rolagem primeiro
    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });
    
    // Atualizar o estado DEPOIS da animação começar
    // Isso é crucial para evitar o "piscar"
    setTimeout(() => {
      onCategorySelect(category);
    }, 50);
  }, [onCategorySelect]);

  return (
    <div className="relative overflow-hidden mb-8">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-3 py-2 px-1 hide-scrollbar"
      >
        {serviceCategories.map((cat) => (
          <button
            key={cat.id}
            data-category-id={cat.id}
            onClick={(e) => handleCategoryClick(e, cat)}
            className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full transition-all duration-300 ${
              selectedCategory?.id === cat.id
                ? "bg-[#5c7160] text-white shadow-md"
                : "bg-white text-[#5c7160] border border-[#5c7160]/30 hover:bg-[#a5bf99]/20"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
);

// -----------------
// Step 1: Serviço
// -----------------
const ServiceSelectionStep = ({
  serviceCategories,
  selectedCategory,
  setSelectedCategory,
  servicesList,
  selectedService,
  setSelectedService,
  nextStep,
  prevStep,
}) => {
  const handleServiceSelect = useCallback(
    (svc) => setSelectedService(svc),
    [setSelectedService]
  );

  return (
    <div className="animate-fadeIn flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-8">
          <h3 className="text-2xl font-light text-[#5c7160] mb-4">
            Selecione a Categoria
          </h3>
          <CategoryBar
            serviceCategories={serviceCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={(cat) => {
              setSelectedCategory(cat);
              setSelectedService(null);
            }}
          />
        </div>

        {selectedCategory && (
          <>
            <h3 className="text-2xl font-light text-[#5c7160] mb-4">
              Selecione o Serviço
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
              {servicesList
                .filter((s) => slugify(s.category) === selectedCategory.id)
                .map((svc) => (
                  <div
                    key={svc.service_id}
                    onClick={() => handleServiceSelect(svc)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[120px] ${
                      selectedService?.service_id === svc.service_id
                        ? "bg-[#a5bf99] text-white shadow-lg"
                        : "bg-white text-[#5c7160] border border-[#5c7160]/20 hover:border-[#5c7160] hover:shadow"
                    }`}
                  >
                    <h4 className="text-lg font-medium mb-2 flex-grow">
                      {svc.name}
                    </h4>
                    <div className="flex justify-between text-base mt-auto">
                      <span>{`${svc.duration} min`}</span>
                      <span
                        className={
                          selectedService?.service_id === svc.service_id
                            ? "font-bold"
                            : "font-bold text-[#c0a080]"
                        }
                      >
                        {typeof svc.price === "number"
                          ? `${svc.price.toFixed(2).replace(".", ",")}€`
                          : svc.price}
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
            ← Anterior
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
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para a Etapa 4: Confirmação e Dados do Cliente
function ConfirmationStep({
  selectedService,
  selectedProfessional,
  selectedDate,
  selectedTime,
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

// -----------------
// Componente principal
// -----------------
function Reservations() {

  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const serviceFromUrl = searchParams.get("service");

  // estados de navegação
  const [currentStep, setCurrentStep] = useState(1);

  // **SERVIÇOS e CATEGORIAS**
  const [servicesList, setServicesList] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [errorServices, setErrorServices] = useState(null);

  // **PROFISSIONAIS**
  const [workersList, setWorkersList] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [errorWorkers, setErrorWorkers] = useState(null);

  // seleções
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const stepperRef = useRef(null);
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" });

  const scrollToContent = useCallback(() => {
    if (stepperRef.current) {
      // Scroll até o stepper com um pequeno offset
      const headerOffset = 80;
      const elementPosition = stepperRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const workerImages = {
    1: mariaImg,
    2: laraImg
  };
  

  // Fetch dos serviços ao montar
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoadingServices(true);
        const res = await fetch("http://127.0.0.1:5001/services");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const { services } = await res.json();
        setServicesList(services);

        // extrair categorias únicas
        const unique = Array.from(
          new Set(services.map((s) => s.category))
        ).map((name) => ({
          id: slugify(name),
          name,
        }));
        setServiceCategories(unique);

        // categoria inicial
        const initial =
          categoryFromUrl && unique.find((c) => c.id === categoryFromUrl)
            ? unique.find((c) => c.id === categoryFromUrl)
            : unique[0];
        setSelectedCategory(initial);
      } catch (e) {
        console.error(e);
        setErrorServices("Não foi possível carregar os serviços.");
      } finally {
        setLoadingServices(false);
      }
    }
    fetchServices();
  }, [categoryFromUrl]);

  // Se vier `serviceFromUrl`, já seleciona e avança
  useEffect(() => {
    if (
      serviceFromUrl &&
      selectedCategory &&
      servicesList.length > 0 &&
      currentStep === 1
    ) {
      const found = servicesList.find(
        (s) =>
          slugify(s.category) === selectedCategory.id &&
          s.name === serviceFromUrl
      );
      if (found) {
        setSelectedService(found);
        setCurrentStep(2);
      }
    }
  }, [serviceFromUrl, selectedCategory, servicesList, currentStep]);

  useEffect(() => {
    async function fetchWorkers() {
      try {
        setLoadingWorkers(true);
        const res = await fetch("http://127.0.0.1:5001/workers");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const { workers } = await res.json();
        setWorkersList(workers);
      } catch (e) {
        console.error(e);
        setErrorWorkers("Não foi possível carregar as profissionais.");
      } finally {
        setLoadingWorkers(false);
      }
    }
    fetchWorkers();
  }, []);  
  
  // Adicione este useEffect para gerenciar o scroll quando o passo muda
  useEffect(() => {
    // Pequeno delay para garantir que o DOM foi atualizado
    const timer = setTimeout(() => {
      scrollToContent();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentStep, scrollToContent]);

  // Gerador de horários disponíveis
  const updateAvailableTimeSlots = (date, available_slots = {}) => {
    const timeSlots = [];
    const startHour = 9; // 9 AM
    const endHour = 19; // 7 PM
    
    for (let hour = startHour; hour <= endHour; hour++) {
      // Adiciona slots a cada 15 minutos (00, 15, 30, 45)
      const formattedHour = hour.toString().padStart(2, '0');
      
      if (hour < endHour) {
        timeSlots.push({ time: `${formattedHour}:00`, available: true});
        timeSlots.push({ time: `${formattedHour}:15`, available: true});
        timeSlots.push({ time: `${formattedHour}:30`, available: true});
        timeSlots.push({ time: `${formattedHour}:45`, available: true});
      } 

    }

    // Disable the hours that are already past
    const currentHour = new Date().getHours();

    let currentDateTomorrow = new Date();
    // currentDateTomorrow.setDate(currentDateTomorrow.getDate() + 1);
    // console.log('Current Date:', currentDateTomorrow);

    //DEBUG
    // let currentHour = 10;
    if (date && new Date(date).getDate() === currentDateTomorrow.getDate()) {
      timeSlots.forEach(slot => {
        if (parseInt(slot.time.split(':')[0]) < currentHour) {
          slot.available = 1; // Disable past hours
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
          slot.available = 1; // Disable past minutes
        }
      });
    }

    // Apply the available slots from the API 
    let index = 0;
    if (available_slots && date) {
      timeSlots.forEach(slot => {
        let slotStatus = available_slots[index];
        slot.available = slotStatus; 
        index++;
      });
    }
    
    return timeSlots;
  }

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);


  // Funções para navegação entre etapas
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      // Limpar dados do passo atual antes de voltar
      if (currentStep === 4) {
        // Se estiver saindo da etapa de Confirmação, limpar dados do cliente
        setCustomerInfo({
          name: '',
          email: '',
          phone: ''
        });
      } else if (currentStep === 3) {
        // Se estiver saindo da etapa de Data/Hora, limpar seleções
        setSelectedDate('');
        setSelectedTime('');
        setAvailableTimeSlots([]); 
      } else if (currentStep === 2) {
        // Se estiver saindo da etapa de Profissional, limpar seleção
        setSelectedProfessional(null);
      }
      
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    // Só permite navegar para passos anteriores ou o atual
    if (step <= currentStep) {
      // Se estiver indo para um passo anterior, limpar dados dos passos subsequentes
      if (step <= 1) {
        // Voltar para o início - limpar tudo exceto a categoria de serviço
        setSelectedProfessional(null);
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
    }
  };

  const handleProfessionalSelect = (professional) => {
    setSelectedProfessional(professional);
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
      service_id: selectedService.service_id,
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

  // Componente para a Etapa 2: Seleção de Profissional
  const ProfessionalSelectionStep = ({
    professionals,
    loading,
    error,
    selectedProfessional,
    handleProfessionalSelect,
    prevStep,
    nextStep
  }) => {
    if (loading) return <p className="text-center">Carregando profissionais…</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
  
    return (
      <div className="animate-fadeIn flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl mx-auto">
          <h3 className="text-2xl font-light text-[#5c7160] mb-6">
            Escolha a Profissional
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
            {professionals.map((prof) => (
              <div
                key={prof.id}
                onClick={() => handleProfessionalSelect(prof)}
                className={`rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-300 ${
                  selectedProfessional?.id === prof.id
                    ? "bg-[#a5bf99] transform scale-[1.02]"
                    : "hover:shadow-lg bg-white"
                }`}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={prof.image}
                    alt={prof.name}
                    className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h4
                    className={`text-xl font-medium ${
                      selectedProfessional?.id === prof.id
                        ? "text-white"
                        : "text-[#5c7160]"
                    }`}
                  >
                    {prof.name}
                  </h4>
                  <p
                    className={
                      selectedProfessional?.id === prof.id
                        ? "text-white"
                        : "text-[#5c7160]"
                    }
                  >
                    {prof.specialty}
                  </p>
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
  };  

  const availablePros = workersList
  .filter(w => selectedService?.workers?.includes(w.worker_id))
  .map(w => ({
    id: w.worker_id,
    name: w.name,
    specialty: w.description,
    image: workerImages[w.worker_id] || ''
  }));



  // Componente para a Etapa 4: Seleção de Data e Hora
  const DateTimeSelectionStep = () => {
    // Calcula a data mínima (hoje)
    const today = new Date();

    // If today is after 7 PM, set minimum date to tomorrow
    if (today.getHours() >= 19) {
      today.setDate(today.getDate() + 1);
    }

    
    // Função para manipular a mudança de data - corrigido
const handleDateChange = async (date) => {
  const localDate = new Date(date);
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  
  // Formato com data e hora (meia-noite)
  const formattedDate = `${year}-${month}-${day}T00%3A00%3A00%2B01%3A00`;
  
  // Simular requisição GET para backend
  console.log("VERIFICAR DISPONIBILIDADE:");
  console.log(JSON.stringify({
    date: formattedDate,
    service_id: selectedService.service_id,
    worker_id: selectedProfessional.id
  }, null, 2));

  // Para o seletor de data, atualizamos primeiro para mostrar a seleção visual
  handleDateSelect(`${year}-${month}-${day}`);
  
  // Agora fazemos a chamada da API e aguardamos o resultado
  try {
    const res = await fetch(`http://127.0.0.1:5001/availability?date=${formattedDate}&service_id=${selectedService.service_id}&worker_id=${selectedProfessional.id}`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const { available_slots } = await res.json();
    console.log("Horários disponíveis:", available_slots);

    // Atualiza os slots disponíveis com o resultado da API
    setAvailableTimeSlots(updateAvailableTimeSlots(`${year}-${month}-${day}`, available_slots));
  } catch (e) {
    console.error("Erro ao buscar horários disponíveis:", e);
    // Em caso de erro, mostrar slots vazios
    setAvailableTimeSlots([]);
  }
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
                {/* Legenda e Ajuda em coluna - mais compacto */}
                <div className="w-full max-w-[360px] flex flex-col gap-2 mt-2">
                  {/* Cartão: Legenda */}
                  <div className="bg-[#F5F1E9] border border-[#5c7160]/20 rounded-lg p-4 shadow-sm w-full">
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        {/* Mini retângulo estilo "livre" (mais semelhante ao botão real) */}
                        <span className="inline-block w-14 h-6 rounded-md border border-[#a5bf99]/30 bg-white mr-2 flex-shrink-0 shadow-sm"></span>
                        <span className="text-[#5c7160] text-sm">Horário livre</span>
                      </li>
                      <li className="flex items-center">
                        {/* Mini retângulo estilo "reservado" */}
                        <span className="inline-block w-14 h-6 rounded-md mr-2 bg-[#a3a3a3]/70 flex-shrink-0 shadow-sm"></span>
                        <span className="text-[#5c7160] text-sm">Horário já reservado</span>
                      </li>
                      <li className="flex items-center">
                        {/* Mini retângulo estilo "não pode começar" */}
                        <span className="inline-block w-14 h-6 rounded-md mr-2 bg-red-300 flex-shrink-0 shadow-sm"></span>
                        <span className="text-[#5c7160] text-sm">Horário sobrepõe reservas</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Precisa de ajuda - more compact */}
                  <div className="bg-white border border-[#5c7160]/20 rounded-lg p-3 shadow-sm w-full flex items-center">
                    <div className="bg-[#5c7160]/10 rounded-full p-1.5 mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#5c7160]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[#5c7160] font-medium text-xs">Precisa de Ajuda?</div>
                      <div className="text-[#5c7160] font-bold text-sm leading-tight">965593794</div>
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
                                onClick={() => slot.available === 0 && handleTimeSelect(slot.time)}
                                // disabled={slot.available === 1 || slot.available === 2}
                                className={`
                                  px-3 py-2 rounded-md transition-all w-[85px] h-[40px] flex items-center justify-center
                                  ${slot.available === 2
                                    ? "bg-red-300 text-white cursor-not-allowed"
                                    : slot.available === 1
                                      ? "bg-[#a3a3a3] bg-opacity-50 text-white cursor-not-allowed"
                                      : selectedTime === slot.time
                                        ? "bg-[#a5bf99]  text-white"
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
                              <circle cx="12" cy="12" r="10" strokeWidth={2} />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
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
    if (loadingServices) {
      return <p className="text-center text-[#5c7160]">Carregando...</p>;
    }
    if (errorServices) {
      return (
        <p className="text-center text-red-500">{errorServices}</p>
      );
    }
    switch (currentStep) {
      case 1:
        return <ServiceSelectionStep
        serviceCategories={serviceCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        servicesList={servicesList}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        nextStep={nextStep}
        prevStep={prevStep}
      />;
      case 2:
        return (
          <ProfessionalSelectionStep
            professionals={availablePros}
            selectedProfessional={selectedProfessional}
            handleProfessionalSelect={handleProfessionalSelect}
            prevStep={prevStep}
            nextStep={nextStep}
            loading={loadingWorkers}
            error={errorWorkers}
          />
        );

      case 3:
        return <DateTimeSelectionStep />;
      case 4:
        return (
          <ConfirmationStep
            selectedService={selectedService}
            selectedProfessional={selectedProfessional}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
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
    setSelectedProfessional(null);
    setSelectedDate('');
    setSelectedTime('');
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
      <div ref={stepperRef} className="pt-8 pb-4 px-6 relative" id="stepper">
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
            {[1, 2, 3, 4].map((step) => (
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
                  {step === 3 && "Data/Hora"}
                  {step === 4 && "Confirmação"}
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