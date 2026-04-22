import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pacientesAPI } from '../api/services';
import { Paciente } from '../types';
import { Users, AlertTriangle, UserPlus, ClipboardList, Search, ChevronRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

const PacientesPage: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    pacientesAPI.getAll()
      .then(setPacientes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pacientesFiltrados = pacientes.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-xl">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            Directorio de Pacientes
          </h1>
          <p className="text-gray-500 mt-1 font-medium ml-1">
            Gestiona la información y el historial de tus {pacientes.length} pacientes.
          </p>
        </div>
        <Link to="/pacientes/nuevo">
          <Button leftIcon={<UserPlus className="w-5 h-5" />} className="shadow-lg shadow-primary-100">
            Registrar Paciente
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-grow">
          <Input
            placeholder="Buscar por nombre del paciente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            className="bg-white shadow-sm"
          />
        </div>
        <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />} className="bg-white">
          Filtros
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {pacientesFiltrados.length === 0 ? (
          <Card variant="outline" className="p-20 text-center bg-gray-50/50 border-dashed">
            <div className="p-4 bg-white rounded-full w-fit mx-auto mb-4 shadow-sm">
              <Users className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No se encontraron pacientes</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-2">
              {pacientes.length === 0
                ? 'Comienza registrando a tu primer paciente para gestionar su tratamiento.'
                : 'Intenta ajustar tus criterios de búsqueda para encontrar lo que necesitas.'}
            </p>
            {pacientes.length === 0 && (
              <Link to="/pacientes/nuevo" className="mt-6 block">
                <Button variant="primary">Registrar mi primer paciente</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
             {/* Dynamic List Rendering */}
             {pacientesFiltrados.map((p, idx) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card hover className="p-0 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center p-5 gap-5">
                      <div className="flex items-center gap-4 flex-grow">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-primary-700 font-black text-xl shadow-inner border border-primary-200/50">
                          {p.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">
                            {p.nombre}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-500 font-medium">{p.edad} años</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="text-sm text-gray-500 font-medium">Expediente: #{p._id.slice(-6).toUpperCase()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:max-w-xs justify-end">
                        {p.alergias.length > 0 ? (
                          p.alergias.slice(0, 3).map((a, i) => (
                            <Badge key={i} variant="warning" className="px-3">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {a}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="default" className="bg-gray-50 text-gray-400 border-gray-100">Sin alergias</Badge>
                        )}
                        {p.alergias.length > 3 && (
                          <Badge variant="warning">+{p.alergias.length - 3}</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-4">
                        <Link to={`/historial/${p._id}`}>
                          <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                            Historial
                          </Button>
                        </Link>
                        <Link to={`/prescripciones/nueva?paciente=${p._id}`}>
                          <Button variant="primary" size="sm" className="bg-medical-500 hover:bg-medical-600">
                             Nueva Receta
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PacientesPage;
