window.addEventListener('DOMContentLoaded', () => {
  const results = JSON.parse(localStorage.getItem('pingResults') || '[]');
  const tbody = document.getElementById('resultsBody');

  results.forEach(({ ip, alive }) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${ip}</td><td>${alive ? '✅ Alive' : '❌ Dead'}</td>`;
    tbody.appendChild(row);
  });
});
