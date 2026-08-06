import type { RegisterFormData } from "./RegisterForm";

interface Props {
  data:             RegisterFormData;
  onChange:         (field: keyof RegisterFormData, value: string | boolean) => void;
}

const textareaCls = "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#EC8900] focus:outline-none focus:ring-1 focus:ring-[#EC8900] resize-none";
const labelCls    = "mb-1.5 block text-xs font-medium text-gray-600";

function OrangeCheckbox({
  checked,
  onChange,
  label,
}: {
  checked:  boolean;
  onChange: (v: boolean) => void;
  label:    React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <div
        onClick={() => onChange(!checked)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          checked ? "border-[#EC8900] bg-[#EC8900]" : "border-gray-300 bg-white"
        }`}
      >
        {checked && (
          <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

export default function SafetySection({ data, onChange }: Props) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <h2 className="mb-1 text-base font-bold text-gray-900">Event safety details</h2>
      <p className="mb-4 text-xs leading-relaxed text-gray-500">
        Please provide your emergency contact and any medical information so we can keep you safe.
      </p>

      {/* Medical history */}
      <div className="mb-3">
        <label className={labelCls}>
          Please state your medical history and any recent injuries you have. If none, please state none.
        </label>
        <textarea
          className={textareaCls}
          rows={2}
          placeholder="e.g. ACL"
          value={data.medicalHistory}
          onChange={e => onChange("medicalHistory", e.target.value)}
        />
      </div>

      {/* Medications */}
      <div className="mb-4">
        <label className={labelCls}>
          Please share any medications taken. If none, please state none.
        </label>
        <textarea
          className={textareaCls}
          rows={2}
          placeholder="None"
          value={data.medications}
          onChange={e => onChange("medications", e.target.value)}
        />
      </div>

      {/* Terms checkbox */}
      <OrangeCheckbox
        checked={data.acceptTerms}
        onChange={v => onChange("acceptTerms", v)}
        label={
          <span>
            I accept the event terms &amp; safety briefing{" "}
            <span className="font-semibold text-gray-900">(required)</span>
          </span>
        }
      />
    </section>
  );
}
