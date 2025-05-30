# 🏰 LingoQuest - Medieval Language Learning Adventure

A gamified language learning web application with a medieval RPG theme, built with Next.js 14+, TypeScript, Tailwind CSS, and Firebase.

![LingoQuest Banner](https://via.placeholder.com/800x200/8B4513/F5DEB3?text=LingoQuest+-+Medieval+Language+Learning)

## ✨ Features

### 🎮 Gamification Elements
- **Character Classes**: Choose from Mage, Warrior, or Rogue, each with unique bonuses
- **XP System**: Earn "Mana" points for completing lessons
- **Level Progression**: Advance through levels as you gain experience
- **Adventure Chain**: Maintain daily streaks to keep your momentum
- **Quest System**: Lessons are presented as medieval quests

### 📚 Learning System
- **Interactive Lessons**: Three types of learning steps:
  - **Flashcards**: Word-translation pairs with pronunciation guides
  - **Multiple Choice**: Questions with immediate feedback
  - **Text Input**: Translation exercises with hint system
- **Progressive Unlocking**: Complete quests to unlock new adventures
- **Score Tracking**: Performance monitoring with detailed feedback
- **Perfect Score Bonuses**: Extra XP for flawless completion

### 🎨 Medieval Theme
- **Fantasy UI**: Medieval-inspired design with custom CSS animations
- **Character Avatars**: Visual representation of chosen character class
- **Themed Terminology**: "Lessons" become "Quests", "XP" becomes "Mana"
- **Immersive Experience**: Consistent medieval fantasy atmosphere

### 🔐 Authentication & Data
- **Firebase Authentication**: Secure email/password authentication
- **User Profiles**: Persistent progress tracking
- **Cloud Storage**: Firestore database for lessons and progress
- **Real-time Updates**: Live progress synchronization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Firebase project (optional for demo)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lingoquest.git
   cd lingoquest
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Firebase Setup

### Creating a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "lingoquest")
4. Enable Google Analytics (optional)
5. Click "Create project"

### Configuring Authentication

1. In the Firebase console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Optionally configure authorized domains for production

### Setting up Firestore Database

1. Go to **Firestore Database** in the Firebase console
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location for your database

### Getting Configuration Keys

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web"
4. Register your app with a nickname
5. Copy the configuration object values to your `.env.local`

### Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Lessons are readable by authenticated users
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
    }

    // Lesson progress is private to each user
    match /lessonProgress/{progressId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard page
│   ├── lesson/           # Lesson pages and completion
│   ├── login/            # Authentication pages
│   ├── signup/
│   ├── layout.tsx        # Root layout with providers
│   ├── page.tsx          # Home page with routing logic
│   └── globals.css       # Global styles and medieval theme
├── components/            # Reusable UI components
│   ├── lesson/           # Lesson-specific components
│   └── ui/               # General UI components
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication state management
├── data/                 # Static data and sample content
│   └── lessons.ts        # Sample lesson data
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   └── firestore.ts      # Database operations
├── types/                # TypeScript type definitions
│   └── index.ts          # All application types
└── middleware.ts         # Next.js middleware for routing
```

## 🎯 Usage Guide

### For Students

1. **Create Account**: Sign up and choose your character class
2. **Start Learning**: Begin with the first available quest
3. **Complete Steps**: Work through flashcards, multiple choice, and input exercises
4. **Track Progress**: Monitor your XP, level, and adventure chain
5. **Unlock Content**: Complete quests to access new adventures

### For Educators

1. **Content Creation**: Add new lessons through the data structure
2. **Progress Monitoring**: View student progress through Firebase console
3. **Customization**: Modify difficulty levels and XP rewards
4. **Analytics**: Track engagement and completion rates

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Lessons

1. Edit `src/data/lessons.ts`
2. Follow the `Lesson` interface structure
3. Include proper step types and metadata
4. Test the lesson flow

### Customizing the Theme

1. Modify CSS variables in `src/app/globals.css`
2. Update character types in `src/types/index.ts`
3. Customize animations and transitions

### Database Schema

#### Users Collection
```typescript
{
  id: string;
  email: string;
  name: string;
  xp: number;
  streak: number;
  lastActiveDate: string;
  lessonsCompleted: string[];
  characterType: 'mage' | 'warrior' | 'rogue';
  level: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Lessons Collection
```typescript
{
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  steps: LessonStep[];
  prerequisites?: string[];
  estimatedTime: number;
  category: string;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Lesson Progress Collection
```typescript
{
  lessonId: string;
  userId: string;
  currentStep: number;
  completedSteps: string[];
  isCompleted: boolean;
  score: number;
  timeSpent: number;
  startedAt: Timestamp;
  completedAt?: Timestamp;
}
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to [Vercel](https://vercel.com)
   - Import your project

2. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings > Environment Variables
   - Add all Firebase configuration variables
   - Deploy the project

3. **Update Firebase Settings**
   - Add your Vercel domain to Firebase authorized domains
   - Update CORS settings if needed

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm run start
   ```

### Environment Variables for Production

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_production_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_production_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_production_app_id
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Character selection
- [ ] Dashboard displays correctly
- [ ] Lesson progression works
- [ ] XP and streak tracking
- [ ] Lesson completion flow
- [ ] Responsive design on mobile
- [ ] Firebase data persistence

### Demo Account

For testing purposes, you can use any email and password combination. The app will create a demo user automatically.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use the established component structure
- Maintain the medieval theme consistency
- Add proper error handling
- Include loading states
- Test on multiple devices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Firebase Team** - For the backend infrastructure
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide React** - For the beautiful icons
- **Medieval Inspiration** - For the fantasy theme elements

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/lingoquest/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Audio Support**: Pronunciation audio for vocabulary
- [ ] **More Languages**: Support for French, German, Italian
- [ ] **Achievements System**: Unlock badges and titles
- [ ] **Leaderboards**: Compete with other learners
- [ ] **Offline Mode**: Download lessons for offline study
- [ ] **AI Tutor**: Personalized learning recommendations
- [ ] **Social Features**: Friend system and study groups
- [ ] **Advanced Analytics**: Detailed progress insights
- [ ] **Mobile App**: React Native companion app
- [ ] **Teacher Dashboard**: Classroom management tools

### Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Enhanced UI and bug fixes (planned)
- **v1.2.0** - Audio support and new languages (planned)

---

**Built with ❤️ for language learners everywhere**

*May your linguistic adventures be ever victorious!* ⚔️📚
