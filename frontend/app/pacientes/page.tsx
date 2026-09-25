'use client';

import { useState, useEffect } from 'react';
import TabelaPacientes, { Paciente } from '@/src/components/TabelaPacientes';
import ModalNovoPaciente from '@/src/components/ModalNovoPaciente';
import { api } from '@/src/services/api';

export default function PacientesPage() {
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
      console.warn('Erro ao carregar pacientes:', err);
      return [] as Paciente[];
    });

    const fetchTutores = api.getTutores().catch((err: unknown) => {
      console.warn('Erro ao carregar tutores:', err);
      return [];
    });

    const fetchVeterinarios = api.getVeterinarios().catch((err: unknown) => {
      console.warn('Erro ao carregar veterinários:', err);
      return [];
    });

    const fetchClinicas = api.getClinicas().catch((err: unknown) => {
      console.warn('Erro ao carregar clínicas:', err);
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
      const message = err instanceof Error ? err.message : 'Erro desconhecido ao carregar pacientes';
      console.error('Falha crítica no módulo de pacientes:', message);
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

  const handleOpenCreateModal = () => {
    setEditingPaciente(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (paciente: Paciente) => {
    setEditingPaciente(paciente);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPaciente(null);
  };

  return (
    <div className="space-y-6 pb-10">
      <section className="bg-white/90 backdrop-blur-md rounded-sm border border-slate-200/70 shadow-sm overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b border-slate-200/80 bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Módulo de Pacientes</h2>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-semibold bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm shadow-md shadow-teal-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span className="text-lg leading-none">+</span>
            <span>Novo Paciente</span>
          </button>
        </header>

        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Lista Geral de Pacientes</h3>
          </div>
          <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200/60 px-3 py-1 rounded-sm font-bold">
            Total: {pacientes.length}
          </span>
        </div>

        <div className="w-full">
          <TabelaPacientes
            pacientes={pacientes}
            loading={loading}
            onEdit={handleOpenEditModal}
            onDelete={handleDeletePaciente}
          />
        </div>
      </section>

      <ModalNovoPaciente
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingPaciente ? handleUpdatePaciente : handleCreatePaciente}
        pacienteInicial={editingPaciente}
        tutores={tutores}
        veterinarios={veterinarios}
        clinicas={clinicas}
      />
    </div>
  );
}