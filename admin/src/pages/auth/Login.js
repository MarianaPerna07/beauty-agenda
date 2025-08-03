import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './Login.css';

function LoginPage() {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    
    let history = useHistory();
    let location = useLocation();
    let { from } = location.state || { from: { pathname: '/dashboard' } };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (credentials.email && credentials.password) {
            localStorage.setItem('token', 'logged-in');
            history.replace(from);
        } else {
            setError('Por favor, preencha todos os campos.');
        }
    };

    const handleGoogleLogin = () => {
        // Implementação futura de autenticação com Google
        console.log('Login com Google será implementado no futuro');
    };

    return (
        <div className="login-page min-h-screen flex flex-col items-center justify-center bg-[#F5F1E9]">
            {/* Elementos decorativos de fundo */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                {/* Círculos decorativos com cores da marca */}
                <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-[#a5bf99]/8"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-[#c0a080]/8"></div>
                <div className="absolute top-1/4 right-10 w-16 h-16 rounded-full bg-[#5c7160]/5"></div>
                <div className="absolute bottom-10 left-20 w-20 h-20 rounded-full bg-[#5c7160]/5"></div>
            </div>
            
            {/* Logotipo acima do formulário - reduzido */}
            <div className="relative z-10 mb-2">
                <div className="w-16 h-16 flex items-center justify-center">
                    <img 
                        src="/logo-gold.png" 
                        alt="Your Moments" 
                        className="w-full"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='100%25' height='100%25' fill='%23f5f1e9'/%3E%3Ctext x='50%25' y='50%25' font-family='Quicksand, sans-serif' font-weight='300' font-size='24' fill='%23c0a080' text-anchor='middle' dominant-baseline='middle'%3EYM%3C/text%3E%3C/svg%3E";
                        }} 
                    />
                </div>
            </div>
            
            {/* Formulário com visual refinado e mais compacto */}
            <div className="relative z-10 w-full max-w-xs">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    {/* Barra dourada decorativa no topo */}
                    <div className="h-1 bg-gradient-to-r from-[#c0a080]/60 via-[#e9d3a3] to-[#c0a080]/60"></div>
                    
                    <div className="px-5 py-5">
                        {/* Cabeçalho */}
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-light text-[#5c7160]">Your Moments</h2>
                            <p className="text-[#5c7160]/70 mt-0.5 text-sm">Área Administrativa</p>
                        </div>
                        
                        {/* Mensagem de erro */}
                        {error && (
                            <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-lg text-xs flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}
                        
                        {/* Formulário de login */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#5c7160]/80 mb-1">O seu email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#5c7160]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        className="w-full bg-[#F5F1E9] pl-9 pr-3 py-2 text-sm border border-[#5c7160]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a5bf99]/30 focus:border-[#a5bf99] transition-all"
                                        placeholder="Introduza o seu email"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-[#5c7160]/80">Palavra-passe</label>
                                    <a href="#" className="text-xs text-[#c0a080] hover:text-[#e9d3a3] transition-colors">Esqueceu a palavra-passe?</a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#5c7160]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        className="w-full bg-[#F5F1E9] pl-9 pr-3 py-2 text-sm border border-[#5c7160]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a5bf99]/30 focus:border-[#a5bf99] transition-all"
                                        placeholder="Introduza a sua palavra-passe"
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="btn-login w-full py-2 bg-[#5c7160] text-white rounded-lg hover:bg-[#5c7160]/90 transition-all flex items-center justify-center shadow-sm hover:shadow group"
                                >
                                    <span className="font-medium text-sm">Entrar</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="relative flex items-center my-3">
                                <div className="flex-grow border-t border-[#5c7160]/10"></div>
                                <span className="flex-shrink-0 px-3 text-xs text-[#5c7160]/50">ou</span>
                                <div className="flex-grow border-t border-[#5c7160]/10"></div>
                            </div>
                            
                            {/* Google button that matches the reference image */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="google-btn w-full flex items-center justify-center"
                            >
                                <img 
                                    src="https://developers.google.com/identity/images/g-logo.png" 
                                    alt="Google" 
                                    className="w-4 h-4 mr-2"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <span className="text-sm">Sign in with Google</span>
                            </button>
                        </form>
                    </div>
                    
                    {/* Barra decorativa na parte inferior */}
                    <div className="bg-[#5c7160]/5 py-2 px-5 text-center">
                        <p className="text-xs text-[#5c7160]/60">
                            © {new Date().getFullYear()} Your Moments Estética
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Elementos decorativos SVG */}
            <div className="absolute bottom-4 w-full flex justify-center z-0 opacity-30">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#c0a080] to-transparent"></div>
            </div>
        </div>
    );
}

export default LoginPage;
