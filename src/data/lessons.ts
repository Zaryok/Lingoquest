import { Lesson } from '@/types';

// Language-specific lesson data
const spanishLessons: Lesson[] = [
  {
    id: 'es-lesson-1',
    title: 'Basic Greetings',
    description: 'Learn essential greetings and polite expressions',
    difficulty: 'beginner',
    xpReward: 100,
    estimatedTime: 10,
    category: 'Vocabulary',
    isLocked: false,
    order: 1,
    targetLanguage: 'es',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'step-1-1',
        word: 'Hello',
        translation: 'Hola',
        pronunciation: 'OH-lah',
        example: 'Hello, how are you? - Hola, ¿cómo estás?'
      },
      {
        type: 'flashcard',
        id: 'step-1-2',
        word: 'Good morning',
        translation: 'Buenos días',
        pronunciation: 'BWAY-nos DEE-ahs',
        example: 'Good morning, teacher! - ¡Buenos días, profesor!'
      },
      {
        type: 'mcq',
        id: 'step-1-3',
        question: 'How do you say "Hello" in Spanish?',
        options: ['Adiós', 'Hola', 'Gracias', 'Por favor'],
        correctAnswer: 1,
        explanation: 'Hola is the most common way to say hello in Spanish.'
      },
      {
        type: 'input',
        id: 'step-1-4',
        question: 'Translate: "Good morning"',
        correctAnswer: 'Buenos días',
        hint: 'Think about the time of day...',
        caseSensitive: false
      },
      {
        type: 'mcq',
        id: 'step-1-5',
        question: 'Which greeting would you use in the morning?',
        options: ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Hasta luego'],
        correctAnswer: 1,
        explanation: 'Buenos días is used from morning until around noon.'
      }
    ]
  },
  {
    id: 'es-lesson-2',
    title: 'Numbers 1-10',
    description: 'Master the first ten numbers in Spanish',
    difficulty: 'beginner',
    xpReward: 120,
    estimatedTime: 15,
    category: 'Numbers',
    isLocked: true,
    order: 2,
    prerequisites: ['es-lesson-1'],
    targetLanguage: 'es',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'step-2-1',
        word: 'One',
        translation: 'Uno',
        pronunciation: 'OO-no'
      },
      {
        type: 'flashcard',
        id: 'step-2-2',
        word: 'Two',
        translation: 'Dos',
        pronunciation: 'dohs'
      },
      {
        type: 'flashcard',
        id: 'step-2-3',
        word: 'Three',
        translation: 'Tres',
        pronunciation: 'trehs'
      },
      {
        type: 'mcq',
        id: 'step-2-4',
        question: 'What is "cinco" in English?',
        options: ['Four', 'Five', 'Six', 'Seven'],
        correctAnswer: 1,
        explanation: 'Cinco means five in English.'
      },
      {
        type: 'input',
        id: 'step-2-5',
        question: 'Write the Spanish word for "eight"',
        correctAnswer: 'ocho',
        hint: 'It starts with "o"...',
        caseSensitive: false
      }
    ]
  },
  {
    id: 'es-lesson-3',
    title: 'Family Members',
    description: 'Learn vocabulary for family relationships',
    difficulty: 'beginner',
    xpReward: 110,
    estimatedTime: 12,
    category: 'Vocabulary',
    isLocked: true,
    order: 3,
    prerequisites: ['es-lesson-2'],
    targetLanguage: 'es',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'step-3-1',
        word: 'Mother',
        translation: 'Madre',
        pronunciation: 'MAH-dreh',
        example: 'My mother is kind - Mi madre es amable'
      },
      {
        type: 'flashcard',
        id: 'step-3-2',
        word: 'Father',
        translation: 'Padre',
        pronunciation: 'PAH-dreh',
        example: 'My father works - Mi padre trabaja'
      },
      {
        type: 'mcq',
        id: 'step-3-3',
        question: 'How do you say "sister" in Spanish?',
        options: ['Hermano', 'Hermana', 'Prima', 'Tía'],
        correctAnswer: 1,
        explanation: 'Hermana means sister. Hermano means brother.'
      },
      {
        type: 'input',
        id: 'step-3-4',
        question: 'Translate: "My brother"',
        correctAnswer: 'Mi hermano',
        hint: 'Remember the possessive "mi"...',
        caseSensitive: false
      }
    ]
  },
  {
    id: 'es-lesson-4',
    title: 'Colors and Adjectives',
    description: 'Discover colors and basic descriptive words',
    difficulty: 'intermediate',
    xpReward: 150,
    estimatedTime: 18,
    category: 'Vocabulary',
    isLocked: true,
    order: 4,
    prerequisites: ['es-lesson-3'],
    targetLanguage: 'es',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'step-4-1',
        word: 'Red',
        translation: 'Rojo',
        pronunciation: 'ROH-ho',
        example: 'The red car - El carro rojo'
      },
      {
        type: 'flashcard',
        id: 'step-4-2',
        word: 'Blue',
        translation: 'Azul',
        pronunciation: 'ah-SOOL',
        example: 'The blue sky - El cielo azul'
      },
      {
        type: 'mcq',
        id: 'step-4-3',
        question: 'What color is "verde"?',
        options: ['Yellow', 'Green', 'Purple', 'Orange'],
        correctAnswer: 1,
        explanation: 'Verde means green in Spanish.'
      },
      {
        type: 'input',
        id: 'step-4-4',
        question: 'How do you say "big" in Spanish?',
        correctAnswer: 'grande',
        hint: 'It\'s similar to the English word "grand"...',
        caseSensitive: false
      },
      {
        type: 'mcq',
        id: 'step-4-5',
        question: 'Which adjective means "small"?',
        options: ['Grande', 'Pequeño', 'Alto', 'Bajo'],
        correctAnswer: 1,
        explanation: 'Pequeño means small or little.'
      }
    ]
  },
  {
    id: 'es-lesson-5',
    title: 'Present Tense Verbs',
    description: 'Master basic present tense conjugations',
    difficulty: 'intermediate',
    xpReward: 180,
    estimatedTime: 25,
    category: 'Grammar',
    isLocked: true,
    order: 5,
    prerequisites: ['es-lesson-4'],
    targetLanguage: 'es',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'step-5-1',
        word: 'I speak',
        translation: 'Yo hablo',
        pronunciation: 'yoh AH-bloh',
        example: 'I speak Spanish - Yo hablo español'
      },
      {
        type: 'flashcard',
        id: 'step-5-2',
        word: 'You eat',
        translation: 'Tú comes',
        pronunciation: 'too KOH-mehs',
        example: 'You eat pizza - Tú comes pizza'
      },
      {
        type: 'mcq',
        id: 'step-5-3',
        question: 'How do you conjugate "vivir" (to live) for "nosotros"?',
        options: ['Vivimos', 'Viven', 'Vives', 'Vivo'],
        correctAnswer: 0,
        explanation: 'Nosotros vivimos - We live. The -ir ending becomes -imos for nosotros.'
      },
      {
        type: 'input',
        id: 'step-5-4',
        question: 'Conjugate "estudiar" for "ella" (she studies)',
        correctAnswer: 'estudia',
        hint: 'Remove -ar and add the third person singular ending...',
        caseSensitive: false
      },
      {
        type: 'mcq',
        id: 'step-5-5',
        question: 'What is the correct form: "Ellos _____ en la escuela"?',
        options: ['trabajo', 'trabajas', 'trabajan', 'trabajamos'],
        correctAnswer: 2,
        explanation: 'Ellos trabajan - They work. Third person plural uses -an ending.'
      }
    ]
  },
  {
    id: 'es-lesson-6',
    title: 'Food and Drinks',
    description: 'Learn vocabulary for meals and beverages',
    difficulty: 'beginner',
    xpReward: 130,
    estimatedTime: 15,
    category: 'Vocabulary',
    isLocked: true,
    order: 6,
    prerequisites: ['es-lesson-5'],
    targetLanguage: 'es',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'step-6-1',
        word: 'Water',
        translation: 'Agua',
        pronunciation: 'AH-gwah',
        example: 'I drink water - Yo bebo agua'
      },
      {
        type: 'flashcard',
        id: 'step-6-2',
        word: 'Bread',
        translation: 'Pan',
        pronunciation: 'pahn',
        example: 'Fresh bread - Pan fresco'
      },
      {
        type: 'mcq',
        id: 'step-6-3',
        question: 'How do you say "apple" in Spanish?',
        options: ['Naranja', 'Manzana', 'Plátano', 'Uva'],
        correctAnswer: 1,
        explanation: 'Manzana means apple in Spanish.'
      },
      {
        type: 'input',
        id: 'step-6-4',
        question: 'Translate: "I eat pizza"',
        correctAnswer: 'Yo como pizza',
        hint: 'Remember the verb "comer" (to eat)...',
        caseSensitive: false
      }
    ]
  },
  {
    id: 'es-lesson-7',
    title: 'Days and Time',
    description: 'Master days of the week and time expressions',
    difficulty: 'intermediate',
    xpReward: 140,
    estimatedTime: 20,
    category: 'Time',
    isLocked: true,
    order: 7,
    prerequisites: ['es-lesson-6'],
    targetLanguage: 'es',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'step-7-1',
        word: 'Monday',
        translation: 'Lunes',
        pronunciation: 'LOO-nehs',
        example: 'Today is Monday - Hoy es lunes'
      },
      {
        type: 'flashcard',
        id: 'step-7-2',
        word: 'What time is it?',
        translation: '¿Qué hora es?',
        pronunciation: 'keh OH-rah ehs',
        example: 'What time is it? It\'s 3 o\'clock - ¿Qué hora es? Son las tres'
      },
      {
        type: 'mcq',
        id: 'step-7-3',
        question: 'Which day comes after "miércoles"?',
        options: ['Martes', 'Jueves', 'Viernes', 'Sábado'],
        correctAnswer: 1,
        explanation: 'Jueves (Thursday) comes after miércoles (Wednesday).'
      },
      {
        type: 'input',
        id: 'step-7-4',
        question: 'How do you say "weekend" in Spanish?',
        correctAnswer: 'fin de semana',
        hint: 'It means "end of week"...',
        caseSensitive: false
      }
    ]
  },
  {
    id: 'es-lesson-8',
    title: 'Clothing and Shopping',
    description: 'Learn clothing vocabulary and shopping phrases',
    difficulty: 'intermediate',
    xpReward: 160,
    estimatedTime: 22,
    category: 'Vocabulary',
    isLocked: true,
    order: 8,
    prerequisites: ['es-lesson-7'],
    targetLanguage: 'es',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'step-8-1',
        word: 'Shirt',
        translation: 'Camisa',
        pronunciation: 'kah-MEE-sah',
        example: 'Blue shirt - Camisa azul'
      },
      {
        type: 'flashcard',
        id: 'step-8-2',
        word: 'How much does it cost?',
        translation: '¿Cuánto cuesta?',
        pronunciation: 'KWAN-toh KWEH-stah',
        example: 'How much does this cost? - ¿Cuánto cuesta esto?'
      },
      {
        type: 'mcq',
        id: 'step-8-3',
        question: 'What does "zapatos" mean?',
        options: ['Socks', 'Shoes', 'Pants', 'Hat'],
        correctAnswer: 1,
        explanation: 'Zapatos means shoes in Spanish.'
      },
      {
        type: 'input',
        id: 'step-8-4',
        question: 'Translate: "I need a jacket"',
        correctAnswer: 'Necesito una chaqueta',
        hint: 'Use "necesito" for "I need"...',
        caseSensitive: false
      }
    ]
  }
];

// French lessons
const frenchLessons: Lesson[] = [
  {
    id: 'fr-lesson-1',
    title: 'Basic Greetings',
    description: 'Learn essential French greetings and polite expressions',
    difficulty: 'beginner',
    xpReward: 100,
    estimatedTime: 10,
    category: 'Vocabulary',
    isLocked: false,
    order: 1,
    targetLanguage: 'fr',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'fr-step-1-1',
        word: 'Hello',
        translation: 'Bonjour',
        pronunciation: 'bon-ZHOOR',
        example: 'Hello, how are you? - Bonjour, comment allez-vous?'
      },
      {
        type: 'flashcard',
        id: 'fr-step-1-2',
        word: 'Good evening',
        translation: 'Bonsoir',
        pronunciation: 'bon-SWAHR',
        example: 'Good evening, madam! - Bonsoir, madame!'
      },
      {
        type: 'mcq',
        id: 'fr-step-1-3',
        question: 'How do you say "Thank you" in French?',
        options: ['Au revoir', 'Merci', 'Pardon', 'Excusez-moi'],
        correctAnswer: 1,
        explanation: 'Merci is the most common way to say thank you in French.'
      },
      {
        type: 'input',
        id: 'fr-step-1-4',
        question: 'Translate: "Good morning"',
        correctAnswer: 'Bonjour',
        hint: 'It\'s the same as "hello" in French...',
        caseSensitive: false
      }
    ]
  },
  {
    id: 'fr-lesson-2',
    title: 'Numbers 1-10',
    description: 'Master the first ten numbers in French',
    difficulty: 'beginner',
    xpReward: 120,
    estimatedTime: 15,
    category: 'Numbers',
    isLocked: true,
    order: 2,
    prerequisites: ['fr-lesson-1'],
    targetLanguage: 'fr',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'fr-step-2-1',
        word: 'One',
        translation: 'Un',
        pronunciation: 'uhn'
      },
      {
        type: 'flashcard',
        id: 'fr-step-2-2',
        word: 'Two',
        translation: 'Deux',
        pronunciation: 'duh'
      },
      {
        type: 'mcq',
        id: 'fr-step-2-3',
        question: 'What is "cinq" in English?',
        options: ['Four', 'Five', 'Six', 'Seven'],
        correctAnswer: 1,
        explanation: 'Cinq means five in English.'
      },
      {
        type: 'input',
        id: 'fr-step-2-4',
        question: 'Write the French word for "eight"',
        correctAnswer: 'huit',
        hint: 'It starts with "h"...',
        caseSensitive: false
      }
    ]
  },
  {
    id: 'fr-lesson-3',
    title: 'Family Members',
    description: 'Learn French vocabulary for family relationships',
    difficulty: 'beginner',
    xpReward: 110,
    estimatedTime: 12,
    category: 'Vocabulary',
    isLocked: true,
    order: 3,
    prerequisites: ['fr-lesson-2'],
    targetLanguage: 'fr',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'fr-step-3-1',
        word: 'Mother',
        translation: 'Mère',
        pronunciation: 'mehr',
        example: 'My mother is kind - Ma mère est gentille'
      },
      {
        type: 'flashcard',
        id: 'fr-step-3-2',
        word: 'Father',
        translation: 'Père',
        pronunciation: 'pehr',
        example: 'My father works - Mon père travaille'
      },
      {
        type: 'mcq',
        id: 'fr-step-3-3',
        question: 'How do you say "sister" in French?',
        options: ['Frère', 'Sœur', 'Cousin', 'Tante'],
        correctAnswer: 1,
        explanation: 'Sœur means sister. Frère means brother.'
      },
      {
        type: 'input',
        id: 'fr-step-3-4',
        question: 'Translate: "My brother"',
        correctAnswer: 'Mon frère',
        hint: 'Remember the possessive "mon"...',
        caseSensitive: false
      }
    ]
  }
];

// German lessons
const germanLessons: Lesson[] = [
  {
    id: 'de-lesson-1',
    title: 'Basic Greetings',
    description: 'Learn essential German greetings and polite expressions',
    difficulty: 'beginner',
    xpReward: 100,
    estimatedTime: 10,
    category: 'Vocabulary',
    isLocked: false,
    order: 1,
    targetLanguage: 'de',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'de-step-1-1',
        word: 'Hello',
        translation: 'Hallo',
        pronunciation: 'HAH-loh',
        example: 'Hello, how are you? - Hallo, wie geht es dir?'
      },
      {
        type: 'flashcard',
        id: 'de-step-1-2',
        word: 'Good morning',
        translation: 'Guten Morgen',
        pronunciation: 'GOO-ten MOR-gen',
        example: 'Good morning, teacher! - Guten Morgen, Lehrer!'
      },
      {
        type: 'mcq',
        id: 'de-step-1-3',
        question: 'How do you say "Thank you" in German?',
        options: ['Auf Wiedersehen', 'Danke', 'Entschuldigung', 'Bitte'],
        correctAnswer: 1,
        explanation: 'Danke is the most common way to say thank you in German.'
      },
      {
        type: 'input',
        id: 'de-step-1-4',
        question: 'Translate: "Good evening"',
        correctAnswer: 'Guten Abend',
        hint: 'Think about the time of day...',
        caseSensitive: false
      }
    ]
  },
  {
    id: 'de-lesson-2',
    title: 'Numbers 1-10',
    description: 'Master the first ten numbers in German',
    difficulty: 'beginner',
    xpReward: 120,
    estimatedTime: 15,
    category: 'Numbers',
    isLocked: true,
    order: 2,
    prerequisites: ['de-lesson-1'],
    targetLanguage: 'de',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'de-step-2-1',
        word: 'One',
        translation: 'Eins',
        pronunciation: 'ines'
      },
      {
        type: 'flashcard',
        id: 'de-step-2-2',
        word: 'Two',
        translation: 'Zwei',
        pronunciation: 'tsvai'
      },
      {
        type: 'mcq',
        id: 'de-step-2-3',
        question: 'What is "fünf" in English?',
        options: ['Four', 'Five', 'Six', 'Seven'],
        correctAnswer: 1,
        explanation: 'Fünf means five in English.'
      },
      {
        type: 'input',
        id: 'de-step-2-4',
        question: 'Write the German word for "ten"',
        correctAnswer: 'zehn',
        hint: 'It starts with "z"...',
        caseSensitive: false
      }
    ]
  }
];

// Italian lessons
const italianLessons: Lesson[] = [
  {
    id: 'it-lesson-1',
    title: 'Basic Greetings',
    description: 'Learn essential Italian greetings and polite expressions',
    difficulty: 'beginner',
    xpReward: 100,
    estimatedTime: 10,
    category: 'Vocabulary',
    isLocked: false,
    order: 1,
    targetLanguage: 'it',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'it-step-1-1',
        word: 'Hello',
        translation: 'Ciao',
        pronunciation: 'chow',
        example: 'Hello, how are you? - Ciao, come stai?'
      },
      {
        type: 'flashcard',
        id: 'it-step-1-2',
        word: 'Good morning',
        translation: 'Buongiorno',
        pronunciation: 'bwon-JOR-no',
        example: 'Good morning, teacher! - Buongiorno, professore!'
      },
      {
        type: 'mcq',
        id: 'it-step-1-3',
        question: 'How do you say "Thank you" in Italian?',
        options: ['Arrivederci', 'Grazie', 'Prego', 'Scusi'],
        correctAnswer: 1,
        explanation: 'Grazie is the most common way to say thank you in Italian.'
      },
      {
        type: 'input',
        id: 'it-step-1-4',
        question: 'Translate: "Good evening"',
        correctAnswer: 'Buonasera',
        hint: 'Think about the time of day...',
        caseSensitive: false
      }
    ]
  },
  {
    id: 'it-lesson-2',
    title: 'Numbers 1-10',
    description: 'Master the first ten numbers in Italian',
    difficulty: 'beginner',
    xpReward: 120,
    estimatedTime: 15,
    category: 'Numbers',
    isLocked: true,
    order: 2,
    prerequisites: ['it-lesson-1'],
    targetLanguage: 'it',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'it-step-2-1',
        word: 'One',
        translation: 'Uno',
        pronunciation: 'OO-no'
      },
      {
        type: 'flashcard',
        id: 'it-step-2-2',
        word: 'Two',
        translation: 'Due',
        pronunciation: 'DOO-eh'
      },
      {
        type: 'mcq',
        id: 'it-step-2-3',
        question: 'What is "cinque" in English?',
        options: ['Four', 'Five', 'Six', 'Seven'],
        correctAnswer: 1,
        explanation: 'Cinque means five in English.'
      },
      {
        type: 'input',
        id: 'it-step-2-4',
        question: 'Write the Italian word for "ten"',
        correctAnswer: 'dieci',
        hint: 'It starts with "d"...',
        caseSensitive: false
      }
    ]
  }
];

// Portuguese lessons
const portugueseLessons: Lesson[] = [
  {
    id: 'pt-lesson-1',
    title: 'Basic Greetings',
    description: 'Learn essential Portuguese greetings and polite expressions',
    difficulty: 'beginner',
    xpReward: 100,
    estimatedTime: 10,
    category: 'Vocabulary',
    isLocked: false,
    order: 1,
    targetLanguage: 'pt',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'pt-step-1-1',
        word: 'Hello',
        translation: 'Olá',
        pronunciation: 'oh-LAH',
        example: 'Hello, how are you? - Olá, como está?'
      },
      {
        type: 'flashcard',
        id: 'pt-step-1-2',
        word: 'Good morning',
        translation: 'Bom dia',
        pronunciation: 'bom DEE-ah',
        example: 'Good morning, teacher! - Bom dia, professor!'
      },
      {
        type: 'mcq',
        id: 'pt-step-1-3',
        question: 'How do you say "Thank you" in Portuguese?',
        options: ['Tchau', 'Obrigado', 'Por favor', 'Desculpe'],
        correctAnswer: 1,
        explanation: 'Obrigado (masculine) or Obrigada (feminine) means thank you in Portuguese.'
      },
      {
        type: 'input',
        id: 'pt-step-1-4',
        question: 'Translate: "Good night"',
        correctAnswer: 'Boa noite',
        hint: 'Think about the time of day...',
        caseSensitive: false
      }
    ]
  },
  {
    id: 'pt-lesson-2',
    title: 'Numbers 1-10',
    description: 'Master the first ten numbers in Portuguese',
    difficulty: 'beginner',
    xpReward: 120,
    estimatedTime: 15,
    category: 'Numbers',
    isLocked: true,
    order: 2,
    prerequisites: ['pt-lesson-1'],
    targetLanguage: 'pt',
    sourceLanguage: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        type: 'flashcard',
        id: 'pt-step-2-1',
        word: 'One',
        translation: 'Um',
        pronunciation: 'oom'
      },
      {
        type: 'flashcard',
        id: 'pt-step-2-2',
        word: 'Two',
        translation: 'Dois',
        pronunciation: 'doysh'
      },
      {
        type: 'mcq',
        id: 'pt-step-2-3',
        question: 'What is "cinco" in English?',
        options: ['Four', 'Five', 'Six', 'Seven'],
        correctAnswer: 1,
        explanation: 'Cinco means five in English.'
      },
      {
        type: 'input',
        id: 'pt-step-2-4',
        question: 'Write the Portuguese word for "eight"',
        correctAnswer: 'oito',
        hint: 'It starts with "o"...',
        caseSensitive: false
      }
    ]
  }
];

// Combine all lessons and export functions
const allLessons = [...spanishLessons, ...frenchLessons, ...germanLessons, ...italianLessons, ...portugueseLessons];

export const getLessonsByLanguage = (targetLanguage: string): Lesson[] => {
  return allLessons.filter(lesson => lesson.targetLanguage === targetLanguage);
};

export const getAllLessons = (): Lesson[] => {
  return allLessons;
};

// Backward compatibility
export const sampleLessons = allLessons;
