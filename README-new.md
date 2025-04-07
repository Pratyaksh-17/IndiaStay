# IndiaStay - Hotel Booking Platform

A comprehensive hotel booking platform specialized for the Indian market, offering seamless travel experiences through advanced search and booking capabilities.

## Features

- **Hotel Search & Booking**: Browse and book from a wide selection of hotels across India
- **Travel Packages**: Explore curated travel packages for popular destinations
- **Hotel Comparison**: Compare hotels based on price, amenities, and ratings
- **Special Offers**: Apply discount codes for special deals and savings
- **User Profiles**: Manage bookings and preferences through user accounts
- **Secure Payments**: Multiple payment options for a seamless booking experience

## Technology Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Express.js with Node.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **UI Components**: Tailwind CSS with Shadcn UI
- **State Management**: React Query

## Project Structure

- `/client`: React frontend
- `/server`: Express backend
- `/shared`: Shared schema definitions

## Deployment Instructions

### Local Development

1. Clone the repository
   ```
   git clone https://github.com/Pratyaksh-17/IndiaStay.git
   cd IndiaStay
   ```

2. Install dependencies
   ```
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

### Deploying to Vercel

#### Backend Deployment

1. Create a new project on Vercel
2. Connect to your GitHub repository
3. Configure the project as follows:
   - Root Directory: `server`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Framework Preset: `Node.js`
4. Add the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A secure random string for session encryption
5. Deploy the project

#### Frontend Deployment

1. Create a new project on Vercel
2. Connect to your GitHub repository
3. Configure the project as follows:
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Framework Preset: `Vite`
4. Add the following environment variables:
   - `VITE_API_URL`: The URL of your deployed backend API
5. Deploy the project

## License

This project is licensed under the MIT License.