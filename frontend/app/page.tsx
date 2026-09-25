'use client';

import { useState, useEffect } from 'react';
import ModalNovoPaciente from '@/src/components/ModalNovoPaciente';
import TabelaPacientes, { Paciente } from '@/src/components/TabelaPacientes';
import { api } from '@/src/services/api';

export default function Home() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [tutores, setTutores] = useState<unknown[]>([]);
  const [veterinarios, setVeterinarios] = useState<unknown[]>([]);
  const [clinicas, setClinicas] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);

  const loadData = async () => {
    setLoading(true);
    
    const fetchPacientes = api.getPacientes().catch((err: unknown) => {
      console.warn('Não foi possível carregar os pacientes:', err);
      return [] as Paciente[];
    });

    const fetchTutores = api.getTutores().catch((err: unknown) => {
      console.warn('Não foi possível carregar a lista de tutores:', err);
      return [];
    });

    const fetchVeterinarios = api.getVeterinarios().catch((err: unknown) => {
      console.warn('Não foi possível carregar a lista de veterinários:', err);
      return [];
    });

    const fetchClinicas = api.getClinicas().catch((err: unknown) => {
      console.warn('Not possible to load clinics:', err);
      return [];
    });

    try {
      const [pData, tData, vData, cData] = await Promise.all([
        fetchPacientes,
        fetchTutores,
        fetchVeterinarios,
        fetchClinicas,
      ]);

      setPacientes(pData);
      setTutores(tData);
      setVeterinarios(vData);
      setClinicas(cData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido ao carregar os dados.';
      console.error('Falha crítica durante o carregamento do Dashboard:', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePaciente = async (data: unknown) => {
    try {
      await api.createPaciente(data);
      await loadData();
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar paciente.';
      alert(msg);
    }
  };

  const handleUpdatePaciente = async (data: unknown) => {
    if (!editingPaciente) return;
    try {
      await api.updatePaciente(editingPaciente.id, data);
      await loadData();
      setEditingPaciente(null);
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar paciente.';
      alert(msg);
    }
  };

  const handleDeletePaciente = async (id: number) => {
    if (confirm('Tem certeza de que deseja remover este paciente?')) {
      try {
        await api.deletePaciente(id);
        await loadData();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao excluir paciente.';
        alert(msg);
      }
    }
  };

  const pacientesRecentes = [...pacientes]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/85 backdrop-blur-md p-6 rounded-1xl border border-slate-200/60 shadow-sm">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Painel de Controle</h2>
          <p className="text-sm text-slate-500 mt-1">Acompanhe as estatísticas e cadastros da clínica em tempo real.</p>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-white/90 backdrop-blur-md p-6 rounded-1xl border border-slate-200/70 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pacientes</p>
            <h3 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{pacientes.length}</h3>
            <span className="inline-block mt-2 text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">Atendidos</span>
          </div>
          <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-1xl flex items-center justify-center text-2xl group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 shadow-inner">
            🐾
          </div>
        </div>

        <div className="group bg-white/90 backdrop-blur-md p-6 rounded-1xl border border-slate-200/70 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tutores Cadastrados</p>
            <h3 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{tutores.length}</h3>
            <span className="inline-block mt-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Vinculados</span>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-inner">
            👤
          </div>
        </div>

        <div className="group bg-white/90 backdrop-blur-md p-6 rounded-1xl border border-slate-200/70 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Veterinários</p>
            <h3 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{veterinarios.length}</h3>
            <span className="inline-block mt-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Especialistas</span>
          </div>
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-inner">
            🩺
          </div>
        </div>

        <div className="group bg-white/90 backdrop-blur-md p-6 rounded-1xl border border-slate-200/70 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unidades / Clínicas</p>
            <h3 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{clinicas.length}</h3>
            <span className="inline-block mt-2 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Disponíveis</span>
          </div>
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-inner">
            🏥
          </div>
        </div>
      </section>

      <section className="bg-white/90 backdrop-blur-md rounded-1xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Últimos Pacientes Cadastrados</h3>
          </div>
        </div>

        <TabelaPacientes
          pacientes={pacientesRecentes}
          loading={loading}
          onEdit={(p) => { setEditingPaciente(p); setIsModalOpen(true); }}
          onDelete={handleDeletePaciente}
        />
      </section>

      <ModalNovoPaciente
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingPaciente(null); }}
        onSubmit={editingPaciente ? handleUpdatePaciente : handleCreatePaciente}
        pacienteInicial={editingPaciente}
        tutores={tutores}
        veterinarios={veterinarios}
        clinicas={clinicas}
      />
    </div>
  );
}