# 📅 Notifio - An Event Reminder App

**Never Miss Another Important Moment**

A modern, intelligent event reminder application that combines sleek design with powerful functionality to help you stay organized and on top of your schedule.

---

## 👥 Team Members - Code Crafters

| Name | Role | Responsibilities |
|------|------|------------------|
| **MD Aman Monazir** | Full Stack Developer & Team Lead | Project architecture, UI/UX design, frontend development, integration |
| **Divyanshu Karn** | Frontend Developer | Component development, styling, user interface |
| **Himanshu Thakur** | Full Stack Developer | API development, database design, server management |
| **Aaditya Singh** | UI/UX Designer | Design system, user experience, visual assets |


---

## 🎯 Problem Statement Chosen

**"Developing a Smart Event Reminder System"**

In our fast-paced digital world, people struggle to keep track of important events, meetings, and deadlines. Traditional calendar apps often lack:
- **Intelligent notifications** that adapt to event urgency
- **Visual countdown timers** for better time awareness
- **Intuitive interfaces** for quick event creation
- **Real-time updates** that sync with system time
- **Smart alerts** that prevent missed appointments

Notifio solves these problems by providing a comprehensive, user-friendly solution that ensures you never miss another important moment.

---

## ✨ Features Implemented

### 🔥 Core Features

#### 1. **Smart Event Creation**
- ✅ Interactive calendar picker with date/time selection
- ✅ 1-minute precision time intervals for exact scheduling
- ✅ Form validation with future date enforcement
- ✅ Rich text descriptions for event details
- ✅ Intuitive user interface with cyber-theme styling

#### 2. **Intelligent Event Display**
- ✅ Chronologically sorted upcoming events list
- ✅ Real-time countdown timers for each event
- ✅ Color-coded urgency indicators (24hr, 1hr, 30min, 5min)
- ✅ Responsive card-based layout
- ✅ Event management (edit/delete functionality)

#### 3. **Advanced Notification System**
- ✅ Browser push notifications with permission handling
- ✅ Multi-tier alert system (High/Medium/Low urgency)
- ✅ Sound notifications with different tones
- ✅ Visual pulse animations for urgent events
- ✅ Smart notification deduplication

#### 4. **Real-Time Updates**
- ✅ Live countdown timers updating every second
- ✅ Automatic urgency level recalculation
- ✅ System time synchronization
- ✅ Dynamic color schemes based on event proximity

#### 5. **Data Persistence & Management**
- ✅ Local storage for offline functionality
- ✅ Event data backup and restoration
- ✅ Automatic cleanup of expired events
- ✅ Data validation and error handling

### 🚀 Premium Features

#### 6. **Enhanced User Experience**
- ✅ Futuristic cyber-punk theme with neon accents
- ✅ Smooth animations and transitions
- ✅ Mobile-responsive design
- ✅ Dark mode optimized interface
- ✅ Accessibility features and keyboard navigation

#### 7. **Advanced Calendar Interface**
- ✅ Custom DateTimePicker component
- ✅ Month navigation with visual indicators
- ✅ Today highlighting and disabled past dates
- ✅ Time selection with scrollable interface
- ✅ Professional styling matching app theme

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

### Adding Events
1. Click the "Add Event" button
2. Fill in the required fields:
   - **Event Name** (required)
   - **Date** (required, must be in the future)
   - **Time** (required)
   - **Description** (optional)
3. Click "Add Event" to save

### Managing Events
- View all upcoming events in the main list
- Events within 24 hours are highlighted with red styling
- Delete events by clicking the "Delete" button
- Real-time countdown shows time remaining for each event

### Notifications
- **Grant notification permissions** when prompted for best experience
- Events within 24 hours trigger browser notifications
- Sound alerts play at different urgency levels:
  - **High**: Events within 5-30 minutes
  - **Medium**: Events within 1 hour
  - **Low**: Events within 24 hours

---

## 🛠️ Tech Stack Used

### **Frontend Framework**
- **Next.js 15** - React-based framework with App Router
- **React 18** - Component-based UI library with latest features
- **TypeScript** - Type-safe JavaScript for better development experience

### **Styling & UI**
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Custom Components** - Reusable UI components with consistent design
- **Responsive Design** - Mobile-first approach with breakpoint optimization
- **CSS Animations** - Smooth transitions and micro-interactions

### **State Management & Data**
- **React Hooks** - useState, useEffect, useCallback for state management
- **Custom Hooks** - Reusable logic for events and notifications
- **Local Storage** - Browser-based data persistence
- **Real-time Updates** - setInterval for live countdown functionality

### **Enhanced User Experience**
- **React DatePicker** - Professional calendar interface for date/time selection
- **Lucide React** - Modern icon library for consistent iconography
- **React Hot Toast** - Elegant notification system for user feedback
- **Motion/Framer Motion** - Advanced animations and transitions

### **Browser APIs & Integration**
- **Web Notifications API** - Browser push notifications
- **Web Audio API** - Sound alerts and audio feedback
- **localStorage API** - Client-side data persistence
- **Date/Time APIs** - Precise time calculations and formatting

### **Development Tools**
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting and consistency
- **Git** - Version control and collaboration
- **npm** - Package management and dependency handling

### **Deployment Ready**
- **Vercel Optimization** - Built for seamless deployment
- **Static Generation** - Optimized build output
- **SEO Ready** - Proper meta tags and structure
- **Performance Optimized** - Code splitting and lazy loading

---

## 🛠️ Technical Details

### File Structure
```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AddEventForm.tsx
│   ├── CountdownTimer.tsx
│   └── EventList.tsx
├── hooks/
│   ├── useEvents.ts
│   └── useNotifications.ts
└── types/
    └── event.ts
```

### Key Features Implementation

#### Real-time Updates
- Uses `setInterval` to update time every second
- Automatically refreshes countdown timers and urgency levels

#### Visual Alerts
- CSS animations and color changes for urgent events
- Responsive design with mobile-first approach

#### Smart Notifications
- Prevents duplicate notifications
- Different notification thresholds (5min, 30min, 1hr, 24hr)
- Auto-cleanup of old notification records

## 🎨 Styling & Animations

- **Gradient backgrounds** for countdown timer with urgency-based colors
- **Pulse animations** for urgent events
- **Smooth transitions** for all interactive elements
- **Responsive design** that works on desktop and mobile

## 📱 Browser Compatibility

- **Chrome/Edge**: Full support for all features
- **Firefox**: Full support for all features
- **Safari**: Full support (may need user interaction for audio)
- **Mobile browsers**: Responsive design with touch-friendly interface

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
