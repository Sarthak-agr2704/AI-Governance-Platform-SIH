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

export interface SystemMetric {
  name: string;
  value: string | number;
  change?: string;
  status: 'healthy' | 'warning' | 'critical' | 'info';
  description: string;
}

export interface ModelSummary {
  id: string;
  name: string;
  version: string;
  type: string;
  status: 'production' | 'staging' | 'archived';
  fairnessScore: number;
  driftStatus: 'normal' | 'warning' | 'critical';
  lastEvaluated: string;
}
