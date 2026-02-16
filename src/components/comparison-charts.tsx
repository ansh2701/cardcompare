'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import type { CardParsed } from '@/lib/db';

const COLORS = ['#6366f1', '#06b6d4', '#f59e0b', '#ec4899'];

export function ComparisonCharts({ cards }: { cards: CardParsed[] }) {
    if (cards.length < 2) return null;

    // Fee comparison data
    const feeData = [
        {
            name: 'Annual Fee',
            ...Object.fromEntries(cards.map((c, i) => [`card${i}`, c.annualFee])),
        },
        {
            name: 'Joining Fee',
            ...Object.fromEntries(cards.map((c, i) => [`card${i}`, c.joiningFee])),
        },
    ];

    // Rewards comparison data
    const rewardsData = [
        {
            name: 'Cashback %',
            ...Object.fromEntries(cards.map((c, i) => [`card${i}`, c.cashbackRate || 0])),
        },
        {
            name: 'Rewards Rate',
            ...Object.fromEntries(cards.map((c, i) => [`card${i}`, c.rewardsRate || 0])),
        },
        {
            name: 'Rating',
            ...Object.fromEntries(cards.map((c, i) => [`card${i}`, c.rating])),
        },
    ];

    // Radar chart data
    const radarData = [
        { metric: 'Rating', ...Object.fromEntries(cards.map((c, i) => [`card${i}`, (c.rating / 5) * 100])) },
        { metric: 'Popularity', ...Object.fromEntries(cards.map((c, i) => [`card${i}`, c.popularityScore])) },
        { metric: 'Rewards', ...Object.fromEntries(cards.map((c, i) => [`card${i}`, Math.min((c.rewardsRate || c.cashbackRate || 0) * 10, 100)])) },
        { metric: 'Low Fees', ...Object.fromEntries(cards.map((c, i) => [`card${i}`, c.annualFee === 0 ? 100 : Math.max(0, 100 - (c.annualFee / 150))])) },
        { metric: 'Value', ...Object.fromEntries(cards.map((c, i) => [`card${i}`, Math.min(((c.rewardsRate || c.cashbackRate || 0) * 20) + (c.rating * 10), 100)])) },
    ];

    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-xs font-semibold mb-1.5">{label}</p>
                    {payload.map((entry, i) => {
                        const cardIdx = parseInt(entry.name.replace('card', ''));
                        return (
                            <p key={i} className="text-xs" style={{ color: COLORS[cardIdx] }}>
                                {cards[cardIdx]?.name}: <span className="font-semibold">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
                            </p>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 mt-8">
            <h2 className="text-xl font-bold">Visual Comparison</h2>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Fee Comparison */}
                <div className="bg-card border border-border/50 rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-4">Fee Comparison (₹)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={feeData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} />
                            <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                formatter={(value) => {
                                    const idx = parseInt(value.replace('card', ''));
                                    return <span className="text-xs">{cards[idx]?.name?.slice(0, 15) || value}</span>;
                                }}
                            />
                            {cards.map((_, i) => (
                                <Bar key={i} dataKey={`card${i}`} fill={COLORS[i]} radius={[4, 4, 0, 0]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Rewards Comparison */}
                <div className="bg-card border border-border/50 rounded-xl p-5">
                    <h3 className="font-semibold text-sm mb-4">Rewards & Rating</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={rewardsData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} />
                            <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                formatter={(value) => {
                                    const idx = parseInt(value.replace('card', ''));
                                    return <span className="text-xs">{cards[idx]?.name?.slice(0, 15) || value}</span>;
                                }}
                            />
                            {cards.map((_, i) => (
                                <Bar key={i} dataKey={`card${i}`} fill={COLORS[i]} radius={[4, 4, 0, 0]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Radar Chart */}
                <div className="bg-card border border-border/50 rounded-xl p-5 md:col-span-2">
                    <h3 className="font-semibold text-sm mb-4">Overall Comparison</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.6)' }} />
                            <PolarRadiusAxis tick={false} domain={[0, 100]} />
                            {cards.map((card, i) => (
                                <Radar
                                    key={card.id}
                                    name={card.name}
                                    dataKey={`card${i}`}
                                    stroke={COLORS[i]}
                                    fill={COLORS[i]}
                                    fillOpacity={0.15}
                                    strokeWidth={2}
                                />
                            ))}
                            <Legend
                                formatter={(value) => <span className="text-xs">{value}</span>}
                            />
                            <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
