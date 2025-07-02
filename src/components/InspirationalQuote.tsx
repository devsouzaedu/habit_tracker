import { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author: string;
  category: 'inspiração' | 'motivação' | 'disciplina' | 'foco';
}

const quotes: Quote[] = [
  // Inspiração
  { text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", author: "Robert Collier", category: "inspiração" },
  { text: "A única maneira de fazer um excelente trabalho é amar o que você faz.", author: "Steve Jobs", category: "inspiração" },
  { text: "Não é o que acontece com você, mas como você reage ao que acontece com você que importa.", author: "Epicteto", category: "inspiração" },
  { text: "O futuro pertence àqueles que acreditam na beleza de seus sonhos.", author: "Eleanor Roosevelt", category: "inspiração" },
  
  // Motivação
  { text: "A motivação é o que te faz começar. O hábito é o que te mantém em movimento.", author: "Jim Ryun", category: "motivação" },
  { text: "Você não precisa ser grande para começar, mas precisa começar para ser grande.", author: "Zig Ziglar", category: "motivação" },
  { text: "O único impossível é aquilo que você não tenta.", author: "Audrey Hepburn", category: "motivação" },
  { text: "Acredite que você pode e você já está no meio do caminho.", author: "Theodore Roosevelt", category: "motivação" },
  
  // Disciplina
  { text: "Disciplina é a ponte entre objetivos e conquistas.", author: "Jim Rohn", category: "disciplina" },
  { text: "A disciplina é a alma de um exército.", author: "George Washington", category: "disciplina" },
  { text: "Sem disciplina, não há vida digna possível.", author: "Immanuel Kant", category: "disciplina" },
  { text: "A disciplina é liberdade. Você pode ter tudo o que quer se estiver disposto a pagar o preço.", author: "Lou Holtz", category: "disciplina" },
  
  // Foco
  { text: "Concentre-se em ser produtivo, não ocupado.", author: "Tim Ferriss", category: "foco" },
  { text: "O foco é sobre dizer não a 100 outras boas ideias.", author: "Steve Jobs", category: "foco" },
  { text: "Onde você coloca sua atenção, sua energia flui e os resultados aparecem.", author: "T. Harv Eker", category: "foco" },
  { text: "A capacidade de focar e a capacidade de usar essa concentração para aprender são as duas habilidades mais importantes do século XXI.", author: "Cal Newport", category: "foco" },
  
  // Mais frases de inspiração
  { text: "Seja você mesmo; todos os outros já foram escolhidos.", author: "Oscar Wilde", category: "inspiração" },
  { text: "A vida é 10% do que acontece com você e 90% de como você reage a isso.", author: "Charles R. Swindoll", category: "inspiração" },
  
  // Mais frases de motivação
  { text: "Não espere por oportunidades extraordinárias. Agarre ocasiões comuns e as torne grandes.", author: "Orison Swett Marden", category: "motivação" },
  { text: "O caminho para o sucesso é tomar ação massiva e determinada.", author: "Tony Robbins", category: "motivação" },
  
  // Mais frases de disciplina
  { text: "A disciplina é escolher entre o que você quer agora e o que você quer mais.", author: "Augusta F. Kantra", category: "disciplina" },
  { text: "Autodisciplina é quando sua consciência te diz o que fazer e você não fala de volta.", author: "W.K. Hope", category: "disciplina" },
  
  // Mais frases de foco
  { text: "É durante nossos momentos mais sombrios que devemos focar para ver a luz.", author: "Aristóteles", category: "foco" },
  { text: "Foque na jornada, não no destino. A alegria é encontrada não em terminar uma atividade, mas em fazê-la.", author: "Greg Anderson", category: "foco" }
];

export function InspirationalQuote() {
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Selecionar uma frase aleatória quando o componente é montado
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  }, []);

  const getNewQuote = () => {
    setIsVisible(false);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
      setIsVisible(true);
    }, 300);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'inspiração': return 'badge-primary';
      case 'motivação': return 'badge-secondary';
      case 'disciplina': return 'badge-accent';
      case 'foco': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'inspiração': return '✨';
      case 'motivação': return '🚀';
      case 'disciplina': return '💪';
      case 'foco': return '🎯';
      default: return '💭';
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-box p-3 sm:p-6 mb-3 sm:mb-6 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getCategoryIcon(currentQuote.category)}</span>
          <div className={`badge ${getCategoryColor(currentQuote.category)} badge-lg capitalize`}>
            {currentQuote.category}
          </div>
        </div>
        
        <button 
          onClick={getNewQuote}
          className="btn btn-ghost btn-sm"
          title="Nova frase"
        >
          🔄
        </button>
      </div>

      <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <blockquote className="text-base sm:text-lg lg:text-xl italic text-base-content/90 mb-3 sm:mb-4 leading-relaxed">
          "{currentQuote.text}"
        </blockquote>
        
        <div className="text-right">
          <cite className="text-sm sm:text-base text-base-content/70 font-medium">
            — {currentQuote.author}
          </cite>
        </div>
      </div>
    </div>
  );
} 