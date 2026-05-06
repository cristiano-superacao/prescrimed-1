import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.cwd(), '.vscode', 'skills', 'agent-customization');
const outPath = path.join(outDir, 'SKILL.md');

const content = `# Skill: Criar SKILL.md para agent-customization (gerado)

Resumo
------
Skill para transformar conversas, checklists e práticas recorrentes em um SKILL.md reutilizável dentro da workspace.

Escopo
------
- Workspace-scoped (arquivo salvo em .vscode/skills/agent-customization/SKILL.md).

Fluxo (resumo)
--------------
1. Identificar contexto
2. Mapear passos
3. Definir gatilhos
4. Especificar entradas/saídas
5. Rascunhar e validar

Exemplos reais (automatizados)
--------------------------------
- Detecta script `predeploy:check` em package.json e recomenda execução.
- Referência de rota: routes/prescricao.routes.js — validações multi-tenant.

Versão: 1.1 (gerado)
`;

try {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, content, 'utf8');
  console.log('SKILL.md gerado em:', outPath);
} catch (err) {
  console.error('Erro ao gerar SKILL.md:', err);
  process.exit(1);
}
