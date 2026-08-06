import Link from "next/link";
import { Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddInstitutionDialog } from "@/components/dashboard/add-institution-dialog";
import { EditInstitutionDialog } from "@/components/dashboard/edit-institution-dialog";

type InstitutionStatus = "invited" | "live" | "exit" | "funded";

interface Institution {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  region: string;
  status: InstitutionStatus;
}

const statusLabel: Record<InstitutionStatus, string> = {
  invited: "Invited",
  live: "Live",
  exit: "Exit",
  funded: "Funded",
};

const institutions: Institution[] = [
  { id: "1", name: "Newton Academy", subtitle: "submitted by a registrant", type: "Schools", region: "Indonesia", status: "invited" },
  { id: "2", name: "Newton Academy", subtitle: "submitted by a registrant", type: "University societies", region: "Indonesia", status: "live" },
  { id: "3", name: "Newton Academy", subtitle: "submitted by a registrant", type: "Masjids", region: "Indonesia", status: "exit" },
  { id: "4", name: "Newton Academy", subtitle: "submitted by a registrant", type: "Organisations", region: "Indonesia", status: "live" },
  { id: "5", name: "Newton Academy", subtitle: "submitted by a registrant", type: "Schools", region: "Indonesia", status: "exit" },
  { id: "6", name: "Newton Academy", subtitle: "submitted by a registrant", type: "Schools", region: "Indonesia", status: "exit" },
  { id: "7", name: "Newton Academy", subtitle: "submitted by a registrant", type: "Schools", region: "Indonesia", status: "exit" },
  { id: "8", name: "Newton Academy", subtitle: "submitted by a registrant", type: "Schools", region: "Indonesia", status: "live" },
  { id: "9", name: "Newton Academy", subtitle: "submitted by a registrant", type: "Schools", region: "Indonesia", status: "funded" },
  { id: "10", name: "Newton Academy", subtitle: "submitted by a registrant", type: "Schools", region: "Indonesia", status: "funded" },
  { id: "11", name: "Newton Academy", subtitle: "submitted by a registrant", type: "Schools", region: "Indonesia", status: "invited" },
];

export default function InstitutionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#161616]">Institutions</h1>
        <p className="text-sm font-regular text-[#475467]">
          Create and manage automated communication journeys for your donors.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Institutions"
            className="pl-9 bg-white w-full rounded-sm border border-[#D7D7D7] py-3"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 hover:bg-orange-50 hover:border-orange-300 hover:text-[#EC8900] border-[#EC8900] text-[#EC8900] font-bold">
            <Upload className="h-4 w-4" color="#EC8900" />
            Import CSV
          </Button>
          <AddInstitutionDialog />
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-white hover:bg-white">
              <TableHead className="text-xs font-semibold text-gray-500 pl-6">Institutions</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Type</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Region</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Status</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {institutions.map((institution) => (
              <TableRow
                key={institution.id}
                className="border-b border-gray-50 hover:bg-gray-50"
              >
                <TableCell className="pl-6 py-4">
                  <Link href={`/campaign/institutions/${institution.id}`} className="group">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-[#EC8900] transition-colors">
                      {institution.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{institution.subtitle}</p>
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-gray-600">{institution.type}</TableCell>
                <TableCell className="text-sm text-gray-600">{institution.region}</TableCell>
                <TableCell>
                  <Badge variant={institution.status} className="gap-1.5 pl-2">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${institution.status === "live" ? "bg-[#14BA6D]" :
                      institution.status === "invited" ? "bg-[#666666]" :
                        institution.status === "exit" ? "bg-red-500" :
                          "bg-[#003080]"
                      }`} />
                    {statusLabel[institution.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <EditInstitutionDialog
                    institutionName={institution.name}
                    institutionType={institution.type}
                    region={institution.region}
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
