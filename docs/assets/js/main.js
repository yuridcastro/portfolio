// Tema Dark/Light
// const themeToggleInput = document.getElementById('themeToggleInput'); // Não mais necessário
const themeToggleBtn = document.getElementById('themeToggleBtn'); // Novo botão
const rootElement = document.documentElement;

function setTheme(theme) {
  rootElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const isDark = theme === 'dark';
  themeToggleBtn.setAttribute('aria-pressed', isDark);
  // Não precisamos mais sincronizar checkbox
}

function toggleTheme() {
  const currentTheme = rootElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Event listener para o novo botão de tema
themeToggleBtn.addEventListener('click', toggleTheme);

// Carregar tema salvo ao iniciar (lógica mantida)
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

document.getElementById('year').textContent = new Date().getFullYear();

// Modal de Estudo de Caso
const modal = document.getElementById('caseModal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');

// Animações com GSAP e ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Animação para as seções com fade-in e slide-up
document.querySelectorAll('.section').forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 50, // move 50px para cima
        duration: 1.0,
        delay: 0.2,
        ease: 'power3.out', // Easing mais suave
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true
        }
    });
});

// Animação para os cards de projetos (individuais)
document.querySelectorAll('.projeto-item.card').forEach(card => {
    // Animação de hover igual aos cards de livros
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -8, // Mesmo movimento dos livros
            boxShadow: '8px 8px 0px var(--accent)', // Mesma sombra dos livros
            scale: 1.03, // Mesma escala dos livros
            duration: 0.3,
            ease: 'power2.out'
        });
        const img = card.querySelector('img');
        if (img) {
            gsap.to(img, {
                filter: 'grayscale(0%) brightness(1.1)', // Mesmo efeito dos livros
                duration: 0.3
            });
        }
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            boxShadow: 'none',
            scale: 1.0,
            duration: 0.3,
            ease: 'power2.out'
        });
        const img = card.querySelector('img');
        if (img) {
            gsap.to(img, {
                filter: 'grayscale(50%) brightness(1)',
                duration: 0.3
            });
        }
    });
});

// Animação para os itens de ferramentas (individuais) - Agora com Stagger
const toolItems = document.querySelectorAll('.ferramenta-item');
gsap.from(toolItems, {
    opacity: 0,
    y: 30,
    duration: 0.6,
    delay: 0.05,
    ease: 'power2.out',
    stagger: 0.1, // Adiciona um delay de 0.1s entre a animação de cada item
    scrollTrigger: {
        trigger: '.ferramentas-grid', // O gatilho deve ser o contêiner da grid
        start: 'top 90%',
        toggleActions: 'play none none none',
        once: true
    }
});

// Animações específicas para cards de livros - Agora com Stagger
const bookCards = document.querySelectorAll('.livro-card');
bookCards.forEach(card => {
    // Animação de fade-in e slide-up para os cards de livro ao entrar na viewport
    // A animação stagger será aplicada ao conjunto de cards, não individualmente aqui

    // Animação de hover para os cards de livro
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -8, // Mover um pouco mais para cima no hover
            boxShadow: '8px 8px 0px var(--accent)', // Sombra maior e mais pronunciada
            scale: 1.03, // Aumentar um pouco mais o tamanho
            duration: 0.3,
            ease: 'power2.out'
        });
        // Animar a capa do livro (ex: sutil escala ou brilho)
        const img = card.querySelector('img');
        if (img) {
            gsap.to(img, {
                filter: 'grayscale(0%) brightness(1.1)', // Remove grayscale e adiciona brilho
                duration: 0.3
            });
        }
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            boxShadow: 'none', // Remove a sombra completamente ao sair
            scale: 1.0,
            duration: 0.3,
            ease: 'power2.out'
        });
        // Retornar a capa do livro ao estado normal
        const img = card.querySelector('img');
        if (img) {
            gsap.to(img, {
                filter: 'grayscale(50%) brightness(1)', // Retorna grayscale e brilho normal
                duration: 0.3
            });
        }
    });
});

// Animação stagger para os cards de livro (separada da animação individual de fade-in)
gsap.from(bookCards, {
    opacity: 0,
    y: 50,
    duration: 0.8,
    delay: 0.1,
    ease: 'power3.out',
    stagger: 0.15, // Adiciona um delay de 0.15s entre a animação de cada card
    scrollTrigger: {
        trigger: '.leituras-grid', // O gatilho deve ser o contêiner da grid
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true
    }
});

// Animação do Cabeçalho ao Rolar
const header = document.querySelector('.header');

gsap.to(header, {
    paddingTop: '0.5rem', // Diminui o padding no topo
    paddingBottom: '0.5rem', // Diminui o padding na base
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // Adiciona uma sombra suave
    duration: 0.3,
    ease: 'power1.out',
    scrollTrigger: {
        trigger: 'body', // O gatilho é o scroll do body
        start: 'top -50px', // Começa a animação quando a página rolar 50px para baixo
        toggleActions: 'play none reverse none' // play ao descer, reverse ao subir
    }
});

// Variável global para controlar a animação atual
let currentTypingAnimation = null;

// Função de efeito máquina de escrever manual
function typeWriterEffect(element, text, cursorEl, typingSpeed = 70, onComplete) {
    // Limpa qualquer animação anterior
    if (currentTypingAnimation) {
        clearTimeout(currentTypingAnimation);
        currentTypingAnimation = null;
    }

    let i = 0;
    element.textContent = '';
    
    if (cursorEl) {
        cursorEl.style.opacity = '1';
        cursorEl.style.animation = '';
    }

    function type() {
        if (i < text.length) {
            element.textContent += text[i];
            i++;
            currentTypingAnimation = setTimeout(type, typingSpeed);
        } else {
            currentTypingAnimation = null;
            if (cursorEl) {
                // Faz o cursor desaparecer suavemente
                gsap.to(cursorEl, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        cursorEl.style.display = 'none';
                        if (onComplete) onComplete();
                    }
                });
            } else {
                if (onComplete) onComplete();
            }
        }
    }
    type();

    // Retorna uma função para cancelar a animação se necessário
    return () => {
        if (currentTypingAnimation) {
            clearTimeout(currentTypingAnimation);
            currentTypingAnimation = null;
        }
    };
}

// Substituir a animação da hero por digitação manual
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title span:not(.typing-cursor)');
    const tagline = document.querySelector('.tagline span:not(.typing-cursor)');
    const titleCursor = document.querySelector('.hero-title .typing-cursor');
    const taglineCursor = document.querySelector('.tagline .typing-cursor');

    if (!heroTitle || !tagline) return;

    // Pega o texto original
    const heroText = heroTitle.textContent;
    const taglineText = tagline.textContent;

    // Reseta os elementos
    heroTitle.textContent = '';
    tagline.textContent = '';
    
    // Reseta os cursores
    if (titleCursor) {
        titleCursor.style.opacity = '1';
        titleCursor.style.animation = '';
        titleCursor.style.display = 'inline';
    }
    if (taglineCursor) {
        taglineCursor.style.opacity = '0';
        taglineCursor.style.animation = '';
        taglineCursor.style.display = 'inline';
    }

    // Digita o título, depois a tagline
    typeWriterEffect(heroTitle, heroText, titleCursor, 35, () => {
        if (taglineCursor) {
            taglineCursor.style.opacity = '1';
            taglineCursor.style.display = 'inline';
        }
        
        setTimeout(() => {
            typeWriterEffect(tagline, taglineText, taglineCursor, 20);
        }, 200);
    });
}

let typingTimeline = null;

// Variáveis globais para os elementos de idioma
let langToggle, langFlag, langLabel;

// Tradução (Adicionando Espanhol e atualizando lógica)
const translations = {
  'pt-BR': {
    navAbout: 'SOBRE',
    navProjects: 'PROJETOS',
    navPrograms: 'FERRAMENTAS',
    navReadings: 'LEITURAS',
    navBooks: 'LIVROS',
    tagline: 'Designer de Experiência do Usuário & Estudante de Sistemas e Mídias Digitais',
    aboutTitle: 'Sobre Mim',
    aboutBio: 'Sou um estudante de Sistemas e Mídias Digitais apaixonado por Design de Experiência do Usuário (UX). Minha especialidade reside na criação de fluxos de usuário intuitivos e eficientes, transformando ideias complexas em interfaces elegantes e funcionais. Domino ferramentas como Figma e Cursor, aplicando uma abordagem centrada no usuário para resolver problemas e criar produtos digitais impactantes. Estou sempre buscando oportunidades para aplicar e expandir minhas habilidades em projetos desafiadores.',
    projectsTitle: 'Projetos',
    projectRU_Title: 'Cardápio RU Interativo',
    projectRU_Desc: 'Redesenhei a experiência de consulta ao cardápio do RU, transformando um fluxo confuso e layout poluído em um acesso rápido e visualização limpa das informações.',
    projectMap_Title: 'Mapa de Salas',
    projectMap_Desc: 'Encontrar salas para aulas, eventos ou estudo era complicado, pois as informações estavam dispersas em Google Docs, dificultando a localização rápida. Desenvolvi um aplicativo que centraliza esses dados em uma interface intuitiva, agilizando a vida acadêmica dos estudantes.',
    programsTitle: 'Ferramentas',
    toolFigma: 'Figma',
    toolPhotoshop: 'Photoshop',
    toolIllustrator: 'Illustrator',
    toolCursor: 'Cursor',
    toolJS: 'Javascript',
    toolMiro: 'Miro',
    toolMilanote: 'Milanote',
    toolHotjar: 'Hotjar',
    toolJira: 'Jira',
    readingsTitle: 'Minhas Leituras',
    book1Title: 'Não me Faça Pensar', book1Author: 'Steve Krug', book1Quote: '"Se algo é difícil de usar, eu provavelmente não vou usar."',
    book2Title: 'O Design do Dia a Dia', book2Author: 'Donald A. Norman', book2Quote: '"Um bom design é, na verdade, muito mais difícil de notar do que um design ruim."',
    book3Title: 'Sprint', book3Author: 'Jake Knapp', book3Quote: '"Grandes ideias são apenas o começo."',
    book4Title: 'Fácil de Usar', book4Author: 'Giles Colborne', book4Quote: '"Simplicidade é sobre subtrair o óbvio e adicionar o significativo."',
    book5Title: 'O Ato Criativo', book5Author: 'Rick Rubin', book5Quote: '"A fonte da criatividade está dentro de cada um de nós."',
    book6Title: 'O Design como Storytelling', book6Author: 'Ellen Lupton', book6Quote: '"Contar histórias é o coração do design."',
    book7Title: 'Leis da Psicologia Aplicada ao UX', book7Author: 'Jon Yablonski', book7Quote: '"Entender a psicologia do usuário é chave para um bom UX."',
    book8Title: 'Ultra-Aprendizado', book8Author: 'Scott H. Young', book8Quote: '"Aprender intensamente pode transformar sua carreira."',
    book9Title: 'Roube como um Artista', book9Author: 'Austin Kleon', book9Quote: '"Nada é original. Roube de todos os lugares."',
    book10Title: 'Design para Quem Não é Designer', book10Author: 'Robin Williams', book10Quote: '"Design não é apenas o que parece, é como funciona."',
    book11Title: 'Enviesados', book11Author: 'Rian Dutra', book11Quote: '"Nossos vieses moldam nossas decisões, mesmo sem percebermos."',
    book12Title: 'Articulando Decisões de Design', book12Author: 'Tom Greever', book12Quote: '"Comunicar o \'porquê\' do seu design é tão importante quanto o design em si."',
    footerRights: 'Todos os direitos reservados.',
    footerContact: 'Entre em contato',
    myRoleTitle: 'Meu Papel',
    myRoleText: 'Designer UX/UI e Desenvolvedor Mobile.',
    modalRUChallenge: 'O Desafio',
    modalRUProcess: 'Meu Processo UX',
    modalRUSolution: 'A Solução',
    modalRUResults: 'Resultados e Impacto',
    modalRUChallengeText: 'O site oficial da UFC para consulta do cardápio do Restaurante Universitário sofria com sérios problemas de usabilidade. A navegação era contraintuitiva, exigindo múltiplos cliques e buscas externas. O layout apresentava sobrecarga de informação, falta de hierarquia visual clara e um design datado, resultando em uma experiência frustrante e ineficiente para os estudantes.',
    modalRUProcessText: 'Iniciei analisando detalhadamente o fluxo de usuário existente no site oficial, mapeando cada passo e identificando os principais pontos de atrito. O objetivo era claro: simplificar drasticamente a jornada do usuário. Com base nessa análise, projetei um novo fluxo otimizado, focado em acesso rápido e apresentação clara da informação. Protótipos de baixa fidelidade, como o esboço em papel abaixo, foram cruciais nesta fase inicial para validar a estrutura básica antes de avançar para a implementação, que envolveu web scraping dos dados oficiais e desenvolvimento da interface com auxílio do Cursor.',
    modalRUSolutionText: 'A solução final é um <strong>aplicativo móvel</strong> leve e responsivo que transforma os dados brutos do site oficial em uma interface limpa e intuitiva. O cardápio é apresentado de forma organizada, geralmente por dia, com fácil navegação e destaque para informações essenciais. O design prioriza a clareza e a rapidez, eliminando a sobrecarga de informação. Além disso, implementei uma funcionalidade que permite aos usuários favoritar pratos específicos e receber notificações push quando eles estiverem disponíveis no cardápio. O cardápio também se atualiza dinamicamente de acordo com o horário, mostrando automaticamente o almoço ou jantar conforme o período do dia. A comparação abaixo ilustra a transformação da experiência:',
    comparisonBefore: 'Antes (v1)',
    comparisonAfter: 'Depois (v2)',
    modalRUResultsText: 'O impacto mais significativo foi a recepção positiva da comunidade estudantil. Mesmo sendo um projeto pessoal, cerca de 20 estudantes da UFC solicitaram acesso à versão inicial (em formato .apk) e relataram utilizá-la regularmente em seu dia a dia, validando a utilidade e a melhoria na experiência de consulta ao cardápio. Isso demonstra como um design focado no usuário pode transformar uma tarefa rutinheira frustrante em algo simples e eficiente.',
    captionCurrentSite: 'Screenshot do atual site do Cardápio RU da UFC.',
    captionPrototype: 'Protótipo inicial em papel do Cardápio RU.',
    mapaSalas_Figcaption: 'Mapa de Salas no Google Docs',
    mapaSalas_FigcaptionV1: 'Lista de salas disponíveis no app',
    mapaSalas_FigcaptionV2: 'Horários e reservas de uma sala',
    modalMap_Challenge: 'O Desafio',
    modalMap_ChallengeText: 'Encontrar salas para aulas, eventos ou estudo era complicado, pois as informações estavam dispersas em Google Docs, dificultando a localização rápida. Desenvolvi um aplicativo que centraliza esses dados em uma interface intuitiva, agilizando a vida acadêmica dos estudantes.',
    modalMap_Solution: 'A Solução',
    modalMap_SolutionText: 'O app Mapa de Salas centraliza todas as informações de ocupação das salas em uma interface intuitiva, permitindo buscas rápidas por salas vagas ou por onde está ocorrendo determinada aula. O design prioriza clareza, agilidade e fácil navegação, facilitando a vida acadêmica.',
    modalMap_Results: 'Resultados e Impacto',
    modalMap_ResultsText: 'A centralização das informações e a facilidade de busca proporcionaram economia de tempo e menos frustração para estudantes e professores, tornando o processo de encontrar salas muito mais eficiente.'
  },
  'en': {
    navAbout: 'ABOUT',
    navProjects: 'PROJECTS',
    navPrograms: 'TOOLS',
    navReadings: 'READINGS',
    navBooks: 'BOOKS',
    tagline: 'User Experience Designer & Digital Systems and Media Student',
    aboutTitle: 'About Me',
    aboutBio: 'I am a passionate student of Digital Systems and Media focused on User Experience (UX) Design, based in Brazil. My expertise lies in creating intuitive and efficient user flows, transforming complex ideas into elegant and functional interfaces. I master tools like Figma and Cursor, applying a user-centered approach to solve problems and create impactful digital products. I am always looking for opportunities to apply and expand my skills on challenging projects.',
    projectsTitle: 'Projects',
    projectRU_Title: 'Interactive RU Menu',
    projectRU_Desc: 'Redesigned the University Restaurant menu experience, turning a confusing flow and cluttered layout into quick access and a clean visualization of information.',
    projectMap_Title: 'Room Map',
    projectMap_Desc: "Locating rooms for classes, events, or study sessions was complicated, as information was scattered across Google Docs, hindering quick searches. I developed an application that centralizes this data into an intuitive interface, streamlining students' academic lives.",
    programsTitle: 'Tools',
    toolFigma: 'Figma',
    toolPhotoshop: 'Photoshop',
    toolIllustrator: 'Illustrator',
    toolCursor: 'Cursor',
    toolJS: 'Javascript',
    toolMiro: 'Miro',
    toolMilanote: 'Milanote',
    toolHotjar: 'Hotjar',
    toolJira: 'Jira',
    readingsTitle: 'My Readings',
    book1Title: "Don't Make Me Think", book1Author: 'Steve Krug', book1Quote: "If something is hard to use, I'm probably not going to use it.",
    book2Title: 'The Design of Everyday Things', book2Author: 'Donald A. Norman', book2Quote: "Good design is actually a lot harder to notice than poor design.",
    book3Title: 'Sprint', book3Author: 'Jake Knapp', book3Quote: "Great ideas are just the beginning.",
    book4Title: 'Simple and Usable', book4Author: 'Giles Colborne', book4Quote: "Simplicity is about subtracting the obvious and adding the meaningful.",
    book5Title: 'The Creative Act', book5Author: 'Rick Rubin', book5Quote: "The source of creativity is within each of us.",
    book6Title: 'Design is Storytelling', book6Author: 'Ellen Lupton', book6Quote: "Storytelling is the heart of design.",
    book7Title: 'Laws of UX', book7Author: 'Jon Yablonski', book7Quote: "Understanding user psychology is key to good UX.",
    book8Title: 'Ultralearning', book8Author: 'Scott H. Young', book8Quote: "Intense learning can transform your career.",
    book9Title: 'Steal Like an Artist', book9Author: 'Austin Kleon', book9Quote: "Nothing is original. Steal from everywhere.",
    book10Title: "The Non-Designer's Design Book", book10Author: 'Robin Williams', book10Quote: "Design is not just what it looks like, it's how it works.",
    book11Title: 'Enviesados', book11Author: 'Rian Dutra', book11Quote: "Our biases shape our decisions, even without us noticing.",
    book12Title: 'Articulating Design Decisions', book12Author: 'Tom Greever', book12Quote: "Communicating the 'why' of your design is as important as the design itself.",
    footerRights: 'All rights reserved.',
    footerContact: 'Get in touch',
    myRoleTitle: 'My Role',
    myRoleText: 'UX/UI Designer and Mobile Developer.',
    modalRUChallenge: 'The Challenge',
    modalRUProcess: 'My UX Process',
    modalRUSolution: 'The Solution',
    modalRUResults: 'Results and Impact',
    modalRUChallengeText: 'The official UFC website for checking the University Restaurant menu suffered from serious usability issues. Navigation was counterintuitive, requiring multiple clicks and external searches. The layout featured information overload, a lack of clear visual hierarchy, and a dated design, resulting in a frustrating and inefficient experience for students.',
    modalRUProcessText: 'I began by thoroughly analyzing the existing user flow on the official website, mapping each step and identifying key friction points. The goal was clear: drastically simplify the user journey. Based on this analysis, I designed a new, optimized flow focused on quick access and clear information presentation. Low-fidelity prototypes, like the paper sketch below, were crucial in this initial phase to validate the basic structure before moving to implementation, which involved web scraping official data and developing the interface with the help of Cursor.',
    modalRUSolutionText: 'The final solution is a lightweight and responsive <strong>mobile application</strong> that transforms the raw data from the official site into a clean and intuitive interface. The menu is presented in an organized manner, usually by day, with easy navigation and highlighting of essential information. The design prioritizes clarity and speed, eliminating information overload. Additionally, I implemented a feature allowing users to favorite specific meals and receive push notifications when they are available on the menu. The menu also updates dynamically according to the time, automatically showing lunch or dinner depending on the time of day. The comparison below illustrates the transformation of the experience:',
    comparisonBefore: 'Before (v1)',
    comparisonAfter: 'After (v2)',
    modalRUResultsText: 'The most significant impact was the positive reception from the student community. Even as a personal project, around 20 UFC students requested access to the initial version (as an .apk file) and reported using it regularly in their daily lives, validating the utility and the improved menu checking experience. This demonstrates how user-focused design can transform a frustrating routine task into something simple and efficient.',
    captionCurrentSite: 'Screenshot of the current UFC University Restaurant menu website.',
    captionPrototype: 'Initial paper prototype of the University Restaurant menu.',
    mapaSalas_Figcaption: 'Room Map in Google Docs',
    mapaSalas_FigcaptionV1: 'List of available rooms in the app',
    mapaSalas_FigcaptionV2: 'Room schedule and reservations',
    modalMap_Challenge: 'The Challenge',
    modalMap_ChallengeText: 'Finding available rooms or figuring out which rooms were hosting some classes was complicated, as the information was scattered in Google Docs, making quick searches difficult. I developed an app that centralizes this data in an intuitive interface, streamlining students\' academic life.',
    modalMap_Solution: 'The Solution',
    modalMap_SolutionText: 'The Room Map app centralizes all room occupancy information in an intuitive interface, allowing quick searches for available rooms or where a specific class is taking place. The design prioritizes clarity, speed, and easy navigation, making academic life easier.',
    modalMap_Results: 'Results and Impact',
    modalMap_ResultsText: 'Centralizing information and making searches easier saved time and reduced frustration for students and teachers, making the process of finding rooms much more efficient.'
  },
  'es': {
    navAbout: 'SOBRE MÍ',
    navProjects: 'PROYECTOS',
    navPrograms: 'HERRAMIENTAS',
    navReadings: 'LECTURAS',
    navBooks: 'LIBROS',
    tagline: 'Diseñador de Experiencia de Usuario & Estudiante de Sistemas y Medios Digitales',
    aboutTitle: 'Sobre Mí',
    aboutBio: 'Soy un estudiante apasionado por los Sistemas y Medios Digitales enfocado en el Diseño de Experiencia de Usuario (UX), residente en Brasil. Mi especialidad reside en la creación de flujos de usuario intuitivos y eficientes, transformando ideas complejas en interfaces elegantes y funcionales. Domino herramientas como Figma y Cursor, aplicando un enfoque centrado en el usuario para resolver problemas y crear productos digitales impactantes. Siempre estoy buscando oportunidades para aplicar y expandir mis habilidades en proyectos desafiantes.',
    projectsTitle: 'Proyectos',
    projectRU_Title: 'Menú Interactivo RU',
    projectRU_Desc: 'Rediseñé la experiencia de consulta del menú del Comedor Universitario, transformando un flujo confuso y un diseño desordenado en un acceso rápido y una visualización limpia de la información.',
    projectMap_Title: 'Mapa de Salas',
    projectMap_Desc: "Localizar salas para clases, eventos o sesiones de estudio era complicado, ya que la información estaba dispersa en Google Docs, lo que dificultaba las búsquedas rápidas. Desarrollé una aplicación que centraliza estos datos en una interfaz intuitiva, agilizando la vida académica de los estudiantes.",
    programsTitle: 'Herramientas',
    toolFigma: 'Figma',
    toolPhotoshop: 'Photoshop',
    toolIllustrator: 'Illustrator',
    toolCursor: 'Cursor',
    toolJS: 'Javascript',
    toolMiro: 'Miro',
    toolMilanote: 'Milanote',
    toolHotjar: 'Hotjar',
    toolJira: 'Jira',
    readingsTitle: 'Mis Lecturas',
    book1Title: 'No me Hagas Pensar', book1Author: 'Steve Krug', book1Quote: "Si algo es difícil de usar, probablemente no lo usaré.",
    book2Title: 'La Psicología de los Objetos Cotidianos', book2Author: 'Donald A. Norman', book2Quote: "Un buen diseño es, en realidad, mucho más difícil de notar que un mal diseño.",
    book3Title: 'Sprint', book3Author: 'Jake Knapp', book3Quote: "Las grandes ideas son solo el comienzo.",
    book4Title: 'Simple y Usable', book4Author: 'Giles Colborne', book4Quote: "La simplicidad consiste en restar lo obvio y añadir lo significativo.",
    book5Title: 'El Acto Creativo', book5Author: 'Rick Rubin', book5Quote: "La fuente de la creatividad está dentro de cada uno de nosotros.",
    book6Title: 'Diseñar es Contar Historias', book6Author: 'Ellen Lupton', book6Quote: "Contar historias es el corazón del diseño.",
    book7Title: 'Leyes de UX', book7Author: 'Jon Yablonski', book7Quote: "Entender la psicología del usuario es clave para una buena UX.",
    book8Title: 'Ultralearning', book8Author: 'Scott H. Young', book8Quote: "El aprendizaje intenso puede transformar tu carrera.",
    book9Title: 'Roba como un Artista', book9Author: 'Austin Kleon', book9Quote: "Nada es original. Roba de todas partes.",
    book10Title: 'Diseño para No Diseñadores', book10Author: 'Robin Williams', book10Quote: "El diseño no es solo cómo se ve, es cómo funciona.",
    book11Title: 'Enviesados', book11Author: 'Rian Dutra', book11Quote: "Nuestros sesgos moldean nuestras decisiones, incluso sin que nos demos cuenta.",
    book12Title: 'Articulando Decisiones de Diseño', book12Author: 'Tom Greever', book12Quote: "Comunicar el 'porqué' de tu diseño es tan importante como el diseño mismo.",
    footerRights: 'Todos los derechos reservados.',
    footerContact: 'Contacta conmigo',
    myRoleTitle: 'Mi Rol',
    myRoleText: 'Diseñador UX/UI y Desarrollador Móvil.',
    modalRUChallenge: 'El Desafío',
    modalRUProcess: 'Mi Proceso UX',
    modalRUSolution: 'La Solución',
    modalRUResults: 'Resultados e Impacto',
    modalRUChallengeText: 'El sitio web oficial de la UFC para consultar el menú del Comedor Universitario sufría graves problemas de usabilidad. La navegación era contraintuitiva, requiriendo múltiples clics y búsquedas externas. El diseño presentaba sobrecarga de información, falta de una jerarquía visual clara y un diseño anticuado, lo que resultaba en una experiencia frustrante e ineficiente para los estudiantes.',
    modalRUProcessText: 'Comencé analizando detalladamente el flujo de usuario existente en el sitio web oficial, mapeando cada paso e identificando los principales puntos de fricción. El objetivo era claro: simplificar drásticamente el recorrido del usuario. Basándome en este análisis, diseñé un nuevo flujo optimizado, centrado en el acceso rápido y la presentación clara de la información. Los prototipos de baja fidelidad, como el boceto en papel a continuación, fueron cruciales en esta fase inicial para validar la estructura básica antes de pasar a la implementación, que implicó web scraping de los datos oficiales y el desarrollo de la interfaz con la ayuda de Cursor.',
    modalRUSolutionText: 'La solución final es una <strong>aplicación móvil</strong> ligera y responsiva que transforma los datos brutos del sitio oficial en una interfaz limpia e intuitiva. El menú se presenta de forma organizada, generalmente por día, con fácil navegación y resaltando la información esencial. El diseño prioriza la claridad y la rapidez, eliminando la sobrecarga de información. Además, implementé una funcionalidad que permite a los usuarios marcar platos específicos como favoritos y recibir notifications push cuando estén disponibles en el menú. El menú también se actualiza dinámicamente según la hora, mostrando automáticamente el almuerzo o la cena según el período del día. La comparación a continuación ilustra la transformación de la experiencia:',
    comparisonBefore: 'Antes (v1)',
    comparisonAfter: 'Después (v2)',
    modalRUResultsText: 'El impacto más significativo fue la recepción positiva de la comunidad estudiantil. Incluso siendo un proyecto personal, alrededor de 20 estudiantes de la UFC solicitaron acceso a la versión inicial (en formato .apk) e informaron que la usan regularmente en su día a día, validando la utilidad y la mejora en la experiencia de consulta del menú. Esto demuestra cómo un diseño centrado en el usuario puede transformar una tarea rutinaria frustrante en algo simple y eficiente.',
    captionCurrentSite: 'Captura de pantalla del sitio web actual del menú del Comedor Universitario de la UFC.',
    captionPrototype: 'Prototipo inicial en papel del menú del Comedor Universitario.',
    mapaSalas_Figcaption: 'Mapa de Salas en Google Docs',
    mapaSalas_FigcaptionV1: 'Lista de aulas disponibles en la app',
    mapaSalas_FigcaptionV2: 'Horarios y reservas de una sala',
    modalMap_Challenge: 'El Desafío',
    modalMap_ChallengeText: 'Encontrar aulas disponibles o saber dónde se estaban impartiendo ciertas clases era complicado, ya que la información estaba dispersa en Google Docs, lo que dificultaba las búsquedas rápidas. Desarrollé una aplicación que centraliza estos datos en una interfaz intuitiva, agilizando la vida académica de los estudiantes.',
    modalMap_Solution: 'La Solución',
    modalMap_SolutionText: 'La app Mapa de Salas centraliza toda la información de ocupación de las aulas en una interfaz intuitiva, permitiendo búsquedas rápidas de aulas disponibles o dónde se imparte una clase específica. El diseño prioriza la claridad, la agilidad y la navegación sencilla, facilitando la vida académica.',
    modalMap_Results: 'Resultados e Impacto',
    modalMap_ResultsText: 'La centralización de la información y la facilidad de búsqueda proporcionaron ahorro de tiempo y menos frustración para estudiantes y profesores, haciendo que el proceso de encontrar aulas sea mucho más eficiente.'
  }
};

const langTextMap = {
  'pt-BR': 'PT-BR',
  'en': 'EN',
  'es': 'ES'
};

const availableLangs = ['pt-BR', 'en', 'es'];
let currentLangIndex = 0; // Começa com PT
let currentLang = 'pt-BR'; // Definir idioma padrão para evitar erros

// URLs das bandeiras atualizadas
const flagUrls = {
  'en': 'https://flagcdn.com/w40/gb.png', // UK
  'pt-BR': 'https://flagcdn.com/w40/br.png', // Brasil
  'es': 'https://flagcdn.com/w40/es.png'  // Espanha
};

// Atualizar alt e aria-label do botão de idioma
const langNames = { 'pt-BR': 'Português', 'en': 'Inglês', 'es': 'Espanhol' };

// Toda a lógica de internacionalização e listeners só após o DOM pronto

document.addEventListener('DOMContentLoaded', () => {
    // Atribuir as variáveis globais após o DOM estar pronto
    langToggle = document.getElementById('langToggle');
    langFlag = document.getElementById('langFlag');
    langLabel = document.getElementById('langLabel'); // Novo elemento

    // Set initial language
    const savedLang = localStorage.getItem('selectedLanguage'); // Tenta ler o idioma salvo
    const browserLang = navigator.language.split('-')[0];

    let initialLang = 'pt-BR'; // Default
    if (savedLang && availableLangs.includes(savedLang)) {
        initialLang = savedLang; // Usa o idioma salvo se válido
    } else if (availableLangs.includes(browserLang)) {
        initialLang = browserLang; // Senão, tenta o idioma do navegador
    }

    const initialIndex = availableLangs.indexOf(initialLang);
    setLanguage(availableLangs[initialIndex]);

    // Listener para botão de idioma
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLangIndex = (currentLangIndex + 1) % availableLangs.length;
            const nextLang = availableLangs[currentLangIndex];
            setLanguage(nextLang);
        });
    }

    // Listener para botão de tema
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Observer para animações (mantido)
    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    document.querySelectorAll('.section, .livro-card, .projeto-item.card').forEach(el => {
        if (el) {
            el.classList.add('fade-up');
            scrollObserver.observe(el);
        }
    });
});

// --- Menu Hamburger --- 
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
        const isExpanded = mainNav.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
        // Opcional: animar ícone hamburger para X
        navToggle.classList.toggle('active'); 
    });
    // Fechar menu ao clicar em um link (opcional)
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
            }
        });
    });
} 

// Função para abrir o modal com conteúdo dinâmico (simplificada)
function openModal(caseId) {
    const modal = document.getElementById('caseModal');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.getElementById('closeModal'); // Garantir que temos o botão

    // Tenta pegar o título do card clicado
    const projectCard = document.querySelector(`.projeto-item[data-case="${caseId}"]`);
    let projectTitle = `Estudo de Caso: ${caseId}`; // Título fallback
    if (projectCard) {
        const titleElement = projectCard.querySelector('h3[data-i18n]');
        if (titleElement) {
            // Pega a chave de tradução e traduz se possível
            const titleKey = titleElement.getAttribute('data-i18n');
            projectTitle = translations[currentLang] && translations[currentLang][titleKey]
                            ? `Estudo de Caso: ${translations[currentLang][titleKey]}`
                            : titleElement.textContent; // Usa o texto atual se a tradução falhar
        }
    }

    // Conteúdo placeholder simples
    let content = `
        <h2 id="modalTitle">${projectTitle}</h2>
        <p>O conteúdo detalhado deste estudo de caso será adicionado em breve.</p>
        <!-- Você pode adicionar o conteúdo específico aqui quando estiver pronto -->
    `;

    modalBody.innerHTML = content;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focar no botão de fechar para acessibilidade
    if (closeModalBtn) {
        closeModalBtn.focus();
    }

    // Adiciona listener para fechar com ESC (se não existir ainda)
    if (!document.onkeydown || document.onkeydown.name !== 'closeModalOnEsc') {
      document.addEventListener('keydown', closeModalOnEsc);
    }
}

// Função para fechar o modal (simplificada, se necessário)
function closeModal() {
    const modal = document.getElementById('caseModal');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Restaura scroll
    // Remove listener ESC
    document.removeEventListener('keydown', closeModalOnEsc);
}

// Função para fechar com ESC
function closeModalOnEsc(e) {
    if (e.key === "Escape") {
        closeModal();
    }
}

function setLanguage(lang) {
    const langIndex = availableLangs.indexOf(lang);
    if (langIndex === -1) return;

    currentLangIndex = langIndex;
    currentLang = availableLangs[currentLangIndex];

    const currentLangName = langNames[currentLang] || currentLang.toUpperCase();
    const currentLangAbbr = langTextMap[currentLang] || currentLang.toUpperCase();
    if (langFlag) {
        langFlag.src = flagUrls[currentLang];
        langFlag.alt = `Idioma atual: ${currentLangName}`;
    } else {
        console.error('langFlag não encontrado no DOM');
    }
    if (langToggle) {
        langToggle.setAttribute('aria-label', `Mudar idioma, atual: ${currentLangName}`);
        langToggle.title = `Mudar idioma (Atual: ${currentLangName})`;
    } else {
        console.error('langToggle não encontrado no DOM');
    }
    if (langLabel) {
        langLabel.textContent = currentLangAbbr;
    } else {
        console.error('langLabel não encontrado no DOM');
    }
    localStorage.setItem('selectedLanguage', lang);
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[currentLang] && translations[currentLang][key]) {
            if (el.classList.contains('hero-title') || el.classList.contains('tagline')) {
                // Não faz nada aqui, será tratado abaixo
            } else if (key.startsWith('book') && key.endsWith('Quote')) {
                 el.innerHTML = translations[currentLang][key];
            } else if (key === 'aboutBio' || key === 'footerContact' || key === 'projectRU_Desc' || key === 'projectMap_Desc' || key.includes('Text')) {
                el.innerHTML = translations[currentLang][key];
            } else {
                el.textContent = translations[currentLang][key];
            }
        }
    });

    const heroTitleSpan = document.querySelector('.hero-title span:not(.typing-cursor)');
    const taglineSpan = document.querySelector('.tagline span:not(.typing-cursor)');
    if (heroTitleSpan) heroTitleSpan.textContent = translations[currentLang]?.heroTitle || 'YURI DE CASTRO';
    if (taglineSpan) taglineSpan.textContent = translations[currentLang]?.tagline || 'Designer de Experiência do Usuário & Estudante de Sistemas e Mídias Digitais';

    if (currentTypingAnimation) {
        clearTimeout(currentTypingAnimation);
        currentTypingAnimation = null;
    }
    
    setTimeout(() => {
        initTypingAnimation();
    }, 100);
} 