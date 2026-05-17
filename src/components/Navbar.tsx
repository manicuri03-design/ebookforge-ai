"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  // Programmatic navigation for mobile to bypass tap delay and ensure instant response
  const handleMobileNavigation = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    // Perform navigation immediately
    router.push(href);
  };

  const handleMobileLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0B0F19]/80 backdrop-blur-md border-b border-white/10 transition-all">
      {/* Main Header Container (z-50 to stay above the backdrop) */}
      <div className="relative z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#0B0F19]/80 backdrop-blur-md">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              E
            </div>
            <Link href="/" className="text-xl font-bold tracking-tighter text-white">
              EbookForge <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/#features" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">Recursos</Link>
              <Link href="/#how-it-works" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">Como Funciona</Link>
              <Link href="/#testimonials" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">Depoimentos</Link>
              <Link href="/#faq" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">FAQ</Link>
            </div>
          </div>

          {/* Desktop CTA Buttons based on Auth State */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-xs text-gray-400 font-medium max-w-[120px] truncate" title={user.email}>
                  Olá, {user.user_metadata?.name?.split(" ")[0] || user.email.split("@")[0]}
                </span>
                <Link href="/dashboard" className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:scale-105 transition-all px-4 py-2 rounded-lg text-sm font-semibold">
                  Dashboard
                </Link>
                <button 
                  onClick={async () => { await logout(); router.push("/"); }}
                  className="text-xs font-semibold text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Entrar
                </Link>
                <Link href="/register" className="bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-all px-4 py-2 rounded-lg text-sm font-semibold shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  Teste Grátis
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2 cursor-pointer z-50"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden fixed top-16 left-0 w-full overflow-hidden transition-all duration-300 ease-in-out z-50 ${isMobileMenuOpen ? "max-h-[450px] border-b border-white/10 opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"}`}>
        <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3 bg-[#0B0F19]/95 backdrop-blur-xl shadow-2xl">
          <Link href="/#features" onClick={(e) => handleMobileNavigation(e, "/#features")} className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium transition-colors">Recursos</Link>
          <Link href="/#how-it-works" onClick={(e) => handleMobileNavigation(e, "/#how-it-works")} className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium transition-colors">Como Funciona</Link>
          <Link href="/#testimonials" onClick={(e) => handleMobileNavigation(e, "/#testimonials")} className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium transition-colors">Depoimentos</Link>
          <Link href="/#faq" onClick={(e) => handleMobileNavigation(e, "/#faq")} className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium transition-colors">FAQ</Link>
          
          <div className="pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <div className="text-center text-xs text-gray-400 font-medium py-1">
                  Logado como {user.email}
                </div>
                <button 
                  onClick={(e) => handleMobileNavigation(e, "/dashboard")}
                  className="text-center bg-gradient-to-r from-primary to-secondary text-white px-4 py-3 rounded-lg text-base font-semibold block w-full cursor-pointer"
                >
                  Ir para o Dashboard
                </button>
                <button 
                  onClick={handleMobileLogout}
                  className="text-center text-base font-medium text-gray-400 hover:text-red-400 border border-white/10 py-3 rounded-lg block w-full cursor-pointer"
                >
                  Sair da Conta
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={(e) => handleMobileNavigation(e, "/login")} className="text-center text-base font-medium text-gray-300 hover:text-white transition-colors border border-white/10 py-3 rounded-lg block">
                  Entrar
                </Link>
                <Link href="/register" onClick={(e) => handleMobileNavigation(e, "/register")} className="text-center bg-white text-gray-900 hover:bg-gray-100 transition-colors px-4 py-3 rounded-lg text-base font-semibold shadow-[0_0_15px_rgba(255,255,255,0.2)] block">
                  Teste Grátis
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
