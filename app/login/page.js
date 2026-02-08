'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginButtonPosition, setLoginButtonPosition] = useState({ x: 0, y: 0 });
  const [registerButtonPosition, setRegisterButtonPosition] = useState({ x: 0, y: 0 });
  const [canClickLogin, setCanClickLogin] = useState(false);
  const [canClickRegister, setCanClickRegister] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Validate login credentials
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!loginData.email || !loginData.password) {
      setCanClickLogin(false);
      return setMessage('Fill in your credentials!');
    }

    if (!emailRegex.test(loginData.email)) {
      setCanClickLogin(false);
      return setMessage('Please enter a valid email (user@domain.com) for example: johndoe@email.com');
    }

    setCanClickLogin(true);
    setLoginButtonPosition({ x: 0, y: 0 });
    setMessage('');
  }, [loginData]);

  // Validate register credentials
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerData.name || !registerData.email || !registerData.password) {
      setCanClickRegister(false);
      return setMessage('Fill in all fields!');
    }

    if (!emailRegex.test(registerData.email)) {
      setCanClickRegister(false);
      return setMessage('Please enter a valid email (user@domain.com) for example: johndoe@email.com');
    }

    setCanClickRegister(true);
    setRegisterButtonPosition({ x: 0, y: 0 });
    setMessage('');
  }, [registerData]);

  const getRandomPosition = () => {
    const offsetX = Math.random() * 500 - 250; // Range: -250 to 250
    const offsetY = Math.random() * 400 - 200; // Range: -200 to 200
    return { x: offsetX, y: offsetY };
  };

  const handleLoginButtonHover = () => {
    if (!canClickLogin) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const newPos = getRandomPosition();
      setLoginButtonPosition(newPos);
      if (!loginData.email || !loginData.password) {
        setMessage('Fill in your credentials!');
      } else if (!emailRegex.test(loginData.email)) {
        setMessage('Please enter a valid email (user@domain.com)');
      } else {
        setMessage('Fill in your credentials!');
      }
    }
  };

  const handleRegisterButtonHover = () => {
    if (!canClickRegister) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const newPos = getRandomPosition();
      setRegisterButtonPosition(newPos);
      if (!registerData.name || !registerData.email || !registerData.password) {
        setMessage('Fill in all fields!');
      } else if (!emailRegex.test(registerData.email)) {
        setMessage('Please enter a valid email (user@domain.com)');
      } else {
        setMessage('Fill in all fields!');
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!canClickLogin) {
      setMessage('Fill in your credentials!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!canClickRegister) {
      setMessage('Fill in all fields!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl"
        />
      </div>

      {/* Auth Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
        style={{ perspective: '1500px' }}
      >
        {/* Flip Container */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 80, damping: 15 }}
          style={{ 
            transformStyle: 'preserve-3d',
            position: 'relative',
          }}
          className="relative w-full min-h-[600px]"
        >
          {/* Login Side */}
          <motion.div
            animate={{ opacity: isFlipped ? 0 : 1 }}
            transition={{ duration: 0.3, delay: isFlipped ? 0 : 0.4 }}
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              position: 'absolute',
              width: '100%',
              top: 0,
              left: 0,
            }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            <div className="text-center mb-8">
              <motion.h1
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-white mb-2"
              >
                Welcome Back
              </motion.h1>
              <p className="text-white/70">Sign in to your library account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {message && !canClickLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-500/20 border border-yellow-500/50 text-white p-3 rounded-lg text-sm text-center"
                >
                  {message}
                </motion.div>
              )}

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="relative h-28 flex items-center justify-center">
                <motion.button
                  onMouseEnter={handleLoginButtonHover}
                  animate={{
                    x: loginButtonPosition.x,
                    y: loginButtonPosition.y,
                  }}
                  transition={{
                    type: canClickLogin ? 'spring' : 'tween',
                    stiffness: 300,
                    damping: 20,
                    duration: 0.15,
                  }}
                  whileHover={canClickLogin ? { scale: 1.05 } : {}}
                  whileTap={canClickLogin ? { scale: 0.95 } : {}}
                  type="submit"
                  disabled={loading}
                  className="absolute bg-white text-purple-600 font-bold px-8 py-3 rounded-xl hover:bg-white/90 transition-colors shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </motion.button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => setIsFlipped(true)}
                  className="text-white font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </motion.div>

          {/* Register Side */}
          <motion.div
            animate={{ opacity: isFlipped ? 1 : 0 }}
            transition={{ duration: 0.3, delay: isFlipped ? 0.4 : 0 }}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              position: 'absolute',
              width: '100%',
              top: 0,
              left: 0,
            }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            <div className="text-center mb-8">
              <motion.h1
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-white mb-2"
              >
                Create Account
              </motion.h1>
              <p className="text-white/70">Join our library community</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {message && !canClickRegister && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-500/20 border border-yellow-500/50 text-white p-3 rounded-lg text-sm text-center"
                >
                  {message}
                </motion.div>
              )}

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="relative h-28 flex items-center justify-center">
                <motion.button
                  onMouseEnter={handleRegisterButtonHover}
                  animate={{
                    x: registerButtonPosition.x,
                    y: registerButtonPosition.y,
                  }}
                  transition={{
                    type: canClickRegister ? 'spring' : 'tween',
                    stiffness: 300,
                    damping: 20,
                    duration: 0.15,
                  }}
                  whileHover={canClickRegister ? { scale: 1.05 } : {}}
                  whileTap={canClickRegister ? { scale: 0.95 } : {}}
                  type="submit"
                  disabled={loading}
                  className="absolute bg-white text-purple-600 font-bold px-8 py-3 rounded-xl hover:bg-white/90 transition-colors shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </motion.button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => setIsFlipped(false)}
                  className="text-white font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
