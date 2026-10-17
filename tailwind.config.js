/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for dark theme (matching requirements)
        'dark-bg': '#0F172A',      // Page background
        'dark-card': '#1E293B',    // Navbar and post cards
        'dark-input': '#334155',   // Inputs and secondary surfaces
        'dark-primary': '#F8FAFC', // Primary text
        'dark-secondary': '#94A3B8', // Secondary text
        'dark-accent': '#3B82F6',  // Primary buttons and links
        'dark-border': '#334155',  // Borders
      }
    }
  },
  plugins: [],
}