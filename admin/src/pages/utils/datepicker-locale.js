import { registerLocale } from "react-datepicker";
import pt from 'date-fns/locale/pt';

// Personalização dos dias da semana
const ptCustom = {
  ...pt,
  localize: {
    ...pt.localize,
    day: (n, { width }) => {
      const days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
      const shortDays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
      
      return width === 'short' ? shortDays[n] : days[n];
    }
  }
};

// Registrar o idioma português personalizado
registerLocale('pt-custom', ptCustom);

export default ptCustom;