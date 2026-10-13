import React, { useState } from 'react';
import { ModelConfig } from '../types';
import { Sliders, Cpu, HardDrive, Terminal, RefreshCw, Power, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react';

interface HardwareViewProps {
  models: ModelConfig[];
  setModels: React.Dispatch<React.SetStateAction<ModelConfig[]>>;
}

export const HardwareView: React.FC<HardwareViewProps> = ({ models, setModels }) => {
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const totalVramGb = 48.0; // Dual RTX 3090 / 4090 or single 48GB workstation
  const usedVramGb = models.filter(m => m.status === 'loaded').reduce((acc, m) => acc + m.vramUsageGb, 0);
  const freeVramGb = Math.max(0, totalVramGb - usedVramGb);
  const vramPercent = Math.round((usedVramGb / totalVramGb) * 100);

  const toggleModelStatus = (id: string) => {
    setModels(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'loaded' ? 'unloaded' : 'loaded';
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  const copyScriptText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(key);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const koboldScript = `koboldcpp.exe --model C:/AI/models/koboldcpp/Llama-3-70B-Instruct-Q4_K_M.gguf --port 5001 --gpulayers 83 --threads 12 --contextsize 8192`;
  const fluxScript = `python -m flux_inference --model_path C:/AI/models/flux/flux1-dev-fp8.safetensors --lora Realism-LoRA-v2.safetensors --port 7860 --fp8`;
  const wanScript = `python generate.py --model Wan2.1-T2V-1.3B --ckpt C:/AI/models/wan2.1/wan2.1_t2v_1.3b_bf16.safetensors --device cuda --resolution 720p`;

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] bg-slate-950 text-slate-100 overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-indigo-400" />
            <span>Hardware & Gerenciamento de VRAM Local</span>
          </h2>
          <p className="text-sm text-slate-400">Monitore o consumo de VRAM da GPU e configure os comandos de inicialização dos modelos locais.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-xl text-xs font-mono">
            GPU: NVIDIA RTX Workstation (48GB VRAM)
          </span>
        </div>
      </div>

      {/* VRAM Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">VRAM Total Usada</span>
            <HardDrive className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-white">{usedVramGb.toFixed(1)} GB <span className="text-base font-normal text-slate-400">/ {totalVramGb} GB</span></div>
            <div className="w-full bg-slate-950 rounded-full h-3 mt-3 overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${vramPercent}%` }} />
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>Ocupação: {vramPercent}%</span>
            <span className="text-emerald-400">{freeVramGb.toFixed(1)} GB Livres</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Temperatura da GPU</span>
            <Cpu className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-white">64°C</div>
            <p className="text-xs text-slate-400 mt-2">Ventoinhas a 45% (Silencioso)</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Thermal Throttling: Inativo</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Modelos Ativos</span>
            <Terminal className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-white">{models.filter(m => m.status === 'loaded').length} / {models.length}</div>
            <p className="text-xs text-slate-400 mt-2">KoboldCpp, Flux.1, Wan2.1</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sincronização em tempo real</span>
          </div>
        </div>
      </div>

      {/* Model Loading Table / Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
        <h3 className="text-base font-bold text-white">Gerenciamento de Instâncias e VRAM</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-4">Backend / Ferramenta</th>
                <th className="pb-3 px-4">Nome do Modelo</th>
                <th className="pb-3 px-4">Quantização</th>
                <th className="pb-3 px-4">VRAM Alocada</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm font-mono">
              {models.map(model => (
                <tr key={model.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 font-semibold text-white">{model.backend}</td>
                  <td className="py-4 px-4 text-slate-300">{model.name}</td>
                  <td className="py-4 px-4 text-slate-400">{model.quantization || 'N/A'}</td>
                  <td className="py-4 px-4 text-indigo-400">{model.vramUsageGb} GB</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
                      model.status === 'loaded'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${model.status === 'loaded' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                      {model.status === 'loaded' ? 'Carregado na VRAM' : 'Descarregado'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => toggleModelStatus(model.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ml-auto ${
                        model.status === 'loaded'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                          : 'bg-indigo-600 text-white hover:bg-indigo-500'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{model.status === 'loaded' ? 'Descarregar' : 'Carregar'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Startup Command Snippets */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <span>Comandos de Inicialização (CLI / Bash)</span>
        </h3>
        <p className="text-xs text-slate-400">Utilize estes comandos no seu terminal local para iniciar os backends com suporte a GPU CUDA.</p>

        <div className="space-y-4">
          {/* KoboldCpp CLI */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-indigo-400 font-semibold">KoboldCpp (Texto)</span>
              <button
                onClick={() => copyScriptText(koboldScript, 'kobold')}
                className="flex items-center gap-1 text-slate-300 hover:text-white"
              >
                {copiedScript === 'kobold' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript === 'kobold' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-200 overflow-x-auto p-3 bg-slate-900 rounded-lg">{koboldScript}</pre>
          </div>

          {/* Flux.1 Dev CLI */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-pink-400 font-semibold">Flux.1 Dev + LoRA (Imagem)</span>
              <button
                onClick={() => copyScriptText(fluxScript, 'flux')}
                className="flex items-center gap-1 text-slate-300 hover:text-white"
              >
                {copiedScript === 'flux' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript === 'flux' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-200 overflow-x-auto p-3 bg-slate-900 rounded-lg">{fluxScript}</pre>
          </div>

          {/* Wan2.1 CLI */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-purple-400 font-semibold">Wan2.1 T2V (Vídeo)</span>
              <button
                onClick={() => copyScriptText(wanScript, 'wan')}
                className="flex items-center gap-1 text-slate-300 hover:text-white"
              >
                {copiedScript === 'wan' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript === 'wan' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-200 overflow-x-auto p-3 bg-slate-900 rounded-lg">{wanScript}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
