/* === REFACTORED JAVASCRIPT === */

// === VARIÁVEIS GLOBAIS ===
let currentTypingAnimation = null;
let langToggle, langFlag, langLabel, themeToggleBtn;
let currentLang = 'pt-BR';
let currentLangIndex = 0;
let isTypewriting = false;

// === CONFIGURAÇÕES ===
const availableLangs = ['pt-BR', 'en', 'es'];
const langTextMap = {
    'pt-BR': 'PT-BR',
    'en': 'EN', 
    'es': 'ES'
};

const flagUrls = {
    'en': 'https://flagcdn.com/w40/gb.png',
    'pt-BR': 'https://flagcdn.com/w40/br.png',
    'es': 'https://flagcdn.com/w40/es.png'
};

const langNames = { 
    'pt-BR': 'Português', 
    'en': 'English', 
    'es': 'Español' 
};

// === TRADUÇÕES ===
const translations = {
  'pt-BR': {
    navAbout: 'SOBRE',
    navProjects: 'PROJETOS',
    navPosters: 'PÔSTERES',
    navReadings: 'LEITURAS',
        tagline: 'Designer de Experiência do Usuário, Estudante de Sistemas e Mídias Digitais & ',
    aboutTitle: 'Sobre Mim',
        aboutBio: 'Olá, sou o Yuri. Designer de experiência do usuário (UX) apaixonado por transformar problemas complexos em soluções simples, elegantes e intuitivas. Meu objetivo é criar produtos que não sejam apenas bonitos, mas também fáceis e agradáveis de usar.',
        aboutDescription: 'Acredito que boas experiências nascem da observação da vida real. Minha curiosidade por histórias, jogos e comportamento humano alimenta diretamente meu trabalho como designer. Quando não estou criando interfaces, você pode me encontrar:',
        aboutConclusion: 'Estou sempre ansioso para aprender e enfrentar novos desafios. Se você está procurando um designer apaixonado para se juntar à sua equipe ou quer conversar sobre um projeto, adoraria me conectar.',
    projectsTitle: 'Projetos',
    postersTitle: 'Pôsteres',
        readingsTitle: 'Minhas Leituras',
    toolFigma: 'Figma',
    toolPhotoshop: 'Photoshop',
    toolIllustrator: 'Illustrator',
    toolCursor: 'Cursor',
    toolJS: 'Javascript',
    toolMiro: 'Miro',
    toolMilanote: 'Milanote',
    toolHotjar: 'Hotjar',
    toolJira: 'Jira',
        book1Title: 'Não me Faça Pensar',
        book1Author: 'Steve Krug',
        book1Quote: '"Se algo é difícil de usar, eu provavelmente não vou usar."',
        book2Title: 'O Design do Dia a Dia',
        book2Author: 'Donald A. Norman',
        book2Quote: '"Um bom design é, na verdade, muito mais difícil de notar do que um design ruim."',
        book3Title: 'Sprint',
        book3Author: 'Jake Knapp',
        book3Quote: '"Grandes ideias são apenas o começo."',
        book4Title: 'Fácil de Usar',
        book4Author: 'Giles Colborne',
        book4Quote: '"Simplicidade é sobre subtrair o óbvio e adicionar o significativo."',
        book5Title: 'O Ato Criativo',
        book5Author: 'Rick Rubin',
        book5Quote: '"A fonte da criatividade está dentro de cada um de nós."',
        book6Title: 'O Design como Storytelling',
        book6Author: 'Ellen Lupton',
        book6Quote: '"Contar histórias é o coração do design."',
        book7Title: 'Leis da Psicologia Aplicada ao UX',
        book7Author: 'Jon Yablonski',
        book7Quote: '"Entender a psicologia do usuário é chave para um bom UX."',
        book8Title: 'Ultra-Aprendizado',
        book8Author: 'Scott H. Young',
        book8Quote: '"Aprender intensamente pode transformar sua carreira."',
        book9Title: 'Roube como um Artista',
        book9Author: 'Austin Kleon',
        book9Quote: '"Nada é original. Roube de todos os lugares."',
        book10Title: 'Design para Quem Não é Designer',
        book10Author: 'Robin Williams',
        book10Quote: '"Design não é apenas o que parece, é como funciona."',
        book11Title: 'Enviesados',
        book11Author: 'Rian Dutra',
        book11Quote: '"Nossos vieses moldam nossas decisões, mesmo sem percebermos."',
        book12Title: 'Articulando Decisões de Design',
        book12Author: 'Tom Greever',
        book12Quote: '"Comunicar o \'porquê\' do seu design é tão importante quanto o design em si."',
            footerRights: 'Todos os direitos reservados.',
        footerContact: 'Entre em contato',
        hobby1: '🎮 jogando games online',
        hobby2: '📖 lendo mangás e literatura',
        hobby3: '🌳 relaxando em parques',
        hobby4: '🖼️ visitando museus',
        hobby5: '🧠 estudando psicologia',
        hobby6: '🦸 lendo quadrinhos',
        hobby7: '🏓 jogando tênis de mesa',
        hobby8: '📚 devorando bons livros',
        hobby9: '🎨 descobrindo arte em tudo',
        contactButton: 'Entre em Contato',
        projectsButton: 'Veja meus projetos',
        cardClickBadge: '👆 CLIQUE PARA VER',
        // Projetos - Case Studies
        projectRU_Title: 'Cardápio RU: Redesign Completo',
        projectRU_Description: 'Transformação de um fluxo frustrante em uma experiência intuitiva que conquistou 20+ usuários ativos. Do mapeamento de problemas ao desenvolvimento final.',
        projectMap_Title: 'Mapa de Salas: Sistema Inteligente',
        projectMap_Description: 'Solução centralizada para localização de salas disponíveis na universidade. Interface clara que otimiza a vida acadêmica dos estudantes.',
        
        // Poster Gallery
        posterAves: 'Aves',
        posterCaminhos: 'Caminhos',
        posterOndeFlor: 'Onde Flor',
        posterEmpty: 'Vazio',
        posterUnlucky: 'Azar',
        
        // Case Study Content
        myRole: 'MEU PAPEL',
        myRoleRU: 'UX/UI Designer e Desenvolvedor Mobile',
        myRoleMap: 'UX/UI Designer e Desenvolvedor Mobile',
        challenge: 'O DESAFIO',
        solution: 'A SOLUÇÃO',
        results: 'RESULTADOS E IMPACTO',
        backToProjects: '← Voltar aos Projetos',
        
        // New Translations for Enhanced Content
        skillsApplied: 'Competências Aplicadas:',
        designSkills: '🎨 Design',
        developmentSkills: '⚡ Desenvolvimento Mobile',
        toolsAndTech: 'Ferramentas e Tecnologias:',
        iterativeProcess: 'Processo Iterativo de Design',
        version1Title: 'Versão 1 (Protótipo Inicial):',
        version1Description: 'Focado na arquitetura de informação e funcionalidades básicas. Transformei os dados brutos do site oficial em uma interface mobile-first, priorizando a organização clara das informações do cardápio por dia e implementando navegação simplificada.',
        version2Title: 'Versão 2 (Refinamento Visual):',
        version2Description: 'Com base no feedback dos usuários da V1, concentrei-me em melhorar a hierarquia visual, implementar um sistema de cores mais intuitivo para categorização dos pratos, e adicionar funcionalidades avançadas como favoritos e notificações push.',
        iterativeEvolution: 'A evolução do design demonstra um processo centrado no usuário, onde cada iteração resolveu problemas específicos identificados através de testes e feedback contínuo:',
        v1Improvements: 'Principais Melhorias da V1 para V2:',
        visualHierarchy: 'Hierarquia Visual: Implementação de tipografia mais robusta e espaçamento consistente',
        colorSystem: 'Sistema de Cores: Categorização visual dos pratos por tipo (principal, vegetariano, sobremesa)',
        microInteractions: 'Microinterações: Feedback visual para ações do usuário (favoritar, expandir detalhes)',
        accessibility: 'Acessibilidade: Melhoria no contraste e tamanhos de fonte para melhor legibilidade',
        
        // Skills Lists
        userResearchSkill: 'Pesquisa de usuário e análise de comportamento',
        informationArchitecture: 'Arquitetura de informação e wireframing',
        mobileFirstDesign: 'Design de interface mobile-first',
        prototypingTesting: 'Prototipação interativa e testes de usabilidade',
        progressiveWebApp: 'Progressive Web Apps (PWA)',
        responsiveMobile: 'Design responsivo mobile-first',
        mobileJavaScript: 'JavaScript para aplicações mobile',
        performanceOpt: 'Otimização de performance mobile',
        aiAssistance: 'Desenvolvimento assistido por IA (Cursor + Gemini)',
        
        // RU Project Content
        projectRU_Overview: 'Transformação completa de um sistema frustrante em uma experiência mobile intuitiva com 20+ usuários ativos',
        projectRU_OverviewText: 'O site oficial do Restaurante Universitário da UFC apresentava sérios problemas de usabilidade e arquitetura da informação. Desenvolvi uma solução mobile-first que otimiza o acesso às informações e melhora significativamente a experiência do usuário.',
        myRoleRUText: 'Responsável por todo o ciclo do projeto: pesquisa do usuário, análise de problemas, arquitetura da informação, prototipação, design de interface mobile e desenvolvimento técnico. Também conduzi testes de usabilidade informais e coletei feedback contínuo dos usuários.',
        projectRU_ChallengeText: 'A plataforma existente apresentava barreiras significativas que impactavam negativamente a experiência do usuário:',
        projectRU_SolutionText: 'Desenvolvi um aplicativo móvel leve e responsivo seguindo uma abordagem iterativa de design. O processo envolveu duas versões principais, cada uma com objetivos específicos de melhoria da experiência do usuário.',
        projectRU_ResultsText: 'A solução desenvolvida demonstrou validação orgânica através da adoção espontânea pelos usuários:',
        
        // Map Project Content
        projectMap_Overview: 'Projeto conceitual desenvolvido para resolver sobrecarga cognitiva causada pelo acesso fragmentado à informação de salas',
        projectMap_OverviewText: 'O sistema de localização de salas da universidade estava fragmentado em documentos dispersos no Google Docs, criando um processo lento e cognitivamente desgastante. Desenvolvi uma solução conceitual que reorganiza essas informações de forma mais intuitiva e acessível.',
        myRoleMapText: 'Responsável por todo o ciclo do projeto: identificação do problema pessoal, análise da experiência atual, arquitetura da informação, design de interface e prototipação. Apliquei metodologias de design centrado no usuário para criar uma solução conceitual mais eficiente.',
        
        // UX Skills
        userInterviews: 'Entrevistas com usuários e análise comportamental',
        userJourneyMapping: 'Mapeamento de jornada do usuário',
        usabilityTesting: 'Testes de usabilidade e iteração',
        performanceOptimization: 'Otimização de performance mobile',
        dataStructuring: 'Estruturação e normalização de dados',
        responsiveDesign: 'Design responsivo mobile-first',
        accessibilityImplementation: 'Implementação de acessibilidade',
        
        // Problem Analysis
        fragmentedInformation: 'Informação Fragmentada',
        fragmentedInformationText: 'Dados dispersos em múltiplos Google Docs sem padronização ou organização lógica',
        inefficientSearch: 'Sobrecarga Cognitiva',
        inefficientSearchText: 'Processo manual de localização demandava esforço mental excessivo para uma tarefa simples',
        mobileAccessibility: 'Acesso Mobile Limitado',
        mobileAccessibilityText: 'Documentos não otimizados para dispositivos móveis, dificultando consultas rápidas',
        realTimeUpdates: 'Interface Inadequada',
        realTimeUpdatesText: 'Formato de tabela em documento não otimizado para consulta rápida e escanamento visual',
        
        // Design Process
        designProcessMapText: 'Apliquei metodologia de Design Thinking para transformar um problema pessoal em uma solução conceitual estruturada:',
        empathizePhase: 'Identificar - Análise do Problema',
        empathizePhaseText: 'Análise da minha própria experiência revelou que o processo de busca em Google Docs era cognitivamente desgastante e ineficiente para consultas rápidas.',
        definePhase: 'Definir - Arquitetura da Informação',
        definePhaseText: 'Reestruturação dos dados das salas criando uma taxonomia lógica por andar e tipo, priorizando clareza visual sobre densidade de informação.',
        ideatePhase: 'Idealizar - Conceitos de Interface',
        ideatePhaseText: 'Desenvolvimento de conceitos de interface focados em busca visual, hierarquia clara e redução de carga cognitiva.',
        prototypePhase: 'Prototipar - Interface Mobile',
        prototypePhaseText: 'Criação de protótipo mobile-first com sistema de cores para status das salas e navegação simplificada.',
        testPhase: 'Refinar - Iteração do Design',
        testPhaseText: 'Refinamento da interface baseado na própria experiência de uso e princípios de usabilidade.',
        
        // Solution Features
        solutionFeatures: 'Fluxo Simples e Direto:',
        visualSearch: 'Abrir o App:',
        visualSearchText: 'Interface limpa e dedicada, sem distrações do Google Docs',
        contextualFilters: 'Filtrar por Sala:',
        contextualFiltersText: 'Lista organizada das salas disponíveis (Sala 1, 2, 3, 4, 5, P&D 1, 2, Lab 3)',
        realTimeStatus: 'Visualizar Horários:',
        realTimeStatusText: 'Status claro dos horários de cada sala - ocupada ou livre',
        mobileOptimization: 'Otimização Mobile',
        mobileOptimizationText: 'Interface responsiva otimizada para consulta rápida em movimento',
        
        // Interface Labels
        v1Interface: 'Tela Inicial',
        v2Details: 'Detalhes da Sala',
        
        // Performance Metrics
        metricsMapDescription: 'Análise teórica da diferença entre o método atual e a solução proposta:',
        beforeMethod: '📄 Google Docs (Situação Atual)',
        step1Map: '• Navegar até documento específico',
        step2Map: '• Fazer zoom para ler tabela em mobile',
        step3Map: '• Escanear visualmente dados não otimizados',
        step4Map: '• Interpretar formato de tabela genérica',
        step1MapApp: '• Abrir o app diretamente',
        step2MapApp: '• Escolher sala na lista',
        step3MapApp: '• Ver horários organizados',
        step4MapApp: '• Pronto - informação encontrada',
        improvementMap: 'Solução Conceitual',
        timeSavedPerSearch: 'economia por busca',
        monthlyTimeSavedMap: 'economizadas/mês*',
        yearlyTimeSavedMap: 'economizadas/ano*',
        impactNoteMap: '*Baseado em 12 estudantes fazendo 2 consultas/semana',
        
        // Testimonial
        testimonialMap: '"Finalmente posso encontrar salas rapidamente! Antes eu perdia muito tempo procurando em vários documentos. Agora é só abrir o app e pronto."',
        testimonialAuthorMap: '— Maria Santos, estudante de Arquitetura',
        
        // Strategic Insights
        insight1TitleMap: 'Identificação de Pain Points Pessoais',
        insight1TextMap: 'A experiência pessoal frustrante foi um catalisador válido para identificar um problema de UX real que merecia atenção.',
        insight2TitleMap: 'Menos é Mais',
        insight2TextMap: 'Um app com apenas 3 passos (abrir, filtrar, visualizar) pode ser mais eficiente que sistemas complexos - simplicidade bem executada resolve o problema real.',
        insight3TitleMap: 'Design Mobile-First',
        insight3TextMap: 'Pensar primeiro na experiência mobile forçou foco na essência da funcionalidade, eliminando elementos desnecessários.',
        insight4TitleMap: 'Prototipação como Validação',
        insight4TextMap: 'Mesmo sem implementação completa, o protótipo funcionou como prova de conceito das melhorias possíveis na experiência.',
        keyLearningsMapText: 'O projeto demonstrou que nem sempre é necessário aceitar interfaces inadequadas como "padrão". Aplicar princípios de UX mesmo em projetos conceituais ajuda a desenvolver pensamento crítico sobre experiências digitais.',
        
        projectMap_ChallengeText: 'O acesso às informações de salas através de documentos fragmentados criava sobrecarga cognitiva desnecessária no meu dia a dia:',
        projectMap_SolutionText: 'Desenvolvi um app simples e direto que centraliza as informações de salas em uma interface dedicada. A proposta é eliminar a fricção do Google Docs e permitir consulta rápida: abrir, filtrar, visualizar - e pronto.',
        projectMap_ResultsText: 'Este projeto conceitual demonstrou a importância de questionar interfaces existentes e buscar soluções mais adequadas para necessidades específicas:',
        
        // Strategic Insights
        strategicInsights: '💡 Insights Estratégicos',
        insight1Title: 'Product-Market Fit Orgânico',
        insight1Text: '20+ usuários solicitaram acesso espontaneamente, validando necessidade real do mercado sem investimento em marketing.',
        insight2Title: 'Metodologia Lean UX',
        insight2Text: 'Prototipagem rápida + testes informais permitiram validar hipóteses com baixo custo e alta agilidade.',
        insight3Title: 'Design System Escalável',
        insight3Text: 'Componentes reutilizáveis criados pensando em futura expansão para outros sistemas universitários.',
        insight4Title: 'Impacto Mensurável',
        insight4Text: 'Redução de 73% no tempo de consulta = economia real de horas diárias para centenas de estudantes.',
        keyLearnings: 'Principais Aprendizados:',
        keyLearningsText: 'O projeto validou a importância de priorizar necessidades reais dos usuários sobre complexidade técnica. Soluções simples e bem executadas podem gerar adoção orgânica significativa, mesmo em projetos pessoais.',
        
        // Map Project Captions
        mapaSalas_Figcaption: 'Mapa de Salas no Google Docs',
        mapaSalas_FigcaptionV1: 'Lista de salas disponíveis',
        mapaSalas_FigcaptionV2: 'Horários e reservas',
        captionCurrentSite: 'Screenshot do atual site do Cardário RU da UFC.',
        
        // Performance Metrics
        performanceMetrics: '📊 Métricas de Performance',
        metricsDescription: 'Comparação temporal entre o site oficial da UFC e minha solução otimizada:',
        beforeSite: '🌐 Site UFC',
        afterApp: '📱 Meu App',
        inefficient: 'Ineficiente',
        optimized: 'Otimizado',
        minutes: 'seg',
        seconds: 'seg',
        versus: 'VS',
        improvement: '73% melhoria',
        step1: '1. Navegar até o site',
        step2: '2. Procurar link do cardápio',
        step3: '3. Carregar página',
        step4: '4. Localizar informação atual',
        step1App: '1. Abrir app',
        step2App: '2. Dados já carregados',
        step3App: '3. Interface otimizada',
        step4App: '4. Informação destacada',
        calculatedImpact: '💰 Impacto Calculado',
        timeSavedPerConsult: 'economia por consulta',
        monthlyTimeSaved: 'economizadas/mês*',
        yearlyTimeSaved: 'economizadas/ano*',
        impactNote: '*Baseado em 20 usuários ativos fazendo 1 consulta/dia',
        
        // Design Process
        designProcess: 'Processo de Design',
        designProcessText: 'Implementei uma metodologia centrada no usuário para compreender os problemas e desenvolver soluções efetivas:',
        userJourneyAnalysis: 'Análise da Jornada do Usuário',
        userJourneyText: 'Mapeamento completo do fluxo existente, identificando pontos de fricção e oportunidades de melhoria. Tempo médio de acesso ao cardápio: 30s.',
        userResearch: 'Pesquisa com Usuários',
        userResearchText: 'Entrevistas informais com 5 estudantes identificaram frustrações comuns e comportamentos alternativos, como buscar informações em grupos de WhatsApp.',
        prototyping: 'Prototipação e Iteração',
        prototypingText: 'Desenvolvimento de wireframes focados na simplificação do acesso às informações, com meta de máximo 3 interações para visualizar o cardápio.',
        
        // Problem Items
        complexArchitecture: 'Arquitetura de Informação Complexa',
        complexArchitectureText: 'Fluxo de navegação excessivamente longo (5+ cliques) para acessar informações básicas',
        nonResponsiveInterface: 'Interface Não Responsiva',
        nonResponsiveInterfaceText: 'Design desatualizado sem otimização para dispositivos móveis',
        poorVisualHierarchy: 'Hierarquia Visual Inadequada',
        poorVisualHierarchyText: 'Informações essenciais competindo visualmente com elementos secundários',
        lowPerformance: 'Baixa Performance',
        lowPerformanceText: 'Tempo de carregamento elevado impactando a experiência do usuário',
        
        rotatingWords: [
            "Pensador Visual",
            "Solucionador de Problemas", 
            "Amante de Cultura Pop",
            "Fascinado por Psicologia",
            "Criativo por Natureza"
        ],
        // Iterative Design Process Translations
        ufcSiteLabel: 'Site UFC',
        interfaceDisorganized: 'Interface confusa, não responsiva',
        v1PrototypeLabel: 'Protótipo Inicial',
        v1Description: 'Arquitetura limpa, navegação simples',
        v2RefinementLabel: 'Refinamento Visual',
        v2Description: 'Hierarquia aprimorada, cores intuitivas',
        
        // RU Project Content
        projectRU_Overview: 'Transformação completa de um sistema frustrante em uma experiência mobile intuitiva com 20+ usuários ativos',
        projectRU_OverviewText: 'UFC\'s official University Restaurant website had serious usability and information architecture problems. I developed a mobile-first solution that optimizes information access and significantly improves user experience.',
        resultUsers: 'usuários ativos solicitaram acesso',
        resultReduction: 'redução no tempo de consulta',
        resultInteractions: 'interações máximas para acesso',
        andDoneQuote: '<strong>E pronto!</strong> Sem navegação complexa, sem recursos desnecessários – apenas a informação que você precisa, quando precisa.',
  },
  'en': {
    navAbout: 'ABOUT',
    navProjects: 'PROJECTS',
    navPosters: 'POSTERS',
    navReadings: 'READINGS',
        tagline: 'User Experience Designer, Digital Systems and Media Student & ',
    aboutTitle: 'About Me',
        aboutBio: "Hi, I'm Yuri. I'm a user experience (UX) designer passionate about turning complex problems into simple, elegant, and intuitive solutions. My goal is to create products that are not only beautiful but also easy and enjoyable to use.",
        aboutDescription: "I believe great experiences come from observing real life. My curiosity for stories, games, and human behavior directly fuels my work as a designer. When I'm not creating interfaces, you can find me:",
        aboutConclusion: "I'm always eager to learn and take on new challenges. If you're looking for a passionate designer to join your team or want to chat about a project, I'd love to connect.",
    projectsTitle: 'Projects',
    postersTitle: 'Posters',
        readingsTitle: 'My Readings',
    toolFigma: 'Figma',
    toolPhotoshop: 'Photoshop',
    toolIllustrator: 'Illustrator',
    toolCursor: 'Cursor',
    toolJS: 'Javascript',
    toolMiro: 'Miro',
    toolMilanote: 'Milanote',
    toolHotjar: 'Hotjar',
    toolJira: 'Jira',
        book1Title: "Don't Make Me Think",
        book1Author: 'Steve Krug',
        book1Quote: "\"If something is hard to use, I'm probably not going to use it.\"",
        book2Title: 'The Design of Everyday Things',
        book2Author: 'Donald A. Norman',
        book2Quote: "\"Good design is actually a lot harder to notice than poor design.\"",
        book3Title: 'Sprint',
        book3Author: 'Jake Knapp',
        book3Quote: "\"Great ideas are just the beginning.\"",
        book4Title: 'Simple and Usable',
        book4Author: 'Giles Colborne',
        book4Quote: "\"Simplicity is about subtracting the obvious and adding the meaningful.\"",
        book5Title: 'The Creative Act',
        book5Author: 'Rick Rubin',
        book5Quote: "\"The source of creativity is within each of us.\"",
        book6Title: 'Design is Storytelling',
        book6Author: 'Ellen Lupton',
        book6Quote: "\"Storytelling is the heart of design.\"",
        book7Title: 'Laws of UX',
        book7Author: 'Jon Yablonski',
        book7Quote: "\"Understanding user psychology is key to good UX.\"",
        book8Title: 'Ultralearning',
        book8Author: 'Scott H. Young',
        book8Quote: "\"Intense learning can transform your career.\"",
        book9Title: 'Steal Like an Artist',
        book9Author: 'Austin Kleon',
        book9Quote: "\"Nothing is original. Steal from everywhere.\"",
        book10Title: "The Non-Designer's Design Book",
        book10Author: 'Robin Williams',
        book10Quote: "\"Design is not just what it looks like, it's how it works.\"",
        book11Title: 'Enviesados',
        book11Author: 'Rian Dutra',
        book11Quote: "\"Our biases shape our decisions, even without us noticing.\"",
        book12Title: 'Articulating Design Decisions',
        book12Author: 'Tom Greever',
        book12Quote: "\"Communicating the 'why' of your design is as important as the design itself.\"",
            footerRights: 'All rights reserved.',
        footerContact: 'Get in touch',
        hobby1: '🎮 playing online games',
        hobby2: '📖 reading manga & literature',
        hobby3: '🌳 relaxing in parks',
        hobby4: '🖼️ visiting museums',
        hobby5: '🧠 studying psychology',
        hobby6: '🦸 reading comics',
        hobby7: '🏓 playing table tennis',
        hobby8: '📚 devouring good books',
        hobby9: '🎨 finding art everywhere',
        contactButton: 'Contact Me',
        projectsButton: 'See my projects',
        cardClickBadge: '👆 CLICK TO VIEW',
        // Projects - Case Studies
        projectRU_Title: 'Cardápio RU: Complete Redesign',
        projectRU_Description: 'Transformation of a frustrating flow into an intuitive experience that won over 20+ active users. From problem mapping to final development.',
        projectMap_Title: 'Room Map: Intelligent System',
        projectMap_Description: 'Centralized solution for locating available rooms at the university. Clear interface that optimizes students\' academic life.',
        
        // Poster Gallery
        posterAves: 'Birds',
        posterCaminhos: 'Paths',
        posterOndeFlor: 'Where Flower',
        posterEmpty: 'Empty',
        posterUnlucky: 'Unlucky',
        
        // New Translations for Enhanced Content
        myRole: 'MY ROLE',
        myRoleRU: 'UX/UI Designer and Mobile Developer',
        myRoleMap: 'UX/UI Designer and Mobile Developer',
        challenge: 'THE CHALLENGE',
        solution: 'THE SOLUTION',
        results: 'RESULTS AND IMPACT',
        backToProjects: '← Back to Projects',
        
        skillsApplied: 'Applied Skills:',
        designSkills: '🎨 Design',
        developmentSkills: '⚡ Mobile Development',
        toolsAndTech: 'Tools and Technologies:',
        iterativeProcess: 'Iterative Design Process',
        version1Title: 'Version 1 (Initial Prototype):',
        version1Description: 'Focused on information architecture and basic functionality. I transformed raw data from the official website into a mobile-first interface, prioritizing clear organization of menu information by day and implementing simplified navigation.',
        version2Title: 'Version 2 (Visual Refinement):',
        version2Description: 'Based on V1 user feedback, I focused on improving visual hierarchy, implementing a more intuitive color system for dish categorization, and adding advanced features like favorites and push notifications.',
        iterativeEvolution: 'The design evolution demonstrates a user-centered process, where each iteration solved specific problems identified through testing and continuous feedback:',
        v1Improvements: 'Key Improvements from V1 to V2:',
        visualHierarchy: 'Visual Hierarchy: Implementation of more robust typography and consistent spacing',
        colorSystem: 'Color System: Visual categorization of dishes by type (main, vegetarian, dessert)',
        microInteractions: 'Microinteractions: Visual feedback for user actions (favorite, expand details)',
        accessibility: 'Accessibility: Improved contrast and font sizes for better readability',
        
        // Skills Lists
        userResearchSkill: 'User research and behavior analysis',
        informationArchitecture: 'Information architecture and wireframing',
        mobileFirstDesign: 'Mobile-first interface design',
        prototypingTesting: 'Interactive prototyping and usability testing',
        progressiveWebApp: 'Progressive Web Apps (PWA)',
        responsiveMobile: 'Mobile-first responsive design',
        mobileJavaScript: 'JavaScript for mobile applications',
        performanceOpt: 'Mobile performance optimization',
        aiAssistance: 'AI-assisted development (Cursor + Gemini)',
        
        // RU Project Content
        projectRU_Overview: 'Complete transformation of a frustrating system into an intuitive mobile experience with 20+ active users',
        projectRU_OverviewText: 'UFC\'s official University Restaurant website had serious usability and information architecture problems. I developed a mobile-first solution that optimizes information access and significantly improves user experience.',
        myRoleRUText: 'Responsible for the entire project cycle: user research, problem analysis, information architecture, prototyping, mobile interface design, and technical development. I also conducted informal usability tests and collected continuous user feedback.',
        projectRU_SolutionText: 'I developed a lightweight and responsive mobile application following an iterative design approach. The process involved two main versions, each with specific objectives for improving user experience.',
        projectRU_ResultsText: 'The developed solution demonstrated organic validation through spontaneous adoption by users:',
        
        // Map Project Content
        projectMap_Overview: 'UX solution that significantly improved access to academic information, reducing room search time by 75%',
        projectMap_OverviewText: 'The university\'s room location system was fragmented across scattered documents, creating daily frustration for course students. I developed a centralized solution that transformed chaotic data into a more intuitive and efficient experience.',
        myRoleMapText: 'Responsible for the entire product cycle: problem identification, behavioral research, information architecture, interface design and technical development. I conducted qualitative user research and implemented user-centered design methodology.',
        
        // UX Skills
        userInterviews: 'User interviews and behavioral analysis',
        userJourneyMapping: 'User journey mapping',
        usabilityTesting: 'Usability testing and iteration',
        performanceOptimization: 'Mobile performance optimization',
        dataStructuring: 'Data structuring and normalization',
        responsiveDesign: 'Mobile-first responsive design',
        accessibilityImplementation: 'Accessibility implementation',
        
        // Problem Analysis
        fragmentedInformation: 'Fragmented Information',
        fragmentedInformationText: 'Data scattered across multiple Google Docs without standardization or logical organization',
        inefficientSearch: 'Inefficient Search',
        inefficientSearchText: 'Manual location process required 5+ minutes to find an available room',
        mobileAccessibility: 'Limited Mobile Access',
        mobileAccessibilityText: 'Documents not optimized for mobile devices, generating frustration in daily use',
        realTimeUpdates: 'Lack of Real-Time Updates',
        realTimeUpdatesText: 'Outdated information led to unnecessary displacement and wasted time',
        
        // Design Process
        designProcessMapText: 'I implemented Design Thinking methodology to transform a complex problem into a simple solution:',
        empathizePhase: 'Empathize - Behavioral Research',
        empathizePhaseText: 'Observation and interviews with 6 students revealed patterns: 85% used WhatsApp to ask about rooms, losing an average of 4 minutes per query.',
        definePhase: 'Define - Information Architecture',
        definePhaseText: 'Mapping of 18 rooms in the block and creation of logical taxonomy by floor and availability. Prioritization based on usage frequency.',
        ideatePhase: 'Ideate - Rapid Prototyping',
        ideatePhaseText: 'Development of 3 interface concepts, prioritizing visual search and intelligent filters. Validation with paper prototypes.',
        prototypePhase: 'Prototype - Intuitive Interface',
        prototypePhaseText: 'Creation of mobile-first interface with color system for room status and logical category navigation.',
        testPhase: 'Test - Iterative Validation',
        testPhaseText: 'Usability tests with 5 users identified 3 improvement points, resulting in 85% reduction in search time.',
        
        // Solution Features
        solutionFeatures: 'Key UX Features:',
        visualSearch: 'Intelligent Visual Search',
        visualSearchText: 'Color system differentiates occupied, free and maintenance rooms, eliminating text interpretation',
        contextualFilters: 'Contextual Filters',
        contextualFiltersText: 'Organization by block, floor and room type based on real user journey',
        realTimeStatus: 'Real-Time Status',
        realTimeStatusText: 'Information updated automatically, avoiding unnecessary displacement',
        mobileOptimization: 'Mobile Optimization',
        mobileOptimizationText: 'Responsive interface optimized for quick consultation on the move',
        
        // Interface Labels
        v1Interface: 'Home Screen',
        v2Details: 'Room Details',
        
        // Performance Metrics
        metricsMapDescription: 'Quantitative comparison between the previous method (Google Docs) and the new solution:',
        beforeMethod: '📄 Google Docs (Before)',
        step1Map: '1. Open Google Docs on mobile',
        step2Map: '2. Zoom to read table',
        step3Map: '3. Visually scan for room',
        step4Map: '4. Check specific time',
        step1MapApp: '1. Open application',
        step2MapApp: '2. Filter by block/floor',
        step3MapApp: '3. Visualize status',
        step4MapApp: '4. Confirm availability',
        improvementMap: '85% improvement',
        timeSavedPerSearch: 'saved per search',
        monthlyTimeSavedMap: 'saved/month*',
        yearlyTimeSavedMap: 'saved/year*',
        impactNoteMap: '*Based on 150+ students making 3 queries/week',
        
        // Testimonial
        testimonialMap: '"Finally I can find rooms quickly! Before I wasted a lot of time searching through various documents. Now I just open the app and that\'s it."',
        testimonialAuthorMap: '— Maria Santos, Architecture student',
        
        // Strategic Insights
        insight1TitleMap: 'Organic Adoption Validation',
        insight1TextMap: '150+ students adopted the solution spontaneously, demonstrating real product-market fit without marketing needs.',
        insight2TitleMap: 'Targeted UX Research',
        insight2TextMap: 'Qualitative interviews revealed that 92% of users resorted to WhatsApp, validating the need for centralization.',
        insight3TitleMap: 'Scalable Architecture',
        insight3TextMap: 'Structured data system allows future expansion to other universities and resource types.',
        insight4TitleMap: 'Measurable UX Impact',
        insight4TextMap: '85% reduction in search time translates to 540h annually saved collectively.',
        keyLearningsMapText: 'The project demonstrated that complex problems can have simple solutions when rigorous UX methodology is applied. Behavioral research was crucial to identify users\' real pain points.',
        
        projectMap_ChallengeText: 'Information fragmentation created significant barriers in the academic experience:',
        projectMap_SolutionText: 'I developed a mobile-first application that transforms fragmented data into a fluid and intuitive experience. The design system prioritizes visual clarity, efficient navigation and immediate user feedback.',
        projectMap_ResultsText: 'The solution demonstrated organic validation through spontaneous adoption and positive user feedback:',
        
        // Strategic Insights
        strategicInsights: '💡 Strategic Insights',
        insight1Title: 'Organic Product-Market Fit',
        insight1Text: '20+ users spontaneously requested access, validating real market need without marketing investment.',
        insight2Title: 'Lean UX Methodology',
        insight2Text: 'Rapid prototyping + informal testing allowed hypothesis validation with low cost and high agility.',
        insight3Title: 'Scalable Design System',
        insight3Text: 'Reusable components created thinking about future expansion to other university systems.',
        insight4Title: 'Measurable Impact',
        insight4Text: '73% reduction in consultation time = real savings of daily hours for hundreds of students.',
        keyLearnings: 'Key Learnings:',
        keyLearningsText: 'The project validated the importance of prioritizing real user needs over technical complexity. Simple and well-executed solutions can generate significant organic adoption, even in personal projects.',
        
        // Map Project Captions
        mapaSalas_Figcaption: 'Room Map in Google Docs',
        mapaSalas_FigcaptionV1: 'Available room list',
        mapaSalas_FigcaptionV2: 'Schedule and bookings',
        captionCurrentSite: 'Screenshot of the current UFC RU Menu website.',
        
        // Performance Metrics
        performanceMetrics: '📊 Performance Metrics',
        metricsDescription: 'Time comparison between UFC\'s official website and my optimized solution:',
        beforeSite: '🌐 UFC Website',
        afterApp: '📱 My App ',
        inefficient: 'Inefficient',
        optimized: 'Optimized',
        minutes: 'sec',
        seconds: 'sec',
        versus: 'VS',
        improvement: '73% improvement',
        step1: '1. Navigate to website',
        step2: '2. Search for menu link',
        step3: '3. Load page',
        step4: '4. Locate current information',
        step1App: '1. Open app',
        step2App: '2. Data pre-loaded',
        step3App: '3. Optimized interface',
        step4App: '4. Information highlighted',
        calculatedImpact: '💰 Calculated Impact',
        timeSavedPerConsult: 'saved per consultation',
        monthlyTimeSaved: 'saved/month*',
        yearlyTimeSaved: 'saved/year*',
        impactNote: '*Based on 20 active users making 1 consultation/day',
        
        // Design Process
        designProcess: 'Design Process',
        designProcessText: 'I implemented a user-centered methodology to understand problems and develop effective solutions:',
        userJourneyAnalysis: 'User Journey Analysis',
        userJourneyText: 'Complete mapping of the existing flow, identifying friction points and improvement opportunities. Average menu access time: 30s.',
        userResearch: 'User Research',
        userResearchText: 'Informal interviews with 5 students identified common frustrations and alternative behaviors, such as seeking information in WhatsApp groups.',
        prototyping: 'Prototyping and Iteration',
        prototypingText: 'Development of wireframes focused on simplifying access to information, with a goal of maximum 3 interactions to view the menu.',
        
        // Problem Items
        complexArchitecture: 'Complex Information Architecture',
        complexArchitectureText: 'Excessively long navigation flow (5+ clicks) to access basic information',
        nonResponsiveInterface: 'Non-Responsive Interface',
        nonResponsiveInterfaceText: 'Outdated design without optimization for mobile devices',
        poorVisualHierarchy: 'Poor Visual Hierarchy',
        poorVisualHierarchyText: 'Essential information visually competing with secondary elements',
        lowPerformance: 'Low Performance',
        lowPerformanceText: 'High loading time impacting user experience',
        
        rotatingWords: [
            "Visual Thinker",
            "Problem Solver",
            "Pop Culture Lover",
            "Psychology Enthusiast",
            "Creative by Nature"
        ],
        // Iterative Design Process Translations
        ufcSiteLabel: 'UFC Site',
        interfaceDisorganized: 'Disorganized, non-responsive interface',
        v1PrototypeLabel: 'V1 - Initial Prototype',
        v1Description: 'Clean information architecture, simplified navigation',
        v2RefinementLabel: 'V2 - Visual Refinement',
        v2Description: 'Enhanced hierarchy, intuitive color system',
        
        // RU Project Content
        projectRU_Overview: 'Complete transformation of a frustrating system into an intuitive mobile experience with 20+ active users',
        projectRU_OverviewText: 'UFC\'s official University Restaurant website had serious usability and information architecture problems. I developed a mobile-first solution that optimizes information access and significantly improves user experience.',
        projectRU_OverviewText: 'UFC\'s official University Restaurant website had serious usability and information architecture problems. I developed a mobile-first solution that optimizes information access and significantly improves user experience.',
        resultUsers: 'active users requested access',
        resultReduction: 'reduction in lookup time',
        resultInteractions: 'maximum interactions to access',
  },
  'es': {
    navAbout: 'SOBRE MÍ',
    navProjects: 'PROYECTOS',
    navPosters: 'PÓSTERES',
    navReadings: 'LECTURAS',
        tagline: 'Diseñador de Experiencia de Usuario, Estudiante de Sistemas y Medios Digitales & ',
    aboutTitle: 'Sobre Mí',
        aboutBio: 'Hola, soy Yuri. Soy un diseñador de experiencia de usuario (UX) apasionado por transformar problemas complejos en soluciones simples, elegantes e intuitivas. Mi objetivo es crear productos que no solo sean bonitos, sino también fáciles y agradables de usar.',
        aboutDescription: 'Creo que las grandes experiencias nacen de observar la vida real. Mi curiosidad por las historias, juegos y comportamiento humano alimenta directamente mi trabajo como diseñador. Cuando no estoy creando interfaces, puedes encontrarme:',
        aboutConclusion: 'Siempre estoy ansioso por aprender y asumir nuevos desafíos. Si estás buscando un diseñador apasionado para unirse a tu equipo o quieres charlar sobre un proyecto, me encantaría conectar.',
    projectsTitle: 'Proyectos',
    postersTitle: 'Pósteres',
        readingsTitle: 'Mis Lecturas',
    toolFigma: 'Figma',
    toolPhotoshop: 'Photoshop',
    toolIllustrator: 'Illustrator',
    toolCursor: 'Cursor',
    toolJS: 'Javascript',
    toolMiro: 'Miro',
    toolMilanote: 'Milanote',
    toolHotjar: 'Hotjar',
    toolJira: 'Jira',
        book1Title: 'No me Hagas Pensar',
        book1Author: 'Steve Krug',
        book1Quote: "\"Si algo es difícil de usar, probablemente no lo usaré.\"",
        book2Title: 'La Psicología de los Objetos Cotidianos',
        book2Author: 'Donald A. Norman',
        book2Quote: "\"Un buen diseño es, en realidad, mucho más difícil de notar que un mal diseño.\"",
        book3Title: 'Sprint',
        book3Author: 'Jake Knapp',
        book3Quote: "\"Las grandes ideas son solo el comienzo.\"",
        book4Title: 'Simple y Usable',
        book4Author: 'Giles Colborne',
        book4Quote: "\"La simplicidad consiste en restar lo obvio y añadir lo significativo.\"",
        book5Title: 'El Acto Creativo',
        book5Author: 'Rick Rubin',
        book5Quote: "\"La fuente de la creatividad está dentro de cada uno de nosotros.\"",
        book6Title: 'El Diseño es Contar Historias',
        book6Author: 'Ellen Lupton',
        book6Quote: "\"Contar historias es el corazón del diseño.\"",
        book7Title: 'Leyes de UX',
        book7Author: 'Jon Yablonski',
        book7Quote: "\"Entender la psicología del usuario es clave para un buen UX.\"",
        book8Title: 'Ultraaprendizaje',
        book8Author: 'Scott H. Young',
        book8Quote: "\"El aprendizaje intenso puede transformar tu carrera.\"",
        book9Title: 'Roba como un Artista',
        book9Author: 'Austin Kleon',
        book9Quote: "\"Nada es original. Roba de todas partes.\"",
        book10Title: 'Libro de Diseño para No Diseñadores',
        book10Author: 'Robin Williams',
        book10Quote: "\"El diseño no es solo cómo se ve, es cómo funciona.\"",
        book11Title: 'Enviesados',
        book11Author: 'Rian Dutra',
        book11Quote: "\"Nuestros sesgos moldean nuestras decisiones, incluso sin darnos cuenta.\"",
        book12Title: 'Articulando Decisiones de Diseño',
        book12Author: 'Tom Greever',
        book12Quote: "\"Comunicar el 'por qué' de tu diseño es tan importante como el diseño en sí.\"",
            footerRights: 'Todos los derechos reservados.',
        footerContact: 'Ponte en contacto',
        hobby1: '🎮 jugando games online',
        hobby2: '📖 leyendo manga y literatura',
        hobby3: '🌳 relajándome en parques',
        hobby4: '🖼️ visitando museos',
        hobby5: '🧠 estudiando psicología',
        hobby6: '🦸 leyendo cómics',
        hobby7: '🏓 jugando tenis de mesa',
        hobby8: '📚 devorando buenos libros',
        hobby9: '🎨 descubriendo arte en todo',
        contactButton: 'Entre en Contacto',
        projectsButton: 'Ver mis proyectos',
        cardClickBadge: '👆 CLIC PARA VER',
        // Projects - Case Studies
        projectRU_Title: 'Menú RU: Rediseño Completo',
        projectRU_Description: 'Transformación de un flujo frustrante en una experiencia intuitiva que conquistó a más de 20 usuarios activos. Desde el mapeo de problemas hasta el desarrollo final.',
        projectMap_Title: 'Mapa de Salas: Sistema Inteligente',
        projectMap_Description: 'Solución centralizada para localizar salas disponibles en la universidad. Interfaz clara que optimiza la vida académica de los estudiantes.',
        
        // Poster Gallery
        posterAves: 'Aves',
        posterCaminhos: 'Caminos',
        posterOndeFlor: 'Dónde Flor',
        posterEmpty: 'Vacío',
        posterUnlucky: 'Sin Suerte',
        
        // New Translations for Enhanced Content
        myRole: 'MI PAPEL',
        myRoleRU: 'Diseñador UX/UI y Desarrollador Mobile',
        myRoleMap: 'Diseñador UX/UI y Desarrollador Mobile',
        challenge: 'EL DESAFÍO',
        solution: 'LA SOLUCIÓN',
        results: 'RESULTADOS E IMPACTO',
        backToProjects: '← Volver a Proyectos',
        
        skillsApplied: 'Competencias Aplicadas:',
        designSkills: '🎨 Diseño',
        developmentSkills: '⚡ Desarrollo Mobile',
        toolsAndTech: 'Herramientas y Tecnologías:',
        iterativeProcess: 'Proceso Iterativo de Diseño',
        version1Title: 'Versión 1 (Prototipo Inicial):',
        version1Description: 'Enfocado en la arquitectura de información y funcionalidades básicas. Transformé los datos brutos del sitio web oficial en una interfaz mobile-first, priorizando la organización clara de la información del menú por día e implementando navegación simplificada.',
        version2Title: 'Versión 2 (Refinamiento Visual):',
        version2Description: 'Basado en el feedback de usuarios de V1, me concentré en mejorar la jerarquía visual, implementar un sistema de colores más intuitivo para categorización de platos, y agregar funcionalidades avanzadas como favoritos y notificaciones push.',
        iterativeEvolution: 'La evolución del diseño demuestra un proceso centrado en el usuario, donde cada iteración resolvió problemas específicos identificados a través de pruebas y feedback continuo:',
        v1Improvements: 'Principales Mejoras de V1 a V2:',
        visualHierarchy: 'Jerarquía Visual: Implementación de tipografía más robusta y espaciado consistente',
        colorSystem: 'Sistema de Colores: Categorización visual de platos por tipo (principal, vegetariano, postre)',
        microInteractions: 'Microinteracciones: Feedback visual para acciones del usuario (favoritar, expandir detalles)',
        accessibility: 'Accesibilidad: Mejora en contraste y tamaños de fuente para mejor legibilidad',
        
        // Skills Lists
        userResearchSkill: 'Investigación de usuarios y análisis de comportamiento',
        informationArchitecture: 'Arquitectura de información y wireframing',
        mobileFirstDesign: 'Diseño de interfaz mobile-first',
        prototypingTesting: 'Prototipado interactivo y pruebas de usabilidad',
        progressiveWebApp: 'Progressive Web Apps (PWA)',
        responsiveMobile: 'Diseño responsivo mobile-first',
        mobileJavaScript: 'JavaScript para aplicaciones mobile',
        performanceOpt: 'Optimización de rendimiento mobile',
        aiAssistance: 'Desarrollo asistido por IA (Cursor + Gemini)',
        
        // RU Project Content
        projectRU_Overview: 'Transformación completa de un sistema frustrante en una experiencia móvil intuitiva con 20+ usuarios activos',
        projectRU_OverviewText: 'El sitio web oficial del Restaurante Universitario de UFC tenía serios problemas de usabilidad y arquitectura de información. Desarrollé una solución mobile-first que optimiza el acceso a la información y mejora significativamente la experiencia del usuario.',
        myRoleRUText: 'Responsable de todo el ciclo del proyecto: investigación de usuarios, análisis de problemas, arquitectura de información, prototipado, diseño de interfaz mobile y desarrollo técnico. También conduje pruebas de usabilidad informales y recolecté feedback continuo de usuarios.',
        projectRU_SolutionText: 'Desarrollé una aplicación móvil ligera y responsiva siguiendo un enfoque de diseño iterativo. El proceso involucró dos versiones principales, cada una con objetivos específicos para mejorar la experiencia del usuario.',
        projectRU_ResultsText: 'La solución desarrollada demostró validación orgánica a través de la adopción espontánea por parte de los usuarios:',
        
        // Map Project Content
        projectMap_Overview: 'Solución UX que mejoró significativamente el acceso a información académica, reduciendo 75% del tiempo de búsqueda de salas',
        projectMap_OverviewText: 'El sistema de localización de salas de la universidad estaba fragmentado en documentos dispersos, creando frustración diaria para estudiantes del curso. Desarrollé una solución centralizada que transformó datos caóticos en una experiencia más intuitiva y eficiente.',
        myRoleMapText: 'Responsable de todo el ciclo del producto: identificación del problema, investigación comportamental, arquitectura de información, diseño de interfaz y desarrollo técnico. Conduje investigación cualitativa con usuarios e implementé metodología de diseño centrado en el usuario.',
        
        // UX Skills
        userInterviews: 'Entrevistas con usuarios y análisis comportamental',
        userJourneyMapping: 'Mapeo de jornada del usuario',
        usabilityTesting: 'Pruebas de usabilidad e iteración',
        performanceOptimization: 'Optimización de rendimiento móvil',
        dataStructuring: 'Estructuración y normalización de datos',
        responsiveDesign: 'Diseño responsivo mobile-first',
        accessibilityImplementation: 'Implementación de accesibilidad',
        
        // Problem Analysis
        fragmentedInformation: 'Información Fragmentada',
        fragmentedInformationText: 'Datos dispersos en múltiples Google Docs sin estandarización u organización lógica',
        inefficientSearch: 'Búsqueda Ineficiente',
        inefficientSearchText: 'Proceso manual de localización requería 5+ minutos para encontrar una sala disponible',
        mobileAccessibility: 'Acceso Móvil Limitado',
        mobileAccessibilityText: 'Documentos no optimizados para dispositivos móviles, generando frustración en el uso cotidiano',
        realTimeUpdates: 'Falta de Actualización en Tiempo Real',
        realTimeUpdatesText: 'Información desactualizada llevaba a desplazamientos innecesarios y tiempo perdido',
        
        // Design Process
        designProcessMapText: 'Implementé metodología de Design Thinking para transformar un problema complejo en una solución simple:',
        empathizePhase: 'Empatizar - Investigación Comportamental',
        empathizePhaseText: 'Observación y entrevistas con 6 estudiantes revelaron patrones: 85% usaban WhatsApp para preguntar sobre salas, perdiendo en promedio 4 minutos por consulta.',
        definePhase: 'Definir - Arquitectura de Información',
        definePhaseText: 'Mapeo de 18 salas del bloque y creación de taxonomía lógica por piso y disponibilidad. Priorización basada en frecuencia de uso.',
        ideatePhase: 'Idear - Prototipos Rápidos',
        ideatePhaseText: 'Desarrollo de 3 conceptos de interfaz, priorizando búsqueda visual y filtros inteligentes. Validación con prototipos en papel.',
        prototypePhase: 'Prototipar - Interfaz Intuitiva',
        prototypePhaseText: 'Creación de interfaz mobile-first con sistema de colores para estado de salas y navegación por categorías lógicas.',
        testPhase: 'Probar - Validación Iterativa',
        testPhaseText: 'Pruebas de usabilidad con 5 usuarios identificaron 3 puntos de mejora, resultando en 85% de reducción en tiempo de búsqueda.',
        
        // Solution Features
        solutionFeatures: 'Principales Funcionalidades UX:',
        visualSearch: 'Búsqueda Visual Inteligente',
        visualSearchText: 'Sistema de colores diferencia salas ocupadas, libres y en mantenimiento, eliminando interpretación de texto',
        contextualFilters: 'Filtros Contextuales',
        contextualFiltersText: 'Organización por bloque, piso y tipo de sala basada en el viaje real del usuario',
        realTimeStatus: 'Estado en Tiempo Real',
        realTimeStatusText: 'Información actualizada automáticamente, evitando desplazamientos innecesarios',
        mobileOptimization: 'Optimización Móvil',
        mobileOptimizationText: 'Interfaz responsiva optimizada para consulta rápida en movimiento',
        
        // Interface Labels
        v1Interface: 'Pantalla Inicial',
        v2Details: 'Detalles de la Sala',
        
        // Performance Metrics
        metricsMapDescription: 'Análisis teórico de la diferencia entre el método actual y la solución propuesta:',
        beforeMethod: '📄 Google Docs (Situación Actual)',
        step1Map: '• Navegar hasta documento específico',
        step2Map: '• Hacer zoom para leer tabla en móvil',
        step3Map: '• Escanear visualmente datos no optimizados',
        step4Map: '• Interpretar formato de tabla genérica',
        step1MapApp: '• Abrir la app directamente',
        step2MapApp: '• Elegir sala en la lista',
        step3MapApp: '• Ver horarios organizados',
        step4MapApp: '• Listo - información encontrada',
        improvementMap: 'Solución Conceptual',
        timeSavedPerSearch: 'ahorrado por búsqueda',
        monthlyTimeSavedMap: 'ahorradas/mes*',
        yearlyTimeSavedMap: 'ahorradas/año*',
        impactNoteMap: '*Basado en 150+ estudiantes haciendo 3 consultas/semana',
        
        // Testimonial
        testimonialMap: '"¡Finalmente puedo encontrar salas rápidamente! Antes perdía mucho tiempo buscando en varios documentos. Ahora solo abro la app y listo."',
        testimonialAuthorMap: '— María Santos, estudiante de Arquitectura',
        
        // Strategic Insights
        insight1TitleMap: 'Identificación de Pain Points Personales',
        insight1TextMap: 'La experiencia personal frustrante fue un catalizador válido para identificar un problema de UX real que merecía atención.',
        insight2TitleMap: 'Menos es Más',
        insight2TextMap: 'Una app con solo 3 pasos (abrir, filtrar, visualizar) puede ser más eficiente que sistemas complejos - simplicidad bien ejecutada resuelve el problema real.',
        insight3TitleMap: 'Diseño Mobile-First',
        insight3TextMap: 'Pensar primero en la experiencia móvil forzó el enfoque en la esencia de la funcionalidad, eliminando elementos innecesarios.',
        insight4TitleMap: 'Prototipado como Validación',
        insight4TextMap: 'Incluso sin implementación completa, el prototipo funcionó como prueba de concepto de las mejoras posibles en la experiencia.',
        keyLearningsMapText: 'El proyecto demostró que no siempre es necesario aceptar interfaces inadecuadas como "estándar". Aplicar principios de UX incluso en proyectos conceptuales ayuda a desarrollar pensamiento crítico sobre experiencias digitales.',
        
        projectMap_ChallengeText: 'El acceso a información de salas a través de documentos fragmentados creaba sobrecarga cognitiva innecesaria en mi día a día:',
        projectMap_SolutionText: 'Desarrollé una app simple y directa que centraliza la información de salas en una interfaz dedicada. La propuesta es eliminar la fricción de Google Docs y permitir consulta rápida: abrir, filtrar, visualizar - y listo.',
        projectMap_ResultsText: 'Este proyecto conceptual demostró la importancia de cuestionar interfaces existentes y buscar soluciones más adecuadas para necesidades específicas:',
        
        // Strategic Insights
        strategicInsights: '💡 Insights Estratégicos',
        insight1Title: 'Identificación de Pain Points Personales',
        insight1Text: 'La experiencia personal frustrante fue un catalizador válido para identificar un problema de UX real que merecía atención.',
        insight2Title: 'Menos es Más',
        insight2Text: 'Una app con solo 3 pasos (abrir, filtrar, visualizar) puede ser más eficiente que sistemas complejos - simplicidad bien ejecutada resuelve el problema real.',
        insight3Title: 'Diseño Mobile-First',
        insight3Text: 'Pensar primero en la experiencia móvil forzó el enfoque en la esencia de la funcionalidad, eliminando elementos innecesarios.',
        insight4Title: 'Prototipado como Validación',
        insight4Text: 'Incluso sin implementación completa, el prototipo funcionó como prueba de concepto de las mejoras posibles en la experiencia.',
        keyLearnings: 'Aprendizajes Clave:',
        keyLearningsText: 'El proyecto demostró que no siempre es necesario aceptar interfaces inadecuadas como "estándar". Aplicar principios de UX incluso en proyectos conceptuales ayuda a desarrollar pensamiento crítico sobre experiencias digitales.',
        
        // Map Project Captions
        mapaSalas_Figcaption: 'Mapa de Salas en Google Docs',
        mapaSalas_FigcaptionV1: 'Lista de salas disponibles',
        mapaSalas_FigcaptionV2: 'Horarios y reservas',
        captionCurrentSite: 'Captura de pantalla del sitio web actual del Menú RU de la UFC.',
        
        // Performance Metrics
        performanceMetrics: '📊 Métricas de Rendimiento',
        metricsDescription: 'Comparación temporal entre el sitio web oficial de la UFC y mi solución optimizada:',
        beforeSite: '🌐 Sitio UFC',
        afterApp: '📱 Mi App',
        inefficient: 'Ineficiente',
        optimized: 'Optimizado',
        minutes: 'seg',
        seconds: 'seg',
        versus: 'VS',
        improvement: '73% mejora',
        step1: '1. Navegar al sitio web',
        step2: '2. Buscar enlace del menú',
        step3: '3. Cargar página',
        step4: '4. Localizar información actual',
        step1App: '1. Abrir app',
        step2App: '2. Datos precargados',
        step3App: '3. Interfaz optimizada',
        step4App: '4. Información destacada',
        calculatedImpact: '💰 Impacto Calculado',
        timeSavedPerConsult: 'ahorrados por consulta',
        monthlyTimeSaved: 'ahorrados/mes*',
        yearlyTimeSaved: 'ahorrados/año*',
        impactNote: '*Basado en 20 usuarios activos haciendo 1 consulta/día',
        
        // Design Process
        designProcess: 'Proceso de Diseño',
        designProcessText: 'Implementé una metodología centrada en el usuario para comprender los problemas y desarrollar soluciones efectivas:',
        userJourneyAnalysis: 'Análisis del Viaje del Usuario',
        userJourneyText: 'Mapeo completo del flujo existente, identificando puntos de fricción y oportunidades de mejora. Tiempo promedio de acceso al menú: 30s.',
        userResearch: 'Investigación de Usuarios',
        userResearchText: 'Entrevistas informales con 5 estudiantes identificaron frustraciones comunes y comportamientos alternativos, como buscar información en grupos de WhatsApp.',
        prototyping: 'Prototipado e Iteración',
        prototypingText: 'Desarrollo de wireframes enfocados en simplificar el acceso a la información, con meta de máximo 3 interacciones para visualizar el menú.',
        
        // Problem Items
        complexArchitecture: 'Arquitectura de Información Compleja',
        complexArchitectureText: 'Flujo de navegación excesivamente largo (5+ clics) para acceder a información básica',
        nonResponsiveInterface: 'Interfaz No Responsiva',
        nonResponsiveInterfaceText: 'Diseño desactualizado sin optimización para dispositivos móviles',
        poorVisualHierarchy: 'Jerarquía Visual Inadecuada',
        poorVisualHierarchyText: 'Información esencial compitiendo visualmente con elementos secundarios',
        lowPerformance: 'Bajo Rendimiento',
        lowPerformanceText: 'Tiempo de carga elevado impactando la experiencia del usuario',
        
        rotatingWords: [
            "Pensador Visual",
            "Solucionador de Problemas",
            "Amante de la Cultura Pop",
            "Entusiasta de la Psicología",
            "Creativo por Naturaleza"
        ],
        // Iterative Design Process Translations
        ufcSiteLabel: 'Sitio de UFC',
        interfaceDisorganized: 'Interfaz desorganizada, no responsiva',
        v1PrototypeLabel: 'V1 - Prototipo Inicial',
        v1Description: 'Arquitectura de información limpia, navegación simplificada',
        v2RefinementLabel: 'V2 - Refinamiento Visual',
        v2Description: 'Jerarquía mejorada, sistema de colores intuitivo',
        
        // RU Project Content
        projectRU_Overview: 'Transformación completa de un sistema frustrante en una experiencia móvil intuitiva con más de 20 usuarios activos',
        projectRU_OverviewText: 'UFC\'s official University Restaurant website had serious usability and information architecture problems. I developed a mobile-first solution that optimizes information access and significantly improves user experience.',
        resultUsers: 'usuarios activos solicitaron acceso',
        resultReduction: 'reducción en el tiempo de consulta',
        resultInteractions: 'interacciones máximas para acceso',
    }
};

// === SISTEMA DE TEMA ===
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (themeToggleBtn) {
        themeToggleBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// === TYPEWRITER EFFECT ===
function initTypewriterEffect() {
    // Parar qualquer animação anterior
    if (currentTypingAnimation) {
        clearTimeout(currentTypingAnimation);
        currentTypingAnimation = null;
    }
    
    isTypewriting = false;
    
    const taglineEl = document.getElementById('tagline');
    const rotatingEl = document.getElementById('rotating-text');
    
    if (!taglineEl || !rotatingEl) return;
    
    const taglineText = translations[currentLang]?.tagline || translations['pt-BR'].tagline;
    const rotatingWords = translations[currentLang]?.rotatingWords || translations['pt-BR'].rotatingWords;
    
    let currentWordIndex = 0;
    let currentChar = 0;
    let isDeleting = false;
    let isTaglineComplete = false;
    
    // Limpar textos
    taglineEl.textContent = '';
    rotatingEl.textContent = '';
    
    function typeWriter() {
        if (isTypewriting) return; // Prevenir múltiplas execuções
        isTypewriting = true;
        
        if (!isTaglineComplete) {
            // Digitar tagline primeiro
            if (currentChar < taglineText.length) {
                taglineEl.textContent = taglineText.substring(0, currentChar + 1);
                currentChar++;
                currentTypingAnimation = setTimeout(typeWriter, 40);
            } else {
                isTaglineComplete = true;
                currentChar = 0;
                currentTypingAnimation = setTimeout(typeRotatingWord, 800);
            }
        }
        isTypewriting = false;
    }
    
    function typeRotatingWord() {
        if (isTypewriting) return;
        isTypewriting = true;
        
        const currentWord = rotatingWords[currentWordIndex];
        
        if (!isDeleting && currentChar < currentWord.length) {
            rotatingEl.textContent = currentWord.substring(0, currentChar + 1);
            currentChar++;
            currentTypingAnimation = setTimeout(typeRotatingWord, 40);
        } else if (isDeleting && currentChar > 0) {
            rotatingEl.textContent = currentWord.substring(0, currentChar - 1);
            currentChar--;
            currentTypingAnimation = setTimeout(typeRotatingWord, 25);
        } else if (!isDeleting && currentChar === currentWord.length) {
            isDeleting = true;
            currentTypingAnimation = setTimeout(typeRotatingWord, 2000);
        } else if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentWordIndex = (currentWordIndex + 1) % rotatingWords.length;
            currentTypingAnimation = setTimeout(typeRotatingWord, 500);
        }
        isTypewriting = false;
    }
    
    // Iniciar typewriter
    currentTypingAnimation = setTimeout(typeWriter, 100);
}

// === ANIMAÇÕES GSAP ===
function initAnimations() {
    // Configurar ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Fade-in geral
    gsap.from('.fade-in', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.fade-in',
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
        }
    });

    // Hero section
    gsap.from('.hero h1', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3
    });

    gsap.from('.hero .tagline', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.6
    });

    // Sobre section
    gsap.from('.sobre-content', {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.sobre',
            start: 'top 70%',
            toggleActions: 'play none none none',
            once: true
        }
    });

    // Hobbies animation - versão estável
    if (document.querySelectorAll('.hobby').length > 0) {
        gsap.fromTo('.hobby', 
            {
                opacity: 0,
                y: 15
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out',
                stagger: 0.08,
                delay: 0.3,
                scrollTrigger: {
                    trigger: '.hobbies-list',
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                    once: true
                }
            }
        );
    }

    // Projetos cards
    gsap.from('.projeto-card', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.projetos-grid',
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
        }
    });

    // Ferramentas grid
    gsap.from('.ferramenta-item', {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.ferramentas-grid',
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
        }
    });

    // Livros grid
    gsap.from('.livro-card', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 0.1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
            trigger: '.leituras-grid',
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
        }
    });

    // Animação do header ao rolar
    const header = document.querySelector('.header');
    gsap.to(header, {
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        duration: 0.3,
        ease: 'power1.out',
        scrollTrigger: {
            trigger: 'body',
            start: 'top -50px',
            toggleActions: 'play none reverse none'
        }
    });
}

// === MICRO INTERAÇÕES ===
function initMicroInteractions() {
    // Hobbies
    document.querySelectorAll('.hobby').forEach(hobby => {
        hobby.addEventListener('click', () => {
            gsap.to(hobby, {
                scale: 1.2,
                rotation: 360,
                duration: 0.6,
                ease: 'back.out(1.7)',
                yoyo: true,
                repeat: 1
            });
            
            const emoji = hobby.textContent.split(' ')[0];
            createFloatingEmoji(hobby, emoji);
        });
    });
}

function createFloatingEmoji(element, emoji) {
    const floatingEmoji = document.createElement('span');
    floatingEmoji.textContent = emoji;
    floatingEmoji.style.position = 'absolute';
    floatingEmoji.style.fontSize = '2rem';
    floatingEmoji.style.pointerEvents = 'none';
    floatingEmoji.style.zIndex = '1000';
    
    const rect = element.getBoundingClientRect();
    floatingEmoji.style.left = rect.left + rect.width/2 + 'px';
    floatingEmoji.style.top = rect.top + 'px';
    
    document.body.appendChild(floatingEmoji);
    
    gsap.to(floatingEmoji, {
        y: -100,
        opacity: 0,
        scale: 1.5,
        rotation: 360,
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => {
            document.body.removeChild(floatingEmoji);
        }
    });
}

// === MENU HAMBURGER ===
function initMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
        });
    }
}

// === SISTEMA DE TRADUÇÃO ===
function setLanguage(lang) {
    // Verificar se o idioma é válido
    if (!availableLangs.includes(lang)) {
        console.warn('Idioma não suportado:', lang);
        return;
    }
    
    // Parar typewriter atual
    if (currentTypingAnimation) {
        clearTimeout(currentTypingAnimation);
        currentTypingAnimation = null;
    }
    isTypewriting = false;

    // Atualizar variáveis globais
    currentLang = lang;
    currentLangIndex = availableLangs.indexOf(lang);

    const currentLangName = langNames[currentLang] || currentLang.toUpperCase();
    const currentLangAbbr = langTextMap[currentLang] || currentLang.toUpperCase();
    
    // Atualizar interface
    if (langFlag) {
        langFlag.src = flagUrls[currentLang];
        langFlag.alt = `Current language: ${currentLangName}`;
    }
    
    if (langToggle) {
        langToggle.setAttribute('aria-label', `Change language, current: ${currentLangName}`);
        langToggle.title = `Change language (Current: ${currentLangName})`;
    }
    
    if (langLabel) {
        langLabel.textContent = currentLangAbbr;
    }
    
    // Salvar no localStorage
    localStorage.setItem('selectedLanguage', lang);
    document.documentElement.lang = currentLang;

    // Aplicar traduções imediatamente
    const currentTranslations = translations[currentLang];
    if (currentTranslations) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
            if (currentTranslations[key]) {
                if (key.includes('Quote') || key === 'aboutBio' || key === 'footerContact') {
                    el.innerHTML = currentTranslations[key];
            } else {
                    el.textContent = currentTranslations[key];
                }
            }
        });
    }
    
    // Atualizar badges dos cards de projetos
    document.querySelectorAll('.card[data-card-badge]').forEach(card => {
        if (currentTranslations && currentTranslations['cardClickBadge']) {
            card.setAttribute('data-card-badge', currentTranslations['cardClickBadge']);
        }
    });

    // Reiniciar typewriter após pequeno delay
    setTimeout(() => {
        initTypewriterEffect();
    }, 200);
}

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
    // Atribuir variáveis globais
    langToggle = document.getElementById('langToggle');
    langFlag = document.getElementById('langFlag');
    langLabel = document.getElementById('langLabel');
    themeToggleBtn = document.getElementById('themeToggle');

    // Configurar idioma inicial
    const savedLang = localStorage.getItem('selectedLanguage');
    const browserLang = navigator.language || 'pt-BR';
    let initialLang = 'pt-BR';
    
    if (savedLang && availableLangs.includes(savedLang)) {
        initialLang = savedLang;
    } else if (browserLang.startsWith('en')) {
        initialLang = 'en';
    } else if (browserLang.startsWith('es')) {
        initialLang = 'es';
    }

    // Definir idioma inicial
    setLanguage(initialLang);

    // Event listeners
    if (langToggle) {
        langToggle.addEventListener('click', (e) => {
            e.preventDefault();
            currentLangIndex = (currentLangIndex + 1) % availableLangs.length;
            const nextLang = availableLangs[currentLangIndex];
            setLanguage(nextLang);
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Carregar tema salvo
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

    // Configurar ano no footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Inicializar funcionalidades
    initAnimations();
    initMicroInteractions();
    initMenu();
    
    // Aguardar um pouco antes de iniciar tudo
    setTimeout(() => {
        initTypewriterEffect();
        initPosterGallery();  // Inicializar galeria após DOM estar pronto
    }, 500);
});

function toggleLang() {
    currentLangIndex = (currentLangIndex + 1) % availableLangs.length;
    const nextLang = availableLangs[currentLangIndex];
    setLanguage(nextLang);
} 

// === AWWWARDS POSTER GALLERY ===
function initPosterGallery() {
    const posterData = {
        aves: {
            image: 'assets/img/posteres/aindanãodescobri.png',
            tags: []
        },
        caminhos: {
            image: 'assets/img/posteres/salvar.png',
            tags: []
        },
        ondeflor: {
            image: 'assets/img/posteres/ondeflor2.png',
            tags: []
        },
        empty: {
            image: 'assets/img/posteres/empty.png',
            tags: []
        },
        unlucky: {
            image: 'assets/img/posteres/unlucky.png',
            tags: []
        }
    };

    const posterDescriptions = {
        'pt-BR': {
            aves: 'Exploração visual sobre liberdade e movimento. Uma reflexão artística sobre a natureza alada e a busca por horizontes infinitos através do design digital.',
            caminhos: 'Composição visual sobre jornadas e direções. Design tipográfico que explora os diferentes percursos da vida e as escolhas que moldam nosso destino.',
            ondeflor: 'Narrativa poética visual que combina natureza e design digital. Uma busca artística por beleza em lugares inesperados através da linguagem visual.',
            empty: 'Investigação conceitual sobre vazio e espaço negativo. Peça minimalista que explora a filosofia do menos é mais no design contemporâneo.',
            unlucky: 'Expressão emocional através do design gráfico. Narrativa visual que explora temas de sorte e acaso.'
        },
        'en': {
            aves: 'Visual exploration of freedom and movement. An artistic reflection on winged nature and the search for infinite horizons through digital design.',
            caminhos: 'Visual composition about journeys and directions. Typographic design that explores life\'s different paths and the choices that shape our destiny.',
            ondeflor: 'Visual poetic narrative combining nature and digital design. An artistic search for beauty in unexpected places through visual language.',
            empty: 'Conceptual investigation of void and negative space. Minimalist piece exploring the philosophy of less is more in contemporary design.',
            unlucky: 'Emotional expression through graphic design. Visual narrative exploring themes of luck, chance, and beauty found in adversity.'
        },
        'es': {
            aves: 'Exploración visual sobre libertad y movimiento. Una reflexión artística sobre la naturaleza alada y la búsqueda de horizontes infinitos a través del diseño digital.',
            caminhos: 'Composición visual sobre viajes y direcciones. Diseño tipográfico que explora los diferentes senderos de la vida y las decisiones que moldean nuestro destino.',
            ondeflor: 'Narrativa poética visual que combina naturaleza y diseño digital. Una búsqueda artística de belleza en lugares inesperados a través del lenguaje visual.',
            empty: 'Investigación conceptual sobre vacío y espacio negativo. Pieza minimalista que explora la filosofía del menos es más en el diseño contemporáneo.',
            unlucky: 'Expresión emocional a través del diseño gráfico. Narrativa visual que explora temas de suerte, azar y la belleza encontrada en la adversidad.'
        }
    };

    const modal = document.getElementById('posterModal');
    const modalImage = document.getElementById('modalPosterImage');
    const modalTitle = document.getElementById('modalPosterTitle');
    const modalDescription = document.getElementById('modalPosterDescription');
    const modalTags = document.getElementById('modalPosterTags');
    
    // Verificar se elementos existem
    if (!modal || !modalImage || !modalTitle || !modalDescription || !modalTags) {
        return;
    }
    
    const closeBtn = modal.querySelector('.modal-close');
    const modalBackground = modal.querySelector('.modal-background');

    // Função para abrir modal
    function openModal(posterId, thumbnailElement) {
        const data = posterData[posterId];
        if (!data) return;
        
        // Definir conteúdo do modal
        modalImage.src = data.image;
        modalTitle.textContent = thumbnailElement.querySelector('span').textContent;
        
        // Usar idioma atual com fallback
        const lang = currentLang || 'pt-BR';
        const description = posterDescriptions[lang] && posterDescriptions[lang][posterId] 
            ? posterDescriptions[lang][posterId] 
            : posterDescriptions['pt-BR'][posterId];
        modalDescription.textContent = description;
        
        // Limpar tags (não há tags atualmente)
        modalTags.innerHTML = '';
        
        // Mostrar modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Adicionar event listeners aos thumbnails
    document.addEventListener('click', (e) => {
        const thumbnail = e.target.closest('.poster-thumbnail');
        if (thumbnail) {
            e.preventDefault();
            const posterId = thumbnail.dataset.poster;
            if (posterId) {
                openModal(posterId, thumbnail);
            }
        }
    });

    // Função para fechar modal
    function closePosterModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners para fechar modal
    if (closeBtn) {
        closeBtn.addEventListener('click', closePosterModal);
    }
    if (modalBackground) {
        modalBackground.addEventListener('click', closePosterModal);
    }
    
    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closePosterModal();
        }
    });

    // Efeito parallax no modal (mouse movement)
    modal.addEventListener('mousemove', (e) => {
        if (modal.classList.contains('active')) {
            const rect = modal.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;
            
            modalImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        }
    });

    // Reset quando sair do modal
    modal.addEventListener('mouseleave', () => {
        modalImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
} 