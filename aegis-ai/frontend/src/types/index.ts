export type NavPageId = 
  | 'dashboard'
  | 'models'
  | 'assessments'
  | 'fairness'
  | 'explainability'
  | 'monitoring'
  | 'governance'
  | 'compliance'
  | 'audit'
  | 'reports'
  | 'settings';

export interface NavItem {
  id: NavPageId;
  label: string;
  iconName: string;
  badge?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  timestamp?: string;
  database?: string;
}

export type UserRole =
  | 'Admin'
  | 'AI/ML Engineer'
  | 'Governance Officer'
  | 'Auditor';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AIModel {
  id: number;
  name: string;
  version: string;
  description: string;
  purpose: string;
  business_domain: string;
  model_type: 'Classification' | 'Regression';
  owner: string;
  department: string;
  risk_category: 'Low' | 'Medium' | 'High' | 'Critical';
  deployment_status: 'Development' | 'Testing' | 'Production' | 'Retired';
  governance_score: number;
  last_assessment?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ModelCreateInput {
  name: string;
  version: string;
  description: string;
  purpose: string;
  business_domain: string;
  model_type: 'Classification' | 'Regression';
  owner: string;
  department: string;
  risk_category: 'Low' | 'Medium' | 'High' | 'Critical';
  deployment_status: 'Development' | 'Testing' | 'Production' | 'Retired';
}

export interface GroupFairnessMetrics {
  total_count: number;
  approved_count: number;
  selection_rate: number;
  selection_rate_pct: string;
  true_positive_rate: number;
  false_positive_rate: number;
  false_negative_rate: number;
}

export interface FairnessAnalysisResult {
  sensitive_attribute: string;
  overall_fairness_score: number;
  status: 'PASS' | 'WARNING' | 'FAIL';
  demographic_parity_diff: number;
  disparate_impact_ratio: number;
  equal_opportunity_diff: number;
  warning_threshold: number;
  critical_threshold: number;
  group_metrics: Record<string, GroupFairnessMetrics>;
  selection_rates: Record<string, number>;
  true_positive_rates: Record<string, number>;
  false_positive_rates: Record<string, number>;
  false_negative_rates: Record<string, number>;
  recommendations: string[];
  explanation: string;
  disclaimer: string;
}

export interface GlobalFeatureImportance {
  rank: number;
  feature: string;
  importance_score: number;
  relative_importance: number;
}

export interface LocalExplainFactor {
  feature: string;
  contribution: number;
  direction: 'Positive' | 'Negative';
  impact: string;
}

export interface LocalExplanationResult {
  prediction: 'Approved' | 'Rejected';
  confidence: number;
  approval_probability: number;
  rejection_probability: number;
  factors: LocalExplainFactor[];
  explanation: string;
}

export interface MonitoringResult {
  run_type: string;
  dataset_size: number;
  baseline_accuracy?: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  data_drift_pct: number;
  prediction_drift_pct: number;
  fairness_score: number;
  status: 'HEALTHY' | 'WARNING' | 'DEGRADED' | 'CRITICAL';
  alerts: string[];
  baseline_approval_rate_pct?: string;
  production_approval_rate_pct?: string;
  disclaimer?: string;
}

export interface RiskFinding {
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  evidence: string;
  recommended_action: string;
  status: string;
}

export interface GovernanceScoreResult {
  overall_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  component_scores: {
    fairness: number;
    performance: number;
    explainability: number;
    data_quality: number;
    monitoring: number;
    compliance: number;
  };
  weights: Record<string, number>;
  findings: RiskFinding[];
  risk_explanation: string;
  disclaimer: string;
}

export interface ComplianceCheck {
  id: string;
  rule: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  details: string;
  frameworks: string[];
}

export interface ComplianceResult {
  compliance_score: number;
  total_rules: number;
  passed: number;
  warnings: number;
  failed: number;
  checks: ComplianceCheck[];
  frameworks_supported: string[];
  disclaimer: string;
}

export interface AuditLogItem {
  id: number;
  timestamp: string;
  user_email: string;
  action: string;
  model_id?: number;
  entity: string;
  result: string;
  previous_value?: string;
  new_value?: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface ReportItem {
  id: number;
  model_id: number;
  title: string;
  governance_score: number;
  risk_level: string;
  file_size_bytes: number;
  download_url: string;
  created_at: string;
}
