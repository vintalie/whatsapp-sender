# Changelog

Todas as mudanças relevantes deste projeto serão documentadas neste arquivo.

O formato segue uma adaptação de Keep a Changelog, e o versionamento segue SemVer.

---

## [1.0.0] - 2025-12-29

### ✨ Adicionado
- Validação real de números WhatsApp utilizando a biblioteca Baileys.
- Conexão persistente com WhatsApp via QR Code, com salvamento de sessão.
- Importação de arquivos CSV para validação de números.
- Geração automática de números com prefixo configurável.
- Sistema de templates de mensagens com suporte a imagens.
- Página de preview de templates com visual fiel ao WhatsApp.
- Envio de mensagem de teste para número informado pelo usuário.
- Sidebar e layout unificado entre todas as páginas (Status, CSV, Gerador, Mensagens).
- Barra de progresso e status em tempo real durante validações.
- Filtros de visualização (todos, válidos, inválidos) na página CSV.
- Paginação de resultados para grandes volumes de números.
- Indicação da origem do número (csv ou generator).

### 🔧 Alterado
- Centralização de todo o estado da aplicação em um fakeDB persistente.
- Padronização do armazenamento de dados em `data/data.json`.
- Separação clara entre:
  - `/api/validation` → controle de job
  - `/api/numbers` → dados persistidos
- Atualização dinâmica do frontend baseada exclusivamente no fakeDB.
- Refatoração do fluxo de upload de CSV para conversão prévia em array de números.
- Contrato estável entre backend e frontend para evitar inconsistências.

### 🐛 Corrigido
- Correção de validação incorreta causada por strings sendo tratadas como arrays.
- Correção de registros inválidos gerados a partir de paths de arquivos.
- Correção de atualização dinâmica da tabela CSV durante validação.
- Correção de inconsistências entre status do backend e exibição no frontend.
- Remoção de dependências desnecessárias (localStorage, uuid).

### 🗑️ Removido
- Uso de estado em memória para validação.
- Salvamento temporário de resultados apenas no frontend.
- Dependências externas desnecessárias para geração de IDs.

---

## [Unreleased]

### 🔜 Planejado
- Envio em massa de mensagens utilizando templates.
- Busca e filtros avançados na tabela CSV.
- Exportação de CSV filtrado.
- Persistência em banco de dados real (MySQL/PostgreSQL).
- Controle avançado de taxa e prevenção de spam.
