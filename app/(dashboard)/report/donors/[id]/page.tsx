"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Pencil, Search, RefreshCw, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DonationStatus = "covered" | "pending" | "failed";
type DonationTab = "all" | DonationStatus;

interface Donation {
  id: string;
  date: string;
  amount: string;
  status: DonationStatus;
  campaign: string;
}

interface Email {
  id: string;
  sent: string;
  subject: string;
  opened: string;
}

const donationTabs: { key: DonationTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "covered", label: "Covered" },
  { key: "pending", label: "Pending" },
  { key: "failed", label: "Failed" },
];

const donations: Donation[] = [
  { id: "1", date: "Oct 5, 2023, 8:52 AM", amount: "$5.50", status: "covered", campaign: "Help Indonesia to Built Well" },
  { id: "2", date: "Oct 5, 2023, 8:52 AM", amount: "$5.50", status: "covered", campaign: "Help Indonesia to Built Well" },
  { id: "3", date: "Oct 5, 2023, 8:52 AM", amount: "$5.50", status: "pending", campaign: "Charity Week Annual Run" },
  { id: "4", date: "Oct 5, 2023, 8:52 AM", amount: "$5.50", status: "failed", campaign: "Orphan Sponsorship Drive" },
  { id: "5", date: "Oct 5, 2023, 8:52 AM", amount: "$5.50", status: "covered", campaign: "Help Indonesia to Built Well" },
];

const emails: Email[] = [
  { id: "1", sent: "Oct 5, 2023, 8:52 AM", subject: "Thank you for being a recurring supporter!", opened: "--" },
  { id: "2", sent: "Oct 5, 2023, 8:52 AM", subject: "Your donation has been confirmed", opened: "--" },
  { id: "3", sent: "Oct 5, 2023, 8:52 AM", subject: "Thank you for being a recurring supporter!", opened: "--" },
  { id: "4", sent: "Oct 5, 2023, 8:52 AM", subject: "Charity Week 2026  save the date", opened: "--" },
  { id: "5", sent: "Oct 5, 2023, 8:52 AM", subject: "Thank you for being a recurring supporter!", opened: "--" },
];

const navItems = [
  { id: "information", label: "Information" },
  { id: "donations", label: "Donations" },
  { id: "emails", label: "Emails" },
];

function DonationStatusBadge({ status }: { status: DonationStatus }) {
  const styles: Record<DonationStatus, string> = {
    covered: "bg-[#ECFDF3] text-[#037847]",
    pending: "bg-yellow-50 text-yellow-700",
    failed: "bg-red-50 text-red-600",
  };
  return (
    <span className={cn("rounded-md px-2.5 py-1 text-xs font-medium capitalize", styles[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <tr>
      <td colSpan={10} className="py-10 text-center text-sm text-gray-400">
        {message}
      </td>
    </tr>
  );
}

export default function DonorDetailPage() {
  useParams<{ id: string }>();

  const [donationTab, setDonationTab] = useState<DonationTab>("all");
  const [activeSection, setActiveSection] = useState("information");

  // Donations search
  const [campaignSearchOpen, setCampaignSearchOpen] = useState(false);
  const [campaignQuery, setCampaignQuery] = useState("");
  const campaignInputRef = useRef<HTMLInputElement>(null);

  // Emails search
  const [emailSearchOpen, setEmailSearchOpen] = useState(false);
  const [emailQuery, setEmailQuery] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);

  const sectionRefs = {
    information: useRef<HTMLElement>(null),
    donations: useRef<HTMLElement>(null),
    emails: useRef<HTMLElement>(null),
  };

  // Focus input when toggled open
  useEffect(() => {
    if (campaignSearchOpen) campaignInputRef.current?.focus();
  }, [campaignSearchOpen]);

  useEffect(() => {
    if (emailSearchOpen) emailInputRef.current?.focus();
  }, [emailSearchOpen]);

  // Scroll-based active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    navItems.forEach(({ id }) => {
      const el = sectionRefs[id as keyof typeof sectionRefs].current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    sectionRefs[id as keyof typeof sectionRefs].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Filtered data
  const filteredDonations = donations.filter((d) => {
    const matchesTab = donationTab === "all" || d.status === donationTab;
    const matchesSearch = d.campaign.toLowerCase().includes(campaignQuery.toLowerCase().trim());
    return matchesTab && matchesSearch;
  });

  const filteredEmails = emails.filter((e) =>
    e.subject.toLowerCase().includes(emailQuery.toLowerCase().trim()) ||
    e.sent.toLowerCase().includes(emailQuery.toLowerCase().trim())
  );

  const closeCampaignSearch = () => {
    setCampaignSearchOpen(false);
    setCampaignQuery("");
  };

  const closeEmailSearch = () => {
    setEmailSearchOpen(false);
    setEmailQuery("");
  };

  return (
    <div className="flex gap-8">
      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 space-y-5">
        <Link
          href="/report/donors"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#EC8900] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Donors
        </Link>

        {/* Information */}
        <section ref={sectionRefs.information} id="information">
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#161616]">Information</h2>
              <button className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { label: "Name", value: "Mr Test" },
                { label: "Tax", value: "" },
                { label: "Email", value: "mrtest@email.com" },
                { label: "Address", value: "Street address number 82, London, Baker Street, United Kingdom" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between py-3.5 gap-8">
                  <span className="text-xs font-medium text-gray-400 w-24 shrink-0">{label}</span>
                  <span className="text-sm text-gray-800 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donations */}
        <section ref={sectionRefs.donations} id="donations">
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#161616]">Donations</h2>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                  {filteredDonations.length}
                </span>
              </div>

              {/* Campaign search toggle */}
              {campaignSearchOpen ? (
                <div className="flex items-center gap-1.5 rounded-lg border border-[#EC8900]/40 bg-orange-50/40 px-2.5 py-1">
                  <Search className="h-3.5 w-3.5 shrink-0 text-[#EC8900]" />
                  <input
                    ref={campaignInputRef}
                    type="text"
                    value={campaignQuery}
                    onChange={(e) => setCampaignQuery(e.target.value)}
                    placeholder="Search campaign name…"
                    className="w-44 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
                  />
                  <button
                    onClick={closeCampaignSearch}
                    className="ml-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs text-gray-500 border-gray-200 hover:border-[#EC8900]/40 hover:text-[#EC8900]"
                  onClick={() => setCampaignSearchOpen(true)}
                >
                  <Search className="h-3.5 w-3.5" />
                  Find campaign
                </Button>
              )}
            </div>

            {/* Donation tabs */}
            <div className="flex items-center gap-2 mb-4">
              {donationTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setDonationTab(tab.key)}
                  className={cn(
                    "rounded-full px-3 py-0.5 text-xs font-semibold transition-colors",
                    donationTab === tab.key
                      ? "bg-[#EC8900] text-white"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="text-xs font-semibold text-gray-500">Date</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Amount</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Campaigns</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonations.length > 0 ? (
                    filteredDonations.map((d) => (
                      <TableRow key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <TableCell className="text-sm text-gray-600 whitespace-nowrap">{d.date}</TableCell>
                        <TableCell className="text-sm font-semibold text-gray-800">{d.amount}</TableCell>
                        <TableCell><DonationStatusBadge status={d.status} /></TableCell>
                        <TableCell className="text-sm text-gray-600">{d.campaign}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <EmptyState
                      message={
                        campaignQuery
                          ? `No campaigns matching "${campaignQuery}"`
                          : "No donations found."
                      }
                    />
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Emails */}
        <section ref={sectionRefs.emails} id="emails">
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#161616]">Emails</h2>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                  {filteredEmails.length}
                </span>
              </div>

              {/* Email search toggle */}
              {emailSearchOpen ? (
                <div className="flex items-center gap-1.5 rounded-lg border border-[#EC8900]/40 bg-orange-50/40 px-2.5 py-1">
                  <Search className="h-3.5 w-3.5 shrink-0 text-[#EC8900]" />
                  <input
                    ref={emailInputRef}
                    type="text"
                    value={emailQuery}
                    onChange={(e) => setEmailQuery(e.target.value)}
                    placeholder="Search subject or date…"
                    className="w-44 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
                  />
                  <button
                    onClick={closeEmailSearch}
                    className="ml-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs text-gray-500 border-gray-200 hover:border-[#EC8900]/40 hover:text-[#EC8900]"
                  onClick={() => setEmailSearchOpen(true)}
                >
                  <Search className="h-3.5 w-3.5" />
                  Search emails
                </Button>
              )}
            </div>

            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="text-xs font-semibold text-gray-500">Sent</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Subject</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Opened</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmails.length > 0 ? (
                    filteredEmails.map((email) => (
                      <TableRow key={email.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <TableCell className="text-sm text-gray-600 whitespace-nowrap">{email.sent}</TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-[220px]">{email.subject}</TableCell>
                        <TableCell className="text-sm text-gray-400">{email.opened}</TableCell>
                        <TableCell>
                          <button
                            className="rounded-md p-1.5 text-[#EC8900] hover:bg-orange-50 transition-colors"
                            title="Resend email"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <EmptyState
                      message={
                        emailQuery
                          ? `No emails matching "${emailQuery}"`
                          : "No emails found."
                      }
                    />
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </div>

      {/* ── Sticky right nav ── */}
      <aside className="w-52 shrink-0">
        <div className="sticky top-8 rounded-xl border border-gray-100 bg-white p-3 space-y-1">
          {navItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left",
                activeSection === item.id
                  ? "bg-orange-50 text-[#EC8900]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  activeSection === item.id
                    ? "bg-[#EC8900] text-white"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {i + 1}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
