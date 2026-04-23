import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pacientesAPI, prescripcionesAPI } from '../api/services';
import { Paciente, HorarioTipo, ViaAdministracion, CrearPrescripcionData } from '../types';
import { Pill, AlertTriangle, User, Activity, Clock, History, ChevronLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { toast } from 'sonner';
import MedicineInput from '../components/ui/MedicineInput';
import DoseInput from '../components/ui/DoseInput';
import { MedicineSugerencia } from '../constants/medicalData';

const HORARIOS: HorarioTipo[] = [6, 8, 12, 24];
const VIAS: { value: ViaAdministracion; label: string }[] = [
  { value: 'oral', label: 'Oral' },
  { value: 'intravenosa', label: 'Intravenosa' },
  { value: 'intramuscular', label: 'Intramuscular' },
  { value: 'subcutanea', label: 'Subcutánea' },
  { value: 'topica', label: 'Tópica' },
  { value: 'inhalatoria', label: 'Inhalatoria' },
  { value: 'sublingual', label: 'Sublingual' },
  { value: 'rectal', label: 'Rectal' },
];

const NuevaPrescripcionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pacienteIdQuery = searchParams.get('paciente');
  
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // UI Local states for dose splitting
  const [doseAmount, setDoseAmount] = useState('');
  const [doseUnit, setDoseUnit] = useState('mg');

  const [form, setForm] = useState<CrearPrescripcionData>({
    medicamento: '',
    horario: 8,
    tiempoTratamiento: 7,
    dosis: '',
    viaAdministracion: 'oral',
    pacienteId: pacienteIdQuery || '',
    prescripcionAnteriorId: null,
    motivoCambio: null,
    indicaciones: '',
  });

  useEffect(() => {
    pacientesAPI.getAll().then(setPacientes).catch(console.error);
  }, []);

  // Sync amount/unit to form.dosis
  useEffect(() => {
    setForm(prev => ({ ...prev, dosis: `${doseAmount} ${doseUnit}`.trim() }));
  }, [doseAmount, doseUnit]);

  const handleChange = (field: keyof CrearPrescripcionData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMedicineSelect = (suggestion: MedicineSugerencia) => {
    setForm(prev => ({
      ...prev,
      medicamento: suggestion.nombre,
      horario: suggestion.frecuenciaSugerida as HorarioTipo || prev.horario
    }));
    setDoseAmount(suggestion.dosisTípica);
    setDoseUnit(suggestion.unidad);
    toast.info(`Datos sugeridos aplicados para ${suggestion.nombre}`, {
      icon: <Check className="w-4 h-4 text-medical-500" />
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doseAmount) {
      toast.error('Por favor indique la cantidad de la dosis');
      return;
    }

    setError('');
    setLoading(true);

    // Validación de alergias
    const paciente = pacientes.find(p => p._id === form.pacienteId);
    const tieneAlergia = paciente?.alergias.some(a => 
      form.medicamento.toLowerCase().includes(a.toLowerCase()) || 
      a.toLowerCase().includes(form.medicamento.toLowerCase())
    );

    if (tieneAlergia) {
       toast.warning('¡Atención! El medicamento podría entrar en conflicto con las alergias del paciente.');
    }

    try {
      await prescripcionesAPI.crear(form);
      toast.success('Prescripción creada exitosamente');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear prescripción');
      toast.error('No se pudo guardar la prescripción');
    } finally {
      setLoading(false);
    }
  };

  const selectedPaciente = pacientes.find((p) => p._id === form.pacienteId);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <Pill className="w-8 h-8 text-primary-500" />
            Nueva Prescripción
          </h1>
          <p className="text-gray-500 font-medium">Establecer nuevo tratamiento médico</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-8 space-y-8 shadow-2xl border-white/50 backdrop-blur-xl bg-white/80">
          {/* Selección de Paciente */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 ml-1">Paciente</label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
              <select
                value={form.pacienteId}
                onChange={(e) => handleChange('pacienteId', e.target.value)}
                className="input-field pl-11"
                required
              >
                <option value="">Seleccionar paciente...</option>
                {pacientes.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.nombre} ({p.edad} años)
                  </option>
                ))}
              </select>
            </div>
            
            <AnimatePresence>
              {selectedPaciente && selectedPaciente.alergias.length > 0 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-amber-50 rounded-2xl p-4 border border-amber-200"
                >
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    Alergias del Paciente
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPaciente.alergias.map((a, i) => (
                      <Badge key={i} variant="warning" className="bg-white/50">{a}</Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <hr className="border-gray-100" />

          {/* Datos del Medicamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <MedicineInput
                value={form.medicamento}
                onChange={(val) => handleChange('medicamento', val)}
                onSuggestionSelect={handleMedicineSelect}
                required
              />
            </div>

            <DoseInput
              amount={doseAmount}
              unit={doseUnit}
              onAmountChange={setDoseAmount}
              onUnitChange={setDoseUnit}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Vía de Administración</label>
              <select
                value={form.viaAdministracion}
                onChange={(e) => handleChange('viaAdministracion', e.target.value)}
                className="input-field"
                required
              >
                {VIAS.map((v) => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Configuración de Horario y Tiempo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-500" />
                Frecuencia (Cada cuántas horas)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {HORARIOS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleChange('horario', h)}
                    className={`h-12 rounded-xl text-sm font-bold transition-all ${
                      form.horario === h
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 relative">
              <label className="block text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                 <History className="w-4 h-4 text-primary-500" />
                 Duración
              </label>
              <div className="relative group">
                <input
                  type="number"
                  placeholder="Días"
                  value={form.tiempoTratamiento}
                  onChange={(e) => handleChange('tiempoTratamiento', Number(e.target.value))}
                  className="input-field pr-12"
                  required
                  min={1}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Días</span>
              </div>
            </div>
          </div>

          {/* Indicaciones Especiales */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 ml-1">Indicaciones Especiales (Opcional)</label>
            <textarea
              value={form.indicaciones || ''}
              onChange={(e) => handleChange('indicaciones', e.target.value)}
              className="input-field min-h-[80px] py-3"
              placeholder="Ej: Tomar después de los alimentos, evitar lácteos..."
            />
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

          <div className="flex gap-4 pt-4">
             <Button variant="ghost" className="flex-1" onClick={() => navigate(-1)}>
                Descartar
             </Button>
             <Button 
                type="submit" 
                className="flex-1 shadow-xl shadow-primary-200" 
                isLoading={loading}
                disabled={!form.pacienteId || !form.medicamento}
                leftIcon={<Pill className="w-5 h-5" />}
             >
                Emitir Prescripción
             </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default NuevaPrescripcionPage;
