import React, { useState, useEffect } from 'react';
import { getModels, createModel, deleteModel } from '../services/api';
import { AIModel, ModelCreateInput } from '../types';
import { ModelRegisterModal } from './ModelRegisterModal';
import { ModelDetails } from './ModelDetails';
import {
  Plus,
  Search,
  Filter,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Eye,
  RefreshCw,
  Layers
} from 'lucide-react';

export const Models: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const data = await getModels();
      setModels(data);
    } catch (err) {
      console.error('Error fetching models:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleRegister = async (input: ModelCreateInput) => {
    await createModel(input);
    await fetchModels();
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this model from governance tracking?')) {
      await deleteModel(id);
      if (selectedModelId === id) setSelectedModelId(null);
      await fetchModels();
    }
  };

  if (selectedModelId !== null) {
    const activeModel = models.find((m) => m.id === selectedModelId) || models[0];
    return (
      <ModelDetails
        model={activeModel}
        onBack={() => setSelectedModelId(null)}
        onRefresh={fetchModels}
      />
    );
  }

  const filteredModels = models.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.department.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = filterRisk === 'all' || m.risk_category.toLowerCase() === filterRisk.toLowerCase();
    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (risk: string) => {
    switch (risk.toUpperCase()) {
      case 'CRITICAL':
        return <span className="px-2.5 py-1 text-xs font-bold bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30 rounded-full">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2.5 py-1 text-xs font-bold bg-[#FB923C]/15 text-[#FB923C] border border-[#FB923C]/30 rounded-full">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 text-xs font-bold bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30 rounded-full">MEDIUM</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 rounded-full">LOW</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PRODUCTION':
        return <span className="px-2.5 py-1 text-xs font-medium bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 rounded-lg">Production</span>;
      case 'TESTING':
        return <span className="px-2.5 py-1 text-xs font-medium bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30 rounded-lg">Testing</span>;
      case 'DEVELOPMENT':
        return <span className="px-2.5 py-1 text-xs font-medium bg-[#67E8F9]/15 text-[#67E8F9] border border-[#67E8F9]/30 rounded-lg">Development</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-medium bg-[#101F29] text-[#94A3B8] border border-[#1D3440] rounded-lg">Retired</span>;
    }
  };

  return (
    <div className="space-y-6 bg-[#07111A] p-1">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0D1B24] border border-[#1D3440] p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC] flex items-center gap-3">
            <Cpu className="w-7 h-7 text-[#34D399]" />
            <span>AI Model Management</span>
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Enterprise registry for model onboarding, risk categorization, governance scoring, and lifecycle tracking.
          </p>
        </div>
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="emerald-button-glow flex items-center justify-center gap-2 px-5 py-2.5 bg-[#34D399] text-[#07111A] font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border border-[#34D399]/40"
        >
          <Plus className="w-5 h-5 text-[#07111A]" />
          <span>Register Model</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search model name or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0A1620] text-[#F8FAFC] border border-[#1D3440] rounded-xl focus:border-[#34D399] focus:outline-none text-sm placeholder-[#64748B] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8]">
            <Filter className="w-4 h-4 text-[#34D399]" />
            <span>Risk Level:</span>
          </div>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-3 py-2 bg-[#0A1620] text-[#F8FAFC] border border-[#1D3440] rounded-xl text-xs font-medium focus:border-[#34D399] focus:outline-none transition-all cursor-pointer"
          >
            <option value="all" className="bg-[#0D1B24] text-[#F8FAFC]">All Risks</option>
            <option value="critical" className="bg-[#0D1B24] text-[#F8FAFC]">Critical</option>
            <option value="high" className="bg-[#0D1B24] text-[#F8FAFC]">High</option>
            <option value="medium" className="bg-[#0D1B24] text-[#F8FAFC]">Medium</option>
            <option value="low" className="bg-[#0D1B24] text-[#F8FAFC]">Low</option>
          </select>
          <button
            onClick={fetchModels}
            className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0A1620] border border-[#1D3440] rounded-xl hover:border-[#34D399]/40 transition-colors cursor-pointer"
            title="Refresh models"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Models Grid / List */}
      {loading ? (
        <div className="p-12 text-center text-[#94A3B8]">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#34D399] mb-3" />
          <p>Loading enterprise AI model registry...</p>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="p-12 text-center bg-[#0D1B24] border border-[#1D3440] rounded-2xl text-[#94A3B8]">
          <AlertTriangle className="w-10 h-10 text-[#FACC15] mx-auto mb-3" />
          <p className="font-semibold text-[#F8FAFC]">No AI Models Found</p>
          <p className="text-xs mt-1">Try adjusting search filters or click "Register Model" to onboard a new model.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              className="bg-[#0D1B24] border border-[#1D3440] rounded-2xl p-5 hover:border-[#34D399]/50 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between spotlight-card"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-bold text-[#34D399] uppercase tracking-wider">{model.business_domain}</span>
                    <h3 className="text-lg font-bold text-[#F8FAFC] group-hover:text-[#67E8F9] transition-colors flex items-center gap-2">
                      {model.name}
                    </h3>
                    <span className="text-xs text-[#94A3B8]">v{model.version} • {model.model_type}</span>
                  </div>
                  {getRiskBadge(model.risk_category)}
                </div>

                <p className="text-xs text-[#94A3B8] line-clamp-2 mb-4">
                  {model.description || model.purpose || 'No description provided.'}
                </p>
              </div>

              <div>
                {/* Metrics Row */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-[#101F29] rounded-xl border border-[#1D3440] text-xs mb-4">
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">Governance Score</span>
                    <span className={`font-bold text-sm ${model.governance_score >= 80 ? 'text-[#34D399]' : 'text-[#FACC15]'}`}>
                      {model.governance_score}/100
                    </span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">Status</span>
                    {getStatusBadge(model.deployment_status)}
                  </div>
                </div>

                {/* Footer Meta */}
                <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-3 border-t border-[#1D3440]">
                  <span>Owner: <strong className="text-[#F8FAFC] font-medium">{model.owner}</strong></span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(e, model.id)}
                      className="p-1.5 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#F87171]/10 rounded-lg transition-colors"
                      title="Delete model"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="p-1.5 bg-[#34D399]/15 text-[#34D399] rounded-lg group-hover:bg-[#34D399] group-hover:text-[#07111A] transition-all">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Model Onboarding Register Modal */}
      <ModelRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmit={handleRegister}
      />
    </div>
  );
};
