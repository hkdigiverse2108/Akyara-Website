import { useState, useMemo } from "react";
import { Queries } from "../Api";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const FaqAccordion = () => {
    const { data: faqData, isLoading } = Queries.useGetFaqAll();
    const [openId, setOpenId] = useState<string | null>(null);

    const groupedFaqs = useMemo(() => {
        const raw = faqData?.data;
        if (!raw) return [];
        // @ts-ignore
        const items: any[] = Array.isArray(raw) ? raw : (raw.faq_data || raw.items || []);
        const activeItems = items.filter(item => !item.isDeleted && item.isActive !== false).sort((a, b) => (a.priority || 0) - (b.priority || 0));
        const groups: Record<string, { name: string, items: any[] }> = {};
        activeItems.forEach(item => {
            const category = item.faqCategoryId;
            const catId = typeof category === 'string' ? category : (category?._id || 'general');
            const catName = typeof category === 'string' ? 'General' : (category?.name || 'General');
            if (!groups[catId]) groups[catId] = { name: catName, items: [] };
            groups[catId].items.push(item);
        });
        return Object.values(groups).slice(0, 3);
    }, [faqData]);

    if (!isLoading && groupedFaqs.length === 0) return null;

    return (
        <section className="py-6 bg-white border-y border-gray-50">
            <div className="site-container-fluid px-4">
                
                {/* Minimalist Heading */}
                <div className="mb-4 text-center">
                    <h2 className="text-sm font-black uppercase tracking-widest text-[#111827]">
                        FAQ
                    </h2>
                </div>

                <div className="mx-auto max-w-lg">
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="grid gap-1">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-8 w-full animate-pulse rounded bg-gray-50" />
                                ))}
                            </div>
                        ) : (
                            groupedFaqs.map((group, gIdx) => (
                                <div key={gIdx}>
                                    <div className="grid gap-1">
                                        {group.items.map((faq) => {
                                            const isOpen = openId === faq._id;
                                            return (
                                                <div key={faq._id} className="overflow-hidden bg-white border-b border-gray-100 last:border-0">
                                                    <button onClick={() => setOpenId(isOpen ? null : faq._id)} className="flex w-full items-center justify-between py-2 text-left">
                                                        <span className={`pr-4 text-[12px] font-medium transition-colors ${isOpen ? 'text-[#e53935]' : 'text-[#4b5563]'}`}>
                                                            {faq.question}
                                                        </span>
                                                        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-135 text-[#e53935]' : 'text-gray-300'}`}>
                                                            {isOpen ? <MinusOutlined className="text-[10px]" /> : <PlusOutlined className="text-[10px]" />}
                                                        </span>
                                                    </button>
                                                    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[200px] pb-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                        <p className="text-[11px] leading-relaxed text-[#9ca3af]">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FaqAccordion;
