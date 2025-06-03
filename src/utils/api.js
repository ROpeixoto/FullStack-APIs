export async function buscarFilmesDaLista(listType) {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${import.meta.env.VITE_API_URL}user-movie-list/${listType}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.error || "Erro ao buscar filmes");
  }

  return response.json();
}