import { useState, useEffect, useCallback } from 'react';
import { HealthResponse } from '../types';
import { checkHealth } from '../services/api';

export function useHealth(pollIntervalMs: number = 30000) {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    try {
      const data = await checkHealth();
      setHealthData(data);
      if (data.status === 'unreachable') {
        setError('Backend service is unreachable.');
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to query health endpoint.');
      setHealthData({ status: 'unreachable', service: 'AegisAI Backend' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchHealth, pollIntervalMs]);

  return {
    healthData,
    isHealthy: healthData?.status === 'healthy',
    loading,
    error,
    refetch: fetchHealth,
  };
}
