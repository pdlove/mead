document.getElementById('rangeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const cidr = document.getElementById('cidrInput').value;
  const results = await window.electronAPI.pingRange(cidr);
  localStorage.setItem('pingResults', JSON.stringify(results));
  window.location = 'results.html';
});
