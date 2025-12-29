const form = document.getElementById('templateForm');
const table = document.getElementById('templateTable');
const statusBox = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    statusBox.innerText = '⏳ Salvando template...';

    const data = new FormData(form);

    const res = await fetch('/api/templates', {
        method: 'POST',
        body: data
    });

    const result = await res.json();

    statusBox.innerText = result.message || 'Template salvo';
    form.reset();

    loadTemplates();
});

async function edit(id, name, text) {
    const payload = { id };

    if (name !== null) payload.name = name;
    if (text !== null) payload.text = text;

    await fetch('/api/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}

async function removeTemplate(id) {
    if (!confirm('Deseja excluir este template?')) return;

    await fetch(`/api/templates/${id}`, {
        method: 'DELETE'
    });

    loadTemplates();
}


async function loadTemplates() {
    const res = await fetch('/api/templates');
    const templates = await res.json();

    table.innerHTML = templates.map(t => `
        <tr>
            <td>
                <input value="${t.name}"
                       onchange="edit(${t.id}, this.value, null)">
            </td>

            <td>
                <textarea
                    onchange="edit(${t.id}, null, this.value)"
                >${t.text}</textarea>
            </td>

            <td>
                ${t.image
                    ? `<img src="${t.image}" class="thumb">`
                    : '—'}
            </td>

            <td>
                <a href="/message/${t.id}/template-view">👁 Preview</a>
                <button onclick="removeTemplate(${t.id})">🗑</button>
            </td>
        </tr>
    `).join('');
}


loadTemplates();
