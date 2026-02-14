export function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} />
}
