const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchFromAPI(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Erro ao comunicar com o servidor.';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        if (errorText) errorMessage = errorText;
      }

      throw new Error(errorMessage);
    }

    if (response.status === 204) return null;
    return await response.json();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error(`Erro na requisição [${endpoint}]:`, message);
    throw error;
  }
}

export const api = {
  getClinicas: () => fetchFromAPI('/clinicas'),
  createClinica: (data: unknown) => fetchFromAPI('/clinicas', { method: 'POST', body: JSON.stringify(data) }),
  updateClinica: (id: number, data: unknown) => fetchFromAPI(`/clinicas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClinica: (id: number) => fetchFromAPI(`/clinicas/${id}`, { method: 'DELETE' }),

  getTutores: () => fetchFromAPI('/tutores'),
  createTutor: (data: unknown) => fetchFromAPI('/tutores', { method: 'POST', body: JSON.stringify(data) }),
  updateTutor: (id: number, data: unknown) => fetchFromAPI(`/tutores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTutor: (id: number) => fetchFromAPI(`/tutores/${id}`, { method: 'DELETE' }),

  getVeterinarios: () => fetchFromAPI('/veterinarios'),
  createVeterinario: (data: unknown) => fetchFromAPI('/veterinarios', { method: 'POST', body: JSON.stringify(data) }),
  updateVeterinario: (id: number, data: unknown) => fetchFromAPI(`/veterinarios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVeterinario: (id: number) => fetchFromAPI(`/veterinarios/${id}`, { method: 'DELETE' }),

  getPacientes: () => fetchFromAPI('/pacientes'),
  createPaciente: (data: unknown) => fetchFromAPI('/pacientes', { method: 'POST', body: JSON.stringify(data) }),
  updatePaciente: (id: number, data: unknown) => fetchFromAPI(`/pacientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePaciente: (id: number) => fetchFromAPI(`/pacientes/${id}`, { method: 'DELETE' }),
};