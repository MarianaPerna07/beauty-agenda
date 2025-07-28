import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import scrollToTop from '../helpers/scrollToTop'
import bannerImage from '../images/banner-image.png'
import ServiceModal from '../components/ServiceModal'
import BookingButton from '../components/BookingButton'

function Services() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const serviceFromUrl = searchParams.get('service');
  
  // Estado para categoria ativa, inicializa com o valor da URL ou 'manicure' por padrão
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || 'manicure')

  // Estado para controlar o modal
  const [selectedService, setSelectedService] = useState(null);
  
  // Efeito para rolar para o elemento do serviço se especificado na URL
  useEffect(() => {
    scrollToTop();
    
    // Se temos um serviço específico na URL, encontre-o e role até ele
    if (serviceFromUrl) {
      setTimeout(() => {
        const serviceElement = document.getElementById(`service-${serviceFromUrl}`);
        if (serviceElement) {
          serviceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Adicionar uma classe de destaque temporária
          serviceElement.classList.add('highlight-service');
          setTimeout(() => {
            serviceElement.classList.remove('highlight-service');
          }, 2000);
        }
      }, 500);
    }
  }, [serviceFromUrl]);

  // Função para abrir o modal
  const openServiceModal = (service) => {
    setSelectedService(service);
  };

  // Função para fechar o modal
  const closeServiceModal = () => {
    setSelectedService(null);
  };

  // Categorias de serviços
  const categories = [
    { id: 'manicure', name: 'Manicure' },
    { id: 'depilacao_mulher', name: 'Depilação a Cera Mulher' },
    { id: 'depilacao_homem', name: 'Depilação a Cera Homem' },
    { id: 'pedicure', name: 'Pedicure' },
    { id: 'depilacao_laser', name: 'Depilação a Laser' },
    { id: 'sobrancelhas', name: 'Sobrancelhas' },
    { id: 'pestanas', name: 'Extensão de Pestanas' },
    { id: 'destaques', name: 'Destaques' }
  ]
  
  // Dados detalhados dos serviços organizados por categoria
  const serviceData = {
    manicure: [
      {
        title: 'Manicure Simples',
        price: '7€',
        duration: '30 min',
        image: 'https://images.pexels.com/photos/939836/pexels-photo-939836.jpeg',
        details: [
          'Limpeza das unhas',
          'Corte e limagem',
          'Tratamento de cutículas',
          'Hidratação'
        ]
      },
      {
        title: 'Manicure simples com pintura',
        price: '8.50€',
        duration: '45 min',
        image: 'https://images.pexels.com/photos/3997304/pexels-photo-3997304.jpeg',
        details: [
          'Manicure completa',
          'Aplicação de verniz tradicional',
          'Escolha de cor',
          'Acabamento brilhante'
        ]
      },
      {
        title: 'Verniz Gel',
        price: '15€',
        duration: '60 min',
        image: 'https://images.pexels.com/photos/704815/pexels-photo-704815.jpeg',
        details: [
          'Manicure completa',
          'Aplicação de verniz gel',
          'Secagem rápida em lâmpada UV',
          'Duração de 2 a 3 semanas'
        ]
      },
      {
        title: '1ª Manutenção de Gel sobre a unha',
        price: '25€',
        duration: '90 min',
        image: 'https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg',
        details: [
          'Preparação das unhas',
          'Aplicação de gel sobre a unha natural',
          'Escolha de cor',
          'Acabamento brilhante'
        ]
      },
      {
        title: 'Manutenção de Gel',
        price: '20€',
        duration: '90 min',
        image: 'https://images.pexels.com/photos/3997386/pexels-photo-3997386.jpeg',
        details: [
          'Remoção parcial do gel anterior',
          'Preenchimento da área crescida',
          'Nova aplicação de cor',
          'Acabamento brilhante'
        ]
      },
      {
        title: 'Manutenção de Acrygel',
        price: '25€',
        duration: '90 min',
        image: 'https://images.pexels.com/photos/4210347/pexels-photo-4210347.jpeg',
        details: [
          'Remoção parcial do acrygel anterior',
          'Preenchimento com material novo',
          'Modelagem e acabamento',
          'Aplicação de cor à escolha'
        ]
      },
      {
        title: '1ª Aplicação De gel com extensão',
        price: '30€',
        duration: '90 min',
        image: 'https://images.pexels.com/photos/3997310/pexels-photo-3997310.jpeg',
        details: [
          'Preparação das unhas',
          'Aplicação de tips ou moldes',
          'Extensão com gel',
          'Modelagem e acabamento personalizado'
        ]
      },
      {
        title: '1ª aplicação acrygel com extensão',
        price: '35€',
        duration: '90 min',
        image: 'https://images.pexels.com/photos/3997383/pexels-photo-3997383.jpeg',
        details: [
          'Preparação das unhas',
          'Aplicação de tips ou moldes',
          'Extensão com acrygel',
          'Maior resistência e durabilidade'
        ]
      },
      {
        title: 'Unha partida',
        price: '2€',
        duration: '15 min',
        image: 'https://images.pexels.com/photos/3997385/pexels-photo-3997385.jpeg',
        details: [
          'Reparação de unha danificada',
          'Reforço com gel ou acrygel',
          'Acabamento uniforme',
          'Serviço rápido e eficiente'
        ]
      },
      {
        title: 'Remoção Verniz Gel, acrygel',
        price: '10€',
        duration: '45 min',
        image: 'https://images.pexels.com/photos/3997374/pexels-photo-3997374.jpeg',
        details: [
          'Remoção segura sem danificar a unha natural',
          'Limagem e polimento',
          'Hidratação intensiva',
          'Acabamento natural'
        ]
      }
    ],
    pedicure: [
      {
        title: 'Pedicure simples',
        price: '10€',
        duration: '30 min',
        image: 'https://images.pexels.com/photos/3997504/pexels-photo-3997504.jpeg',
        details: [
          'Limpeza das unhas dos pés',
          'Corte e limagem',
          'Tratamento de cutículas',
          'Hidratação básica'
        ]
      },
      {
        title: 'Pedicure simples com verniz',
        price: '10.50€',
        duration: '45 min',
        image: 'https://images.pexels.com/photos/3997512/pexels-photo-3997512.jpeg',
        details: [
          'Pedicure simples completa',
          'Aplicação de verniz tradicional',
          'Escolha de cor',
          'Acabamento brilhante'
        ]
      },
      {
        title: 'Pedicure completa',
        price: '17€',
        duration: '60 min',
        image: 'https://images.pexels.com/photos/4046316/pexels-photo-4046316.jpeg',
        details: [
          'Banho relaxante de pés',
          'Esfoliação completa',
          'Tratamento de cutículas e calosidades',
          'Massagem hidratante'
        ]
      },
      {
        title: 'Pedicure completa com verniz',
        price: '17.50€',
        duration: '75 min',
        image: 'https://images.pexels.com/photos/3997392/pexels-photo-3997392.jpeg',
        details: [
          'Pedicure completa',
          'Aplicação de verniz tradicional',
          'Secagem completa',
          'Acabamento de longa duração'
        ]
      },
      {
        title: 'Pintura com verniz gel',
        price: '15€',
        duration: '40 min',
        image: 'https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg',
        details: [
          'Aplicação de verniz gel nas unhas dos pés',
          'Secagem em lâmpada UV',
          'Durabilidade de 3 a 4 semanas',
          'Acabamento brilhante'
        ]
      },
      {
        title: 'Pedicure com verniz gel',
        price: '22.50€',
        duration: '90 min',
        image: 'https://images.pexels.com/photos/3997401/pexels-photo-3997401.jpeg',
        details: [
          'Pedicure completa',
          'Aplicação de verniz gel',
          'Tratamento de hidratação intensiva',
          'Máxima durabilidade'
        ]
      }
    ],
    depilacao_mulher: [
      {
        title: 'Buço',
        price: '3€',
        duration: '10 min',
        image: 'https://images.pexels.com/photos/5069594/pexels-photo-5069594.jpeg',
        details: [
          'Remoção dos pelos do buço',
          'Técnica suave para pele sensível',
          'Cera de alta qualidade',
          'Resultado limpo e sem irritações'
        ]
      },
      {
        title: 'Sobrancelha',
        price: '5€',
        duration: '15 min',
        image: 'https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg',
        details: [
          'Design personalizado',
          'Técnica de precisão',
          'Remoção total de pelos indesejados',
          'Forma harmoniosa com o rosto'
        ]
      },
      {
        title: 'Mento',
        price: '3€',
        duration: '10 min',
        image: 'https://images.pexels.com/photos/3738354/pexels-photo-3738354.jpeg',
        details: [
          'Depilação da região do queixo',
          'Cera específica para áreas pequenas',
          'Técnica rápida e eficiente',
          'Resultado duradouro'
        ]
      },
      {
        title: 'Axilas',
        price: '4€',
        duration: '10 min',
        image: 'https://images.pexels.com/photos/3738348/pexels-photo-3738348.jpeg',
        details: [
          'Depilação completa das axilas',
          'Técnica precisa e rápida',
          'Pele macia por mais tempo',
          'Mínimo desconforto'
        ]
      },
      {
        title: 'Virilha cavada',
        price: '6€',
        duration: '20 min',
        image: 'https://images.pexels.com/photos/5938360/pexels-photo-5938360.jpeg',
        details: [
          'Depilação parcial da área íntima',
          'Formato adaptado à preferência',
          'Técnica delicada',
          'Produto pós-depilação para acalmar'
        ]
      },
      {
        title: 'Virilha completa',
        price: '9€',
        duration: '20 min',
        image: 'https://images.pexels.com/photos/5240683/pexels-photo-5240683.jpeg',
        details: [
          'Depilação total da área íntima',
          'Técnica cuidadosa para minimizar desconforto',
          'Produto calmante pós-depilação',
          'Resultado duradouro'
        ]
      },
      {
        title: 'Braços completos',
        price: '8€',
        duration: '30 min',
        image: 'https://images.pexels.com/photos/7760849/pexels-photo-7760849.jpeg',
        details: [
          'Depilação dos braços do pulso até o ombro',
          'Técnica em seções para maior conforto',
          'Remoção completa dos pelos',
          'Pele suave por semanas'
        ]
      },
      {
        title: 'Meia perna',
        price: '7€',
        duration: '20 min',
        image: 'https://images.pexels.com/photos/7282433/pexels-photo-7282433.jpeg',
        details: [
          'Depilação do tornozelo até o joelho',
          'Ou do joelho até a coxa',
          'Técnica em faixas para eficiência',
          'Produto hidratante para finalizar'
        ]
      },
      {
        title: 'Perna inteira',
        price: '12€',
        duration: '40 min',
        image: 'https://images.pexels.com/photos/3738352/pexels-photo-3738352.jpeg',
        details: [
          'Depilação das pernas do tornozelo à coxa',
          'Técnica em seções para maior conforto',
          'Remoção completa dos pelos',
          'Pele macia e hidratada'
        ]
      },
      {
        title: 'Perna inteira + virilha + axila',
        price: '22€',
        duration: '60 min',
        image: 'https://images.pexels.com/photos/6663467/pexels-photo-6663467.jpeg',
        details: [
          'Combo completo de depilação',
          'Preço promocional integrado',
          'Técnica otimizada para reduzir tempo',
          'Finalização com produto calmante e hidratante'
        ]
      }
    ],
    depilacao_homem: [
      {
        title: 'Peito/Abdómen',
        price: '12€',
        duration: '20 min',
        image: 'https://images.pexels.com/photos/3976320/pexels-photo-3976320.jpeg',
        details: [
          'Depilação completa do peito e abdômen',
          'Cera específica para pelos masculinos',
          'Técnica para minimizar desconforto',
          'Produto pós-depilação para acalmar'
        ]
      },
      {
        title: 'Costas',
        price: '10€',
        duration: '15 min',
        image: 'https://images.pexels.com/photos/4426555/pexels-photo-4426555.jpeg',
        details: [
          'Depilação completa das costas',
          'Técnica eficiente para área extensa',
          'Alcance de todas as áreas',
          'Resultado uniforme'
        ]
      },
      {
        title: 'Glúteos',
        price: '5€',
        duration: '15 min',
        image: 'https://images.pexels.com/photos/6551144/pexels-photo-6551144.jpeg',
        details: [
          'Depilação completa da área dos glúteos',
          'Técnica precisa e rápida',
          'Produto especial para sensibilidade',
          'Acabamento uniforme'
        ]
      },
      {
        title: 'Virilha',
        price: '8€',
        duration: '20 min',
        image: 'https://images.pexels.com/photos/6551176/pexels-photo-6551176.jpeg',
        details: [
          'Depilação da área íntima masculina',
          'Técnica adaptada para maior conforto',
          'Produto calmante pós-depilação',
          'Resultado duradouro'
        ]
      },
      {
        title: 'Axilas',
        price: '5€',
        duration: '10 min',
        image: 'https://images.pexels.com/photos/3763347/pexels-photo-3763347.jpeg',
        details: [
          'Depilação completa das axilas',
          'Técnica específica para pelos grossos',
          'Remoção completa',
          'Produto antisséptico para finalizar'
        ]
      },
      {
        title: 'Pernas',
        price: '14€',
        duration: '30 min',
        image: 'https://images.pexels.com/photos/6698141/pexels-photo-6698141.jpeg',
        details: [
          'Depilação completa das pernas',
          'Técnica específica para pelos masculinos',
          'Trabalho em seções para maior conforto',
          'Hidratação final'
        ]
      },
      {
        title: 'Braços completos',
        price: '8€',
        duration: '30 min',
        image: 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg',
        details: [
          'Depilação dos braços do pulso até o ombro',
          'Técnica para pelos mais grossos',
          'Remoção completa',
          'Produto calmante para finalizar'
        ]
      }
    ],
    depilacao_laser: [
      {
        title: '1 zona',
        price: '15€',
        duration: '15 min',
        image: 'https://images.pexels.com/photos/3985320/pexels-photo-3985320.jpeg',
        details: [
          'Depilação a laser de uma área pequena',
          'Equipamento de última geração',
          'Resultados visíveis em poucas sessões',
          'Tratamento indolor e seguro'
        ]
      },
      {
        title: '2 zonas',
        price: '20€',
        duration: '30 min',
        image: 'https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg',
        details: [
          'Depilação a laser de duas áreas',
          'Preço promocional combinado',
          'Tecnologia avançada',
          'Personalização para cada tipo de pele'
        ]
      },
      {
        title: '3 zonas',
        price: '30€',
        duration: '45 min',
        image: 'https://images.pexels.com/photos/3738348/pexels-photo-3738348.jpeg',
        details: [
          'Depilação a laser de três áreas à escolha',
          'Economia significativa no pacote',
          'Proteção personalizada',
          'Redução permanente dos pelos'
        ]
      },
      {
        title: '4 zonas',
        price: '40€',
        duration: '40 min',
        image: 'https://images.pexels.com/photos/3738352/pexels-photo-3738352.jpeg',
        details: [
          'Depilação a laser de quatro áreas',
          'Pacote com desconto especial',
          'Equipamento de alta potência',
          'Resultados duradouros'
        ]
      },
      {
        title: '5 zonas',
        price: '50€',
        duration: '55 min',
        image: 'https://images.pexels.com/photos/6551096/pexels-photo-6551096.jpeg',
        details: [
          'Depilação a laser de cinco áreas',
          'Sessão completa e economica',
          'Gel refrigerador para conforto',
          'Acompanhamento personalizado'
        ]
      },
      {
        title: 'Corpo inteiro',
        price: '70€',
        duration: '90 min',
        image: 'https://images.pexels.com/photos/5240677/pexels-photo-5240677.jpeg',
        details: [
          'Depilação a laser completa',
          'Melhor relação custo-benefício',
          'Ajuste de potência para cada área',
          'Resultados visíveis desde a primeira sessão'
        ]
      }
    ],
    pestanas: [
      {
        title: '1ª aplicação de pestanas brasileiras',
        price: '30€',
        duration: '90 min',
        image: 'https://images.pexels.com/photos/3373738/pexels-photo-3373738.jpeg',
        details: [
          'Volume natural',
          'Cílios flexíveis e leves',
          'Aspecto mais denso e natural',
          'Duração de 3-4 semanas'
        ]
      },
      {
        title: 'Aplicação pestanas Egípcia',
        price: '30€',
        duration: '90 min',
        image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg',
        details: [
          'Formato alongado nas pontas externas',
          'Efeito de olhos puxados',
          'Olhar mais intenso e dramático',
          'Ideal para olhos redondos'
        ]
      },
      {
        title: 'Aplicação De pestanas Híbridas',
        price: '30€',
        duration: '90 min',
        image: 'https://images.pexels.com/photos/7356429/pexels-photo-7356429.jpeg',
        details: [
          'Mistura de técnicas para volume e comprimento',
          'Combina cílios finos e mais espessos',
          'Efeito natural com pontos de destaque',
          'Adaptável a diferentes formatos de olhos'
        ]
      },
      {
        title: 'Manutenção (3 em 3 semanas)',
        price: '25€',
        duration: '90 min',
        image: 'https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg',
        details: [
          'Remoção de pestanas soltas',
          'Aplicação de novas pestanas',
          'Reposição nas áreas necessárias',
          'Mantém o efeito das extensões'
        ]
      }
    ],
    sobrancelhas: [
      {
        title: 'Brown Lamination',
        price: '25€',
        duration: '60 min',
        image: 'https://images.pexels.com/photos/5069429/pexels-photo-5069429.jpeg',
        details: [
          'Lamina e fixa os pelos da sobrancelha',
          'Proporciona um efeito volumoso e estruturado',
          'Define e alinha os pelos em uma direção uniforme',
          'Realça o olhar de forma natural'
        ]
      },
      {
        title: 'Henna',
        price: '15€',
        duration: '60 min',
        image: 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg',
        details: [
          'Coloração temporária para sobrancelhas',
          'Efeito natural com duração de até 15 dias',
          'Ideal para quem quer experimentar um novo formato',
          'Design personalizado para cada tipo de rosto'
        ]
      },
      {
        title: 'Microblading (inclui 2 manutenções)',
        price: '150€',
        duration: '90 min',
        image: 'https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg',
        details: [
          'Usa-se uma caneta com microlâminas',
          'Aplica-se pigmento na camada superficial da pele',
          'Desenha fios finos nas sobrancelhas, imitando os pelos naturais',
          'Preenche falhas nas sobrancelhas',
          'Corrige o formato',
          'Resultado natural e personalizado para cada rosto'
        ]
      }
    ],
    destaques: [
      {
        title: 'Micropigmentação',
        price: '180€',
        duration: '120 min',
        image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg',
        details: [
          'Aplica-se pigmento na camada superficial da pele',
          'Realça ou corrige partes do rosto ou corpo',
          'Dura meses a alguns anos',
          'Deixa o rosto mais bonito e definido',
          'Poupa tempo na maquilhagem diária',
          'Melhora a autoestima'
        ]
      },
      {
        title: 'Eyeliner',
        price: '100€',
        duration: '90 min',
        image: 'https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg',
        details: [
          'Aplica-se pigmento na pele da pálpebra',
          'Realça os olhos de forma natural ou marcada',
          'Evita o uso diário de maquilhagem',
          'Dá a sensação de olhos mais definidos e expressivos',
          'Olhar bonito todos os dias, sem esforço',
          'Ideal para quem tem alergia a maquilhagem ou usa óculos',
          'Poupa tempo na rotina'
        ]
      },
      {
        title: 'Microagulhamento',
        price: 'Sob consulta',
        duration: '60 min',
        image: 'https://images.pexels.com/photos/3865557/pexels-photo-3865557.jpeg',
        details: [
          'Usa-se um aparelho com microagulhas',
          'Rejuvenesce a pele',
          'Reduz rugas e linhas finas',
          'Fecha os poros dilatados',
          'Melhora cicatrizes de acne e estrias',
          'Uniformiza o tom da pele e clareia manchas',
          'Normalmente são necessárias 3 a 6 sessões',
          'O intervalo entre sessões é de 4 a 6 semanas',
          'Pele mais jovem, firme e saudável',
          'Ajuda a tratar imperfeições e sinais do tempo'
        ]
      },
      {
        title: 'Micropigmentação Labial',
        price: '240€',
        duration: '120 min',
        image: 'https://images.pexels.com/photos/6628629/pexels-photo-6628629.jpeg',
        details: [
          'Aplica-se pigmento na pele dos lábios',
          'Dá cor, forma e definição à boca',
          'Lábios com mais cor e forma natural',
          'Dispensa o uso de batom no dia a dia',
          'Aumenta a autoestima e sensação de bem-estar'
        ]
      },
      {
        title: 'Microblading',
        price: '150€',
        duration: '90 min',
        image: 'https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg',
        details: [
          'Usa-se uma caneta com microlâminas',
          'Aplica-se pigmento na camada superficial da pele',
          'Desenha fios finos nas sobrancelhas, imitando os pelos naturais',
          'Preenche falhas nas sobrancelhas',
          'Corrige o formato',
          'Cria sobrancelhas mais definidas e naturais',
          'Ideal para quem tem poucos pelos',
          'Fios desenhados parecem naturais e realistas',
          'Sobrancelhas ficam mais simétricas e expressivas',
          'O efeito é suave e delicado',
          'Dura cerca de 6 meses a 1 ano e meio',
          'Resultado natural e personalizado para cada rosto',
          'Aumenta a autoestima e valoriza o olhar'
        ]
      }
    ]
  }
  
  return (
    <div className='min-h-screen bg-[#F5F1E9]'>
      {/* Hero Section */}
      <div className='relative'>
        <img 
          className='object-cover h-[50vh] w-full' 
          src={bannerImage}
          alt="Serviços de beleza e estética"
        />
        <div className='absolute inset-0 bg-gradient-to-b from-[#c0a080]/40 to-[#c0a080]/70'></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-[#F5F1E9] text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">
            Nossos Serviços
          </h2>
        </div>
        
        {/* Wave shape at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-16">
          <svg viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,60 V30 C150,50 350,40 500,35 C650,30 750,25 900,30 C1050,35 1200,45 1200,45 V60 H0 Z" fill="#F5F1E9"/>
          </svg>
        </div>
      </div>
      
      {/* Introduction */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl md:text-4xl font-light text-[#5c7160] mb-6">
            Conheça Os Nossos Serviços
          </h3>
          <p className="text-lg text-[#5c7160]/80">
            Oferecemos uma gama completa de serviços de beleza e estética para realçar a sua beleza natural. 
            Cada tratamento é personalizado para atender às suas necessidades específicas, utilizando produtos 
            de alta qualidade e técnicas avançadas.
          </p>
          
          {/* Decorative divider */}
          <div className="w-32 h-0.5 mx-auto my-8 bg-gradient-to-r from-transparent via-[#c0a080] to-transparent"></div>
        </div>
      </section>
      
      {/* Category Navigation */}
      <section className="pb-8 px-6">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-[#5c7160] text-white shadow-md"
                    : "bg-white text-[#5c7160] hover:bg-[#a5bf99]/20"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Service Cards */}
      <section className="py-12 px-6 bg-[#F5F1E9]/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceData[activeCategory].map((service, index) => (
              <div 
                key={index}
                id={`service-${service.title}`}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group cursor-pointer"
                onClick={() => openServiceModal(service)}
              >
                <div 
                  className="h-64 overflow-hidden relative cursor-pointer"
                >
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-white/80 rounded-full text-[#5c7160] text-sm font-medium">
                      Ver detalhes
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-medium text-[#5c7160] mb-2">{service.title}</h3>
                  
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-[#5c7160]/70">{service.duration}</div>
                    <div className="font-medium text-[#c0a080] text-xl">{service.price}</div>
                  </div>
                  
                  {/* Lista de características (limitada a 3 para o card) */}
                  <ul className="mt-3 mb-4 space-y-1">
                    {service.details.slice(0, 3).map((detail, i) => (
                      <li key={i} className="flex items-start text-[#5c7160]/80 text-sm">
                        <span className="text-[#a5bf99] mr-2">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Botão de agendar */}
                  {/* <div className="mt-auto pt-3">
                    <BookingButton 
                      to={`/reservations?category=${activeCategory}&service=${encodeURIComponent(service.title)}`}
                      className="text-sm py-2 w-full"
                      fullWidth
                    >
                      <span className="text-sm">Agendar</span>
                    </BookingButton>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de serviço */}
      {selectedService && (
        <ServiceModal 
          service={selectedService} 
          onClose={closeServiceModal} 
          categoryId={activeCategory}
        />
      )}

    </div>
  )
}

export default Services