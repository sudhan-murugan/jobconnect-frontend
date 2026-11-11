// Skills as small tags. `max` shows only the first few, plus "+N more".
export default function SkillList({ skills, max }) {
  if (!skills?.length) return null

  const visible = max ? skills.slice(0, max) : skills
  const hiddenCount = skills.length - visible.length

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Skills">
      {visible.map((skill) => (
        <li key={skill} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
          {skill}
        </li>
      ))}
      {hiddenCount > 0 && <li className="px-1 py-0.5 text-xs text-slate-500">+{hiddenCount} more</li>}
    </ul>
  )
}
