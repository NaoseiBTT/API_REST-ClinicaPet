'use client';

export interface Paciente {
  id: number;
  nome: string;
  especie: string;
  raca?: string;
  idade?: number;
  peso?: number;
  tutor?: { id: number; nome: string };
  veterinario?: { id: number; nome: string };
  clinica?: { id: number; nome: string };
}

interface TabelaPacientesProps {
  pacientes: Paciente[];
  loading: boolean;
  onEdit: (paciente: Paciente) => void;
  onDelete: (id: number) => void;
}

export default function TabelaPacientes({
  pacientes,
  loading,
  onEdit,
  onDelete,
}: Readonly<TabelaPacientesProps>) {
  if (loading) {
    return <div className="p-8 text-center text-slate-500">A carregar dados dos pacientes...</div>;
  }

  if (pacientes.length === 0) {
    return <div className="p-8 text-center text-slate-400">Nenhum paciente cadastrado.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <th className="p-4 pl-6">Paciente</th>
            <th className="p-4">Espécie / Raça</th>
            <th className="p-4">Idade / Peso</th>
            <th className="p-4">Tutor</th>
            <th className="p-4">Veterinário</th>
            <th className="p-4">Clínica</th>
            <th className="p-4 pr-6 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {pacientes.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50/80 transition">
              <td className="p-4 pl-6 font-semibold text-slate-800">{p.nome}</td>
              <td className="p-4 text-slate-600">{p.especie} {p.raca ? `• ${p.raca}` : ''}</td>
              <td className="p-4 text-slate-600">
                {p.idade !== undefined && p.idade !== null ? `${p.idade} anos` : '—'} 
                {p.peso ? ` • ${p.peso} kg` : ''}
              </td>
              <td className="p-4 text-slate-600">{p.tutor?.nome || '—'}</td>
              <td className="p-4 text-slate-600">{p.veterinario?.nome || '—'}</td>
              <td className="p-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
                  {p.clinica?.nome || '—'}
                </span>
              </td>
              <td className="p-4 pr-6 text-right space-x-2">
                <button
                  type="button"
                  onClick={() => onEdit(p)}
                  className="text-amber-600 hover:text-amber-800 font-medium text-xs px-2 py-1 rounded hover:bg-amber-50 transition"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(p.id)}
                  className="text-red-500 hover:text-red-700 font-medium text-xs px-2 py-1 rounded hover:bg-red-50 transition"
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
}