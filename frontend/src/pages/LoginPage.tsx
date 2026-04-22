import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Pill, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      toast.success('¡Bienvenido de nuevo!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface-100 relative overflow-hidden px-4">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-medical-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg mb-6"
          >
            <Pill className="text-white w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Dr. Memento</h1>
          <p className="text-gray-500 mt-2 font-medium text-center">Seguimiento médico inteligente</p>
        </div>

        <Card className="p-8 shadow-2xl border-white/50 backdrop-blur-xl bg-white/80">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 text-left">Iniciar Sesión</h2>
            <p className="text-gray-500 text-sm mt-1 text-left">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<Mail className="w-5 h-5" />}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<Lock className="w-5 h-5" />}
            />

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full py-4 text-base"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Entrar al Sistema
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-center mt-12 text-gray-400 text-xs font-medium">
          Dr. MEMENTO <span className="mx-1">|</span> Medical System &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
