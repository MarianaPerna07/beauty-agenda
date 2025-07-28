function ServicePrices() {
    return (
      <section className="">
        <h2 className=" text-center text-3xl md:text-4xl font-light text-[#5c7160] mb-6">
          Serviços
        </h2>
        
        <ul className="max-w-6xl grid grid-cols- grid-rows-1 gap-2 mx-auto">
          
          <div className="text-">
            <div className="flex items-end">
              <h2 className="font-bold min-w-fit">Manicure Simples</h2>
              <div className="h-px w-full mb-1 bg-neutral-400"></div>
              <p className="font-bold text-[#c0a080]">7.00€</p>
            </div>
            <p>30 minutos</p>
          </div>

          <div className="text-left">
            <div className="flex items-end">
              <h2 className="font-bold min-w-fit">Manicure simples com pintura</h2>
              <div className="h-px w-full mb-1 bg-neutral-400"></div>
              <p className="font-bold text-[#c0a080]">8.50€</p>
            </div>
            <p >30 minutos</p>
          </div>

          <div className="text-left">
            <div className="flex items-end">
              <h2 className="font-bold min-w-fit">Verniz Gel</h2>
              <div className="h-px w-full mb-1 bg-neutral-400"></div>
              <p className="font-bold text-[#c0a080]">15.00€</p>
            </div>
            <p>60 minutos</p>
          </div>

          <div className="text-left">
            <div className="flex items-end">
              <h2 className="font-bold min-w-fit">1ª Manutenção de Gel sobre a unha </h2>
              <div className="h-px w-full mb-1 bg-neutral-400"></div>
              <p className="font-bold text-[#c0a080]">25.00€</p>
            </div>
            <p>90 minutos</p>
          </div>

          <div className="text-left">
            <div className="flex items-end">
              <h2 className="font-bold min-w-fit">Manutenção de Gel </h2>
              <div className="h-px w-full mb-1 bg-neutral-400"></div>
              <p className="font-bold text-[#c0a080]"> 20.00€</p>
            </div>
            <p>90 minutos</p>
          </div>

          

        </ul>
      </section>
    );
  }
  
  export default ServicePrices;