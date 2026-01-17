'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetcher } from '@/lib/api';

interface Lead {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export default function LeadDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetcher(`/leads/${id}`)
            .then(setLead)
            .catch((err) => {
                console.error(err);
                // router.push('/'); 
            })
            .finally(() => setLoading(false));
    }, [id, router]);

    if (loading) return <div className="flex h-screen items-center justify-center text-indigo-600">Loading...</div>;
    if (!lead) return <div className="flex h-screen items-center justify-center text-red-500">Lead not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 dark:bg-gray-900 transition-colors duration-300">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="bg-gradient-to-r from-indigo-600 to-pink-600 px-8 py-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
                    <span className="bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                        {lead.status}
                    </span>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-400">Email Address</label>
                            <div className="text-gray-900 font-medium dark:text-gray-100">{lead.email}</div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-400">Phone Number</label>
                            <div className="text-gray-900 font-medium dark:text-gray-100">{lead.phone}</div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-400">Created At</label>
                            <div className="text-gray-900 font-medium dark:text-gray-100">{new Date(lead.createdAt).toLocaleString()}</div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-400">Last Updated</label>
                            <div className="text-gray-900 font-medium dark:text-gray-100">{new Date(lead.updatedAt).toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4 dark:border-gray-700">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Back
                        </button>
                        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-medium">
                            Edit Lead
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
