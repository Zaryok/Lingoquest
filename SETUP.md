# 🏰 LingoQuest Setup Guide

This guide will walk you through setting up LingoQuest from scratch to deployment.

## 📋 Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm, yarn, or pnpm** - Package manager
- **Firebase Account** - [Create here](https://firebase.google.com/)
- **Vercel Account** (for deployment) - [Sign up here](https://vercel.com/)

## 🚀 Quick Start (5 minutes)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/lingoquest.git
cd lingoquest
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase configuration (see Firebase Setup below).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔥 Firebase Setup (Detailed)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `lingoquest-[your-name]`
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Authentication

1. In Firebase console, go to **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"**
5. Save changes

### Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"**
4. Select your preferred location
5. Click **"Done"**

### Step 4: Get Configuration Keys

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **"Add app"** → **"Web"**
4. Enter app nickname: `lingoquest-web`
5. **Don't** check "Firebase Hosting"
6. Click **"Register app"**
7. Copy the configuration object

### Step 5: Configure Environment Variables

Update your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 6: Set Security Rules

In Firestore Database → Rules, replace the content with:

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

Click **"Publish"**.

### Step 7: Seed Database (Optional)

To populate with sample lessons:

```bash
npm run seed
```

## 🌐 Vercel Deployment

### Step 1: Prepare for Deployment

1. Push your code to GitHub
2. Make sure `.env.local` is in `.gitignore` (it should be by default)

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add all your Firebase configuration variables:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

### Step 4: Update Firebase Settings

1. In Firebase console, go to **Authentication** → **Settings**
2. Add your Vercel domain to **Authorized domains**:
   - `your-project.vercel.app`
   - `your-custom-domain.com` (if applicable)

### Step 5: Deploy

Click **"Deploy"** in Vercel. Your app will be live in minutes!

## 🧪 Testing Your Setup

### 1. Test Authentication

1. Go to your deployed app
2. Click **"Create Your Character"**
3. Sign up with a test email
4. Verify you can log in and out

### 2. Test Lessons

1. Complete the first lesson
2. Check that XP and progress are saved
3. Verify next lesson unlocks

### 3. Test Responsiveness

1. Open on mobile device
2. Test all major features
3. Verify UI adapts properly

## 🔧 Development Tips

### Local Development

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

### Adding New Lessons

1. Edit `src/data/lessons.ts`
2. Follow the existing lesson structure
3. Test locally before deploying

### Customizing Theme

1. Modify CSS variables in `src/app/globals.css`
2. Update character types in `src/types/index.ts`
3. Customize animations and colors

### Database Management

```bash
# Seed database with sample data
npm run seed

# View data in Firebase console
# Go to Firestore Database → Data
```

## 🐛 Troubleshooting

### Common Issues

**"Module not found" errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Firebase connection issues**
- Check environment variables are correct
- Verify Firebase project is active
- Check browser console for detailed errors

**Build failures**
- Run `npm run lint` to check for errors
- Verify all imports are correct
- Check TypeScript errors

**Authentication not working**
- Verify Firebase Auth is enabled
- Check authorized domains in Firebase
- Ensure environment variables are set

### Getting Help

1. Check the [Issues](https://github.com/yourusername/lingoquest/issues) page
2. Review Firebase documentation
3. Check Next.js documentation
4. Create a new issue with detailed error information

## 📚 Next Steps

After setup, you can:

1. **Add More Languages**: Extend the lesson system
2. **Create Custom Lessons**: Build your own content
3. **Add Features**: Implement achievements, leaderboards
4. **Customize Design**: Make it your own
5. **Scale Up**: Add more users and content

## 🎉 Congratulations!

You now have a fully functional LingoQuest application! 

**Your medieval language learning adventure awaits!** ⚔️📚
