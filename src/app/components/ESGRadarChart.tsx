import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { RadarPoint } from '../../lib/types';

export function ESGRadarChart({ data }: { data: RadarPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#E5E5E5" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6C757D', fontSize: 12 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6C757D', fontSize: 10 }} />
        <Radar name="Control score" dataKey="value" stroke="#003A70" fill="#E5B700" fillOpacity={0.3} strokeWidth={2} />
        <Tooltip
          contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 4 }}
          formatter={(value: number) => [`${value} / 100`, 'Control score']}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
