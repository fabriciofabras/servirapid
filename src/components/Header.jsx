import { useEffect, useState } from 'react';
import logo_horizontal from "../assets/logo_horizontal.png"

export default function Header() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setHidden(currentScroll > lastScroll && currentScroll > 50);
      lastScroll = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-gray-50 text-white flex transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="w-1/2 p-3 text-center">
      <img style={{ height: "60px" }}  src={logo_horizontal}></img>
      </div>
      <div className="w-1/2 p-3 text-center">Admin</div>
    </header>
  );
}
