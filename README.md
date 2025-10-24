# UniSeat Frontend

A modern React application for the UniSeat University Examination Seat Generator system.

## Features

- **Dashboard**: Overview of system statistics and quick actions
- **Block Management**: Create and manage building blocks
- **Floor Management**: Organize floors within blocks
- **Classroom Management**: Configure classrooms with capacity and layout types
- **Student Management**: Upload and manage student records via CSV
- **Exam Management**: Create and schedule examinations
- **Seat Plan Generation**: Generate optimized seat assignments
- **Visualization**: Interactive 2D seat map with hover details
- **Export Options**: PDF and CSV export functionality
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Setup and Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm start` - Alias for dev command

## Technology Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **jsPDF** - PDF generation
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── api.js              # API client configuration
│   ├── components/
│   │   ├── Layout.jsx           # Main layout with sidebar
│   │   ├── BlockForm.jsx        # Block creation/edit form
│   │   ├── FloorForm.jsx        # Floor creation/edit form
│   │   ├── ClassroomForm.jsx    # Classroom creation/edit form
│   │   ├── StudentUpload.jsx   # CSV upload component
│   │   └── SeatMap2D.jsx       # Interactive seat map
│   ├── pages/
│   │   ├── Login.jsx            # Authentication page
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── Blocks.jsx           # Block management
│   │   ├── Floors.jsx           # Floor management
│   │   ├── Classrooms.jsx       # Classroom management
│   │   ├── Students.jsx          # Student management
│   │   ├── Exams.jsx            # Exam management
│   │   └── Visualization.jsx    # Seat plan visualization
│   ├── utils/
│   │   ├── helpers.js           # Utility functions
│   │   └── seatRenderer.js     # Seat rendering utilities
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # App entry point
│   └── index.css                # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Authentication

The application uses JWT-based authentication. Users can log in with:

- **Admin**: `admin@uniseat.local` / `Admin@123`
- **Faculty**: `faculty@uniseat.local` / `Faculty@123`

## Key Features

### Dashboard
- System statistics overview
- Quick action buttons
- Recent activity display

### Seat Plan Generation
- Deterministic algorithm to avoid same-branch adjacency
- Round-robin distribution across branch groups
- Local optimization for seat assignments

### Visualization
- Interactive 2D seat maps
- Hover tooltips with student information
- Classroom statistics
- Export functionality (PDF/CSV)

### Responsive Design
- Mobile-first approach
- Collapsible sidebar navigation
- Touch-friendly interface

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`. All API calls are handled through the centralized API client in `src/api/api.js`.

## Styling

The application uses Tailwind CSS with custom configuration:
- Primary color scheme (blue)
- Secondary color scheme (gray)
- Custom component classes
- Responsive utilities

## Development

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/Layout.jsx`

### Adding New Components
1. Create component in `src/components/`
2. Export from component file
3. Import and use in parent components

### API Integration
1. Add new API methods in `src/api/api.js`
2. Use in components with proper error handling
3. Update loading states and user feedback

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure backend is running on port 5000
   - Check CORS configuration
   - Verify API endpoints

2. **Authentication Issues**
   - Check JWT token in localStorage
   - Verify token expiration
   - Clear localStorage if needed

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check for TypeScript errors
   - Verify all imports

4. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check PostCSS configuration
   - Verify CSS imports

## Demo Walkthrough

1. Start the backend server (`npm run dev` in backend directory)
2. Start the frontend server (`npm run dev` in frontend directory)
3. Open `http://localhost:5173`
4. Login with admin credentials
5. Navigate through different sections:
   - View dashboard statistics
   - Create blocks and classrooms
   - Upload student data
   - Create an exam
   - Generate seat plan
   - View visualization
   - Export seat plan

## Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Implement proper error handling
4. Add loading states for async operations
5. Maintain responsive design
6. Write clean, commented code
