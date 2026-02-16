import type { ReactNode } from 'react'

export function ResponsiveContainer({ children }: { width: string; height: string; children: ReactNode }) { return <div>{children}</div> }
export function LineChart({ children }: { data: unknown[]; margin?: Record<string, number>; children: ReactNode }) { return <div>{children}</div> }
export function BarChart({ children }: { data: unknown[]; margin?: Record<string, number>; children: ReactNode }) { return <div>{children}</div> }
export function CartesianGrid(_props: { strokeDasharray?: string }) { return null }
export function XAxis(_props: { dataKey: string; tickFormatter?: (v: unknown) => string }) { return null }
export function YAxis(_props: { tickFormatter?: (v: number) => string }) { return null }
export function Legend() { return null }
export function ReferenceLine(_props: { y: number; strokeDasharray?: string; label?: string }) { return null }
export function Tooltip(_props: { formatter?: (v: unknown) => string; labelFormatter?: (l: unknown) => string }) { return null }
export function Line(_props: { type: string; dataKey: string; strokeWidth?: number; dot?: boolean }) { return null }
export function Bar(_props: { dataKey: string; stackId?: string; fill?: string; radius?: [number, number, number, number] }) { return null }
