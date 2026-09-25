'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/services/api';

export interface Clinica {
  id: number;
  nome: string;
}

export interface Veterinario {
  id: number;
  nome: string;
  crmv?: string;
  especialidade?: string;
  email?: string;
  telefone?: string;
  clinica_id?: number;
  clinica?: Clinica | number | string;
  clinicas?: Clinica[];
}

const ESPECIALIDADES_COMUNS = [
  'Clínico Geral',
  'Cirurgia Geral',
  'Ortopedia Veterinária',
  'Dermatologia',
  'Oftalmologia',
  'Cardiologia',
  'Oncologia',
  'Silvestres e Exóticos',
  'Neurologia',
  'Anestesiologia',
];

export default function VeterinariosPage() {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVet, setEditingVet] = useState<Veterinario | null>(null);
  const [nome, setNome] = useState('');
  const [crmv, setCrmv] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [selectedClinicaIds, setSelectedClinicaIds] = useState<number[]>([]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const [vData, cData] = await Promise.all([
        api.getVeterinarios(),
        api.getClinicas(),
      ]);
      setVeterinarios(vData);
      setClinicas(cData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido ao carregar dados';
      console.error('Falha ao carregar dados da página de veterinários:', message);
      setVeterinarios([]);
      setClinicas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getNomesClinicas = (vet: Veterinario) => {
    const nomesMap = new Map<string, string>();

    const registrarNome = (id: number) => {
      const encontrada = clinicas.find((item) => item.id === id);
      if (encontrada) nomesMap.set(String(encontrada.id), encontrada.nome);
    };

    if (Array.isArray(vet.clinicas)) {
      vet.clinicas.forEach((c) => {
        const id = typeof c === 'object' && c !== null ? c.id : Number(c);
        if (id) registrarNome(Number(id));
      });
    }

    if (vet.clinica) {
      const id = typeof vet.clinica === 'object' && vet.clinica !== null ? vet.clinica.id : Number(vet.clinica);
      if (id) registrarNome(Number(id));
    }

    if (vet.clinica_id && nomesMap.size === 0) {
      registrarNome(Number(vet.clinica_id));
    }

    return Array.from(nomesMap.values());
  };

  const handleOpenCreate = () => {
    setEditingVet(null);
    setNome('');
    setCrmv('');
    setEspecialidade('');
    setEmail('');
    setTelefone('');
    setSelectedClinicaIds([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (vet: Veterinario) => {
    setEditingVet(vet);
    setNome(vet.nome || '');
    setCrmv(vet.crmv || '');
    setEspecialidade(vet.especialidade || '');
    setEmail(vet.email || '');
    setTelefone(vet.telefone || '');

    const ids: number[] = [];
    if (Array.isArray(vet.clinicas)) {
      vet.clinicas.forEach((c) => {
        const id = typeof c === 'object' && c !== null ? c.id : Number(c);
        if (id && !ids.includes(Number(id))) ids.push(Number(id));
      });
    }
    if (vet.clinica) {
      const id = typeof vet.clinica === 'object' && vet.clinica !== null ? vet.clinica.id : Number(vet.clinica);
      if (id && !ids.includes(Number(id))) ids.push(Number(id));
    }
    if (vet.clinica_id && !ids.includes(Number(vet.clinica_id))) {
      ids.push(Number(vet.clinica_id));
    }
    setSelectedClinicaIds(ids);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVet(null);
  };

  const handleCheckboxClinicaChange = (clinicaId: number) => {
    if (selectedClinicaIds.includes(clinicaId)) {
      setSelectedClinicaIds(selectedClinicaIds.filter((id) => id !== clinicaId));
    } else {
      setSelectedClinicaIds([...selectedClinicaIds, clinicaId]);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!nome.trim() || !crmv.trim() || !especialidade.trim() || !email.trim() || !telefone.trim()) {
      alert('Todos os campos de texto devem ser preenchidos.');
      return;
    }

    if (selectedClinicaIds.length === 0) {
      alert('Selecione pelo menos uma clínica para o veterinário.');
      return;
    }

    try {
      const payload = {
        nome,
        crmv,
        especialidade,
        email,
        telefone,
        clinicas: selectedClinicaIds.map((id) => ({ id })),
        clinica: { id: selectedClinicaIds[0] },
      };

      if (editingVet) {
        await api.updateVeterinario(editingVet.id, payload);
      } else {
        await api.createVeterinario(payload);
      }

      await fetchData();
      handleCloseModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar veterinário.';
      alert(msg);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja remover este veterinário?')) {
      try {
        await api.deleteVeterinario(id);
        await fetchData();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao excluir veterinário.';
        alert(msg);
      }
    }
  };

  const renderVeterinariosContent = () => {
    if (loading) {
      return <div className="p-8 text-center text-slate-500 font-medium">A carregar veterinários...</div>;
    }

    if (veterinarios.length === 0) {
      return <div className="p-8 text-center text-slate-400 font-medium">Nenhum veterinário encontrado.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs border-b border-slate-200/80">
            <tr>
              <th scope="col" className="px-6 py-4">ID</th>
              <th scope="col" className="px-6 py-4">Nome</th>
              <th scope="col" className="px-6 py-4">CRMV</th>
              <th scope="col" className="px-6 py-4">Especialidade</th>
              <th scope="col" className="px-6 py-4">E-mail / Telefone</th>
              <th scope="col" className="px-6 py-4">Clínica(s)</th>
              <th scope="col" className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {veterinarios.map((vet) => {
              const nomesClinicas = getNomesClinicas(vet);
              return (
                <tr key={vet.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">#{vet.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{vet.nome}</td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {vet.crmv ? (
                      <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-sm font-semibold border border-indigo-100">
                        {vet.crmv}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-700">{vet.especialidade || 'Clínico Geral'}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    <div className="text-slate-700 font-medium">{vet.email || '—'}</div>
                    <div className="font-mono text-slate-400">{vet.telefone || ''}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {nomesClinicas.length > 0 ? (
                        nomesClinicas.map((nomeClinica) => (
                          <span
                            key={`${vet.id}-${nomeClinica}`}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60"
                          >
                            {nomeClinica}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(vet)}
                      className="text-amber-600 hover:text-amber-800 font-medium text-xs px-2 py-1 rounded-sm hover:bg-amber-50 transition cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(vet.id)}
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
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Módulo de Veterinários</h2>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-semibold bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm shadow-md shadow-teal-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span className="text-lg leading-none">+</span>
            <span>Novo Veterinário</span>
          </button>
        </header>

        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Lista Geral de Veterinários</h3>
          </div>
          <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200/60 px-3 py-1 rounded-sm font-bold">
            Total: {veterinarios.length}
          </span>
        </div>

        {renderVeterinariosContent()}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-sm max-w-md w-full p-6 shadow-2xl border border-slate-200/80">
            <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-200/60 bg-slate-50/50 -mx-6 -mt-6 px-6 pt-6">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {editingVet ? 'Editar Veterinário' : 'Cadastrar Novo Veterinário'}
              </h3>
              <button type="button" onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700 text-sm font-bold transition-colors cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="vetNome" className="block text-xs font-bold text-slate-600 uppercase mb-1">Nome *</label>
                <input id="vetNome" type="text" required placeholder="Ex: Dr. Carlos Silva" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vetCrmv" className="block text-xs font-bold text-slate-600 uppercase mb-1">CRMV *</label>
                  <input id="vetCrmv" type="text" required placeholder="Ex: 12345/PE" value={crmv} onChange={(e) => setCrmv(e.target.value)} className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm" />
                </div>
                <div>
                  <label htmlFor="vetEsp" className="block text-xs font-bold text-slate-600 uppercase mb-1">Especialidade *</label>
                  <select 
                    id="vetEsp" 
                    required 
                    value={especialidade} 
                    onChange={(e) => setEspecialidade(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm bg-white cursor-pointer"
                  >
                    <option value="" disabled>Selecione...</option>
                    {ESPECIALIDADES_COMUNS.map((esp) => (
                      <option key={esp} value={esp}>
                        {esp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vetEmail" className="block text-xs font-bold text-slate-600 uppercase mb-1">E-mail *</label>
                  <input id="vetEmail" type="email" required placeholder="Ex: carlos@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm" />
                </div>
                <div>
                  <label htmlFor="vetTel" className="block text-xs font-bold text-slate-600 uppercase mb-1">Telefone *</label>
                  <input id="vetTel" type="text" required placeholder="Ex: (87) 99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm" />
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-600 uppercase mb-2">Clínica(s) de Atuação *</span>
                <div className="max-h-36 overflow-y-auto space-y-2 border border-slate-200 p-3 rounded-sm bg-slate-50/50">
                  {clinicas.map((c) => {
                    const checkboxId = `clinica-checkbox-${c.id}`;
                    return (
                      <label key={c.id} htmlFor={checkboxId} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                        <input
                          id={checkboxId}
                          type="checkbox"
                          checked={selectedClinicaIds.includes(c.id)}
                          onChange={() => handleCheckboxClinicaChange(c.id)}
                          className="rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                        />
                        <span>{c.nome}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 mt-6">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 rounded-sm font-semibold text-slate-600 hover:bg-slate-100 text-sm transition cursor-pointer">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 rounded-sm font-semibold bg-teal-500 hover:bg-teal-600 text-white text-sm shadow-md transition cursor-pointer">
                  {editingVet ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}