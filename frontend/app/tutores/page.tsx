'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/services/api';

export interface Clinica {
  id: number;
  nome: string;
}

export interface Tutor {
  id: number;
  cpf: string;
  email: string;
  nome: string;
  telefone: string;
  clinica_id?: number;
  clinicaId?: number;
  clinica?: Clinica | number | string | null;
}

export default function TutoresPage() {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [clinicaId, setClinicaId] = useState('');

  const fetchData = async () => {
    setLoading(true);

    try {
      const [tutoresData, clinicasData] = await Promise.all([
        api.getTutores(),
        api.getClinicas(),
      ]);
      setTutores(tutoresData);
      setClinicas(clinicasData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido ao carregar dados';
      console.error('Falha ao carregar dados da página de tutores:', message);
      setTutores([]);
      setClinicas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getNomeClinica = (tutor: Tutor) => {
    if (tutor.clinica && typeof tutor.clinica === 'object' && 'nome' in tutor.clinica && tutor.clinica.nome) {
      return (tutor.clinica as Clinica).nome;
    }

    const cId = tutor.clinica_id ?? tutor.clinicaId ?? (typeof tutor.clinica === 'number' ? tutor.clinica : Number(tutor.clinica));
    if (cId) {
      const encontrada = clinicas.find((item) => item.id === Number(cId));
      if (encontrada) return encontrada.nome;
    }

    return '—';
  };

  const handleOpenCreate = () => {
    setEditingTutor(null);
    setNome('');
    setCpf('');
    setEmail('');
    setTelefone('');
    setClinicaId('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tutor: Tutor) => {
    setEditingTutor(tutor);
    setNome(tutor.nome || '');
    setCpf(tutor.cpf || '');
    setEmail(tutor.email || '');
    setTelefone(tutor.telefone || '');

    let resolvedId = '';

    if (tutor.clinica_id !== undefined && tutor.clinica_id !== null) {
      resolvedId = String(tutor.clinica_id);
    } else if (tutor.clinicaId !== undefined && tutor.clinicaId !== null) {
      resolvedId = String(tutor.clinicaId);
    } else if (typeof tutor.clinica === 'object' && tutor.clinica !== null && 'id' in tutor.clinica) {
      resolvedId = String((tutor.clinica as Clinica).id);
    } else if (typeof tutor.clinica === 'number' || typeof tutor.clinica === 'string') {
      resolvedId = String(tutor.clinica);
    }

    setClinicaId(resolvedId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTutor(null);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!nome.trim() || !cpf.trim() || !email.trim() || !telefone.trim()) {
      alert('Todos os campos de texto devem ser preenchidos.');
      return;
    }

    if (!clinicaId) {
      alert('Selecione uma clínica para o tutor.');
      return;
    }

    try {
      const payload = {
        nome,
        cpf,
        email,
        telefone,
        clinica: { id: Number(clinicaId) },
        clinica_id: Number(clinicaId),
      };

      if (editingTutor) {
        await api.updateTutor(editingTutor.id, payload);
      } else {
        await api.createTutor(payload);
      }

      await fetchData();
      handleCloseModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar tutor.';
      alert(msg);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja remover este tutor?')) {
      try {
        await api.deleteTutor(id);
        await fetchData();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao excluir tutor.';
        alert(msg);
      }
    }
  };

  const renderTutoresContent = () => {
    if (loading) {
      return <div className="p-8 text-center text-slate-500 font-medium">A carregar tutores...</div>;
    }

    if (tutores.length === 0) {
      return <div className="p-8 text-center text-slate-400 font-medium">Nenhum tutor encontrado.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs border-b border-slate-200/80">
            <tr>
              <th scope="col" className="px-6 py-4">ID</th>
              <th scope="col" className="px-6 py-4">Nome</th>
              <th scope="col" className="px-6 py-4">CPF</th>
              <th scope="col" className="px-6 py-4">E-mail / Telefone</th>
              <th scope="col" className="px-6 py-4">Clínica</th>
              <th scope="col" className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tutores.map((tutor) => {
              const nomeClinica = getNomeClinica(tutor);
              return (
                <tr key={tutor.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">#{tutor.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{tutor.nome}</td>
                  <td className="px-6 py-4 font-mono text-xs">{tutor.cpf || '—'}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    <div className="text-slate-700 font-medium">{tutor.email || '—'}</div>
                    <div className="font-mono text-slate-400">{tutor.telefone || ''}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
                      {nomeClinica}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(tutor)}
                      className="text-amber-600 hover:text-amber-800 font-medium text-xs px-2 py-1 rounded-sm hover:bg-amber-50 transition cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tutor.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-xs px-2 py-1 rounded-sm hover:bg-red-50 transition cursor-pointer"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-10">
      <section className="bg-white/90 backdrop-blur-md rounded-sm border border-slate-200/70 shadow-sm overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b border-slate-200/80 bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Módulo de Tutores</h2>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-semibold bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm shadow-md shadow-teal-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span className="text-lg leading-none">+</span>
            <span>Novo Tutor</span>
          </button>
        </header>

        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Lista Geral de Tutores</h3>
          </div>
          <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200/60 px-3 py-1 rounded-sm font-bold">
            Total: {tutores.length}
          </span>
        </div>

        {renderTutoresContent()}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-sm max-w-md w-full p-6 shadow-2xl border border-slate-200/80">
            <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-200/60 bg-slate-50/50 -mx-6 -mt-6 px-6 pt-6">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {editingTutor ? 'Editar Tutor' : 'Cadastrar Novo Tutor'}
              </h3>
              <button type="button" onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700 text-sm font-bold transition-colors cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="tutorNome" className="block text-xs font-bold text-slate-600 uppercase mb-1">Nome *</label>
                <input id="tutorNome" type="text" required placeholder="Ex: Ana Souza" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm" />
              </div>
              <div>
                <label htmlFor="tutorCpf" className="block text-xs font-bold text-slate-600 uppercase mb-1">CPF *</label>
                <input id="tutorCpf" type="text" required placeholder="Ex: 000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tutorEmail" className="block text-xs font-bold text-slate-600 uppercase mb-1">E-mail *</label>
                  <input id="tutorEmail" type="email" required placeholder="Ex: ana@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm" />
                </div>
                <div>
                  <label htmlFor="tutorTel" className="block text-xs font-bold text-slate-600 uppercase mb-1">Telefone *</label>
                  <input id="tutorTel" type="text" required placeholder="Ex: (87) 98888-8888" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="tutorClinicaSelect" className="block text-xs font-bold text-slate-600 uppercase mb-1">Clínica *</label>
                <select
                  id="tutorClinicaSelect"
                  required
                  value={clinicaId}
                  onChange={(e) => setClinicaId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm bg-slate-50/50 cursor-pointer"
                >
                  <option value="" disabled>Selecione a Clínica</option>
                  {clinicas.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 mt-6">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 rounded-sm font-semibold text-slate-600 hover:bg-slate-100 text-sm transition cursor-pointer">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 rounded-sm font-semibold bg-teal-500 hover:bg-teal-600 text-white text-sm shadow-md transition cursor-pointer">
                  {editingTutor ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}