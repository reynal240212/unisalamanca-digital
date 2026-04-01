import React from 'react';
import { Calendar, Clock, MapPin, BookOpen, AlertCircle, FileText } from 'lucide-react';
import { useSchedule } from '../hooks/useSchedule';

const StudentSchedule = ({ student }) => {
  const { schedule, loading, error } = useSchedule();

  const getPdfPath = (programName) => {
    const maps = {
      'Ingeniería de Sistemas': '/curriculums/ingenieria_sistemas.pdf',
      'Desarrollo de Software': '/curriculums/desarrollo_software.pdf',
      'Administración de Empresas': '/curriculums/administracion_empresas.pdf',
      'Contaduría Pública': '/curriculums/contaduria_publica.pdf',
      'Finanzas y Comercio Internacional': '/curriculums/finanzas_comercio.pdf',
      'Tecnología en Desarrollo de Software': '/curriculums/desarrollo_software.pdf'
    };
    return maps[programName] || '/curriculums/ingenieria_sistemas.pdf';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3">
        <AlertCircle size={20} />
        <p>{error}</p>
      </div>
    );
  }

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl shadow-lg shadow-blue-500/20">
            <Calendar className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Mi Horario Académico</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Periodo: {schedule[0]?.period || 'Cargando...'} | Jornada Nocturna
            </p>
          </div>
        </div>

        <a 
          href={getPdfPath(student?.program)} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md"
        >
          <FileText size={18} className="text-red-500" />
          Descargar Pénsum
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map((day) => {
          const daySubjects = schedule.filter(s => 
            s.blocks?.some(b => b.day_of_week === day)
          );

          return (
            <div key={day} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 h-full shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                    {day}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                    {daySubjects.length} Clases
                  </span>
                </div>

                <div className="space-y-4">
                  {daySubjects.length > 0 ? (
                    daySubjects.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors group/card">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <BookOpen size={14} className="text-blue-500" />
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight uppercase tracking-tight">
                              {item.subject}
                            </h4>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-lg">
                            {item.credits} CR
                          </span>
                        </div>

                        {item.blocks.filter(b => b.day_of_week === day).map((block, bIdx) => (
                          <div key={bIdx} className="space-y-2 mt-2">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <Clock size={12} className="text-blue-400" />
                              <span className="font-medium">
                                {block.start_time.slice(0, 5)} - {block.end_time.slice(0, 5)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <MapPin size={12} className="text-cyan-400" />
                              <span>Salón: {block.classroom || 'Por definir'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 opacity-40">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                        <Clock size={20} />
                      </div>
                      <p className="text-xs font-medium">Sin clases programadas</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentSchedule;
