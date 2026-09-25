'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/services/api';

export interface Clinica {
  id: number;
  nome: string;
  endereco?: string;
  telefone?: string;
  email?: string;
}

export default function ClinicasPage() {
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClinica, setEditingClinica] = useState<Clinica | null>(null);
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.getClinicas();
      setClinicas(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido ao carregar clínicas';
      console.error('Falha ao carregar clínicas:', message);
      setClinicas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingClinica(null);
    setNome('');
    setEndereco('');
    setTelefone('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (clinica: Clinica) => {
    setEditingClinica(clinica);
    setNome(clinica.nome || '');
    setEndereco(clinica.endereco || '');
    setTelefone(clinica.telefone || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClinica(null);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      alert('O nome da clínica é obrigatório.');
      return;
    }

    try {
      const payload = { nome, endereco, telefone };

      if (editingClinica) {
        await api.updateClinica(editingClinica.id, payload);
      } else {
        await api.createClinica(payload);
      }

      await fetchData();
      handleCloseModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar clínica.';
      alert(msg);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja remover esta clínica?')) {
      try {
        await api.deleteClinica(id);
        await fetchData();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao excluir clínica.';
        alert(msg);
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="p-8 text-center text-slate-500 font-medium">A carregar clínicas...</div>;
    }

    if (clinicas.length === 0) {
      return <div className="p-8 text-center text-slate-400 font-medium">Nenhuma clínica encontrada.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs border-b border-slate-200/80">
            <tr>
              <th scope="col" className="px-6 py-4">ID</th>
              <th scope="col" className="px-6 py-4">Nome da Clínica</th>
              <th scope="col" className="px-6 py-4">Endereço</th>
              <th scope="col" className="px-6 py-4">Contato</th>
              <th scope="col" className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clinicas.map((clinica) => (
              <tr key={clinica.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">#{clinica.id}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{clinica.nome}</td>
                <td className="px-6 py-4 text-slate-600">{clinica.endereco || '—'}</td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  <div className="font-mono text-slate-400">{clinica.telefone || '—'}</div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(clinica)}
                    className="text-amber-600 hover:text-amber-800 font-medium text-xs px-2 py-1 rounded-sm hover:bg-amber-50 transition cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(clinica.id)}
                    className="text-red-500 hover:text-red-700 font-medium text-xs px-2 py-1 rounded-sm hover:bg-red-50 transition cursor-pointer"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
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
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Módulo de Clínicas</h2>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-semibold bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm shadow-md shadow-teal-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span className="text-lg leading-none">+</span>
            <span>Nova Clínica</span>
          </button>
        </header>

        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Lista Geral de Clínicas</h3>
          </div>
          <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200/60 px-3 py-1 rounded-sm font-bold">
            Total: {clinicas.length}
          </span>
        </div>

        {renderContent()}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-sm max-w-md w-full p-6 shadow-2xl border border-slate-200/80">
            <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-200/60 bg-slate-50/50 -mx-6 -mt-6 px-6 pt-6">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {editingClinica ? 'Editar Clínica' : 'Cadastrar Nova Clínica'}
              </h3>
              <button type="button" onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700 text-sm font-bold transition-colors cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="clinicaNome" className="block text-xs font-bold text-slate-600 uppercase mb-1">Nome *</label>
                <input
                  id="clinicaNome"
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Clínica Veterinária Central"
                  className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm"
                />
              </div>
              <div>
                <label htmlFor="clinicaEndereco" className="block text-xs font-bold text-slate-600 uppercase mb-1">Endereço</label>
                <input
                  id="clinicaEndereco"
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Ex: Rua Principal, 123"
                  className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm"
                />
              </div>
              <div>
                <label htmlFor="clinicaTel" className="block text-xs font-bold text-slate-600 uppercase mb-1">Telefone</label>
                <input
                  id="clinicaTel"
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Ex: (87) 3861-0000"
                  className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-sm font-semibold text-slate-600 hover:bg-slate-100 text-sm transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-sm font-semibold bg-teal-500 hover:bg-teal-600 text-white text-sm shadow-md transition cursor-pointer"
                >
                  {editingClinica ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}