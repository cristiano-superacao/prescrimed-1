## Skill: Criar SKILL.md para `agent-customization` (fluxo completo)

Resumo
------
Skill para transformar conversas, checklists e práticas recorrentes em um `SKILL.md` reutilizável e versionável dentro da workspace. Fornece um fluxo completo: coleta de contexto, definição de gatilhos, entradas/saídas, critérios de qualidade e exemplos reais do repositório.

Escopo
------
- Padrão: workspace-scoped (arquivo salvo em `.vscode/skills/agent-customization/SKILL.md`).
- Pode ser convertida para uso pessoal removendo a pasta da workspace e mantendo a cópia local.

Quando usar
-----------
- Ao formalizar um procedimento recorrente (ex.: pré-deploy, verificação de segurança, revisão de PRs).
- Ao extrair um processo conversacional em passos reprodutíveis.

Objetivo de saída
-----------------
- Um `SKILL.md` detalhado que descreva o fluxo, pontos de decisão e verificação final.
- Exemplos e prompts testados com arquivos reais do repositório.

Fluxo passo-a-passo (Workflow)
------------------------------
1. Identificar o contexto da conversa (mensagens, PR, issue ou histórico de commits).
2. Mapear o processo observado em passos atômicos e ordenados.
3. Listar pontos de decisão (condições que mudam o caminho do fluxo).
4. Definir entradas (arquivos, variáveis, permissões) e saídas esperadas (artefatos, arquivos criados, checklist concluído).
5. Escrever rascunho do `SKILL.md` incluindo exemplos concretos e prompts de invocação.
6. Validar com 1-2 execuções manuais usando casos reais do repositório.
7. Ajustar linguagem, tornar prompts determinísticos e adicionar critérios de aceitação.
8. Salvar versão inicial e adicionar nota de `versão` com data/autor.

Pontos de decisão (exemplos)
---------------------------
- Escopo: "Se o autor do PR for um colaborador externo, rodar checks extras".
- Automação: "Se existir script `predeploy:check` em `package.json`, executar automaticamente; senão, orientar execução manual".

Critérios de qualidade (checklist)
---------------------------------
- [ ] Descreve claramente gatilhos de invocação.
- [ ] Lista entradas e pré-requisitos (ex.: Node >= 20).
- [ ] Inclui pelo menos 2 prompts de exemplo.
- [ ] Contém 1 caso de uso validado com arquivos reais do repositório.
- [ ] Tem instruções de manutenção (como atualizar exemplos e versão).

Exemplos reais (do repositório)
--------------------------------
- Script detectado em `package.json`: `predeploy:check` — use como gatilho automático quando presente.
- Rota de API exemplo: [routes/prescricao.routes.js](routes/prescricao.routes.js) — boa candidata para checks de segurança e validação de `empresaId`/autorização.

Como validar com um caso real
-----------------------------
1. Executar workflow manualmente contra o caso "predeploy":
	- Verifique se `predeploy:check` existe em `package.json` e rode `npm run predeploy:check`.
	- Se falhar, registre as saídas e transforme a falha em passo do `SKILL.md` (ex.: "Corrigir variável X no env").
2. Validar regra de autorização em `routes/prescricao.routes.js`:
	- Checar presença de filtros por `empresaId` e uso de `tenantIsolation`/`req.tenantEmpresaId`.
	- Documentar o critério: "Todas as rotas que manipulam dados multi-tenant devem verificar `empresaId` ou `req.tenantEmpresaId`."

Prompts de exemplo (versões finais para usar com o agente)
-------------------------------------------------------
- "Gere um SKILL.md workspace que valida o fluxo de pré-deploy usando `predeploy:check` do `package.json` e adicione passos de correção se falhar." 
- "Crie um checklist para revisar rotas que manipulam dados multi-tenant; valide `routes/prescricao.routes.js` e proponha testes unitários simples." 

Modelo detalhado de `SKILL.md` gerado
------------------------------------
- Título
- Resumo objetivo
- Escopo (workspace/pessoal)
- Quando usar (gatilhos)
- Entradas esperadas (arquivos, versões de runtime)
- Saídas geradas (arquivos, checklist, mudanças sugeridas)
- Passos detalhados (com comandos exatos quando aplicável)
- Pontos de decisão e rotas alternativas
- Critérios de qualidade e checklist
- Exemplos de prompts (prontos para usar)
- Casos reais validados (com referências de arquivo)
- Instruções de manutenção (como atualizar)

Local de salvamento sugerido
---------------------------
Salvar em `.vscode/skills/agent-customization/SKILL.md` para acesso coletivo da equipe.

Notas de iteração e manutenção
------------------------------
- Ao alterar um exemplo real, atualize a seção "Casos reais validados" com data e autor.
- Adicione mais prompts quando um padrão de conversa se provar útil.

Exemplo rápido de passos executáveis
-----------------------------------
1. Checar script de predeploy:

```powershell
npm run predeploy:check
```

2. Revisar rota de prescrição (resumo do check):
	- Verificar uso de `empresaId`/`tenantEmpresaId`.
	- Confirmar tratamento de campos de `medicamentos` com `normalizeMedicamentos`.

Autor
-----
Gerado por assistente de criação de skills — revise e ajuste conforme políticas do time.

Versão
-----
1.1 (completo, exemplos reais)

Salvar este arquivo em `.vscode/skills/agent-customization/SKILL.md` para que membros da equipe o encontrem facilmente.

Iteração e manutenção
----------------------
- Atualize a seção "Exemplos" com prompts reais que funcionaram.
- Registre mudanças significativas no cabeçalho com data e autor.

Autor
-----
Gerado por assistente de criação de skills — revise antes de usar.

Versão
-----
1.0
