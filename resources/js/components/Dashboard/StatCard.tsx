import React from 'react';

export default function StatCard({ title, value, icon, color, lightColor }: any) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className={`p-3.5 rounded-xl ${lightColor} group-hover:${color} group-hover:text-white transition-colors duration-300`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                </svg>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{title}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
            </div>
        </div>
    );
}

//export default function StatCard({ title, value, icon, color, lightColor }: any) {