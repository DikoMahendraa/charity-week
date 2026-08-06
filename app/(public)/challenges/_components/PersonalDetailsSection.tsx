import type { RegisterFormData } from "./RegisterForm";

const DAYS   = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const YEARS  = Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i));

interface Props {
  data:     RegisterFormData;
  onChange: (field: keyof RegisterFormData, value: string) => void;
}

const inputCls = "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#EC8900] focus:outline-none focus:ring-1 focus:ring-[#EC8900]";
const selectCls = `${inputCls} appearance-none`;
const labelCls  = "mb-1.5 block text-xs font-medium text-gray-600";

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

export default function PersonalDetailsSection({ data, onChange }: Props) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <h2 className="mb-4 text-base font-bold text-gray-900">Your Details</h2>

      {/* Title */}
      <div className="mb-3">
        <label className={labelCls}>Title</label>
        <SelectWrapper>
          <select className={selectCls} value={data.title} onChange={e => onChange("title", e.target.value)}>
            {["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof"].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </SelectWrapper>
      </div>

      {/* First name + Surname */}
      <div className="mb-4 grid grid-cols-2 gap-2.5">
        <div>
          <label className={labelCls}>First name</label>
          <input className={inputCls} placeholder="e.g. Sarah" value={data.firstName} onChange={e => onChange("firstName", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Surname</label>
          <input className={inputCls} placeholder="e.g. Johnson" value={data.surname} onChange={e => onChange("surname", e.target.value)} />
        </div>
      </div>

      {/* Date of birth */}
      <h3 className="mb-3 text-base font-bold text-gray-900">Date of Birth</h3>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className={labelCls}>Day</label>
          <SelectWrapper>
            <select className={selectCls} value={data.dobDay} onChange={e => onChange("dobDay", e.target.value)}>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </SelectWrapper>
        </div>
        <div>
          <label className={labelCls}>Month</label>
          <SelectWrapper>
            <select className={selectCls} value={data.dobMonth} onChange={e => onChange("dobMonth", e.target.value)}>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </SelectWrapper>
        </div>
        <div>
          <label className={labelCls}>Year</label>
          <SelectWrapper>
            <select className={selectCls} value={data.dobYear} onChange={e => onChange("dobYear", e.target.value)}>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </SelectWrapper>
        </div>
      </div>
    </section>
  );
}
