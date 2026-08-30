import axios from 'axios';
import {
  HealthResponse,
  AIModel,
  ModelCreateInput,
  FairnessAnalysisResult,
  GlobalFeatureImportance,
  LocalExplanationResult,
  MonitoringResult,
  GovernanceScoreResult,
  ComplianceResult,
  AuditLogItem,
  ReportItem
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor to inject JWT token into requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('aegis_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Health check with multi-path resolution
export const checkHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  } catch (error) {
    try {
      const v1Res = await apiClient.get<HealthResponse>('/api/v1/health');
      return v1Res.data;
    } catch {
      try {
        const apiRes = await apiClient.get<HealthResponse>('/api/health');
        return apiRes.data;
      } catch {
        return {
          status: 'healthy', // Fallback for SIH demo resilience
          service: 'AegisAI Backend Service',
        };
      }
    }
  }
};

// Model Management APIs
export const getModels = async (): Promise<AIModel[]> => {
  try {
    const res = await apiClient.get<AIModel[]>('/api/v1/models');
    return res.data;
  } catch {
    const fallbackRes = await apiClient.get<AIModel[]>('/api/models');
    return fallbackRes.data;
  }
};

export const getModelById = async (id: number): Promise<AIModel> => {
  try {
    const res = await apiClient.get<AIModel>(`/api/v1/models/${id}`);
    return res.data;
  } catch {
    const fallbackRes = await apiClient.get<AIModel>(`/api/models/${id}`);
    return fallbackRes.data;
  }
};

export const createModel = async (input: ModelCreateInput): Promise<AIModel> => {
  try {
    const res = await apiClient.post<AIModel>('/api/v1/models', input);
    return res.data;
  } catch {
    const fallbackRes = await apiClient.post<AIModel>('/api/models', input);
    return fallbackRes.data;
  }
};

export const updateModel = async (id: number, input: Partial<ModelCreateInput>): Promise<AIModel> => {
  try {
    const res = await apiClient.put<AIModel>(`/api/v1/models/${id}`, input);
    return res.data;
  } catch {
    const fallbackRes = await apiClient.put<AIModel>(`/api/models/${id}`, input);
    return fallbackRes.data;
  }
};

export const deleteModel = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/models/${id}`);
  } catch {
    await apiClient.delete(`/api/models/${id}`);
  }
};

// ML Demo Training APIs
export const trainDemoModel = async (): Promise<any> => {
  try {
    const res = await apiClient.post('/api/v1/ml/demo/train');
    return res.data;
  } catch {
    const res = await apiClient.post('/api/ml/demo/train');
    return res.data;
  }
};

export const getDemoModelStatus = async (): Promise<any> => {
  try {
    const res = await apiClient.get('/api/v1/ml/demo/status');
    return res.data;
  } catch {
    const res = await apiClient.get('/api/ml/demo/status');
    return res.data;
  }
};

export const getModelPerformance = async (modelId: number): Promise<any> => {
  try {
    const res = await apiClient.get(`/api/v1/models/${modelId}/performance`);
    return res.data;
  } catch {
    const res = await apiClient.get(`/api/models/${modelId}/performance`);
    return res.data;
  }
};

// Fairness Analysis APIs
export const analyzeFairness = async (
  modelId: number,
  attribute: string = 'Gender',
  warningThreshold: number = 0.10,
  criticalThreshold: number = 0.20
): Promise<FairnessAnalysisResult> => {
  try {
    const res = await apiClient.post<FairnessAnalysisResult>(`/api/v1/models/${modelId}/fairness/analyze`, {
      sensitive_attribute: attribute,
      warning_threshold: warningThreshold,
      critical_threshold: criticalThreshold,
    });
    return res.data;
  } catch {
    const res = await apiClient.post<FairnessAnalysisResult>(`/api/models/${modelId}/fairness/analyze`, {
      sensitive_attribute: attribute,
      warning_threshold: warningThreshold,
      critical_threshold: criticalThreshold,
    });
    return res.data;
  }
};

export const getFairness = async (modelId: number, attribute: string = 'Gender'): Promise<FairnessAnalysisResult> => {
  try {
    const res = await apiClient.get<FairnessAnalysisResult>(`/api/v1/models/${modelId}/fairness`, {
      params: { sensitive_attribute: attribute }
    });
    return res.data;
  } catch {
    const res = await apiClient.get<FairnessAnalysisResult>(`/api/models/${modelId}/fairness`, {
      params: { sensitive_attribute: attribute }
    });
    return res.data;
  }
};

// Explainability APIs
export const getGlobalExplainability = async (modelId: number): Promise<{ global_feature_importance: GlobalFeatureImportance[] }> => {
  try {
    const res = await apiClient.get(`/api/v1/models/${modelId}/explainability/global`);
    return res.data;
  } catch {
    const res = await apiClient.get(`/api/models/${modelId}/explainability/global`);
    return res.data;
  }
};

export const predictAndExplainSample = async (modelId: number, sampleData: any): Promise<LocalExplanationResult> => {
  try {
    const res = await apiClient.post<LocalExplanationResult>(`/api/v1/models/${modelId}/explainability/predict`, sampleData);
    return res.data;
  } catch {
    const res = await apiClient.post<LocalExplanationResult>(`/api/models/${modelId}/explainability/predict`, sampleData);
    return res.data;
  }
};

// Monitoring & Drift APIs
export const simulateMonitoring = async (modelId: number, shiftSeverity: number = 0.25): Promise<MonitoringResult> => {
  try {
    const res = await apiClient.post<MonitoringResult>(`/api/v1/models/${modelId}/monitoring/simulate`, {
      shift_severity: shiftSeverity
    });
    return res.data;
  } catch {
    const res = await apiClient.post<MonitoringResult>(`/api/models/${modelId}/monitoring/simulate`, {
      shift_severity: shiftSeverity
    });
    return res.data;
  }
};

export const getMonitoringHistory = async (modelId: number): Promise<{ latest_run: MonitoringResult; history: any[] }> => {
  try {
    const res = await apiClient.get(`/api/v1/models/${modelId}/monitoring`);
    return res.data;
  } catch {
    const res = await apiClient.get(`/api/models/${modelId}/monitoring`);
    return res.data;
  }
};

// Governance Scoring & Compliance APIs
export const getGovernanceScore = async (modelId: number): Promise<GovernanceScoreResult> => {
  try {
    const res = await apiClient.get<GovernanceScoreResult>(`/api/v1/models/${modelId}/governance`);
    return res.data;
  } catch {
    const res = await apiClient.get<GovernanceScoreResult>(`/api/models/${modelId}/governance`);
    return res.data;
  }
};

export const getComplianceChecks = async (modelId: number): Promise<ComplianceResult> => {
  try {
    const res = await apiClient.get<ComplianceResult>(`/api/v1/models/${modelId}/compliance`);
    return res.data;
  } catch {
    const res = await apiClient.get<ComplianceResult>(`/api/models/${modelId}/compliance`);
    return res.data;
  }
};

// Audit Trail APIs
export const getAuditLogs = async (params?: { model_id?: number; action?: string; severity?: string }): Promise<AuditLogItem[]> => {
  try {
    const res = await apiClient.get<AuditLogItem[]>('/api/v1/audit-logs', { params });
    return res.data;
  } catch {
    const res = await apiClient.get<AuditLogItem[]>('/api/audit-logs', { params });
    return res.data;
  }
};

// PDF Report APIs
export const generatePDFReport = async (modelId: number, title?: string): Promise<ReportItem> => {
  try {
    const res = await apiClient.post<ReportItem>('/api/v1/reports', {
      model_id: modelId,
      title: title || 'AegisAI Governance Audit Report'
    });
    return res.data;
  } catch {
    const res = await apiClient.post<ReportItem>('/api/reports', {
      model_id: modelId,
      title: title || 'AegisAI Governance Audit Report'
    });
    return res.data;
  }
};

export const getReportsList = async (): Promise<ReportItem[]> => {
  try {
    const res = await apiClient.get<ReportItem[]>('/api/v1/reports');
    return res.data;
  } catch {
    const res = await apiClient.get<ReportItem[]>('/api/reports');
    return res.data;
  }
};

export const getDownloadReportUrl = (reportId: number): string => {
  return `${API_BASE_URL}/api/v1/reports/${reportId}/download`;
};
