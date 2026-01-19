import './globals.css';
import './mocar.css';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';

export const metadata = {
  title: 'MoCar - Self Drive Rentals',
  description: 'Self Drive Cars & Bikes in Sundargarh, Odisha',
  icons: {
    icon: '/assets/images/mo_car_logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <AuthProvider>
          <DataProvider>
            <SiteHeader />
            <main>{children}</main>
            <Footer />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
