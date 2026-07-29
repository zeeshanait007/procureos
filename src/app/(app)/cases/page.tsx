import Link from 'next/link';
import { NavButton } from '@/components/ui/nav-button';
import { prisma } from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewCaseButton } from '@/components/dashboard/new-case-button';
import { DeleteCaseButton } from '@/components/dashboard/delete-case-button';

export default async function Page({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const resolvedParams = await searchParams;
  const isPendingFilter = resolvedParams.filter === 'pending';

  const cases = await prisma.procurementCase.findMany({
    where: isPendingFilter ? {
      status: {
        in: ['COMPLIANCE_REVIEW', 'PUBLISH_TRACK']
      }
    } : undefined,
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {isPendingFilter ? "Pending Approvals" : "Procurement Cases"}
            </h1>
            <p className="text-slate-500 mt-1">
              {isPendingFilter 
                ? "Cases currently waiting for compliance review or final publishing."
                : "Manage all procurement initiatives."}
            </p>
          </div>
          <NewCaseButton />
        </div>

        {cases.length === 0 ? (
          <div className="mt-8 border rounded-lg p-12 bg-white shadow-sm text-center">
            <h3 className="text-lg font-semibold text-slate-900">No Cases Found</h3>
            <p className="text-slate-500 mb-4 mt-2">Get started by creating a new procurement case.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {cases.map((pc) => (
              <Card key={pc.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-indigo-700 border-indigo-200 bg-indigo-50">
                      {pc.status.replace(/_/g, ' ')}
                    </Badge>
                    <DeleteCaseButton caseId={pc.id} />
                  </div>
                  <CardTitle className="text-lg line-clamp-1">{pc.title}</CardTitle>
                  <CardDescription className="text-xs">
                    Last updated: {new Date(pc.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NavButton 
                    href={`/cases/${pc.id}`} 
                    className="w-full bg-slate-900 text-white hover:bg-slate-800"
                  >
                    Open Workspace
                  </NavButton>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
