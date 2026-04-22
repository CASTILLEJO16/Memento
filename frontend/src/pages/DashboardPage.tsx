import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { pacientesAPI, prescripcionesAPI } from '../api/services';
import { Paciente, Prescripcion } from '../types';
import { ClipboardList, Users, Pill, Clock, AlertTriangle, Activity, UserPlus, RefreshCw, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import PrescriptionItem from '../components/medical/PrescriptionItem';

const DashboardPage: React.FC = () => {
  const { usuario, perfil } = useAuth();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [prescripcionesRecientes, setPrescripcionesRecientes] = useState<Prescripcion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (usuario?.rol === 'medico') {
          const pacs = await pacientesAPI.getAll();
          setPacientes(pacs);
        }
        if (usuario?.rol === 'paciente' && perfil && '_id' in perfil) {
          const activas = await prescripcionesAPI.getActivas(perfil._id);
          setPrescripcionesRecientes(activas);
        }
      } catch (err) {
        console.error('Error cargando dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [usuario, perfil]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const isMedico = usuario?.rol === 'medico';
  const isPaciente = usuario?.rol === 'paciente';
  const nombreUsuario = perfil && 'nombre' in perfil ? (perfil as any).nombre : 'Usuario';

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            {isMedico ? 'Panel de Control' : 'Mi Bienestar'}
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            ¡Hola, <span className="text-primary-600 font-bold">{nombreUsuario}</span>! Este es el estado de hoy.
          </p>
        </div>
        {isMedico && (
          <div className="flex gap-3">
            <Link to="/pacientes/nuevo">
              <Button leftIcon={<UserPlus className="w-5 h-5" />}>
                Registrar Paciente
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isMedico && (
          <>
            <Link to="/pacientes" className="block outline-none">
              <Card hover className="bg-primary-500 text-white border-none relative overflow-hidden group">
                <div className="absolute right-0 top-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-primary-100 font-medium">Pacientes Totales</p>
                    <p className="text-4xl font-black">{pacientes.length}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center text-primary-100 text-sm font-bold group-hover:translate-x-2 transition-transform">
                  Ver lista completa <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </Link>

            <Link to="/prescripciones/nueva" className="block outline-none">
              <Card hover className="bg-white group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-medical-50 rounded-2xl group-hover:bg-medical-100 transition-colors">
                    <ClipboardList className="w-6 h-6 text-medical-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Nueva Gestión</p>
                    <h3 className="text-xl font-bold text-gray-900">Prescripción</h3>
                  </div>
                </div>
                <p className="mt-4 text-gray-500 text-sm">
                  Crea una nueva orden médica para tus pacientes rápidamente.
                </p>
              </Card>
            </Link>

            <Link to="/prescripciones/alergia" className="block outline-none">
              <Card hover className="bg-white group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 rounded-2xl group-hover:bg-amber-100 transition-colors">
                    <RefreshCw className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Ajuste Clínico</p>
                    <h3 className="text-xl font-bold text-gray-900">Cambiar Receta</h3>
                  </div>
                </div>
                <p className="mt-4 text-gray-500 text-sm">
                  Modifica tratamientos basándote en la evolución del paciente.
                </p>
              </Card>
            </Link>
          </>
        )}

        {isPaciente && (
          <>
            <Card className="bg-medical-500 text-white border-none overflow-hidden relative group">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-medical-100 font-medium text-sm">Tratamientos Activos</p>
                  <p className="text-4xl font-black">{prescripcionesRecientes.length}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-2xl">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Alergias Detectadas</p>
                  <p className="text-2xl font-black text-gray-900">
                    {perfil && 'alergias' in perfil ? (perfil as Paciente).alergias.length : 0}
                  </p>
                </div>
              </div>
            </Card>

            <Link to="/historial" className="block outline-none">
              <Card hover className="bg-white group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-50 rounded-2xl group-hover:bg-primary-100 transition-colors">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Consulta Médica</p>
                    <h3 className="text-xl font-bold text-gray-900">Mi Historial</h3>
                  </div>
                </div>
                <p className="mt-4 text-gray-500 text-sm">
                  Revisa todas tus prescripciones y evoluciones pasadas.
                </p>
              </Card>
            </Link>
          </>
        )}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Treatments or Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary-600" />
              {isMedico ? 'Actividad Reciente' : 'Mis Medicamentos Actuales'}
            </h2>
            {isPaciente && (
               <Link to="/historial" className="text-sm font-bold text-primary-600 hover:underline">
                Ver historial
               </Link>
            )}
          </div>

          <div className="space-y-4">
            {prescripcionesRecientes.length > 0 ? (
              prescripcionesRecientes.map((p, idx) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <PrescriptionItem prescription={p} />
                </motion.div>
              ))
            ) : (
              <Card variant="outline" className="p-12 text-center bg-gray-50/50 border-dashed">
                <div className="p-4 bg-white rounded-full w-fit mx-auto mb-4 shadow-sm">
                  <Pill className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No hay tratamientos activos en este momento.</p>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Actions or Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2 px-1">
            <Activity className="w-5 h-5 text-medical-600" />
            Acciones Especializadas
          </h2>
          <Card className="bg-gradient-to-br from-primary-50 to-white border-primary-100">
            <h3 className="font-bold text-primary-900 mb-2">Consejo Médico del día</h3>
            <p className="text-primary-800/80 text-sm leading-relaxed">
              Recuerde siempre seguir las indicaciones de dosificación exacta y no suspender los tratamientos sin consultar a su especialista. El seguimiento constante es la clave de su recuperación.
            </p>
            <div className="mt-6 p-4 bg-white/60 rounded-xl border border-primary-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <p className="text-sm font-bold text-primary-900 text-left">Asistente Dr. Memento</p>
                  <p className="text-xs text-primary-600 text-left">Central de Conocimiento</p>
                </div>
              </div>
            </div>
          </Card>
          
          {isMedico && (
             <div className="grid grid-cols-1 gap-3">
               <Link to="/pacientes/nuevo" className="w-full">
                 <Button variant="outline" className="w-full justify-start py-4" leftIcon={<UserPlus className="w-5 h-5" />}>
                   Agregar nuevo expediente
                 </Button>
               </Link>
               <Link to="/pacientes" className="w-full">
                 <Button variant="outline" className="w-full justify-start py-4" leftIcon={<Users className="w-5 h-5" />}>
                   Directorio de pacientes
                 </Button>
               </Link>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
