'use client';

import { useState, useMemo, useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  pacienteInicial?: any;
  tutores: any[];
  veterinarios: any[];
  clinicas: any[];
}

export default function ModalNovoPaciente({
  isOpen,
  onClose,
  onSubmit,
  pacienteInicial,
  tutores,
  veterinarios,
  clinicas,
}: Readonly<ModalProps>) {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('Cão');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [clinicaId, setClinicaId] = useState('');
  const [tutorId, setTutorId] = useState('');
  const [veterinarioId, setVeterinarioId] = useState('');

  useEffect(() => {
    if (pacienteInicial) {
      setNome(pacienteInicial.nome || '');
      setEspecie(pacienteInicial.especie || 'Cão');
      setRaca(pacienteInicial.raca || '');
      setIdade(pacienteInicial.idade ? String(pacienteInicial.idade) : '');
      setPeso(pacienteInicial.peso ? String(pacienteInicial.peso) : '');

      const cId = pacienteInicial.clinica?.id ?? pacienteInicial.clinicaId ?? '';
      const tId = pacienteInicial.tutor?.id ?? pacienteInicial.tutorId ?? '';
      const vId = pacienteInicial.veterinario?.id ?? pacienteInicial.veterinarioId ?? '';

      setClinicaId(cId ? String(cId) : '');
      setTutorId(tId ? String(tId) : '');
      setVeterinarioId(vId ? String(vId) : '');
    } else {
      setNome('');
      setEspecie('Cão');
      setRaca('');
      setIdade('');
      setPeso('');
      setClinicaId('');
      setTutorId('');
      setVeterinarioId('');
    }
  }, [pacienteInicial, isOpen]);

  const tutoresFiltrados = useMemo(() => {
    if (!clinicaId || !tutores) return [];
    const selectedId = Number(clinicaId);

    return tutores.filter((t) => {
      if (t.clinica?.id === selectedId) return true;
      if (t.clinicaId === selectedId) return true;
      if (typeof t.clinica === 'number' || typeof t.clinica === 'string') {
        return Number(t.clinica) === selectedId;
      }
      return false;
    });
  }, [clinicaId, tutores]);

  const veterinariosFiltrados = useMemo(() => {
    if (!clinicaId || !veterinarios) return [];
    const selectedId = Number(clinicaId);

    return veterinarios.filter((v) => {
      if (v.clinica?.id === selectedId) return true;
      if (v.clinicaId === selectedId) return true;
      if (Array.isArray(v.clinicas)) {
        return v.clinicas.some((c: any) => c.id === selectedId);
      }
      if (typeof v.clinica === 'number' || typeof v.clinica === 'string') {
        return Number(v.clinica) === selectedId;
      }
      return false;
    });
  }, [clinicaId, veterinarios]);

  const getTutorPlaceholder = () => {
    if (!clinicaId) return '← Escolha uma clínica primeiro';
    if (tutoresFiltrados.length === 0) return 'Nenhum tutor cadastrado nesta clínica';
    return 'Selecione o Tutor';
  };

  const getVeterinarioPlaceholder = () => {
    if (!clinicaId) return '← Escolha uma clínica primeiro';
    if (veterinariosFiltrados.length === 0) return 'Nenhum veterinário nesta clínica';
    return 'Selecione o Veterinário (Opcional)';
  };

  const handleClinicaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClinicaId = e.target.value;
    setClinicaId(newClinicaId);
    setTutorId('');
    setVeterinarioId('');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!nome || !tutorId || !clinicaId) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    onSubmit({
      nome,
      especie,
      raca,
      idade: idade ? Number(idade) : 0,
      peso: peso ? Number(peso) : 0,
      tutor: { id: Number(tutorId) },
      veterinario: veterinarioId ? { id: Number(veterinarioId) } : null,
      clinica: { id: Number(clinicaId) },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-sm max-w-lg w-full p-6 shadow-2xl border border-slate-200/80">
        
        <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-200/60 bg-slate-50/50 -mx-6 -mt-6 px-6 pt-6">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {pacienteInicial ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}
          </h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nomePet" className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Nome do Pet *
            </label>
            <input
              id="nomePet"
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Rex, Thor, Mia..."
              className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="especiePet" className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Espécie
              </label>
              <select
                id="especiePet"
                value={especie}
                onChange={(e) => setEspecie(e.target.value)}
                className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm bg-white"
              >
                <option value="Cão">Cão</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div>
              <label htmlFor="racaPet" className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Raça
              </label>
              <input
                id="racaPet"
                type="text"
                value={raca}
                onChange={(e) => setRaca(e.target.value)}
                placeholder="Ex: Poodle, SRD..."
                className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="idadePet" className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Idade (anos)
              </label>
              <input
                id="idadePet"
                type="number"
                min="0"
                step="1"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                placeholder="Ex: 3"
                className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm"
              />
            </div>
            <div>
              <label htmlFor="pesoPet" className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Peso (kg)
              </label>
              <input
                id="pesoPet"
                type="number"
                min="0"
                step="0.1"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Ex: 12.5"
                className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="selectClinica" className="block text-xs font-bold text-slate-600 uppercase mb-1">
              1. Clínica *
            </label>
            <select
              id="selectClinica"
              required
              value={clinicaId}
              onChange={handleClinicaChange}
              className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm bg-slate-50/50"
            >
              <option value="">Selecione primeiro a Clínica</option>
              {clinicas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="selectTutor" className="block text-xs font-bold text-slate-600 uppercase mb-1">
              2. Tutor
            </label>
            <select
              id="selectTutor"
              required
              disabled={!clinicaId}
              value={tutorId}
              onChange={(e) => setTutorId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm disabled:bg-slate-100 disabled:text-slate-400 bg-white"
            >
              <option value="">{getTutorPlaceholder()}</option>
              {tutoresFiltrados.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="selectVeterinario" className="block text-xs font-bold text-slate-600 uppercase mb-1">
              3. Veterinário Responsável
            </label>
            <select
              id="selectVeterinario"
              disabled={!clinicaId}
              value={veterinarioId}
              onChange={(e) => setVeterinarioId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm disabled:bg-slate-100 disabled:text-slate-400 bg-white"
            >
              <option value="">{getVeterinarioPlaceholder()}</option>
              {veterinariosFiltrados.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nome} {v.crmv ? `(CRMV: ${v.crmv})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-sm font-semibold text-slate-600 hover:bg-slate-100 text-sm transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!clinicaId || !tutorId}
              className="px-5 py-2.5 rounded-sm font-semibold bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm shadow-md transition cursor-pointer"
            >
              {pacienteInicial ? 'Atualizar Paciente' : 'Salvar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}