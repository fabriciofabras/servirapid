import { useEffect, useState } from 'react';

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
      className={`fixed top-0 left-0 w-full bg-gray-800 text-white flex transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="w-1/2 p-3 text-center">LOGO</div>
      <div className="w-1/2 p-3 text-center">Admin</div>
    </header>
  );
}
