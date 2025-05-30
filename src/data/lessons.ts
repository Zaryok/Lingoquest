import { Lesson } from '@/types';

export const sampleLessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Basic Greetings',
    description: 'Learn essential greetings and polite expressions',
    difficulty: 'beginner',
    xpReward: 100,
    estimatedTime: 10,
    category: 'Vocabulary',
    isLocked: false,
    order: 1,
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
    id: 'lesson-2',
    title: 'Numbers 1-10',
    description: 'Master the first ten numbers in Spanish',
    difficulty: 'beginner',
    xpReward: 120,
    estimatedTime: 15,
    category: 'Numbers',
    isLocked: true,
    order: 2,
    prerequisites: ['lesson-1'],
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
    id: 'lesson-3',
    title: 'Family Members',
    description: 'Learn vocabulary for family relationships',
    difficulty: 'beginner',
    xpReward: 110,
    estimatedTime: 12,
    category: 'Vocabulary',
    isLocked: true,
    order: 3,
    prerequisites: ['lesson-2'],
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
    id: 'lesson-4',
    title: 'Colors and Adjectives',
    description: 'Discover colors and basic descriptive words',
    difficulty: 'intermediate',
    xpReward: 150,
    estimatedTime: 18,
    category: 'Vocabulary',
    isLocked: true,
    order: 4,
    prerequisites: ['lesson-3'],
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
    id: 'lesson-5',
    title: 'Present Tense Verbs',
    description: 'Master basic present tense conjugations',
    difficulty: 'intermediate',
    xpReward: 180,
    estimatedTime: 25,
    category: 'Grammar',
    isLocked: true,
    order: 5,
    prerequisites: ['lesson-4'],
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
  }
];
