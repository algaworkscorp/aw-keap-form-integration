const container = document.getElementById('custom-fields');
const addBtn = document.getElementById('add-custom');
const form = document.getElementById('test-form');
const errorMsg = document.getElementById('custom-error');

function addRow(name = '', value = '') {
  const row = document.createElement('div');
  row.className = 'custom-row';

  row.innerHTML = `
    <div class="prefix-wrap">
      <span class="prefix">inf_custom_</span>
      <input class="name-input" type="text" placeholder="NomeDoCampo" value="${escAttr(name)}" />
    </div>
    <input class="value-input" type="text" placeholder="Valor" value="${escAttr(value)}" />
    <button class="remove-btn" type="button" title="Remover">✕</button>
  `;

  row.querySelector('.remove-btn').addEventListener('click', () => row.remove());
  container.appendChild(row);
  row.querySelector('.name-input').focus();
}

function escAttr(str) {
  return str.replace(/"/g, '&quot;');
}

addBtn.addEventListener('click', () => addRow());

form.addEventListener('submit', (e) => {
  const rows = container.querySelectorAll('.custom-row');
  let valid = true;

  rows.forEach((row) => {
    const nameInput = row.querySelector('.name-input');
    if (nameInput.value.trim() === '') valid = false;
  });

  if (!valid) {
    e.preventDefault();
    errorMsg.style.display = 'block';
    return;
  }

  errorMsg.style.display = 'none';

  // Injeta inputs ocultos com o nome completo antes de submeter
  rows.forEach((row) => {
    const name = row.querySelector('.name-input').value.trim();
    const value = row.querySelector('.value-input').value;

    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = `inf_custom_${name}`;
    hidden.value = value;
    form.appendChild(hidden);
  });
});
