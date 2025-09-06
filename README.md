# 📌 AI-Powered Sticky Notes App

A local-first sticky notes application with AI summarization features, built for both web and mobile platforms.

## 🚀 Features

### Core Features
- ✅ **Create Notes**: Add title, content, and choose from 6 color options
- ✅ **View All Notes**: Grid/list view with latest-first sorting
- ✅ **Edit Notes**: Click any note to edit in full-screen modal
- ✅ **Delete Notes**: Delete with confirmation dialog
- ✅ **Search Notes**: Real-time search by title, content, or AI summary
- ✅ **Persist Notes**: Local storage (web) / AsyncStorage (mobile)

### AI Features
- ✅ **Auto Summarization**: AI generates summaries for longer notes (>50 characters)
- ✅ **OpenAI Integration**: Ready for API key configuration with local fallback
- ✅ **Smart Summaries**: Displays in note cards for quick overview

## 🛠️ Tech Stack

| Platform | Technologies |
|----------|-------------|
| **Web** | Next.js 14, TypeScript, TailwindCSS, localStorage |
| **Mobile** | React Native, Expo, AsyncStorage, TypeScript |
| **AI** | OpenAI API (configurable) + Local fallback |
| **Icons** | Lucide React (web), Ionicons (mobile) |
| **Storage** | localStorage (web), AsyncStorage (mobile) |

## 📦 Project Structure

```
/
├── web/                    # Next.js Web Application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── NotesApp.tsx
│   │   │   ├── NoteCard.tsx
│   │   │   └── NoteEditor.tsx
│   │   ├── lib/           # Utilities & services
│   │   │   ├── notes-storage.ts
│   │   │   ├── ai-service.ts
│   │   │   └── utils.ts
│   │   ├── types/         # TypeScript definitions
│   │   │   └── note.ts
│   │   └── app/          # Next.js app directory
│   └── package.json
│
├── mobile/                # React Native Mobile App
│   ├── src/
│   │   ├── components/    # React Native components
│   │   │   ├── NotesApp.tsx
│   │   │   ├── NoteCard.tsx
│   │   │   └── NoteEditor.tsx
│   │   ├── lib/          # Mobile utilities & services
│   │   │   ├── notes-storage.ts
│   │   │   ├── ai-service.ts
│   │   │   └── utils.ts
│   │   └── types/        # Shared TypeScript definitions
│   │       └── note.ts
│   ├── App.tsx
│   └── package.json
│
└── README.md
```

## 🚦 Getting Started

### Web Application

1. **Install dependencies**:
   ```bash
   cd web
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Access the app**: Open [http://localhost:3000](http://localhost:3000)

### Mobile Application

1. **Install dependencies**:
   ```bash
   cd mobile
   npm install
   ```

2. **Start Expo development server**:
   ```bash
   # For web preview
   npm run web
   
   # For iOS simulator (Mac only)
   npm run ios
   
   # For Android emulator
   npm run android
   ```

3. **Access mobile web**: Open [http://localhost:8081](http://localhost:8081)

## 🤖 AI Configuration

### OpenAI API Setup (Optional)

To enable advanced AI summarization, set your OpenAI API key:

**Web (Next.js)**:
Create `.env.local` in the `web` directory:
```env
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

**Mobile (React Native)**:
The mobile app uses local summarization by default. For OpenAI integration, you would need to implement secure key storage.

### Local Fallback

Both apps include intelligent local summarization that:
- Extracts the first meaningful sentence for short content
- Truncates long content to 97 characters + "..."
- Handles edge cases gracefully

## 📱 Cross-Platform Features

### Web Features
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Keyboard shortcuts (Ctrl+Enter to save, Escape to cancel)
- ✅ localStorage persistence
- ✅ Fast build times with Next.js

### Mobile Features
- ✅ Native mobile UI components
- ✅ Touch-optimized interactions
- ✅ AsyncStorage persistence
- ✅ Pull-to-refresh functionality
- ✅ Modal-based editing
- ✅ iOS and Android compatibility

## 🎨 UI/UX Highlights

### Color System
- 6 distinct note colors: Yellow, Blue, Green, Pink, Purple, Orange
- Consistent color palette across platforms
- Hover/touch states for better interactivity

### Responsive Design
- Grid layout adapts to screen sizes
- Mobile-first approach
- Touch-friendly button sizes
- Optimized typography

### User Experience
- Instant feedback on all actions
- Loading states for AI processing
- Error handling with graceful fallbacks
- Confirmation dialogs for destructive actions

## 🔧 Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Consistent code style across platforms
- Modular component architecture

### Performance
- Local-first approach for instant responsiveness
- Efficient state management
- Minimal bundle sizes
- Optimized for mobile performance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📧 Support

For issues and questions, please open a GitHub issue in this repository.
