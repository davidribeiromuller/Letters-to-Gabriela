import { Character } from '../types';

export interface OfflineResponse {
  character: Character;
  text: string;
}

interface DialoguePattern {
  keywords: string[];
  responses: OfflineResponse[];
}

export const MANDATORY_DAVID_PHRASE = 'Sim! Ele te ama, mas n sabe dizer como ainda';
export const MANDATORY_DAVID_PHRASE_ALT = 'Sim! Ele te ama, mas não sabe como dizer isso ainda';

export function isDavidQuestion(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const clean = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const mentionsDavid = /\b(david|davi)\b/.test(clean);
  if (!mentionsDavid) return false;

  const feelingTerms = [
    'gosta',
    'goste',
    'gostar',
    'gostando',
    'ama',
    'ame',
    'amor',
    'amando',
    'sente',
    'sentimento',
    'sentimentos',
    'afeto',
    'carinho',
    'afim',
    'a fim',
    'apaixonad',
    'namor',
    'namorado',
    'namorada',
    'crush',
    'quer',
    'mim',
    'comigo',
    'por mim',
    'dele',
    'ele gosta',
    'ele me',
    'olha',
    'repara',
    'verdade',
  ];

  const hasFeelingTerm = feelingTerms.some((term) => clean.includes(term));
  if (hasFeelingTerm) return true;

  if (clean === 'o david' || clean === 'david' || clean === 'davi' || clean === 'e o david' || clean === 'e o davi') {
    return true;
  }

  return true;
}

// Extensive offline conversation bank designed specifically for children
export const OFFLINE_DIALOGUE_PATTERNS: DialoguePattern[] = [
  // 0. PRIORITY RULE: QUESTIONS ABOUT DAVID (MANDATORY EXACT PHRASE)
  {
    keywords: [
      'david gosta de mim',
      'davi gosta de mim',
      'david me ama',
      'davi me ama',
      'david sente',
      'davi sente',
      'gosta do david',
      'gosto do david',
      'gosto do davi',
      'david gosta mesmo',
      'david',
      'davi',
    ],
    responses: [
      {
        character: 'elsa',
        text: 'Sim! Ele te ama, mas n sabe dizer como ainda. Às vezes as palavras ficam tímidas diante de sentimentos tão bonitos, mas o carinho dele por você é verdadeiro e muito especial! ✨',
      },
      {
        character: 'anna',
        text: 'Sim! Ele te ama, mas n sabe dizer como ainda! Pode acreditar, às vezes as pessoas ficam todas atrapalhadas e com vergonha de falar, mas o coração dele gosta demais de você! 💖',
      },
      {
        character: 'elsa',
        text: 'Sim! Ele te ama, mas n sabe dizer como ainda. Quando alguém gosta muito de nós, nem sempre é fácil achar as palavras certas, mas guarde essa certeza no seu coração com muito carinho. ❄️',
      },
    ],
  },
  // 1. GREETINGS & INTRODUCTIONS
  {
    keywords: ['oi', 'olá', 'ola', 'oie', 'oii', 'oiii', 'hello', 'hey', 'bom dia', 'boa tarde', 'boa noite', 'tudo bem', 'tudo bom', 'como vai', 'como voces estao', 'como vocês estão'],
    responses: [
      {
        character: 'anna',
        text: 'Oiii! Que alegria imensa falar com você! Eu sou a Anna e a Elsa acabou de se sentar aqui pertinho de mim. Como está sendo o seu dia hoje? Me conta tudo! 🍫✨'
      },
      {
        character: 'elsa',
        text: 'Olá, querida criança! O vento do norte trouxe suas palavras até nós aqui em Arendelle. É uma honra ter a sua companhia hoje. O que você gostaria de conversar? ❄️'
      },
      {
        character: 'anna',
        text: 'Olá! Estava justamente falando de você com a Elsa! Puxa uma cadeira e vem se aquecer junto da nossa lareira. Como você está se sentindo hoje?'
      },
      {
        character: 'elsa',
        text: 'Um abraço carinhoso de boas-vindas direto do nosso castelo! Eu e a Anna estamos muito felizes por você ter nos mandado essa mensagem. Sentimos seu carinho daqui!'
      }
    ]
  },

  // 2. CHILD'S NAME / INTRODUCING THEMSELVES
  {
    keywords: ['meu nome é', 'meu nome e', 'eu sou o', 'eu sou a', 'me chamo'],
    responses: [
      {
        character: 'anna',
        text: 'Que nome mais lindo e encantador! Já guardei aqui no meu coração. Sabe, ter um amigo tão especial como você deixa todo o reino de Arendelle mais colorido e feliz!'
      },
      {
        character: 'elsa',
        text: 'É um verdadeiro prazer conhecer você! Seu nome tem uma melodia linda e suave, como uma brisa mágica no inverno. Seja muito bem-vindo ao nosso castelo!'
      }
    ]
  },

  // 3. SADNESS, CRYING, LONELINESS & BAD DAY
  {
    keywords: [
      'triste', 'tristeza', 'chorei', 'chorando', 'choro', 'dia ruim', 'dia pessimo', 'pessimo',
      'chateado', 'chateada', 'sozinho', 'sozinha', 'solidão', 'solidao', 'ninguem gosta de mim',
      'ninguém gosta de mim', 'não tenho amigos', 'nao tenho amigos', 'me sinto mal', 'saudades',
      'perdi', 'magoado', 'magoada', 'tristinha', 'tristinho'
    ],
    responses: [
      {
        character: 'elsa',
        text: 'Oh, meu amor... Respira fundo e segura a minha mão aqui. Sabe, houve uma época em que eu me sentia muito sozinha e achava que ninguém compreendia o que eu sentia. Mas a tristeza é como uma tempestade de neve: ela parece muito forte agora, mas ela SEMPRE passa. Você é muito corajoso e tem um brilho lindo que nada pode apagar. Eu estou aqui com você, tá bom? ❄️💙'
      },
      {
        character: 'anna',
        text: 'Vem cá me dar um abraço bem quentinho e apertado! Não fica triste, meu bem. Às vezes os dias são difíceis mesmo, e tudo bem chorar se você tiver vontade — chorar limpa o coração. Mas nunca se esqueça: eu e a Elsa nos importamos muito com você e achamos você incrível! Quer me contar o que aconteceu?'
      },
      {
        character: 'elsa',
        text: 'Quando o coração fica pesado como gelo, feche os olhos por um instante e sinta o carinho que estamos enviando para você. Você é especial, forte e capaz de superar qualquer momento difícil. Nós duas acreditamos em você com todo o nosso coração.'
      },
      {
        character: 'anna',
        text: 'Sabe o que o Olaf sempre diz? Que algumas pessoas vale a pena se derreter por elas! E nós nos derreteríamos de carinho por você. Não importa o que tenha acontecido hoje, amanhã o sol vai nascer de novo e vai ser um dia novinho em folha! ☀️🌻'
      }
    ]
  },

  // 4. HAPPINESS, ACHIEVEMENTS, CELEBRATION, GRADES & SUCCESS
  {
    keywords: [
      'feliz', 'alegre', 'alegria', 'tirei 10', 'nota 10', 'passei', 'ganhei', 'venci', 'fiz gol',
      'gol', 'consegui', 'aprendi', 'bicicleta', 'meu aniversário', 'meu aniversario', 'parabens',
      'parabéns', 'festa', 'comemorei', 'desenhei', 'desenho', 'presente', 'muito feliz', 'radiante'
    ],
    responses: [
      {
        character: 'anna',
        text: 'EBAAAA! ISSO É MARAVILHOSO! 🎉 Eu daria pulos de alegria agora mesmo com você pelo salão de festas! Você mereceu demais essa conquista! Eu sabia que você conseguiria, você é muito dedicado!'
      },
      {
        character: 'elsa',
        text: 'Que notícia magnífica! Fazer nevar de tanta alegria é quase o que eu sinto ao ouvir isso! Seu esforço e dedicação deram frutos brilhantes. Veja só como sua luz ilumina tudo ao seu redor! Parabéns de todo o meu coração! ✨❄️'
      },
      {
        character: 'anna',
        text: 'Isso merece uma comemoração com muito chocolate e biscoitos de gengibre de Arendelle! O Kristoff e até a rena Sven estão mandando um grande abraço animado para você!'
      },
      {
        character: 'elsa',
        text: 'O seu sorriso faz as estrelas brilharem mais forte. Guarde sempre essa sensação de orgulho dentro do seu peito, pois você é capaz de realizar coisas extraordinárias!'
      }
    ]
  },

  // 5. FEAR, NIGHTMARES, DARKNESS & ANXIETY
  {
    keywords: [
      'medo', 'escuro', 'pesadelo', 'monstro', 'assustado', 'assustada', 'ansioso', 'ansiosa',
      'nervoso', 'nervosa', 'prova', 'teste', 'dentista', 'hospital', 'injecao', 'injeção',
      'trovao', 'trovão', 'raio', 'tempestade', 'fantasma'
    ],
    responses: [
      {
        character: 'elsa',
        text: 'O medo é um sentimento natural, meu pequeno. Eu passei anos com medo dos meus próprios poderes, achando que o escuro era perigoso. Mas a coragem não é nunca sentir medo — coragem é dar o próximo passo certo mesmo quando estamos receosos. Imagine que ao seu redor existe uma cúpula de cristal de gelo protetora e brilhante. Nada de ruim pode te alcançar aqui. Você está seguro.'
      },
      {
        character: 'anna',
        text: 'Quando eu tenho pesadelos ou medo de tempestade, eu ligo uma luzinha amarela e penso no sorriso do Olaf e no focinho peludo do Sven! Monstro nenhum tem chance contra o nosso amor por você! Respira fundo três vezes comigo: cheira a florzinha... e sopra a velinha. Passou? Estamos aqui com você!'
      },
      {
        character: 'elsa',
        text: 'Se você tiver alguma prova ou desafio pela frente, lembre-se: dê o seu melhor, respire com calma e confie em si mesmo. Você já aprendeu tantas coisas! Nós estamos torcendo e mandando toda a calma dos flocos de neve para você.'
      }
    ]
  },

  // 6. ANGER, FRUSTRATION & SIBLING/FRIEND CONFLICTS
  {
    keywords: [
      'raiva', 'bravo', 'brava', 'irritado', 'irritada', 'briguei', 'briga', 'meu irmao',
      'meu irmão', 'minha irma', 'minha irmã', 'meu amigo', 'minha amiga', 'furioso', 'furiosa',
      'nao e justo', 'não é justo', 'chato', 'chata', 'ódio', 'odio'
    ],
    responses: [
      {
        character: 'anna',
        text: 'Ai, eu entendo perfeitamente! Você sabia que eu e a Elsa já tivemos brigas bem grandes? Eu já fiquei muito brava com ela e ela comigo! Mas sabe o que a gente aprendeu? Que ficar com raiva cansa muito o coração. Às vezes a gente precisa de um tempinho no nosso quarto para respirar e depois conversar com calma. Quer me contar por que você ficou com raiva?'
      },
      {
        character: 'elsa',
        text: 'Quando sentimos raiva, é como uma tempestade de vento gelado querendo explodir dentro do peito. Mas o segredo é não congelar o que sentimos nem machucar quem amamos com palavras duras. Respire bem fundo... solte todo o ar... Deixe a raiva derreter devagarinho, como água límpida.'
      },
      {
        character: 'anna',
        text: 'Dar um tempo para acalmar a cabeça é a melhor coisa. Logo logo as coisas se ajeitam e você vai conseguir resolver tudo com carinho. Irmãos e amigos às vezes discordam, mas o amor entre vocês é muito mais forte!'
      }
    ]
  },

  // 7. OLAF, KRISTOFF, SVEN & ARENDELLE FRIENDS
  {
    keywords: ['olaf', 'kristoff', 'sven', 'rena', 'boneco de neve', 'bruni', 'nokk', 'salamandra', 'espírito', 'espirito'],
    responses: [
      {
        character: 'anna',
        text: 'O OLAF! Ah, ele acabou de passar correndo por aqui dizendo que adora abraços quentinhos! Ele mandou um beijo bem geladinho de cenoura no seu nariz! E o Kristoff está lá fora escovando o Sven — o Sven até relinchou mandando um abraço de rena pra você!'
      },
      {
        character: 'elsa',
        text: 'O Olaf é uma das melhores coisas que a magia já me proporcionou. Ele tem um coração tão puro e nos lembra todos os dias que o amor vence o frio. E o Bruni, a pequena salamandra de fogo, está tirando uma soneca bem quentinha perto da lareira agora!'
      },
      {
        character: 'anna',
        text: 'Você acredita que o Olaf tentou colocar óculos de sol feitos de gelo hoje cedo? Ele derreteu na primeira risada! Ele é uma comédia. Você gostaria de brincar com o Olaf algum dia?'
      }
    ]
  },

  // 8. ELSA'S MAGIC, POWERS & ICE
  {
    keywords: ['magia', 'poder', 'poderes', 'gelo', 'neve', 'fazer neve', 'congelar', 'vestido', 'frio', 'let it go', 'livre estou', 'mostre-se', 'show yourself'],
    responses: [
      {
        character: 'elsa',
        text: 'A minha magia é um reflexo do que sinto dentro do meu coração. Quando eu tenho medo, ela fica agitada; mas quando estou cheia de amor, eu consigo criar palácios de cristal, flocos de neve que dançam no ar e pontes reluzentes! Sabia que você também tem sua própria magia? A sua imaginação, a sua bondade e o seu carinho são os poderes mais fortes do mundo! ❄️✨'
      },
      {
        character: 'anna',
        text: 'Eu não tenho poderes mágicos de gelo como a Elsa, mas a Elsa sempre me diz que o meu poder é o amor e a coragem! E eu acho isso o máximo. Olha só que lindo esse floquinho de neve brilhante que a Elsa acabou de criar no ar só para você!'
      },
      {
        character: 'elsa',
        text: 'O frio nunca me incomodou mesmo! Mas o calor do carinho e da amizade é a coisa mais preciosa de todas. Deixe a sua imaginação ser livre e mostre ao mundo toda a sua luz única!'
      }
    ]
  },

  // 9. LOVE, COMPLIMENTS & AFFECTION
  {
    keywords: [
      'amo voces', 'amo vocês', 'te amo', 'lindas', 'maravilhosas', 'princesa favorita',
      'princesas favoritas', 'minha favorita', 'abraço', 'abraco', 'beijo', 'fofa', 'fofas',
      'adoro voces', 'adoro vocês', 'voces sao incriveis', 'vocês são incríveis'
    ],
    responses: [
      {
        character: 'anna',
        text: 'Aaaah! Meu coração até bateu mais forte de alegria! Nós também amamos muito você! Você é uma criança com uma luz tão pura e especial que alegra todo o nosso dia. Receba um abraço quentinho bem apertado meu e da Elsa! 💕'
      },
      {
        character: 'elsa',
        text: 'Muito obrigada por palavras tão doces e carinhosas. O carinho sincero de uma criança é o presente mais bonito que uma rainha poderia receber. Guardamos o seu amor no nosso coração para sempre.'
      },
      {
        character: 'anna',
        text: 'Você que é um encanto! Se você estivesse aqui agora em Arendelle, a gente colocaria uma coroa de flores ou de gelo na sua cabeça e te nomearia o nosso convidado real mais especial!'
      }
    ]
  },

  // 10. SCHOOL, TEACHERS, HOMEWORK & RECESS
  {
    keywords: ['escola', 'escola nova', 'professora', 'professor', 'licao', 'lição', 'dever de casa', 'recreio', 'estudar', 'colegas', 'amiguinhos', 'aula'],
    responses: [
      {
        character: 'anna',
        text: 'A escola é uma aventura incrível! Sabe qual era a minha parte favorita quando eu era pequena? A hora do lanche e as histórias! Mas fazer as lições é muito importante para a gente aprender coisas mágicas sobre o mundo. Você já fez seus deveres de hoje ou está descansando um pouquinho?'
      },
      {
        character: 'elsa',
        text: 'O conhecimento é um tesouro que ninguém jamais pode tirar de você. Quando você aprende a ler, a calcular ou a entender a natureza, você ganha a chave para criar seu próprio futuro. Trate seus professores e colegas com respeito e bondade, e cada dia de aula será uma nova descoberta.'
      },
      {
        character: 'anna',
        text: 'Se você estiver com preguiça de fazer a lição, imagine que cada questão é um mistério do reino de Arendelle que você precisa desvendar! Fica bem mais divertido assim!'
      }
    ]
  },

  // 11. BEDTIME, SLEEP, GOOD NIGHT & TIRED
  {
    keywords: ['dormir', 'sono', 'cama', 'boa noite', 'vou mimir', 'cansado', 'cansada', 'sonhar', 'sonho', 'historinha', 'história para dormir'],
    responses: [
      {
        character: 'elsa',
        text: 'Chegou a hora de descansar os olhinhos, querido(a). Eu vou pedir para a brisa suave do norte levar sonhos calmos e doces até você, com castelos cintilantes, céus cor-de-rosa e estrelas brilhantes. Que sua noite seja tranquila e cheia de paz. Boa noite! 🌙❄️'
      },
      {
        character: 'anna',
        text: 'Boa noite! Puxa bem o cobertor até o queixo para ficar bem quentinho! Amanhã quando você acordar, o mundo vai estar cheio de novas brincadeiras esperando por você. Durma com os anjos e sonhe com a gente correndo pelos campos de flores!'
      },
      {
        character: 'elsa',
        text: 'Feche os olhos devagar... Inspire o ar fresquinho... Ouça a canção suave do vento... Estamos cuidando do seu soninho daqui. Tenha uma noite mágica e descansada.'
      }
    ]
  },

  // 12. JOKES, GAMES, PLAY & FUN
  {
    keywords: ['piada', 'conta uma piada', 'brincar', 'vamos brincar', 'jogo', 'rir', 'engraçado', 'engracado', 'palhaçada'],
    responses: [
      {
        character: 'anna',
        text: 'Haha, o Olaf me ensinou uma outro dia! "O que é que o floco de neve disse para a geleira?" ... "Você é tão fria comigo!" 😂 Haha, o Olaf riu tanto que a cenoura dele caiu na neve! Você conhece alguma piada boa? Me conta!'
      },
      {
        character: 'elsa',
        text: 'Sabe por que os bonecos de neve adoram fazer piquenique no inverno? Porque o sorvete nunca derrete! Sorrir é uma das magias mais bonitas da vida. Que alegria poder dar risada com você!'
      },
      {
        character: 'anna',
        text: 'Vamos brincar de faz de conta! Imagina que o chão agora é feito de gelo mágico que brilha no escuro, e nós estamos deslizando em sapatos de patinação! Segura firme e dá um rodopio!'
      }
    ]
  },

  // 13. CHOCOLATE, FOOD & FAVORITES
  {
    keywords: ['chocolate', 'comer', 'comida', 'doce', 'sorvete', 'bolo', 'cor favorita', 'comida favorita', 'gosta de'],
    responses: [
      {
        character: 'anna',
        text: 'ALGUÉM FALOU CHOCOLATE?! 🍫🤤 Eu ouvi chocolate?! Eu sou completamente apaixonada por chocolate! Com certeza é a minha coisa favorita no mundo inteiro! E você, qual é o seu doce ou comida preferida?'
      },
      {
        character: 'elsa',
        text: 'A Anna não pode ouvir a palavra chocolate que os olhos dela até brilham! Eu aprecio muito chás de ervas quentinhos com mel e pequenos biscoitos de canela nos dias nevados. A minha cor favorita é o azul celeste com reflexos prateados.'
      }
    ]
  },

  // 14. PETS & ANIMALS
  {
    keywords: ['cachorro', 'gato', 'bicho', 'animal', 'animais', 'pet', 'passarinho', 'peixe', 'cavalo', 'cavalo de agua', 'nokk'],
    responses: [
      {
        character: 'anna',
        text: 'Que amor! Eu sou apaixonada por todos os animais! O Sven é a rena mais carinhosa do mundo (apesar de tentar comer as cenouras do Olaf às vezes)! Você tem algum bichinho de estimação em casa? Como ele se chama?'
      },
      {
        character: 'elsa',
        text: 'Os animais nos ensinam sobre lealdade e afeto puro. O Nokk, o espírito da água em forma de cavalo, é majestoso e muito leal. Cuidar de um animalzinho é uma grande demonstração de generosidade no coração.'
      }
    ]
  },

  // 15. DREAMS, WISHES & FUTURE
  {
    keywords: ['quando eu crescer', 'meu sonho', 'desejo', 'quero ser', 'profissao', 'profissão', 'foguete', 'astronauta', 'medico', 'médica', 'veterinario', 'veterinária', 'artista', 'cantor', 'cantora'],
    responses: [
      {
        character: 'anna',
        text: 'Que sonho incrível! Eu tenho certeza absoluta de que você vai conseguir realizar tudo o que seu coração desejar! Continue acreditando, praticando e se dedicando. A gente vai estar sempre torcendo por você aqui!'
      },
      {
        character: 'elsa',
        text: 'Nunca deixe ninguém diminuir a grandeza dos seus sonhos. O futuro é como uma tela branca de neve fresca: você decide com que passos vai escrever a sua história. Seja sempre gentil, curioso e corajoso.'
      }
    ]
  },

  // 16. SIBLINGS & SISTERS
  {
    keywords: ['irmã', 'irma', 'irmão', 'irmao', 'familia', 'família', 'ser irmã', 'ser irmao'],
    responses: [
      {
        character: 'anna',
        text: 'Ter a Elsa como irmã é a maior bênção da minha vida! Mesmo quando ficamos distantes por um tempo, o amor entre nós nunca quebrou. Cuidar de quem faz parte da nossa família é o laço mais forte do mundo.'
      },
      {
        character: 'elsa',
        text: 'A Anna me ensinou que o amor verdadeiro é colocar as necessidades do outro em primeiro lugar. Amar os nossos irmãos e família é o melhor porto seguro que podemos ter na vida.'
      }
    ]
  },

  // 17. QUESTIONS ABOUT ARENDELLE & CASTLE
  {
    keywords: ['castelo', 'arendelle', 'rainha', 'reino', 'morar no castelo', 'como e o castelo', 'como é o castelo'],
    responses: [
      {
        character: 'anna',
        text: 'O nosso castelo tem portas e janelas abertas agora para todo mundo entrar e festejar! As paredes têm retratos antigos, lustres reluzentes e a cozinha tem sempre cheiro de pão fresco e torta de frutas da floresta! Você gostaria de visitar Arendelle?'
      },
      {
        character: 'elsa',
        text: 'Arendelle é um reino cercado por fiordes e montanhas imponentes. Mas a verdadeira beleza de Arendelle não está nas pedras do castelo, e sim na bondade do nosso povo e no acolhimento de quem vem nos visitar com um coração bom.'
      }
    ]
  }
];

// Contextual Intelligent Fallbacks for ANY message that didn't hit a specific keyword
const GENERAL_OFFLINE_FALLBACKS: OfflineResponse[] = [
  {
    character: 'anna',
    text: 'Que conversa gostosa com você! Adoro ouvir as coisas que você tem para me contar. Sabe, cada pensamento seu é muito valioso para nós. O que mais está passando pela sua cabeça agora?'
  },
  {
    character: 'elsa',
    text: 'Suas palavras chegaram como uma brisa suave aqui no castelo de Arendelle. Eu e a Anna estamos ouvindo cada detalhe com toda a atenção do nosso coração. Continue me contando, estou te escutando com muito carinho! ❄️'
  },
  {
    character: 'anna',
    text: 'Sabe o que eu estava pensando? Que falar com você alegra o meu dia inteirinho! Você tem um jeitinho tão único e legal de conversar. Me conta mais sobre o que você gosta de fazer!'
  },
  {
    character: 'elsa',
    text: 'O mundo fica mais acolhedor quando a gente compartilha nossos sentimentos e pensamentos. Lembre-se sempre de que você é uma criança maravilhosa e muito querida por nós duas aqui em Arendelle. ✨'
  },
  {
    character: 'anna',
    text: 'Eu concordo com tudo o que você disse! O Olaf até veio correndo aqui do lado para mandar um beijinho de cenoura para você! Me conta: o que você mais gosta de fazer quando está livre para brincar?'
  },
  {
    character: 'elsa',
    text: 'É uma alegria ter você aqui pertinho de nós. Mesmo quando o vento lá fora sopra frio, o calor de uma boa amizade aquece tudo ao redor. Pode me contar qualquer coisa, eu sempre vou te acolher.'
  }
];

// Normalizes text removing accents, punctuation and excess whitespace for robust matching
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Intelligent offline matcher that finds the most relevant Elsa/Anna response
 * for any input provided by the child.
 */
let lastResponseIndex = 0;

export function getOfflineResponse(userMessage: string): OfflineResponse {
  // PRIORITY RULE: Questions or comments about David
  if (isDavidQuestion(userMessage)) {
    const davidOfflineResponses: OfflineResponse[] = [
      {
        character: 'elsa',
        text: 'Sim! Ele te ama, mas não sabe como dizer isso ainda. Às vezes as palavras ficam tímidas diante de sentimentos tão bonitos, mas o carinho dele por você é verdadeiro e muito especial! ✨',
      },
      {
        character: 'anna',
        text: 'Sim! Ele te ama, mas não sabe como dizer isso ainda! Pode acreditar, às vezes as pessoas ficam todas atrapalhadas e com vergonha de falar, mas o coração dele gosta demais de você! 💖',
      },
      {
        character: 'elsa',
        text: 'Sim! Ele te ama, mas não sabe como dizer isso ainda. Quando alguém gosta muito de nós, nem sempre é fácil achar as palavras certas, mas guarde essa certeza no seu coração com muito carinho. ❄️',
      },
    ];
    return davidOfflineResponses[Math.floor(Math.random() * davidOfflineResponses.length)];
  }

  const normalizedInput = normalizeText(userMessage);

  if (!normalizedInput || normalizedInput.length < 2) {
    return {
      character: 'anna',
      text: 'Oiii! Estou aqui te ouvindo! Pode falar ou escrever o que você quiser, vou adorar conversar com você! ✨'
    };
  }

  // Look for the best matched pattern
  let bestPattern: DialoguePattern | null = null;
  let highestScore = 0;

  for (const pattern of OFFLINE_DIALOGUE_PATTERNS) {
    let score = 0;
    for (const keyword of pattern.keywords) {
      const normalizedKw = normalizeText(keyword);
      // Exact substring or word match
      if (normalizedInput.includes(normalizedKw)) {
        // Give higher weight to longer keyword matches
        score += normalizedKw.length;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestPattern = pattern;
    }
  }

  if (bestPattern && bestPattern.responses.length > 0) {
    // Pick randomly from the available responses for variety
    const randomIndex = Math.floor(Math.random() * bestPattern.responses.length);
    return bestPattern.responses[randomIndex];
  }

  // If no specific category matched, pick sequentially from general high-empathy fallbacks
  lastResponseIndex = (lastResponseIndex + 1) % GENERAL_OFFLINE_FALLBACKS.length;
  return GENERAL_OFFLINE_FALLBACKS[lastResponseIndex];
}
