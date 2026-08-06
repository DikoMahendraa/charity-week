"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Search, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Nav ────────────────────────────────────────────────────────────────────

const NAV = [
  { id: "donations",            label: "Donations" },
  { id: "payment-fees",         label: "Payment and Fees" },
  { id: "giftaid",              label: "GiftAid" },
  { id: "personal-information", label: "Personal Information" },
  { id: "tribute",              label: "Tribute" },
  { id: "notes",                label: "Notes" },
  { id: "message-support",      label: "Message of Support" },
  { id: "source",               label: "Source" },
  { id: "insights",             label: "Insights" },
  { id: "utf-parameters",       label: "UTF Parameters" },
  { id: "custom-fields",        label: "Custom Fields" },
  { id: "emails",               label: "Emails" },
  { id: "transactions",         label: "Transactions" },
  { id: "logs-events",          label: "Logs & Events" },
  { id: "sync",                 label: "Sync" },
];

// ─── Data ────────────────────────────────────────────────────────────────────

type DonationCampaignStatus = "covered" | "pending" | "failed";

const donationRows = [
  { id: "XASJ2382", supporter: "Ali Habbash",   status: "covered" as DonationCampaignStatus, fund: "Build a dwell" },
  { id: "BKRL9274", supporter: "Sara Mansour",  status: "covered" as DonationCampaignStatus, fund: "Water for Gaza" },
  { id: "PGMN4521", supporter: "Omar Khalil",   status: "pending" as DonationCampaignStatus, fund: "Orphan Sponsorship" },
  { id: "WRTX8837", supporter: "Fatima Noor",   status: "failed"  as DonationCampaignStatus, fund: "Emergency Relief" },
  { id: "JKLM1190", supporter: "Yusuf Ahmed",   status: "covered" as DonationCampaignStatus, fund: "Zakat Fund" },
];

const paymentFeeRows = [
  { label: "Payment total amount",   value: "$12.21" },
  { label: "Transaction Fee",        value: "$12.21" },
  { label: "Tip/fee",               value: "$12.23" },
  { label: "Payment processing fee", value: "$0.23"  },
  { label: "Admin fee",              value: "$12.23" },
];

const paymentDetailRows = [
  { label: "Payment processor", value: "Stripe" },
  { label: "Payment ID",        value: "Stripe" },
  { label: "Payment method",    value: "$12.23" },
  { label: "Credit Card",       value: "239A, Mile End Road, London, E222 292AA, United Kingdom" },
  { label: "Fee covered",       value: "$12.23" },
  { label: "Effective fee",     value: "$12.23" },
];

const giftAidRows = [
  { label: "GiftAid",    value: "Yes" },
  { label: "Legal text", value: "--" },
];

const personalInfoRows = [
  { label: "Name",            value: "Mr Gaphari" },
  { label: "Email",           value: "gaphari@email.com" },
  { label: "Mailing list",    value: "$12.23" },
  { label: "Mailing address", value: "239A, Mile End Road, London, E222 292AA, United Kingdom" },
];

const sourceRows = [
  { label: "Source",  value: "Mr Gaphari" },
  { label: "Page",    value: "gaphari@email.com" },
  { label: "Element", value: "$12.23" },
];

const insightRows = [
  { label: "IP Address",         value: "Mr Gaphari" },
  { label: "IP geolocation",     value: "gaphari@email.com" },
  { label: "Browser",            value: "$12.23" },
  { label: "Device",             value: "$12.23" },
  { label: "OS",                 value: "$12.23" },
  { label: "Suggested cover fees", value: "$12.23" },
  { label: "Suggested amounts",  value: "$12.23" },
  { label: "Suggested frequency", value: "$12.23" },
  { label: "Switch to recurring", value: "$12.23" },
];

const emailRows = [
  { id: "1", sent: "Oct 5, 2023, 8:52 AM", subject: '"Thank you for donating!"', opened: "--" },
  { id: "2", sent: "Oct 5, 2023, 8:52 AM", subject: '"Thank you for donating!"', opened: "--" },
  { id: "3", sent: "Oct 5, 2023, 8:52 AM", subject: '"Thank you for donating!"', opened: "--" },
  { id: "4", sent: "Oct 5, 2023, 8:52 AM", subject: '"Thank you for donating!"', opened: "--" },
  { id: "5", sent: "Oct 5, 2023, 8:52 AM", subject: '"Thank you for donating!"', opened: "--" },
];

const transactionRows = [
  { id: "1", sent: "Oct 5, 2023, 8:52 AM", txId: "ch_jhorgw6YFIndCq4xvwPOIF" },
  { id: "2", sent: "Oct 5, 2023, 8:52 AM", txId: "ch_jhorgw6YFIndCq4xvwPOIF" },
  { id: "3", sent: "Oct 5, 2023, 8:52 AM", txId: "ch_jhorgw6AHYFIndCq4xvwPOW" },
  { id: "4", sent: "Oct 5, 2023, 8:52 AM", txId: "ch_jhorgw6AHYFIndCq4xvwPOW" },
  { id: "5", sent: "Oct 5, 2023, 8:52 AM", txId: "ch_jhorgw6AHYFIndCq4xvwPOW" },
];

interface LogEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  errorCode?: { code: string; type: "error" | "success" };
}

const logEvents: LogEvent[] = [
  { id: "1", date: "Tue, 19 March 2023, 08:47:02", title: "Payment Failed",  description: "An attempt to fulfil the payment pl_ejwwleA/USei8rjq4lpwegzjhDFvec for $60.00 failed" },
  { id: "2", date: "Tue, 19 March 2023, 08:47:02", title: "Payment Failed",  description: "An attempt to fulfil the payment pl_ejwwleA/USei8rjq4lpwegzjhDFvec for $60.00 failed" },
  { id: "3", date: "Tue, 19 March 2023, 08:47:02", title: "Payment Failed",  description: "An attempt to fulfil the payment pl_ejwwleA/USei8rjq4lpwegzjhDFvec for $60.00 failed" },
  { id: "4", date: "Tue, 19 March 2023, 08:47:02", title: "Payment Failed",  description: "An attempt to fulfil the payment pl_ejwwleA/USei8rjq4lpwegzjhDFvec for $60.00 failed", errorCode: { code: "402 ERR", type: "error" } },
  { id: "5", date: "Tue, 19 March 2023, 08:47:02", title: "Payment Success", description: "An attempt to fulfil the payment pl_ejwwleA/USei8rjq4lpwegzjhDFvec for $60.00 success", errorCode: { code: "200 OK", type: "success" } },
];

const logEventJson = `{
  "id": "pi_l3PueLDvCle3n10810qd8TR0",
  "object": "payment_intent",
  "last_payment_error": {
    "charge": "ch_3PueLDvCle3n10810Ros1jM",
    "code": "expired_card",
    "doc_url": "https://stripe.com/docs/error-codes/expired-card",
    "message": "Your card has expired.",
    "param": "exp_month",
    "payment_method": {
`;

const syncRows = [
  { date: "Oct 5, 2023, 8:52 AM", status: "Success", syncBy: "Adil" },
  { date: "Oct 5, 2023, 8:52 AM", status: "Success", syncBy: "Ali" },
  { date: "Oct 5, 2023, 8:52 AM", status: "Success", syncBy: "Abdulrahman" },
  { date: "Oct 5, 2023, 8:52 AM", status: "Success", syncBy: "Yesa" },
  { date: "Oct 5, 2023, 8:52 AM", status: "Success", syncBy: "Fauzan" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-3 gap-8 border-b border-gray-50 last:border-0">
      <span className="text-xs font-medium text-gray-400 w-40 shrink-0">{label}</span>
      <span className="text-sm text-gray-800 text-right">{value}</span>
    </div>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
      {count}
    </span>
  );
}

interface SectionHeaderProps {
  title: string;
  count?: number;
  editButton?: boolean;
  searchId?: string;
  searchOpen: boolean;
  searchQuery: string;
  searchPlaceholder?: string;
  onSearchOpen: () => void;
  onSearchClose: () => void;
  onSearchChange: (v: string) => void;
}

function SectionHeader({
  title, count, editButton, searchId,
  searchOpen, searchQuery, searchPlaceholder = "Search records…",
  onSearchOpen, onSearchClose, onSearchChange,
}: SectionHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-[#161616]">{title}</h2>
        {count !== undefined && <CountBadge count={count} />}
      </div>
      <div className="flex items-center gap-2">
        {searchId && (
          searchOpen ? (
            <div className="flex items-center gap-1.5 rounded-lg border border-[#EC8900]/40 bg-orange-50/40 px-2.5 py-1">
              <Search className="h-3.5 w-3.5 shrink-0 text-[#EC8900]" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-36 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
              />
              <button onClick={onSearchClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Button
              variant="outline" size="sm"
              className="gap-1.5 text-xs text-gray-500 border-gray-200 hover:border-[#EC8900]/40 hover:text-[#EC8900]"
              onClick={onSearchOpen}
            >
              <Search className="h-3.5 w-3.5" />
              Search records
            </Button>
          )
        )}
        {editButton && (
          <button className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function EmptySection({ message }: { message: string }) {
  return (
    <p className="py-6 text-center text-sm text-gray-400">{message}</p>
  );
}

const campaignVariant: Record<DonationCampaignStatus, "completed" | "pending" | "failed"> = {
  covered: "completed",
  pending: "pending",
  failed:  "failed",
};

const campaignDot: Record<DonationCampaignStatus, string> = {
  covered: "bg-[#037847]",
  pending: "bg-amber-500",
  failed:  "bg-red-500",
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PaymentDetailPage() {
  const [activeSection, setActiveSection] = useState("donations");
  const [donationTab, setDonationTab] = useState<"all" | DonationCampaignStatus>("all");
  const [selectedLog, setSelectedLog] = useState<string>("1");

  // Search state keyed by section id
  const [searchOpen, setSearchOpen] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<Record<string, string>>({});

  const openSearch  = (id: string) => setSearchOpen((p) => ({ ...p, [id]: true }));
  const closeSearch = (id: string) => {
    setSearchOpen((p) => ({ ...p, [id]: false }));
    setSearchQuery((p) => ({ ...p, [id]: "" }));
  };
  const changeQuery = (id: string, v: string) => setSearchQuery((p) => ({ ...p, [id]: v }));
  const isOpen  = (id: string) => !!searchOpen[id];
  const query   = (id: string) => searchQuery[id] ?? "";

  // Section refs
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const setRef = (id: string) => (el: HTMLElement | null) => { sectionRefs.current[id] = el; };

  // When a nav item is clicked we pause the scroll listener so it doesn't
  // race-activate intermediate sections while smooth-scrolling.
  const isProgrammaticScroll = useRef(false);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks whether nav transitions should run (only during real scroll, not on click).
  const [navAnimate, setNavAnimate] = useState(false);

  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (!mainEl) return;

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;
      for (let i = NAV.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[NAV[i].id];
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 120) {
          setNavAnimate(true);
          setActiveSection(NAV[i].id);
          return;
        }
      }
      setNavAnimate(true);
      setActiveSection(NAV[0].id);
    };

    mainEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => mainEl.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    // Immediately apply active state with no transition
    setNavAnimate(false);
    setActiveSection(id);

    // Suppress scroll listener for the duration of the smooth scroll (~600 ms)
    isProgrammaticScroll.current = true;
    if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 700);

    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Filtered donations
  const filteredDonations = donationRows.filter((d) => {
    const matchTab = donationTab === "all" || d.status === donationTab;
    const q = query("donations").toLowerCase();
    const matchSearch = !q || d.id.toLowerCase().includes(q) || d.supporter.toLowerCase().includes(q) || d.fund.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  // Filtered emails
  const filteredEmails = emailRows.filter((e) => {
    const q = query("emails").toLowerCase();
    return !q || e.subject.toLowerCase().includes(q) || e.sent.toLowerCase().includes(q);
  });

  // Filtered transactions
  const filteredTx = transactionRows.filter((t) => {
    const q = query("transactions").toLowerCase();
    return !q || t.txId.toLowerCase().includes(q) || t.sent.toLowerCase().includes(q);
  });

  // Filtered sync
  const filteredSync = syncRows.filter((s) => {
    const q = query("sync").toLowerCase();
    return !q || s.syncBy.toLowerCase().includes(q) || s.status.toLowerCase().includes(q);
  });

  const selectedLogData = logEvents.find((l) => l.id === selectedLog);

  const sharedHeaderProps = (id: string, placeholder?: string) => ({
    searchId: id,
    searchOpen: isOpen(id),
    searchQuery: query(id),
    searchPlaceholder: placeholder,
    onSearchOpen:  () => openSearch(id),
    onSearchClose: () => closeSearch(id),
    onSearchChange: (v: string) => changeQuery(id, v),
  });

  return (
    <div className="flex gap-8">
      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 space-y-4">
        <Link
          href="/report/payments"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#EC8900] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </Link>

        {/* 1. Donations */}
        <section ref={setRef("donations")} id="donations">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="Donations" count={donationRows.length} {...sharedHeaderProps("donations", "Search by ID, supporter or fund…")} />

            <div className="flex items-center gap-2 mb-4">
              {(["all", "covered", "pending", "failed"] as const).map((t) => (
                <button key={t} onClick={() => setDonationTab(t)}
                  className={cn("rounded-full px-3 py-0.5 text-xs font-semibold capitalize transition-colors",
                    donationTab === t ? "bg-[#EC8900] text-white" : "text-gray-500 hover:text-gray-700"
                  )}
                >{t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>

            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="text-xs font-semibold text-gray-500">Donation ID</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Supporter</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Campaign</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Fund</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonations.length > 0 ? filteredDonations.map((d) => (
                    <TableRow key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <TableCell className="text-sm font-medium text-gray-700">{d.id}</TableCell>
                      <TableCell className="text-sm font-semibold text-gray-900">{d.supporter}</TableCell>
                      <TableCell>
                        <Badge variant={campaignVariant[d.status]} className="gap-1.5 pl-2">
                          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", campaignDot[d.status])} />
                          {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{d.fund}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={4} className="py-8 text-center text-sm text-gray-400">No donations found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* 2. Payment and Fees */}
        <section ref={setRef("payment-fees")} id="payment-fees">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="Payment and Fees" editButton {...sharedHeaderProps("payment-fees")} searchId={undefined} onSearchOpen={() => {}} onSearchClose={() => {}} onSearchChange={() => {}} />
            <div>
              {paymentFeeRows.map((r) => <InfoRow key={r.label} {...r} />)}
            </div>
            <div className="mt-2">
              {paymentDetailRows.map((r) => <InfoRow key={r.label} {...r} />)}
            </div>
          </div>
        </section>

        {/* 3. GiftAid */}
        <section ref={setRef("giftaid")} id="giftaid">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="GiftAid" count={3} {...sharedHeaderProps("giftaid")} />
            {giftAidRows.map((r) => <InfoRow key={r.label} {...r} />)}
          </div>
        </section>

        {/* 4. Personal Information */}
        <section ref={setRef("personal-information")} id="personal-information">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="Personal Information" editButton {...sharedHeaderProps("personal-info")} searchId={undefined} onSearchOpen={() => {}} onSearchClose={() => {}} onSearchChange={() => {}} />
            {personalInfoRows.map((r) => <InfoRow key={r.label} {...r} />)}
          </div>
        </section>

        {/* 5. Tribute */}
        <section ref={setRef("tribute")} id="tribute">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="Tribute" count={6} {...sharedHeaderProps("tribute")} />
            <EmptySection message="No tribute yet" />
          </div>
        </section>

        {/* 6. Notes */}
        <section ref={setRef("notes")} id="notes">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="Notes" count={0} {...sharedHeaderProps("notes")} />
            <EmptySection message="No notes yet" />
          </div>
        </section>

        {/* 7. Message of Support */}
        <section ref={setRef("message-support")} id="message-support">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="Message of Support" count={6} {...sharedHeaderProps("message-support")} />
            <EmptySection message="No comment yet" />
          </div>
        </section>

        {/* 8. Source */}
        <section ref={setRef("source")} id="source">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="Source" count={6} {...sharedHeaderProps("source")} />
            {sourceRows.map((r) => <InfoRow key={r.label} {...r} />)}
          </div>
        </section>

        {/* 9. Insights */}
        <section ref={setRef("insights")} id="insights">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="Insights" count={6} {...sharedHeaderProps("insights")} />
            {insightRows.map((r) => <InfoRow key={r.label} {...r} />)}
          </div>
        </section>

        {/* 10. UTF Parameters */}
        <section ref={setRef("utf-parameters")} id="utf-parameters">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="UTF Parameters" count={0} {...sharedHeaderProps("utf-parameters")} />
            <EmptySection message="No UTM parameters recorded" />
          </div>
        </section>

        {/* 11. Custom Fields */}
        <section ref={setRef("custom-fields")} id="custom-fields">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="Custom Fields" count={0} {...sharedHeaderProps("custom-fields")} />
            <EmptySection message="No custom fields available" />
          </div>
        </section>

        {/* 12. Emails */}
        <section ref={setRef("emails")} id="emails">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="Emails" count={emailRows.length} {...sharedHeaderProps("emails", "Search by subject or date…")} />
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
                  {filteredEmails.length > 0 ? filteredEmails.map((e) => (
                    <TableRow key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <TableCell className="text-sm text-gray-600 whitespace-nowrap">{e.sent}</TableCell>
                      <TableCell className="text-sm text-gray-600">{e.subject}</TableCell>
                      <TableCell className="text-sm text-gray-400">{e.opened}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm"
                          className="gap-1.5 border-[#EC8900] text-[#EC8900] hover:bg-orange-50 text-xs"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Resend
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={4} className="py-8 text-center text-sm text-gray-400">No emails found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* 13. Transactions */}
        <section ref={setRef("transactions")} id="transactions">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="Transactions" count={transactionRows.length} {...sharedHeaderProps("transactions", "Search by transaction ID…")} />
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="text-xs font-semibold text-gray-500">Sent</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTx.length > 0 ? filteredTx.map((t) => (
                    <TableRow key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <TableCell className="text-sm text-gray-600 whitespace-nowrap">{t.sent}</TableCell>
                      <TableCell>
                        <a href="#" className="text-sm font-medium text-[#EC8900] hover:underline">{t.txId}</a>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={2} className="py-8 text-center text-sm text-gray-400">No transactions found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* 14. Logs & Events */}
        <section ref={setRef("logs-events")} id="logs-events">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="Logs &amp; Events" count={logEvents.length} {...sharedHeaderProps("logs")} />
            <div className="flex gap-4">
              {/* Timeline */}
              <div className="w-52 shrink-0 space-y-3 relative">
                <div className="absolute left-[7px] top-5 bottom-5 w-px bg-orange-200" />
                {logEvents.map((log) => (
                  <button key={log.id} onClick={() => setSelectedLog(log.id)}
                    className={cn("relative w-full text-left pl-5 pr-2 py-2 rounded-lg transition-colors",
                      selectedLog === log.id ? "bg-orange-50" : "hover:bg-gray-50"
                    )}
                  >
                    <span className={cn("absolute left-0 top-3.5 h-3.5 w-3.5 rounded-full border-2 border-white",
                      selectedLog === log.id ? "bg-[#EC8900]" : "bg-orange-200"
                    )} />
                    {log.errorCode && (
                      <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold mr-1",
                        log.errorCode.type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                      )}>
                        {log.errorCode.code}
                      </span>
                    )}
                    <p className="text-xs font-semibold text-gray-800 inline">{log.title}</p>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{log.description}</p>
                  </button>
                ))}
              </div>

              {/* Detail panel */}
              {selectedLogData && (
                <div className="flex-1 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">From Stripe</p>
                  <p className="text-sm font-semibold text-gray-800">Payment_Intent.payment_failed</p>
                  <a href="#" className="text-xs text-[#EC8900] hover:underline">View event detail</a>
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-500 mb-1.5">Event Data</p>
                    <div className="rounded-lg bg-white border border-gray-100 overflow-hidden">
                      <pre className="p-3 text-[11px] text-gray-700 leading-relaxed overflow-x-auto font-mono whitespace-pre">
                        {logEventJson}
                      </pre>
                      <div className="border-t border-gray-100 px-3 py-2">
                        <button className="text-[11px] text-[#EC8900] hover:underline">
                          ⊕ See all 66 lines
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 15. Sync */}
        <section ref={setRef("sync")} id="sync">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <SectionHeader title="Sync" count={syncRows.length} {...sharedHeaderProps("sync", "Search by name or status…")} />
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="text-xs font-semibold text-gray-500">Date</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Sync by</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSync.length > 0 ? filteredSync.map((s, i) => (
                    <TableRow key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <TableCell className="text-sm text-gray-600 whitespace-nowrap">{s.date}</TableCell>
                      <TableCell>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{s.status}</span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">{s.syncBy}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={3} className="py-8 text-center text-sm text-gray-400">No sync records found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </div>

      {/* ── Sticky right nav (15 items) ── */}
      <aside className="w-52 shrink-0">
        <div className="sticky top-8 rounded-xl border border-gray-100 bg-white p-3 space-y-0.5 max-h-[calc(100vh-6rem)] overflow-y-auto">
          {NAV.map((item, i) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-left",
                navAnimate && "transition-colors",
                activeSection === item.id
                  ? "bg-orange-50 text-[#EC8900]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              )}
            >
              <span className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                navAnimate && "transition-colors",
                activeSection === item.id ? "bg-[#EC8900] text-white" : "bg-gray-100 text-gray-500"
              )}>
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
