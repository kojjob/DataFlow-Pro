# DataFlow Pro - Development Branch

## Development Workflow

This is the development branch for the DataFlow Pro frontend application. All new features should be developed here before merging to main.

### Branch Structure
- `main` - Production-ready code
- `dev` - Development branch for new features
- `feature/*` - Feature branches (created from dev)

### Development Setup

```bash
# Switch to dev branch
git checkout dev

# Create a new feature branch
git checkout -b feature/your-feature-name

# Install dependencies
npm install

# Start development server
npm start
```

### Current Features in Dev
- ✅ Performance Metrics Dashboard with real-time updates
- ✅ Interactive chart components with Chart.js
- ✅ Responsive Material-UI design
- ✅ Professional styling and animations

### Development Guidelines
1. Always create feature branches from `dev`
2. Test thoroughly before merging
3. Follow existing code patterns and conventions
4. Update documentation as needed

### Available Scripts
- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Current Development Server
The app is currently running on: http://localhost:3003