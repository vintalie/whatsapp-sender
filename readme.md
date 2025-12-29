# WhatsApp Sender Panel

Painel web para validação de números WhatsApp, geração de listas, gerenciamento de templates de mensagens e envio de mensagens utilizando a biblioteca Baileys.

---

## 🚀 Funcionalidades

### 📡 Conexão WhatsApp
- Conexão via QR Code.
- Sessão persistente (não é necessário escanear sempre).
- Status em tempo real da conexão.

### 📄 Validação de CSV
- Upload de arquivos CSV com números.
- Validação real de números WhatsApp.
- Acompanhamento em tempo real:
  - Número atual
  - Próximo número
  - Barra de progresso
- Histórico completo de validações.
- Filtros:
  - Todos
  - Válidos
  - Inválidos
- Paginação de resultados.

### 🔢 Gerador de Números
- Geração automática de números com prefixo configurável.
- Quantidade de números configurável.
- Validação em tempo real.
- Salvamento automático dos números válidos.
- Download do CSV gerado.

### ✉️ Templates de Mensagens
- Criação de templates de mensagens.
- Upload de imagens para envio.
- Persistência em banco fictício (fakeDB).
- Preview fiel ao WhatsApp.
- Envio de mensagem de teste para número informado.
- Listagem, edição e exclusão de templates.

### 💾 Persistência de Dados
- Fake database persistente em arquivo JSON.
- Arquivo único: `data/data.json`.
- Fácil migração futura para banco de dados real.

---

## 🧱 Arquitetura

whatsapp-sender/
│
├── server.js
├── lib/
│ ├── whatsapp.js
│ ├── validator.js
│ ├── validationJob.js
│ ├── csvParser.js
│ ├── fakeDB.js
│ └── messageController.js
│
├── data/
│ └── data.json
│
├── public/
│ ├── index.html
│ ├── csv.html
│ ├── generate.html
│ ├── message.html
│ └── assets/
│ └── style.css
│
└── uploads/


---

## ⚙️ Instalação

### Pré-requisitos
- Node.js 18+ (recomendado Node 20+)
- WhatsApp ativo para escanear o QR Code

### Instalar dependências
```bash
npm install
▶️ Executar o projeto
node server.js


Acesse no navegador:

http://localhost:3000

🧪 Como usar
1️⃣ Conectar WhatsApp

Acesse o Dashboard.

Escaneie o QR Code com o WhatsApp.

Aguarde o status "Conectado".

2️⃣ Validar CSV

Vá até a página CSV.

Envie um arquivo CSV com números.

Acompanhe a validação em tempo real.

3️⃣ Gerar números

Vá até o Gerador.

Configure prefixo e quantidade.

Inicie a geração.

Baixe o CSV ao final.

4️⃣ Criar templates

Vá até Mensagens.

Crie um template com texto e imagem.

Visualize o preview.

Envie mensagem de teste.

📌 Regras Importantes

A validação só funciona se o WhatsApp estiver conectado.

O fakeDB é a fonte única da verdade.

/api/validation controla o job.

/api/numbers fornece os dados.

Uploads de imagens ficam na pasta uploads/.

🔐 Aviso Legal

Este projeto é apenas para fins educacionais e de testes.
O envio em massa de mensagens pode violar os termos do WhatsApp.
Use com responsabilidade.

📄 Licença

MIT License


---

## ✅ Próximo passo (opcional)

Se quiser, posso:
- gerar **exemplos de CSV**
- criar um **.env.example**
- preparar **Dockerfile**
- ou planejar o **envio em massa com controle anti-spam**

Você agora tem **documentação de projeto profissional** 🚀