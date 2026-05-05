export const getRootFromApiUrl = (apiUrl) => {
  if (!apiUrl) return '';
  return apiUrl.replace(/\/api\/?$/, '');
};

export const isRelativeApiUrl = (apiUrl) => Boolean(apiUrl) && apiUrl.startsWith('/');

export const resolveApiUrl = ({ hostname = '', isProduction = false, explicitApiUrl = '' } = {}) => {
  const trimmedApiUrl = explicitApiUrl?.trim?.() || '';
  const isRailwayHost = hostname.includes('railway.app');

  if (isProduction && trimmedApiUrl) {
    return trimmedApiUrl;
  }

  if (isRailwayHost && isProduction) {
    return '/api';
  }

  if (isProduction) {
    return '/api';
  }

  return trimmedApiUrl || 'http://localhost:8000/api';
};

export const resolveApiRootUrl = ({ hostname = '', isProduction = false, explicitApiUrl = '', explicitBackendRoot = '' } = {}) => {
  const trimmedApiUrl = explicitApiUrl?.trim?.() || '';
  const trimmedBackendRoot = explicitBackendRoot?.trim?.() || '';
  // Permite override em tempo de execução via localStorage para facilitar
  // debugging sem rebuild. Chave: 'prescrimed.backend.root' ou 'prescrimed.api.url'
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const runtimeBackend = (window.localStorage.getItem('prescrimed.backend.root') || '').trim();
      const runtimeApiUrl = (window.localStorage.getItem('prescrimed.api.url') || '').trim();
      if (runtimeBackend) return runtimeBackend.replace(/\/+$/, '');
      if (runtimeApiUrl && !runtimeApiUrl.startsWith('/')) return runtimeApiUrl.replace(/\/+$/, '').replace(/\/api\/?$/, '');
    }
  } catch (e) {
    // Não falhar se localStorage estiver indisponível
  }
  const isRailwayHost = hostname.includes('railway.app');

  if (trimmedApiUrl && isRelativeApiUrl(trimmedApiUrl)) {
    return '';
  }

  if (isProduction && trimmedBackendRoot) {
    return trimmedBackendRoot;
  }

  if (isProduction && trimmedApiUrl) {
    return getRootFromApiUrl(trimmedApiUrl);
  }

  if (isRailwayHost && isProduction) {
    return '';
  }

  if (isProduction) {
    return '';
  }

  return trimmedBackendRoot || getRootFromApiUrl(trimmedApiUrl) || 'http://localhost:8000';
};