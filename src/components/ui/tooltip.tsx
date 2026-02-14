export function TooltipProvider({ children }: { children: React.ReactNode }) { return <>{children}</> }
export function Tooltip({ children }: { children: React.ReactNode }) { return <>{children}</> }
export function TooltipTrigger({ children }: { asChild?: boolean; children: React.ReactNode }) { return <>{children}</> }
export function TooltipContent({ children, className }: { children: React.ReactNode; className?: string }) { return <span className={className}>{children}</span> }
