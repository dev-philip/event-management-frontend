import HeaderComponent from '@/app/components/header/HeaderComponent';
import { Outlet } from 'react-router-dom';
import FooterComponent from './components/footer/FooterComponent';

export default function Layout() {
  return (
    <div>
      <HeaderComponent />
      <main>
        <Outlet /> {/* renders nested route content */}
      </main>
      <FooterComponent />
    </div>
  );
}
