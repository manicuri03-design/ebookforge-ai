"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const router = useRouter();
  const { signup, loginWithGoogle, user, isMocked, resendVerificationEmail, confirmMockEmail, login } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  // Verification Screen States
  const [needsVerification, setNeedsVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState("");
  const [isResending, setIsResending] = useState(false);

  // If user is already authenticated, redirect to dashboard automatically
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Handle Resend Cooldown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Form Validations
    if (!formData.name || !formData.email || !formData.password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    
    // Strict Real Email Format Check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Insira um endereço de e-mail corporativo ou pessoal válido (ex: nome@empresa.com).");
      return;
    }

    // Strong Password Validation: min 6 chars, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Senha muito fraca! A senha deve ter no mínimo 6 caracteres, incluir pelo menos uma letra maiúscula, uma letra minúscula e um número.");
      return;
    }

    setIsLoading(true);
    const { error: signupError, needsVerification: shouldVerify } = await signup(
      formData.name, 
      formData.email, 
      formData.password
    );

    if (signupError) {
      setError(signupError);
      setIsLoading(false);
    } else if (shouldVerify) {
      setRegisteredEmail(formData.email);
      setNeedsVerification(true);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);
    
    const { error: googleError } = await loginWithGoogle();
    if (googleError) {
      setError(googleError);
      setIsGoogleLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;
    
    setIsResending(true);
    setResendSuccess("");
    setError("");

    const { error: resendError } = await resendVerificationEmail(registeredEmail);
    
    setIsResending(false);
    if (resendError) {
      setError(resendError);
    } else {
      setResendSuccess("Novo link de confirmação enviado com sucesso!");
      setResendCooldown(60); // 60 seconds cooldown to prevent spam
    }
  };

  const handleSimulateConfirmation = async () => {
    setIsLoading(true);
    setError("");
    
    await confirmMockEmail(registeredEmail);
    
    // Log the user in now that mock email is verified
    const { error: loginError } = await login(registeredEmail, formData.password);
    
    if (loginError) {
      setError(loginError);
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-xl shadow-[0_0_20px_rgba(139,92,246,0.6)] animate-pulse">
            E
          </div>
          <p className="text-xs text-gray-400 font-medium">Redirecionando para o Dashboard seguro...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-[400px] bg-secondary/20 blur-[120px] -z-10 rounded-full"></div>
      
      <div className="w-full max-w-md bg-[#121827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in-up">
        
        {/* Dynamic Card Toggle based on confirmation state */}
        {needsVerification ? (
          
          /* VERIFICATION SCREEN */
          <div className="text-center">
            {/* Glowing Envelope Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-secondary/30 border border-primary/50 rounded-full flex items-center justify-center mx-auto mb-6 relative animate-pulse shadow-[0_0_25px_rgba(139,92,246,0.3)]">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">Confirme seu E-mail</h1>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Enviamos um link de confirmação real para <br />
              <strong className="text-gray-200">{registeredEmail}</strong>.<br />
              Por favor, clique no link contido no e-mail para desbloquear seu painel de criação.
            </p>

            {/* Dynamic Status / Success Info */}
            {resendSuccess && (
              <div className="mb-6 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-xs p-3 rounded-lg flex items-center justify-center gap-2 animate-fade-in">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{resendSuccess}</span>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg flex items-center justify-center gap-2 animate-fade-in">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-4">
              <button
                onClick={handleResendEmail}
                disabled={isResending || resendCooldown > 0}
                className="w-full bg-[#1A1F2C] border border-white/10 hover:bg-[#242B3C] text-white font-medium rounded-lg px-4 py-3 text-sm transition-all shadow-md disabled:opacity-60 flex justify-center items-center gap-2 cursor-pointer"
              >
                {isResending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Reenviando...</span>
                  </>
                ) : resendCooldown > 0 ? (
                  <span>Reenviar em {resendCooldown}s</span>
                ) : (
                  <span>Reenviar E-mail de Confirmação</span>
                )}
              </button>

              {/* simulated confirmation bypass - visible only when mock client is active */}
              {isMocked && (
                <button
                  onClick={handleSimulateConfirmation}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white font-bold rounded-lg px-4 py-3 text-sm transition-all transform hover:-translate-y-0.5 disabled:opacity-60 flex justify-center items-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <span>✨ Simular Confirmação (Dev)</span>
                  )}
                </button>
              )}

              <div className="pt-2">
                <Link
                  href="/login"
                  className="text-xs text-gray-400 hover:text-white transition-colors underline"
                >
                  Ir para a página de Login
                </Link>
              </div>
            </div>

          </div>
        ) : (
          
          /* REGULAR REGISTER SCREEN */
          <>
            {/* Header Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                  E
                </div>
                <span className="text-xl font-bold tracking-tighter text-white">
                  EbookForge <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI</span>
                </span>
              </Link>
              <h1 className="text-2xl font-bold text-white">Crie sua conta</h1>
              <p className="text-gray-400 mt-2">Comece seu teste grátis de 7 dias</p>
            </div>

            {/* Form and Validations */}
            <form onSubmit={handleRegister} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2 animate-fade-in">
                  <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="leading-tight">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Nome completo</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="Seu nome"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">E-mail</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="seu@email.com"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Senha</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="Crie uma senha forte"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
                <span className="block text-[10px] text-gray-500 mt-1.5">Mínimo de 6 caracteres, incluindo maiúscula, minúscula e número.</span>
              </div>

              <button 
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="group relative flex justify-center items-center gap-2 w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg px-4 py-3 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all transform hover:-translate-y-0.5 overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin text-white relative z-10" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="relative z-10">Criando conta...</span>
                  </>
                ) : (
                  <span className="relative z-10">Começar Teste Grátis</span>
                )}
              </button>
            </form>

            {/* Google OAuth Register Button */}
            <div className="space-y-4 mt-6">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase">Ou</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading}
                className="w-full bg-[#1A1F2C] border border-white/10 hover:bg-[#242B3C] text-white font-medium rounded-lg px-4 py-3 transition-colors flex items-center justify-center gap-3 disabled:opacity-60 shadow-lg cursor-pointer"
              >
                {isGoogleLoading ? (
                  <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>Cadastrar com o Google</span>
              </button>
            </div>

            {/* Switch back to Login */}
            <div className="mt-8 text-center text-sm text-gray-400">
              Já tem uma conta? <Link href="/login" className="text-primary hover:text-white transition-colors font-medium">Faça login</Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
