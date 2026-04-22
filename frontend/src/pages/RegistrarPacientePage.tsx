import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pacientesAPI } from '../api/services';
import { Plus, X, UserPlus, History, User, Check, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { toast } from 'sonner';

const RegistrarPacientePage: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [alergias, setAlergias] = useState<string[]>([]);
  const [newAlergia, setNewAlergia] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addAlergia = () => {
    if (newAlergia.trim() && !alergias.includes(newAlergia.trim())) {
      setAlergias([...alergias, newAlergia.trim()]);
      setNewAlergia('');
      toast.info(`Alergia "${newAlergia.trim()}" agregada`);
    }
  };

  const removeAlergia = (index: number) => {
    setAlergias(alergias.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent, prescribe: boolean = false) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const nuevoPaciente = await pacientesAPI.crear({ nombre, edad: Number(edad), alergias });
      toast.success('Paciente registrado con éxito');
      
      if (prescribe) {
        navigate(`/prescripciones/nueva?paciente=${nuevoPaciente._id}`);
      } else {
        navigate('/pacientes');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar paciente');
      toast.error('No se pudo completar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-8 h-8 text-primary-600" />
            Nuevo Registro
          </h1>
          <p className="text-gray-500 font-medium">Expediente Clínico de Paciente</p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <Card className="p-8 space-y-6 shadow-2xl border-white/50 backdrop-blur-xl bg-white/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Nombre Completo"
                placeholder="Nombre del paciente"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                leftIcon={<User className="w-5 h-5" />}
              />
            </div>
            <div>
              <Input
                label="Edad"
                type="number"
                placeholder="30"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                required
                min={0}
                max={150}
                leftIcon={<History className="w-5 h-5" />}
              />
            </div>
          </div>

          <div className="space-y-3">
             <label className="block text-sm font-semibold text-gray-700 ml-1">
                Alergias Conocidas
             </label>
             <div className="flex gap-2">
                <Input
                  placeholder="Ej: Penicilina, Nueces..."
                  value={newAlergia}
                  onChange={(e) => setNewAlergia(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAlergia())}
                  className="bg-gray-50/50"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addAlergia}
                  className="px-4"
                >
                  <Plus className="w-5 h-5" />
                </Button>
             </div>
             
             <div className="min-h-[48px] p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <AnimatePresence>
                  {alergias.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {alergias.map((a, i) => (
                        <motion.div
                          key={`${a}-${i}`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                        >
                          <Badge variant="warning" className="py-1.5 px-3 flex items-center gap-2">
                            {a}
                            <button 
                              type="button" 
                              onClick={() => removeAlergia(i)}
                              className="hover:text-red-900 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm text-center italic">No se han registrado alergias para este paciente.</p>
                  )}
                </AnimatePresence>
             </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              variant="outline"
              className="flex-1"
              isLoading={loading}
              leftIcon={<Check className="w-5 h-5" />}
            >
              Solo Registrar
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="flex-1 shadow-lg shadow-primary-200 bg-medical-500 hover:bg-medical-600"
              isLoading={loading}
              leftIcon={<Pill className="w-5 h-5" />}
            >
              Registrar y Recetar
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default RegistrarPacientePage;
