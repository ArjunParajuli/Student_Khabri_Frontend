'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/api';
import { ThemeToggle } from '@/components/theme-toggle';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

interface Analytics {
  totalLeads: number;
  convertedLeads: number;
  leadsByStage: { _id: string; count: number }[];
}

export default function Dashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState('-createdAt');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsData, analyticsData] = await Promise.all([
        fetcher(`/leads?page=${page}&limit=10&search=${search}&status=${statusFilter}&sort=${sort}`),
        fetcher('/leads/analytics')
      ]);

      setLeads(leadsData.leads);
      setTotalPages(leadsData.pagination.pages);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error(error);
      // If error is auth, redirect to login (basic check)
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, sort, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = async () => {
    try {
      await fetcher('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-10 transition-colors duration-300">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
                LeadMaster
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Analytics Section */}
        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total Leads</h3>
                <p className="mt-2 text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{analytics.totalLeads}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Converted</h3>
                <p className="mt-2 text-3xl font-extrabold text-green-500 dark:text-green-400">{analytics.convertedLeads}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Conversion Rate</h3>
                <p className="mt-2 text-3xl font-extrabold text-pink-500 dark:text-pink-400">
                  {analytics.totalLeads > 0
                    ? ((analytics.convertedLeads / analytics.totalLeads) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>

            {/* Stage Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {analytics.leadsByStage.map((stage) => (
                <div key={stage._id} className="bg-white/50 p-4 rounded-lg border border-gray-100 text-center dark:bg-gray-800/50 dark:border-gray-700">
                  <span className="block text-xs font-semibold text-gray-400 uppercase dark:text-gray-500">{stage._id}</span>
                  <span className="block text-xl font-bold text-gray-800 dark:text-gray-200">{stage.count}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Filters & Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between dark:bg-gray-800 dark:border-gray-700">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="-name">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Date</th>
                  <th className="px-6 py-3 relative"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  ))
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead._id}
                      onClick={() => router.push(`/leads/${lead._id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{lead.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${lead.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                          ${lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : ''}
                          ${lead.status === 'Qualified' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : ''}
                          ${lead.status === 'Converted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                          ${lead.status === 'Lost' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : ''}
                        `}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</div>
                        <div className="text-sm text-gray-400 dark:text-gray-500">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <span className="text-indigo-600 hover:text-indigo-900">View</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Page <span className="font-medium dark:text-gray-200">{page}</span> of <span className="font-medium dark:text-gray-200">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    <span className="sr-only">Previous</span>
                    {/* Heroicon name: solid/chevron-left */}
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    // Simple pagination logic for display
                    // For true advanced pagination, we'd need more logic, but this is a mini dashboard
                    let p = i + 1;
                    if (page > 3 && totalPages > 5) p = page - 2 + i;
                    if (p > totalPages) return null;

                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === p ? 'bg-indigo-50 text-indigo-600 z-10' : ''}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    {/* Heroicon name: solid/chevron-right */}
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
