import { useEffect, useMemo, useState } from "react";
import { Queries } from "../../Api/Queries";
import type { FaqItem, FaqValue } from "../../Types";

type FaqRecord = Record<string, unknown>;

type FaqCategoryGroup = {
  key: string;
  label: string;
  items: FaqItem[];
};

const COLLECTION_KEYS = ["data", "docs", "items", "rows", "results", "records"] as const;

const isRecord = (value: unknown): value is FaqRecord => typeof value === "object" && value !== null;

const getFaqCategoryValue = (value: unknown): FaqItem["faqCategoryId"] | undefined => {
  if (typeof value === "string") {
    return value;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const categoryName = typeof value.name === "string" ? value.name.trim() : undefined;
  const categoryTitle = typeof value.title === "string" ? value.title.trim() : undefined;

  return {
    _id: typeof value._id === "string" ? value._id : undefined,
    name: categoryName || categoryTitle,
  };
};

const toFaqItem = (value: unknown): FaqItem | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const question = typeof value.question === "string" ? value.question.trim() : undefined;
  const answer = typeof value.answer === "string" ? value.answer.trim() : undefined;

  if (!question && !answer) {
    return undefined;
  }

  return {
    _id: typeof value._id === "string" ? value._id : undefined,
    question,
    answer,
    priority: typeof value.priority === "number" ? value.priority : 0,
    faqCategoryId: getFaqCategoryValue(value.faqCategoryId),
    isActive: typeof value.isActive === "boolean" ? value.isActive : undefined,
    isDeleted: typeof value.isDeleted === "boolean" ? value.isDeleted : undefined,
  };
};

const normalizeFaqItems = (value: unknown, visited = new WeakSet<object>()): FaqItem[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeFaqItems(item, visited));
  }

  if (!isRecord(value)) {
    return [];
  }

  if (visited.has(value)) {
    return [];
  }

  visited.add(value);

  const directItem = toFaqItem(value);

  if (directItem) {
    return [directItem];
  }

  const fromCollectionKeys = COLLECTION_KEYS.flatMap((key) =>
    normalizeFaqItems(value[key], visited),
  );

  if (fromCollectionKeys.length) {
    return fromCollectionKeys;
  }

  return Object.values(value).flatMap((nestedValue) => normalizeFaqItems(nestedValue, visited));
};

const toTitleCase = (value: string) =>
  value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const resolveFaqCategory = (item: FaqItem, index: number) => {
  if (typeof item.faqCategoryId === "string" && item.faqCategoryId.trim()) {
    const normalized = item.faqCategoryId.trim();
    return { key: `cat:${normalized}`, label: `${toTitleCase(normalized)}:` };
  }

  if (item.faqCategoryId && typeof item.faqCategoryId === "object") {
    const categoryName = item.faqCategoryId.name?.trim();
    const categoryId = item.faqCategoryId._id?.trim();

    if (categoryName) {
      return { key: `cat:${categoryId || categoryName}`, label: `${categoryName}:` };
    }

    if (categoryId) {
      return { key: `cat:${categoryId}`, label: "General:" };
    }
  }

  return { key: `general:${index}`, label: "General:" };
};

const getFaqItemKey = (item: FaqItem, categoryKey: string, index: number) =>
  item._id ? `faq:${item._id}` : `faq:${categoryKey}:${index}`;

const FAQPage = () => {
  const faqQuery = Queries.useGetFaqAll(true);

  const faqItems = useMemo(
    () =>
      normalizeFaqItems(faqQuery.data?.data as FaqValue)
        .filter((item) => item.isDeleted !== true && item.isActive !== false)
        .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)),
    [faqQuery.data?.data],
  );

  const faqGroups = useMemo(() => {
    const groupedMap = new Map<string, FaqCategoryGroup>();

    faqItems.forEach((item, index) => {
      const category = resolveFaqCategory(item, index);
      const existing = groupedMap.get(category.key);

      if (existing) {
        existing.items.push(item);
        return;
      }

      groupedMap.set(category.key, {
        key: category.key,
        label: category.label,
        items: [item],
      });
    });

    return Array.from(groupedMap.values());
  }, [faqItems]);

  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!faqGroups.length || Object.keys(openItems).length) {
      return;
    }

    const firstGroup = faqGroups[0];
    const firstItem = firstGroup.items[0];

    if (!firstItem) {
      return;
    }

    const firstItemKey = getFaqItemKey(firstItem, firstGroup.key, 0);
    setOpenItems({ [firstItemKey]: true });
  }, [faqGroups, openItems]);

  const toggleItem = (itemKey: string) => {
    setOpenItems((previous) => ({
      ...previous,
      [itemKey]: !previous[itemKey],
    }));
  };

  return (
    <section className="mx-auto w-[94%] max-w-[1300px] py-12 sm:py-16 lg:py-20">
      <div className="relative text-center">
        <p className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 text-[3rem] font-semibold italic tracking-wide text-[#d7d9dd] opacity-60 sm:text-[4.4rem]">
          FAQs Section
        </p>
        <h1 className="text-[2.15rem] font-semibold leading-tight text-[#0b0b0b] sm:text-[2.75rem]">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="mt-8 space-y-8">
        {faqQuery.isLoading ? (
          <div className="rounded-[8px] border border-[#cfd4da] bg-[#f3f4f6] px-6 py-8 sm:px-10">
            <p className="text-[1.02rem] leading-9 text-[#0b0b0b]">Loading FAQs...</p>
          </div>
        ) : faqGroups.length ? (
          faqGroups.map((group) => (
            <article key={group.key} className="rounded-[8px] border border-[#cfd4da] bg-[#f3f4f6] p-5 sm:p-6">
              <h2 className="text-[2rem] font-semibold leading-tight text-[#0b0b0b]">{group.label}</h2>

              <div className="mt-4 space-y-3">
                {group.items.map((item, index) => {
                  const itemKey = getFaqItemKey(item, group.key, index);
                  const isOpen = !!openItems[itemKey];

                  return (
                    <div key={itemKey} className="overflow-hidden rounded-[8px] border border-[#cfd4da] bg-[#f3f4f6]">
                      <button
                        type="button"
                        onClick={() => toggleItem(itemKey)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-[1.05rem] font-semibold text-[#0b0b0b]">
                          {item.question ?? "Question"}
                        </span>
                        <span className="text-4xl leading-none text-[#3b3f46]">{isOpen ? "\u2212" : "+"}</span>
                      </button>

                      {isOpen && item.answer ? (
                        <div className="border-t border-[#d5dae0] px-5 pb-5">
                          <p className="mt-3 whitespace-pre-line text-[1.02rem] leading-9 text-[#5f6774]">
                            {item.answer}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[8px] border border-[#cfd4da] bg-[#f3f4f6] px-6 py-8 sm:px-10">
            <p className="text-[1.02rem] leading-9 text-[#5f6774]">
              FAQ content will appear here once it is published.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQPage;
