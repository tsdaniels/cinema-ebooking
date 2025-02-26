## Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Git

## Installation

1. Clone the project and switch to it:
```bash
git clone https://github.com/tsdaniels/cinema-ebooking.git
cd cinema-ebooking
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start the development server:
```bash
npm run dev
```

5. Add an .env file to the root of the directory
'''bash
touch .env
'''

6. Fill in required fields with your own
'''
MONGODB_URI="mongodb+srv://yourlinkhere"
JWT_SECRET="your-password"
EMAIL_ADDRESS="your-gmail@gmail.com"
EMAIL_PASSWORD="your-gmail-app-password"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
'''

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development Notes
- The development server supports hot-reloading - your changes will appear automatically in the browser
- The application runs on port 3000 by default. If this port is in use, the server will automatically try the next available port

## Troubleshooting
If you encounter any issues:
1. Make sure all prerequisites are installed correctly
2. Try removing the `node_modules` folder and running `npm install` again
3. Clear your browser cache
4. Check that your Node.js version is compatible
``
