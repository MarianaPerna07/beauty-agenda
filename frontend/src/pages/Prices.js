import React, { useEffect, useState } from "react";
import scrollToTop from "../helpers/scrollToTop";
import BookingButton from "../components/BookingButton";
import bannerImage from "../images/banner-image.png";

function Prices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // scroll para topo ao montar
  useEffect(() => {
    scrollToTop();
  }, []);

  // fetch de todos os serviços
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:5001/services");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const { services } = await res.json();
        setServices(services);

        // extrai categorias únicas
        const uniqueCats = [
          ...new Set(services.map((s) => s.category)),
        ];
        setCategories(uniqueCats);
      } catch (e) {
        console.error(e);
        setError("Erro ao carregar o preçário. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // função para formatar o preço
  const formatPrice = (p) =>
    typeof p === "number" ? `${p.toFixed(2).replace(".", ",")} €` : p;

  return (
    <div className="min-h-screen bg-[#F5F1E9]">
      {/* Hero Section */}
      <div className="relative">
        <img
          className="object-cover h-[30vh] w-full"
          src={bannerImage}
          alt="Preçário"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#c0a080]/40 to-[#c0a080]/70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-[#F5F1E9] text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">
            Preçário
          </h2>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16">
          <svg
            viewBox="0 0 1200 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,60 V30 C150,50 350,40 500,35 C650,30 750,25 900,30 C1050,35 1200,45 1200,45 V60 H0 Z"
              fill="#F5F1E9"
            />
          </svg>
        </div>
      </div>

      {/* Intro */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl md:text-4xl font-light text-[#5c7160] mb-6">
            Os Nossos Serviços e Preços
          </h3>
          <p className="text-lg text-[#5c7160]/80">
            Oferecemos uma variedade de tratamentos de beleza de alta qualidade
            por preços acessíveis. Consulte a nossa lista completa abaixo.
          </p>
        </div>
      </section>

      {/* Prices */}
      <section className="pb-16 px-6">
        <div className="container mx-auto max-w-5xl space-y-12">
          {loading && (
            <p className="text-center text-[#5c7160]">Carregando...</p>
          )}
          {error && (
            <p className="text-center text-red-500">{error}</p>
          )}

          {!loading &&
            !error &&
            categories.map((cat) => {
              // filtra serviços desta categoria
              const list = services.filter(
                (s) => s.category === cat
              );
              return (
                <div key={cat}>
                  <h4 className="text-2xl font-medium text-[#415140] mb-4">
                    {cat}
                  </h4>
                  <ul className="space-y-2">
                    {list.map(({ service_id, name, price }) => (
                      <li
                        key={service_id}
                        className="flex justify-between items-center border-b border-[#5c7160]/20 pb-2"
                      >
                        <span className="text-[#5c7160]">{name}</span>
                        <span className="font-semibold text-[#c0a080]">
                          {formatPrice(price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#F5F1E9]/10 to-[#F5F1E9]/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-2xl md:text-3xl font-light text-[#5c7160] mb-6">
            Vamos marcar uma sessão?
          </h3>
          <p className="text-lg text-[#5c7160]/80 mb-8">
            Estamos ansiosas para te proporcionar uma experiência de beleza
            personalizada.
          </p>
          <div className="flex justify-center">
            <BookingButton className="px-8 py-3 text-base md:text-lg">
              <span className="mr-2">Agendar Agora</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 
                  010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 
                  11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 
                  010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </BookingButton>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Prices;
