/**
 * Prescrimed - Sistema de Gestão de Prescrições Médicas
 * Componente principal da aplicação React
 * 
 * Este arquivo gerencia o roteamento e estrutura geral do frontend,
 * incluindo rotas públicas (login/registro) e rotas protegidas (dashboard, etc).
 */

// Importações do React Router para gerenciamento de rotas
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Biblioteca para notificações toast (alertas visuais)
import { Toaster } from 'react-hot-toast';
import './utils/toast';

// ===== PÁGINAS DA APLICAÇÃO =====
// Páginas públicas (sem necessidade de autenticação)
import Login from './pages/Login'; // Tela de login do usuário
import Register from './pages/Register'; // Tela de registro/onboarding

// Páginas protegidas (requerem autenticação)
import Dashboard from './pages/Dashboard'; // Dashboard com estatísticas e resumo
import Pacientes from './pages/Pacientes'; // Gestão de pacientes (CRUD)
import Prescricoes from './pages/Prescricoes'; // Criação e gestão de prescrições médicas
import CensoMP from './pages/CensoMP'; // Censo e mapas de pacientes
import Usuarios from './pages/Usuarios'; // Gerenciamento de usuários do sistema
import Empresas from './pages/Empresas'; // Gestão de empresas (multi-tenant)
import Backups from './pages/Backups'; // Backups (Superadmin)
import Configuracoes from './pages/Configuracoes'; // Configurações do sistema
import Agenda from './pages/Agenda'; // Agenda de consultas e atendimentos
import Cronograma from './pages/Cronograma'; // Cronograma de atividades
import Estoque from './pages/Estoque'; // Controle de estoque de medicamentos
import Evolucao from './pages/Evolucao'; // Evolução clínica dos pacientes
import Financeiro from './pages/Financeiro'; // Gestão financeira (receitas/despesas)
import ComercialFiscal from './pages/ComercialFiscal'; // Comercial + fiscal (catálogo, pedidos e notas)
import Manual from './pages/Manual'; // Manual de uso do sistema

// ===== COMPONENTES DE LAYOUT E SEGURANÇA =====
import Layout from './components/Layout'; // Layout principal com sidebar e header
import ProtectedRoute from './components/ProtectedRoute'; // HOC para proteger rotas que requerem autenticação
import BackendStatusMonitor from './components/BackendStatusMonitor'; // Monitor de status de conexão com backend
import RuntimeConfig from './components/RuntimeConfig';

/**
 * Componente principal da aplicação
 * Configura o sistema de roteamento e estrutura de páginas
 * 
 * @returns {JSX.Element} Estrutura completa de rotas da aplicação
 */
function App() {
  return (
    <>
      {/* Monitor de status da API - mostra alerta se backend estiver offline */}
      <BackendStatusMonitor />
      
      {/* Configuração do roteador com flags de compatibilidade para React Router v7 */}
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* ===== ROTAS PÚBLICAS (sem autenticação) ===== */}
          <Route path="/login" element={<Login />} /> {/* Página de login */}
          <Route path="/register" element={<Register />} /> {/* Página de registro/onboarding */}

          {/* ===== ROTAS PROTEGIDAS (requerem autenticação) ===== */}
          {/* Layout principal que envolve todas as rotas autenticadas */}
          <Route
            path="/"
            element={
              <ProtectedRoute> {/* Wrapper que verifica se usuário está autenticado */}
                <Layout /> {/* Layout com sidebar, header e área de conteúdo */}
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            
            {/* Dashboard - página inicial com estatísticas e resumo */}
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Agenda - gerenciamento de consultas e agendamentos */}
            <Route
              path="agenda"
              element={
                <ProtectedRoute>
                  <Agenda />
                </ProtectedRoute>
              }
            />

            {/* Cronograma - visualização de atividades programadas */}
            <Route
              path="cronograma"
              element={
                <ProtectedRoute>
                  <Cronograma />
                </ProtectedRoute>
              }
            />

            {/* Censo MP - censo e mapa de pacientes (requer permissão específica) */}
            <Route
              path="censo-mp"
              element={
                <ProtectedRoute requiredPermission="prescricoes">
                  <CensoMP />
                </ProtectedRoute>
              }
            />

            {/* Prescrições - criação e gestão de prescrições médicas */}
            <Route
              path="prescricoes"
              element={
                <ProtectedRoute requiredPermission="prescricoes">
                  <Prescricoes />
                </ProtectedRoute>
              }
            />

            {/* Estoque - controle de medicamentos e insumos */}
            <Route
              path="estoque"
              element={
                <ProtectedRoute>
                  <Estoque />
                </ProtectedRoute>
              }
            />

            {/* Evolução - acompanhamento da evolução clínica dos pacientes */}
            <Route
              path="evolucao"
              element={
                <ProtectedRoute>
                  <Evolucao />
                </ProtectedRoute>
              }
            />

            {/* Financeiro - gestão de receitas, despesas e fluxo de caixa */}
            <Route
              path="financeiro"
              element={
                <ProtectedRoute>
                  <Financeiro />
                </ProtectedRoute>
              }
            />

            <Route
              path="comercial"
              element={
                <ProtectedRoute>
                  <ComercialFiscal />
                </ProtectedRoute>
              }
            />

            {/* Residentes/Pacientes - cadastro e gestão de pacientes */}
            <Route
              path="residentes"
              element={
                <ProtectedRoute requiredPermission="pacientes">
                  <Pacientes />
                </ProtectedRoute>
              }
            />
            
            {/* Redirecionamento para manter compatibilidade com rota antiga */}
            <Route path="pacientes" element={<Navigate to="/residentes" replace />} />
            
            {/* Usuários - gerenciamento de usuários do sistema (requer permissão admin) */}
            <Route
              path="usuarios"
              element={
                <ProtectedRoute requiredPermission="usuarios">
                  <Usuarios />
                </ProtectedRoute>
              }
            />

            {/* Empresas - gestão de empresas (multi-tenant) */}
            <Route
              path="empresas"
              element={
                <ProtectedRoute>
                  <Empresas />
                </ProtectedRoute>
              }
            />

            {/* Backups - geração/listagem/download (Superadmin) */}
            <Route
              path="backups"
              element={
                <ProtectedRoute>
                  <Backups />
                </ProtectedRoute>
              }
            />
            
            {/* Configurações - ajustes e preferências do sistema */}
            <Route
              path="configuracoes"
              element={
                <ProtectedRoute requiredPermission="configuracoes">
                  <Configuracoes />
                </ProtectedRoute>
              }
            />

            {/* Manual - documentação e ajuda do sistema */}
            <Route
              path="manual"
              element={
                <ProtectedRoute>
                  <Manual />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Rota curinga (404) - redireciona qualquer rota não encontrada para /login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      
      {/* Componente de notificações toast - exibe alertas em toda a aplicação */}
      <Toaster
        position="top-right"
        containerStyle={{ top: 16, right: 16, left: 'auto', maxWidth: 420 }}
      />
      {/* Pequena UI para sobrescrever configuração do backend/supabase em runtime (debug) */}
      <RuntimeConfig />
    </>
  );
}

// Exporta o componente App para ser usado no index.jsx
export default App;
