import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddChallengeDialog } from "@/components/dashboard/add-challenge-dialog";
import { EditChallengeDialog } from "@/components/dashboard/edit-challenge-dialog";

type RegistrationStatus = "open" | "limited" | "full";

interface Challenge {
  id: string;
  name: string;
  subtitle: string;
  createdDate: string;
  createdBy: string;
  dateOfEvent: string;
  price: string;
  cap: number;
  registered: number;
  status: RegistrationStatus;
  spotsLeft?: number;
}

const challenges: Challenge[] = [
  { id: "1", name: "CW 10K Run", subtitle: "submitted by a registrant", createdDate: "Fri. 13 Sept 2026, 9:00 PM", createdBy: "Layla Haddad", dateOfEvent: "Fri. 13 Sept 2026, 9:00 PM", price: "$25", cap: 200, registered: 117, status: "open" },
  { id: "2", name: "CW 10K Run", subtitle: "submitted by a registrant", createdDate: "Fri. 13 Sept 2026, 9:00 PM", createdBy: "Omar Al-Farouq", dateOfEvent: "Fri. 13 Sept 2026, 9:00 PM", price: "$25", cap: 117, registered: 105, status: "limited", spotsLeft: 12 },
  { id: "3", name: "CW 10K Run", subtitle: "submitted by a registrant", createdDate: "Fri. 13 Sept 2026, 9:00 PM", createdBy: "Nadia Mansour", dateOfEvent: "Fri. 13 Sept 2026, 9:00 PM", price: "$25", cap: 117, registered: 117, status: "full" },
  { id: "4", name: "CW 10K Run", subtitle: "submitted by a registrant", createdDate: "Fri. 13 Sept 2026, 9:00 PM", createdBy: "Youssef Khalil", dateOfEvent: "Fri. 13 Sept 2026, 9:00 PM", price: "$25", cap: 200, registered: 100, status: "open" },
  { id: "5", name: "CW 10K Run", subtitle: "submitted by a registrant", createdDate: "Fri. 13 Sept 2026, 9:00 PM", createdBy: "Amina Saeed", dateOfEvent: "Fri. 13 Sept 2026, 9:00 PM", price: "$25", cap: 117, registered: 100, status: "open" },
  { id: "6", name: "CW 10K Run", subtitle: "submitted by a registrant", createdDate: "Fri. 13 Sept 2026, 9:00 PM", createdBy: "Rami Nasser", dateOfEvent: "Fri. 13 Sept 2026, 9:00 PM", price: "$25", cap: 220, registered: 120, status: "open" },
  { id: "7", name: "CW 10K Run", subtitle: "submitted by a registrant", createdDate: "Fri. 13 Sept 2026, 9:00 PM", createdBy: "Dina Farhat", dateOfEvent: "Fri. 13 Sept 2026, 9:00 PM", price: "$25", cap: 220, registered: 208, status: "limited", spotsLeft: 12 },
  { id: "8", name: "CW 10K Run", subtitle: "submitted by a registrant", createdDate: "Fri. 13 Sept 2026, 9:00 PM", createdBy: "Zain Al-Hassan", dateOfEvent: "Fri. 13 Sept 2026, 9:00 PM", price: "$25", cap: 220, registered: 208, status: "limited", spotsLeft: 12 },
  { id: "9", name: "CW 10K Run", subtitle: "submitted by a registrant", createdDate: "Fri. 13 Sept 2026, 9:00 PM", createdBy: "Mona Jaber", dateOfEvent: "Fri. 13 Sept 2026, 9:00 PM", price: "$25", cap: 220, registered: 208, status: "limited", spotsLeft: 12 },
  { id: "10", name: "CW 10K Run", subtitle: "submitted by a registrant", createdDate: "Fri. 13 Sept 2026, 9:00 PM", createdBy: "Tariq Al-Masri", dateOfEvent: "Fri. 13 Sept 2026, 9:00 PM", price: "$25", cap: 220, registered: 124, status: "open" },
  { id: "11", name: "CW 10K Run", subtitle: "submitted by a registrant", createdDate: "Fri. 13 Sept 2026, 9:00 PM", createdBy: "Salma Youssef", dateOfEvent: "Fri. 13 Sept 2026, 9:00 PM", price: "$25", cap: 220, registered: 125, status: "open" },
];

function RegistrationBadge({ challenge }: { challenge: Challenge }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-700">{challenge.registered}</span>
      {challenge.status === "open" && (
        <span className="text-xs font-light bg-[#ECFDF3] px-2 py-0.5 rounded-full text-[#037847]">Open</span>
      )}
      {challenge.status === "limited" && (
        <span className="text-xs px-2 py-0.5 font-light text-[#EAB308] bg-[#FCFDEC] rounded-full">
          left
        </span>
      )}
      {challenge.status === "full" && (
        <span className="rounded-full bg-[#FDECEC] px-2 py-0.5 text-xs font-light text-[#EF4444]">
          Full
        </span>
      )}
    </div>
  );
}

export default function ChallengesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#161616]">Challenges</h1>
        <p className="text-sm text-[#475467]">
          Create and manage automated communication journeys for your donors.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search challenges"
            className="pl-9 bg-white w-full rounded-sm border border-[#D7D7D7] py-3"
          />
        </div>
        <AddChallengeDialog />
      </div>

      <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-white hover:bg-white">
              <TableHead className="text-xs font-semibold text-gray-500 pl-6">Name</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Created Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Created By</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Date of Event</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Price</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Cap</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Registered</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {challenges.map((challenge) => (
              <TableRow
                key={challenge.id}
                className="border-b border-gray-50 hover:bg-gray-50"
              >
                <TableCell className="pl-6 py-4">
                  <Link href={`/campaign/challenges/${challenge.id}`} className="group">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-[#EC8900] transition-colors">
                      {challenge.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{challenge.subtitle}</p>
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-gray-600 whitespace-nowrap">{challenge.createdDate}</TableCell>
                <TableCell className="text-sm text-gray-600">{challenge.createdBy}</TableCell>
                <TableCell className="text-sm text-gray-600 whitespace-nowrap">{challenge.dateOfEvent}</TableCell>
                <TableCell className="text-sm text-gray-600">{challenge.price}</TableCell>
                <TableCell className="text-sm text-gray-600">{challenge.cap}</TableCell>
                <TableCell>
                  <RegistrationBadge challenge={challenge} />
                </TableCell>
                <TableCell>
                  <EditChallengeDialog
                    challengeName={challenge.name}
                    initialPrice={challenge.price.replace("$", "")}
                    initialCap={String(challenge.cap)}
                    triggerLabel="Edit"
                    triggerSize="sm"
                    triggerClassName="border-[#EC8900] text-[#EC8900] hover:bg-orange-50 hover:border-orange-300 rounded-full px-4"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
