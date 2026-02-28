import { Company } from "@/types/company";
import { ChevronRight, Globe, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CompanyTableProps {
  companies: Company[];
}

export default function CompanyTable({ companies }: CompanyTableProps) {
  const router = useRouter();

  if (companies.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-neutral-200 border-dashed bg-white">
        <p className="text-sm text-neutral-500">No companies found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              Company
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              Industry
            </th>
            <th scope="col" className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 md:table-cell">
              Location
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 bg-white">
          {companies.map((company) => (
            <tr
              key={company.id}
              onClick={() => router.push(`/companies/${company.id}`)}
              className="group cursor-pointer transition-colors hover:bg-neutral-50"
            >
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-white">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="h-full w-full object-contain p-1"
                      loading="lazy"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-neutral-900 group-hover:text-black">
                      {company.name}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-neutral-500">
                      <Globe className="h-3 w-3" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline flex-1 truncate max-w-[150px] relative z-10" onClick={(e) => e.stopPropagation()}>
                        {company.website.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    </div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10"
                )}>
                  {company.industry}
                </span>
              </td>
              <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-neutral-500 md:table-cell">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {company.location}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <ChevronRight className="ml-auto h-5 w-5 text-neutral-400 group-hover:text-neutral-900" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
