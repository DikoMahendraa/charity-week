import type { RegisterFormData } from "./RegisterForm";

interface Props {
  data:     RegisterFormData;
  onChange: (field: keyof RegisterFormData, value: boolean) => void;
}

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

export default function PolicySection({ data, onChange }: Props) {
  return (
    <>
      {/* Photography policy card */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <h2 className="mb-3 text-base font-bold text-gray-900">
          Photography &amp; Videography Policy
        </h2>
        <p className="mb-4 text-xs leading-relaxed text-gray-500">
          There may be a photographer at this event and pictures may be taken of you participating in the
          event. Islamic Relief may use these photographs for the purpose of marketing future events online
          and on print materials, for a period of 5 years. If you do not wish your photograph to be taken
          and/or used, please let us know at the event so that we can make the necessary arrangements.
        </p>

        <OrangeCheckbox
          checked={data.consentPhotography}
          onChange={v => onChange("consentPhotography", v)}
          label="I consent to the processing of my pictures is used by Islamic Relief in the future events"
        />
      </section>

      {/* Questions & concerns card */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
          Questions or Concerns?
        </p>
        <div className="flex flex-col gap-2">
          <a
            href="mailto:challenges@islamic-relief.org.uk"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#EC8900]"
          >
            <svg className="h-4 w-4 shrink-0 text-[#EC8900]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M4 4h16v16H4V4z" />
              <path d="M4 4l8 9 8-9" />
            </svg>
            challenges@islamic-relief.org.uk
          </a>
          <a
            href="tel:02075933232"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#EC8900]"
          >
            <svg className="h-4 w-4 shrink-0 text-[#EC8900]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.55.55 1 1 0 011 1V20a1 1 0 01-1 1A16 16 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.55 3.55a1 1 0 01-.25 1z" />
            </svg>
            0207 593 3232
          </a>
        </div>
        <a
          href="/privacy-policy"
          className="mt-3 block text-center text-sm font-semibold text-[#EC8900] underline underline-offset-2"
        >
          Read Our Privacy Policy
        </a>
      </section>
    </>
  );
}
