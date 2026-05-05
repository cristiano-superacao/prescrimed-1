import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';

export default function RuntimeConfig() {
  const [visible, setVisible] = useState(false);
  const [backendRoot, setBackendRoot] = useState(() =>
    (typeof window !== 'undefined' && window.localStorage.getItem('prescrimed.backend.root')) || ''
  );
  const [apiUrl, setApiUrl] = useState(() =>
    (typeof window !== 'undefined' && window.localStorage.getItem('prescrimed.api.url')) || ''
  );
  const [supabaseRaw, setSupabaseRaw] = useState(() => {
    try {
      const raw = typeof window !== 'undefined' && window.localStorage.getItem('prescrimed.supabase.config');
      return raw || '';
    } catch { return ''; }
  });

  const save = () => {
    try {
      if (typeof window === 'undefined') return;
      if (backendRoot && backendRoot.trim()) {
        window.localStorage.setItem('prescrimed.backend.root', backendRoot.trim());
      } else {
        window.localStorage.removeItem('prescrimed.backend.root');
      }

      if (apiUrl && apiUrl.trim()) {
        window.localStorage.setItem('prescrimed.api.url', apiUrl.trim());
      } else {
        window.localStorage.removeItem('prescrimed.api.url');
      }

      if (supabaseRaw && supabaseRaw.trim()) {
        // salva raw JSON como string (mesma chave usada pelo lib/supabase)
        window.localStorage.setItem('prescrimed.supabase.config', supabaseRaw.trim());
      } else {
        window.localStorage.removeItem('prescrimed.supabase.config');
      }
      // reload opcional para aplicar alterações imediatas
      // window.location.reload();
      alert('Configurações salvas localmente. Recarregue a página se necessário.');
    } catch (e) {
      console.error('Erro ao salvar configurações runtime', e);
      alert('Falha ao salvar configurações no navegador. Veja o console.');
    }
  };

  const [testing, setTesting] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null); // null | 'ok' | 'fail'
  const [healthMessage, setHealthMessage] = useState('');
  const [supabaseStatus, setSupabaseStatus] = useState(null); // null | 'ok' | 'fail'
  const [supabaseMessage, setSupabaseMessage] = useState('');

  const testConnections = async () => {
    setTesting(true);
    setHealthStatus(null);
    setSupabaseStatus(null);
    setHealthMessage('');
    setSupabaseMessage('');

    let localHealthStatus = null;
    let localHealthMessage = '';
    let localSupabaseStatus = null;
    let localSupabaseMessage = '';

    // Resolve root
    let root = '';
    if (apiUrl && apiUrl.trim()) {
      root = apiUrl.trim().replace(/\/+$/,'').replace(/\/api\/?$/,'');
    } else if (backendRoot && backendRoot.trim()) {
      root = backendRoot.trim().replace(/\/+$/,'');
    }

    // Test health
    if (root) {
      const candidates = [`${root}/api/health`, `${root}/health`];
      let ok = false;
      let lastErr = '';
      for (const url of candidates) {
        try {
          const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(5000), mode: 'cors' });
          if (res && res.ok) {
            ok = true;
            break;
          }
          if (res && res.status === 503) {
            // Consider degraded as ok for connectivity
            ok = true;
            break;
          }
          lastErr = `HTTP ${res?.status}`;
        } catch (e) {
          lastErr = e?.message || String(e);
        }
      }
      if (ok) {
        localHealthStatus = 'ok';
        localHealthMessage = 'Backend alcançável';
        setHealthStatus('ok');
        setHealthMessage('Backend alcançável');
      } else {
        localHealthStatus = 'fail';
        localHealthMessage = `Falha ao alcançar health: ${lastErr}`;
        setHealthStatus('fail');
        setHealthMessage(`Falha ao alcançar health: ${lastErr}`);
      }
    } else {
      setHealthStatus('fail');
      setHealthMessage('Nenhum backend definido para testar');
    }

    // Test Supabase if JSON informado
    if (supabaseRaw && supabaseRaw.trim()) {
      try {
        const parsed = JSON.parse(supabaseRaw);
        const url = parsed.url || parsed.VITE_SUPABASE_URL || parsed.supabaseUrl || '';
        const anon = parsed.anonKey || parsed.VITE_SUPABASE_ANON_KEY || parsed.anon || '';
          if (url && anon) {
          try {
            const res = await fetch(`${url.replace(/\/+$/,'')}/auth/v1/settings`, {
              headers: { apikey: anon },
              signal: AbortSignal.timeout(5000)
            });
            if (res.ok) {
              localSupabaseStatus = 'ok';
              localSupabaseMessage = 'Supabase alcançável';
              setSupabaseStatus('ok');
              setSupabaseMessage('Supabase alcançável');
            } else {
              localSupabaseStatus = 'fail';
              localSupabaseMessage = `Supabase respondeu ${res.status}`;
              setSupabaseStatus('fail');
              setSupabaseMessage(`Supabase respondeu ${res.status}`);
            }
          } catch (e) {
            setSupabaseStatus('fail');
            setSupabaseMessage(`Erro de rede: ${e?.message || e}`);
          }
        } else {
          localSupabaseStatus = 'fail';
          localSupabaseMessage = 'JSON inválido ou sem url/anonKey';
          setSupabaseStatus('fail');
          setSupabaseMessage('JSON inválido ou sem url/anonKey');
        }
      } catch (e) {
        localSupabaseStatus = 'fail';
        localSupabaseMessage = 'Supabase JSON inválido';
        setSupabaseStatus('fail');
        setSupabaseMessage('Supabase JSON inválido');
      }
    }

    setTesting(false);
    return { healthStatus: localHealthStatus, healthMessage: localHealthMessage, supabaseStatus: localSupabaseStatus, supabaseMessage: localSupabaseMessage };
  };

  const clearAll = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('prescrimed.backend.root');
    window.localStorage.removeItem('prescrimed.api.url');
    window.localStorage.removeItem('prescrimed.supabase.config');
    setBackendRoot('');
    setApiUrl('');
    setSupabaseRaw('');
    alert('Overrides runtime removidos. Recarregue a página.');
  };

  // Mostrar o controle apenas em desenvolvimento ou quando explicitamente permitido
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    try {
      const forced = typeof window !== 'undefined' && (
        window.localStorage.getItem('prescrimed.showRuntimeConfig') === '1' ||
        window.location.search.includes('showRuntimeConfig=1')
      );
      const isDev = import.meta.env.DEV;
      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      setAllowed(Boolean(isDev || forced || isLocal));
    } catch {
      setAllowed(false);
    }
  }, []);

  if (!allowed) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="backdrop-blur-sm bg-white/80 p-2 rounded-lg shadow-lg text-xs w-80 sm:w-96">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setVisible(v => !v)}
            className="flex items-center gap-2 px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
            aria-expanded={visible}
            aria-controls="runtime-config-panel"
            title="Configuração runtime (apenas dev/local)"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Config Runtime</span>
          </button>
          <button
            onClick={clearAll}
            className="text-xs text-red-600 hover:underline"
            title="Limpar overrides runtime"
          >
            Limpar
          </button>
        </div>
        {visible ? (
          <div id="runtime-config-panel" className="mt-3 space-y-2">
            <label className="block text-xs">Backend root (ex: https://meu.backend.com)</label>
            <input className="w-full p-1 text-sm border rounded" value={backendRoot} onChange={e => setBackendRoot(e.target.value)} />

            <label className="block text-xs">API URL (opcional, ex: https://meu.backend.com/api)</label>
            <input className="w-full p-1 text-sm border rounded" value={apiUrl} onChange={e => setApiUrl(e.target.value)} />

            <label className="block text-xs">Supabase config (JSON) — opcional</label>
            <textarea rows={4} className="w-full p-1 text-sm border rounded" value={supabaseRaw} onChange={e => setSupabaseRaw(e.target.value)} />

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={async () => {
                  const res = await testConnections();
                  const ok = res?.healthStatus === 'ok' || res?.healthStatus === null;
                  if (ok) {
                    save();
                  } else if (confirm('Teste do backend falhou. Deseja salvar mesmo assim?')) {
                    save();
                  }
                }}
                disabled={testing}
              >
                {testing ? 'Testando...' : 'Testar & Salvar'}
              </button>
              <button className="px-3 py-1 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200" onClick={() => setVisible(false)}>Fechar</button>
            </div>
            <div className="text-xs mt-1 space-y-1">
              {healthStatus ? (
                <div className={`p-1 rounded ${healthStatus==='ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <strong>Health:</strong> {healthMessage}
                </div>
              ) : null}
              {supabaseStatus ? (
                <div className={`p-1 rounded ${supabaseStatus==='ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <strong>Supabase:</strong> {supabaseMessage}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
