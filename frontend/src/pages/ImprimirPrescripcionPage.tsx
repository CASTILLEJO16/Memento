import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { prescripcionesAPI } from '../api/services';
import { Prescripcion, Paciente } from '../types';
import { CLINIC_INFO } from '../constants/medicalData';
import { Printer, ChevronLeft, Mail, Phone, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';

const ImprimirPrescripcionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prescripcion, setPrescripcion] = useState<Prescripcion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      prescripcionesAPI.getById(id)
        .then(setPrescripcion)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Cargando receta...</div>;
  if (!prescripcion) return <div className="flex items-center justify-center h-screen text-red-500 font-bold">Error: Receta no encontrada</div>;

  const paciente = typeof prescripcion.pacienteId === 'object' ? (prescripcion.pacienteId as Paciente) : null;
  const medico = typeof prescripcion.medicoId === 'object' ? (prescripcion.medicoId as any) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 print:bg-white print:py-0">
      {/* Action Bar (Hidden on print) */}
      <div className="w-full max-w-[148mm] flex justify-between items-center mb-6 no-print print:hidden">
        <Button variant="ghost" onClick={() => navigate(-1)} leftIcon={<ChevronLeft className="w-4 h-4" />}>
          Volver
        </Button>
        <Button variant="primary" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
          Imprimir Receta (A5)
        </Button>
      </div>

      {/* Prescription Sheet (A5 Format) */}
      <div className="w-[148mm] h-[210mm] bg-white shadow-2xl p-[15mm] flex flex-col border border-gray-100 print:shadow-none print:border-none print:m-0 print:w-full print:h-full">
        
        {/* Header: Institution & Doctor Info */}
        <header className="border-b-2 border-primary-600 pb-6 mb-8 flex justify-between items-start">
          <div className="space-y-1">
             <h1 className="text-2xl font-black text-primary-700 tracking-tighter">{CLINIC_INFO.logoText}</h1>
             <h2 className="text-lg font-bold text-gray-900 leading-tight">
                Dr. {medico?.nombre || CLINIC_INFO.doctor}
             </h2>
             <p className="text-sm font-bold text-primary-600 uppercase tracking-wide">
                {medico?.especialidad || CLINIC_INFO.especialidad}
             </p>
             <p className="text-xs text-gray-500 font-medium">
                Cédula Prof: {medico?.cedula || CLINIC_INFO.cedula}
             </p>
          </div>
          <div className="text-right space-y-1 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
             <div className="flex items-center justify-end gap-1"><Phone className="w-3 h-3" /> {CLINIC_INFO.telefono}</div>
             <div className="flex items-center justify-end gap-1"><Mail className="w-3 h-3" /> {CLINIC_INFO.email}</div>
             <div className="flex items-center justify-end gap-1 max-w-[150px] text-right"><MapPin className="w-3 h-3" /> {CLINIC_INFO.direccion}</div>
          </div>
        </header>

        {/* Patient Details */}
        <div className="grid grid-cols-2 gap-6 mb-10 pb-6 border-b border-gray-50 text-sm">
           <div>
              <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Paciente</p>
              <p className="font-bold text-gray-900">{paciente?.nombre || 'Paciente Registrado'}</p>
              <p className="text-gray-500 font-medium">{paciente?.edad} años</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Fecha de Emisión</p>
              <p className="font-bold text-gray-900">{new Date(prescripcion.fechaCreacion).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              <p className="text-gray-500 font-medium text-[10px]">Exp: #{prescripcion._id.slice(-8).toUpperCase()}</p>
           </div>
        </div>

        {/* Prescription Body (Rx) */}
        <main className="flex-grow">
           <div className="flex items-baseline gap-4 mb-6">
              <span className="text-6xl font-serif text-primary-700 select-none">R<span className="text-4xl">x</span></span>
              <div className="h-0.5 flex-grow bg-gray-50" />
           </div>

           <div className="space-y-8 pl-4">
              <div>
                 <h3 className="text-xl font-black text-gray-900 mb-2">{prescripcion.medicamento}</h3>
                 <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <p className="text-gray-600 font-medium">Dosificación: <span className="text-gray-900 font-bold">{prescripcion.dosis}</span></p>
                    <p className="text-gray-600 font-medium">Vía: <span className="text-gray-900 font-bold uppercase text-xs">{prescripcion.viaAdministracion}</span></p>
                    <p className="text-gray-600 font-medium">Frecuencia: <span className="text-gray-900 font-bold">Cada {prescripcion.horario} horas</span></p>
                    <p className="text-gray-600 font-medium">Duración: <span className="text-gray-900 font-bold">{prescripcion.tiempoTratamiento} días</span></p>
                 </div>
              </div>

              {prescripcion.indicaciones && (
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                   <p className="text-[10px] uppercase font-black text-gray-400 mb-2">Indicaciones Especiales</p>
                   <p className="text-sm text-gray-700 leading-relaxed italic">{prescripcion.indicaciones}</p>
                </div>
              )}
           </div>
        </main>

        {/* Footer: Signature & Clinic Stamp Space */}
        <footer className="mt-auto pt-10">
           <div className="flex justify-between items-end">
              <div className="space-y-1">
                 <div className="w-32 h-32 border-2 border-primary-50/50 rounded-2xl flex items-center justify-center opacity-30 select-none">
                    <div className="text-[8px] text-center font-bold text-primary-400 p-2 border border-dashed border-primary-400 rounded-lg"> SELLO DE LA CLÍNICA </div>
                 </div>
              </div>
              <div className="text-center w-64 space-y-2">
                 <div className="h-px bg-gray-900" />
                 <p className="text-xs font-bold text-gray-900">Dr. {medico?.nombre || CLINIC_INFO.doctor}</p>
                 <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none">Firma y Sello del Médico</p>
              </div>
           </div>
           
           <div className="mt-8 text-center border-t border-gray-50 pt-4">
              <p className="text-[9px] text-gray-300 font-medium italic">Esta receta es válida por 30 días a partir de su fecha de emisión. Dr. MEMENTO v2.5 - Gestión Clínica Segura.</p>
           </div>
        </footer>
      </div>

      <style>{`
        @media print {
          body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A5 portrait;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ImprimirPrescripcionPage;
