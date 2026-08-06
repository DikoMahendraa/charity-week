"use client";

import { useState } from "react";
import type { RegisterFormData } from "./RegisterForm";

interface Props {
  data:     RegisterFormData;
  onChange: (field: keyof RegisterFormData, value: string) => void;
}

const inputCls  = "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#EC8900] focus:outline-none focus:ring-1 focus:ring-[#EC8900]";
const labelCls  = "mb-1.5 block text-xs font-medium text-gray-600";

const COUNTRY_CODES = [
  { code: "+44", flag: "🇬🇧", country: "GB" },
  { code: "+1",  flag: "🇺🇸", country: "US" },
  { code: "+61", flag: "🇦🇺", country: "AU" },
  { code: "+971",flag: "🇦🇪", country: "AE" },
  { code: "+92", flag: "🇵🇰", country: "PK" },
  { code: "+880",flag: "🇧🇩", country: "BD" },
];

const COUNTRIES = [
  "United Kingdom", "United States", "Australia",
  "Canada", "Pakistan", "Bangladesh", "UAE",
  "Egypt", "Nigeria", "South Africa", "Other",
];

export default function ContactDetailsSection({ data, onChange }: Props) {
  const [manualAddress, setManualAddress] = useState(true);

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <h2 className="mb-4 text-base font-bold text-gray-900">Your Contact Details</h2>

      {/* Email */}
      <div className="mb-3">
        <label className={labelCls}>Email</label>
        <input type="email" className={inputCls} placeholder="Enter your email address" value={data.email} onChange={e => onChange("email", e.target.value)} />
      </div>

      {/* Phone */}
      <div className="mb-3">
        <label className={labelCls}>Phone number</label>
        <div className="flex gap-2">
          <div className="relative shrink-0">
            <select
              className="h-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-3 pr-7 text-sm text-gray-700 focus:border-[#EC8900] focus:outline-none"
              value={data.phoneCode}
              onChange={e => onChange("phoneCode", e.target.value)}
            >
              {COUNTRY_CODES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <input
            type="tel"
            className={`${inputCls} flex-1`}
            placeholder="7700 000000"
            value={data.phone}
            onChange={e => onChange("phone", e.target.value)}
          />
        </div>
      </div>

      {/* Address search */}
      <div className="mb-3">
        <label className={labelCls}>Address</label>
        <div className="relative">
          <input
            className={inputCls}
            placeholder="Enter your address"
            value={data.address}
            onChange={e => onChange("address", e.target.value)}
          />
          <button
            type="button"
            onClick={() => setManualAddress(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#EC8900]"
          >
            Enter manually
          </button>
        </div>
      </div>

      {/* Manual address fields */}
      {manualAddress && (
        <div className="flex flex-col gap-3">
          <div>
            <label className={labelCls}>Postcode</label>
            <input className={inputCls} placeholder="Enter your postcode" value={data.postcode} onChange={e => onChange("postcode", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Building / House number</label>
            <input className={inputCls} placeholder="Building/House number" value={data.buildingNumber} onChange={e => onChange("buildingNumber", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Address Line 1</label>
            <input className={inputCls} placeholder="Enter your address line 1" value={data.addressLine1} onChange={e => onChange("addressLine1", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Address Line 2</label>
            <input className={inputCls} placeholder="Enter your address line 2" value={data.addressLine2} onChange={e => onChange("addressLine2", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Town / City</label>
            <input className={inputCls} placeholder="Enter your town/city" value={data.townCity} onChange={e => onChange("townCity", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Country</label>
            <div className="relative">
              <select
                className={`${inputCls} appearance-none`}
                value={data.country}
                onChange={e => onChange("country", e.target.value)}
              >
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
