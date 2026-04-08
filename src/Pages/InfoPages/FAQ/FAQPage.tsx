import { useEffect, useMemo, useState } from "react";
import { Queries } from "../../../Api/Queries";
import type { FaqItem } from "../../../Types";
import { PageLoader } from "../../../Components";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

type FaqRecord = Record<string, unknown>;
type FaqCategoryGroup = { key: string; label: string; items: FaqItem[] };

const KEYS = ["data", "docs", "items", "rows", "results", "records"] as const;
const isObj = (v: unknown): v is FaqRecord => typeof v === "object" && v !== null;

const getCategory = (v: unknown): FaqItem["faqCategoryId"] | undefined => {
    if (typeof v === "string") return v;
    if (!isObj(v)) return;
    return { _id: typeof v._id === "string" ? v._id : undefined, name: (v.name || v.title)?.toString().trim() };
};

const toItem = (v: unknown): FaqItem | undefined => {
    if (!isObj(v)) return;
    const q = v.question?.toString().trim(), a = v.answer?.toString().trim();
    if (!q && !a) return;
    return { _id: typeof v._id === "string" ? v._id : undefined, question: q, answer: a, priority: Number(v.priority) || 0, faqCategoryId: getCategory(v.faqCategoryId), isActive: v.isActive as boolean, isDeleted: v.isDeleted as boolean };
};

const normalize = (v: unknown, visited = new Set()): FaqItem[] => {
    if (!v || (typeof v === 'object' && visited.has(v))) return [];
    if (Array.isArray(v)) return v.flatMap(i => normalize(i, visited));
    if (!isObj(v)) return [];
    visited.add(v);
    const item = toItem(v);
    if (item) return [item];
    return KEYS.flatMap(k => normalize(v[k], visited)).concat(
        Object.keys(v).filter(k => !KEYS.includes(k as any)).flatMap(k => normalize(v[k], visited))
    );
};

const title = (s: string) => s.replace(/[_-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());

const resolveCat = (item: FaqItem, i: number) => {
    const c = item.faqCategoryId;
    if (typeof c === "string") return { key: `cat:${c}`, label: title(c) };
    if (typeof c === "object" && (c?.name || c?._id)) return { key: `cat:${c._id || c.name}`, label: c.name || "General Information" };
    return { key: `general:${i}`, label: "General Support" };
};

const FAQPage = () => {
    const { data, isLoading } = Queries.useGetFaqAll(true);
    const [open, setOpen] = useState<Record<string, boolean>>({});

    const items = useMemo(() => normalize(data?.data).filter(i => i.isDeleted !== true && i.isActive !== false).sort((a, b) => (a.priority || 0) - (b.priority || 0)), [data]);

    const groups = useMemo(() => {
        const map = new Map<string, FaqCategoryGroup>();
        items.forEach((item, i) => {
            const cat = resolveCat(item, i);
            const key = cat.key;
            if (!map.has(key)) map.set(key, { ...cat, items: [] });
            if (!map.get(key)!.items.find(existing => existing._id === item._id)) {
                map.get(key)!.items.push(item);
            }
        });
        return [...map.values()];
    }, [items]);

    useEffect(() => {
        if (!groups.length || Object.keys(open).length) return;
        const first = groups[0]?.items[0];
        if (first?._id) setOpen({ [`faq:${first._id}`]: true });
    }, [groups, open]);

    if (isLoading) return <PageLoader />;

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <div className="bg-white border-b border-gray-100 py-12 sm:py-20 overflow-hidden">
                <div className="site-container">
                    <div className="relative text-center max-w-4xl mx-auto">
                        <p className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(2.5rem,10vw,6rem)] font-bold italic tracking-wider text-black/[0.03] sm:tracking-widest">
                            <span>FAQ&apos;s Section</span>
                        </p>
                        <h1 className="relative z-10 text-2xl font-bold text-[#111827] sm:text-4xl lg:text-[2.75rem] leading-tight">
                            <span>Frequently Asked Questions</span>
                        </h1>
                    </div>
                </div>
            </div>
            <div className="site-container py-12 sm:py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-12">
                        {groups.length > 0 ? (
                            groups.map((group) => (
                                <div key={group.key} className="animate-fadeIn">
                                    <div className="flex items-center gap-4 mb-6">
                                        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-[#e53935] whitespace-nowrap">
                                            <span>{group.label}</span>
                                        </h2>
                                        <div className="h-[1px] w-full bg-gray-100" />
                                    </div>
                                    <div className="space-y-3">
                                        {group.items.map((item, idx) => {
                                            const key = item._id ? `faq:${item._id}` : `faq:${group.key}:${idx}`;
                                            const isOpen = !!open[key];
                                            return (
                                                <div key={key} className={`group transition-all duration-300 rounded-xl border ${isOpen ? 'border-gray-200 bg-white shadow-lg shadow-black/[0.02]' : 'border-transparent bg-white shadow-sm hover:border-gray-200'}`}>
                                                    <button onClick={() => setOpen(p => ({ ...p, [key]: !p[key] }))} className="w-full flex items-center justify-between px-6 py-4.5 text-left">
                                                        <span className={`pr-6 font-bold text-[0.95rem] transition-colors duration-300 ${isOpen ? 'text-[#e53935]' : 'text-[#111827]'}`}>
                                                            <span>{item.question}</span>
                                                        </span>
                                                        <span className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${isOpen ? 'bg-[#e53935] text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                                                            {isOpen ? <MinusOutlined className="text-[9px]" /> : <PlusOutlined className="text-[9px]" />}
                                                        </span>
                                                    </button>
                                                    <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                        <div className="px-6 pb-5 pt-1">
                                                            <div className="border-t border-gray-50 pt-4">
                                                                <p className="text-gray-500 leading-relaxed text-[0.92rem]">
                                                                    <span>{item.answer}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-2"><span>No FAQs Yet</span></h3>
                                <p className="text-gray-500"><span>Check back soon!</span></p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
