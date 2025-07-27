function ServicePrices() {
    return (
      <section className="">
        <h2 className="text-center text-3xl py-4 text-red-800">Serviços</h2>
        
        <ul className="max-w-6xl grid grid-cols- grid-rows-1 gap-2 mx-auto">
          
          <div className="text-">
            <div className="flex items-end">
              <h2 className="font-bold min-w-fit">Manicure Simples</h2>
                <div className="h-px w-full mb-1 bg-neutral-400"></div>
                <p>7.00€</p>
            </div>
            <p>30 minutos</p>
          </div>

          <div className="text-left">
          <div className="flex items-end">
          <h2 className="font-bold min-w-fit">Manicure simples com pintura</h2>
          <div className="h-px w-full mb-1 bg-neutral-400"></div>
          <p>8.50€</p>
          </div>
          <p>30 minutos</p>
          </div>

        </ul>
      </section>
    );
  }
  
  export default ServicePrices;