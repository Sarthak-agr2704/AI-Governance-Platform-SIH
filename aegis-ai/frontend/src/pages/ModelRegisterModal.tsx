import React, { useState } from 'react';
import { ModelCreateInput } from '../types';
import { X, ShieldAlert, Cpu, Layers, UserCheck, CheckCircle } from 'lucide-react';

interface ModelRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: ModelCreateInput) => Promise<void>;
}

export const ModelRegisterModal: React.FC<ModelRegisterModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ModelCreateInput>({
    name: '',
    version: '1.0.0',
    description: '',
    purpose: '',
    business_domain: 'Finance',
    model_type: 'Classification',
    owner: 'Risk & Governance Committee',
    department: 'Credit Risk Operations',
    risk_category: 'High',
    deployment_status: 'Development',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    try {
      setLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card-subtle">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-main">Register New AI Model</h2>
              <p className="text-xs text-text-muted">Enter metadata to onboard an enterprise AI model into AegisAI governance.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-main hover:bg-border/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text-main mb-1">Model Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Fraud Detection Engine"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-text-main"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-main mb-1">Version</label>
              <input
                type="text"
                required
                placeholder="1.0.0"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-text-main"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-main mb-1">Model Type</label>
              <select
                value={formData.model_type}
                onChange={(e) => setFormData({ ...formData, model_type: e.target.value as any })}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-text-main"
              >
                <option value="Classification">Classification</option>
                <option value="Regression">Regression</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-text-main mb-1">Business Domain</label>
              <input
                type="text"
                value={formData.business_domain}
                onChange={(e) => setFormData({ ...formData, business_domain: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-text-main"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-main mb-1">Owner / Lead</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-text-main"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-main mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-text-main"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-main mb-1">Risk Category</label>
              <select
                value={formData.risk_category}
                onChange={(e) => setFormData({ ...formData, risk_category: e.target.value as any })}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-text-main"
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
                <option value="Critical">Critical Risk</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-text-main mb-1">Deployment Status</label>
              <select
                value={formData.deployment_status}
                onChange={(e) => setFormData({ ...formData, deployment_status: e.target.value as any })}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-text-main"
              >
                <option value="Development">Development</option>
                <option value="Testing">Testing</option>
                <option value="Production">Production</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-text-main mb-1">Primary Purpose</label>
            <input
              type="text"
              placeholder="e.g. Automated risk assessment for credit applications"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-text-main"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-main mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Technical description of architecture, data sources, and intended operational environment..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-text-main"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-muted hover:text-text-main hover:bg-border/50 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all shadow-md"
            >
              {loading ? (
                <span>Registering...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Register Model</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
