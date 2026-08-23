# NexusFlow - Enterprise Industrial AI Platform

NexusFlow is a professional, production-ready frontend application for intelligent workflow automation and real-time industrial monitoring. Built with modern enterprise standards, it provides a comprehensive suite of tools for managing production systems, machines, and AI-driven workflows.

## 🚀 Features

- **Professional Enterprise UI** - Google/Microsoft-level design system
- **User Authentication** - Secure login with demo credentials
- **Dashboard** - Real-time metrics, system status, and activity feeds
- **Workflow Builder** - Visual workflow designer with React Flow
- **Machine Management** - Monitor production equipment and health metrics
- **Real-time Telemetry** - Live system monitoring and data visualization
- **Alert Management** - Critical alerts and notifications system
- **Asset Inventory** - Comprehensive asset tracking and management
- **Settings & Configuration** - User and workspace preferences
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **@xyflow/react** - Visual workflow builder
- **Zustand** - State management
- **Lucide React** - Icon library
- **CSS** - Modern responsive styling

## 📁 Project Structure

```
NexusFlow/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   ├── layout/          # Layout components
│   │   ├── dashboard/       # Dashboard components
│   │   └── workflow/        # Workflow builder components
│   ├── pages/               # Page components
│   ├── store/               # Zustand stores
│   ├── services/            # API services
│   ├── types/               # TypeScript types
│   ├── styles/              # CSS files
│   ├── config/              # Configuration
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## 🚦 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## 🔐 Authentication

For demo purposes, any email and password combination will work:
- Email: `user@example.com`
- Password: `any-password`

After login, you'll have full access to the dashboard and all features.

## 📋 Available Routes

- `/login` - Login page
- `/dashboard` - Main dashboard
- `/workflow` - Workflow builder
- `/machines` - Machine management
- `/telemetry` - Real-time telemetry
- `/alerts` - Alert management
- `/assets` - Asset inventory
- `/settings` - Settings and preferences

## 🎨 Design System

### Colors
- Primary: `#087ea9`
- Primary Dark: `#07111f`
- Primary Light: `#45d7ff`
- Success: `#18a979`
- Warning: `#e5a72b`
- Danger: `#e04f5f`
- Background: `#f5f7fb`

### Spacing
Uses 8px spacing system throughout the application.

### Typography
Uses system font stack with -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', etc.

## 🔄 State Management

The application uses Zustand for state management with three main stores:

- `authStore` - Authentication state
- `workflowStore` - Workflow builder state
- `uiStore` - UI state (sidebar, notifications, etc.)

## 🌐 Backend Integration

The application is prepared for backend integration. Configure your API endpoints:

1. Create `.env` file:
```
VITE_API_BASE_URL=http://your-api-server:5000/api
VITE_WS_URL=ws://your-api-server:5000/ws
```

2. Update `src/services/api.ts` with actual API calls

## 📦 Components

### Common Components
- `Button` - Reusable button component
- `Modal` - Dialog component
- `Loader` - Loading spinner
- `Badge` - Status badges
- `EmptyState` - Empty state placeholder

### Layout Components
- `Sidebar` - Main navigation
- `Topbar` - Top bar with search and user info
- `PageContainer` - Page wrapper
- `ProtectedLayout` - Layout for authenticated pages

### Dashboard Components
- `MetricCard` - Metric display cards
- `SystemStatus` - System status panel
- `ProductionChart` - Production metrics
- `ActivityFeed` - Activity log
- `AlertSummary` - Alert notifications

### Workflow Components
- `WorkflowCanvas` - Visual canvas
- `NodeLibrary` - Available nodes
- `CustomNode` - Custom node component
- `NodeInspector` - Node properties
- `WorkflowToolbar` - Canvas controls

## 🚀 Performance

- Code splitting with Vite
- Lazy loading of routes
- CSS modules and scoped styling
- Optimized re-renders with Zustand

## 🔒 Security Features

- Protected routes with authentication
- Secure password input
- XSS protection with React
- CORS support ready

## 📱 Responsive Design

The application is fully responsive:
- Desktop: Full sidebar and layout
- Tablet: Compact sidebar
- Mobile: Hamburger menu and optimized layout

## 🎯 Future Enhancements

- Backend API integration
- WebSocket support for real-time updates
- Advanced analytics
- Custom reporting
- Multi-tenant support
- Dark mode
- Internationalization (i18n)

## 📄 License

Professional Enterprise Software - All Rights Reserved

## 🤝 Support

For issues or feature requests, contact your development team.

---

Built with ❤️ using React, TypeScript, and Vite
