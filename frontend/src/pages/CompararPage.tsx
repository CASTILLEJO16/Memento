import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { prescripcionesAPI } from '../api/services';
import { ComparacionResponse, Diferencia } from '../types';
import { GitCompareArrows, ArrowRight, CheckCircle2, XCircle, ChevronLeft, Calendar, Info, Pill, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const CompararPage: React.FC = () => {
  const { id1, id2 } = useParams<{ id1: string; id2: string }>();
  const navigate = useNavigate();
  const [comparacion, setComparacion] = useState<ComparacionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id1 && id2) {
      prescripcionesAPI
        .comparar(id1, id2)
        .then(setComparacion)
        .catch((err) => setError('Error al comparar prescripciones'))
        .finally(() => setLoading(false));
    }
  }, [id1, id2]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !comparacion) {
    return (
      <Card variant="outline" className="bg-red-50 border-red-100 p-8 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 shadow-sm">
           <XCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-red-900">Error de Comparación</h3>
        <p className="text-red-700 mt-1">{error || 'No se pudieron cargar los datos de comparación'}</p>
        <Button variant="outline" className="mt-6" onClick={() => navigate(-1)}>Volver al historial</Button>
      </Card>
    );
  }

  const campoLabels: Record<string, string> = {
    medicamento: 'Medicamento',
    horario: 'Horario',
    tiempoTratamiento: 'Duración',
    dosis: 'Dosis',
    viaAdministracion: 'Vía de administración',
    activa: 'Estado',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
             <GitCompareArrows className="w-8 h-8 text-primary-600" />
             Evolución Médica
          </h1>
          <p className="text-gray-500 font-medium">Comparativa detallada entre estados de tratamiento</p>
        </div>
      </div>

      {/* Motivo del cambio */}
      {comparacion.motivoCambio && (
        <Card className="bg-amber-50 border-amber-200 p-6 flex gap-4 items-start shadow-xl">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
             <Info className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-black text-amber-900 text-sm uppercase tracking-wider mb-1">Contexto del Cambio</h4>
            <p className="text-amber-800 font-medium italic">"{comparacion.motivoCambio}"</p>
          </div>
        </Card>
      )}

      {/* Resultado Principal */}
      {comparacion.sonIguales ? (
        <Card className="p-12 text-center bg-medical-50 border-medical-100 shadow-2xl">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-medical-500 shadow-premium">
             <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-medical-900">Sin cambios detectados</h2>
          <p className="text-medical-700 max-w-sm mx-auto mt-2 font-medium">
             Ambos registros médicos son idénticos en todas sus especificaciones clínicas.
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
           {/* Diff visualization */}
           <Card className="p-0 overflow-hidden shadow-2xl border-white/50">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h2 className="font-black text-gray-900 flex items-center gap-2">
                   <Activity className="w-5 h-5 text-primary-500" />
                   Ajustes Realizados
                </h2>
                <Badge variant="info">
                   {comparacion.diferencias.length} cambios aplicados
                </Badge>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                   <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                         <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-1/4">Especificación</th>
                         <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-1/3">Configuración Anterior</th>
                         <th className="px-0 py-4 text-center w-8"></th>
                         <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-1/3">Nueva Configuración</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {comparacion.diferencias.map((diff: Diferencia, i: number) => (
                         <motion.tr 
                           key={i} 
                           initial={{ opacity: 0, y: 5 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: i * 0.1 }}
                           className="group hover:bg-surface-50/50"
                         >
                            <td className="px-8 py-5">
                               <span className="font-bold text-gray-800 text-sm">{campoLabels[diff.campo] || diff.campo}</span>
                            </td>
                            <td className="px-8 py-5">
                               <div className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl inline-block">
                                  <span className="text-red-700 text-sm font-bold opacity-60 line-through mr-2">
                                     {String(diff.anterior)}
                                  </span>
                                  <span className="text-red-800 text-sm font-black">
                                     {String(diff.anterior)}
                                  </span>
                               </div>
                            </td>
                            <td className="px-0 py-5 text-center">
                               <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-colors" />
                            </td>
                            <td className="px-8 py-5">
                               <div className="bg-medical-50 border border-medical-100 px-3 py-1.5 rounded-xl inline-block shadow-sm">
                                  <span className="text-medical-800 text-sm font-black italic">
                                     {String(diff.nuevo)}
                                  </span>
                               </div>
                            </td>
                         </motion.tr>
                      ))}
                   </tbody>
                </table>
              </div>
           </Card>

           {/* Side by side overview */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Origen", type: "Anterior", data: comparacion.prescripcionAnterior, color: "red" },
                { title: "Destino", type: "Nueva", data: comparacion.prescripcionNueva, color: "medical" }
              ].map((view, idx) => (
                <Card key={idx} className={`p-6 border-${view.color}-100 shadow-xl overflow-hidden relative`}>
                   <div className={`absolute top-0 right-0 p-3 bg-${view.color}-50 text-${view.color}-600 rounded-bl-2xl text-[10px] font-black uppercase tracking-tighter`}>
                      Snapshot {view.type}
                   </div>
                   
                   <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-2xl bg-${view.color}-50 flex items-center justify-center text-${view.color}-600 shadow-inner`}>
                         <Pill className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="font-black text-gray-900">{view.data.medicamento}</h3>
                         <p className="text-xs text-gray-500 font-medium">Registrado el {new Date(view.data.fechaCreacion).toLocaleDateString()}</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                               <Activity className="w-3 h-3" /> Dosis
                            </p>
                            <p className="text-sm font-bold text-gray-700">{view.data.dosis}</p>
                         </div>
                         <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                               <Clock className="w-3 h-3" /> Frecuencia
                            </p>
                            <p className="text-sm font-bold text-gray-700">Cada {view.data.horario}h</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 px-4">
                         <span className="text-[10px] font-black text-gray-400 uppercase">Vía / Duración</span>
                         <div className="flex items-center gap-3">
                            <Badge variant="default" className="bg-white">{view.data.viaAdministracion}</Badge>
                            <Badge variant="default" className="bg-white">{view.data.tiempoTratamiento} días</Badge>
                         </div>
                      </div>
                   </div>
                </Card>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default CompararPage;
