import type { DataSourceRecord, SourceStatus, SourceView } from './types';
import { relativeTime } from './format';

export function sourceStatus(lastSyncAt: string, asOf: string, failed?: boolean): SourceStatus {
  if (failed) return 'failed';
  const ageMs = new Date(asOf).getTime() - new Date(lastSyncAt).getTime();
  const hours = ageMs / 3_600_000;
  if (hours < 0.5) return 'healthy';
  if (hours < 24) return 'stale';
  return 'failed';
}

export function sourceLabel(status: SourceStatus): string {
  if (status === 'healthy') return 'Healthy';
  if (status === 'stale') return 'Stale';
  return 'Failed';
}

export function viewSources(records: DataSourceRecord[], asOf: string): SourceView[] {
  return records.map((record) => {
    const status = sourceStatus(record.lastSyncAt, asOf, record.failed);
    return {
      id: record.id,
      name: record.name,
      pillar: record.pillar,
      system: record.system,
      endpoint: record.endpoint,
      lastSyncAt: record.lastSyncAt,
      notes: record.notes,
      status,
      statusLabel: sourceLabel(status),
      relativeSync: relativeTime(record.lastSyncAt, asOf),
    };
  });
}
