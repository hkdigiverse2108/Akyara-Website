import { Queries } from "../Api/Queries";
import type { InfoPageProps, PolicyCollection, PolicyItem, PolicyValue } from "../Types";

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

const pickFirstItem = (items: PolicyItem[], policyType?: string) =>
  items.find((item) => item?.type === policyType && item?.isActive !== false) ??
  items.find((item) => item?.type === policyType) ??
  items.find((item) => item?.isActive !== false) ??
  items[0];

const isPolicyItem = (value: PolicyItem | PolicyCollection): value is PolicyItem =>
  "description" in value || "title" in value || "type" in value;

const normalizeContent = (value: PolicyValue, policyType?: string): PolicyItem | undefined => {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return pickFirstItem(value, policyType);
  }

  if (isPolicyItem(value)) {
    return !policyType || value.type === policyType ? value : undefined;
  }

  return normalizeContent(value.data ?? value.docs ?? value.items ?? value.rows, policyType);
};

const InfoPage = ({ eyebrow, title, description, policyType, aboutPage }: InfoPageProps) => {
  const policyQuery = Queries.useGetPolicyByType(policyType, !!policyType);
  const aboutQuery = Queries.useGetAboutSections(!!aboutPage);

  const contentResponse = aboutPage ? aboutQuery.data : policyQuery.data;
  const contentItem = normalizeContent(contentResponse?.data as PolicyValue, policyType);
  const resolvedTitle = contentItem?.title?.trim() || title;
  const contentDescription = contentItem?.description?.trim() || description;
  const shouldRenderHtml = !!contentDescription && HTML_TAG_PATTERN.test(contentDescription);
  const isLoading = aboutPage ? aboutQuery.isLoading : policyQuery.isLoading;
  const showContentCard = !!policyType || !!aboutPage;
  const emptyMessage = aboutPage
    ? "About page content will appear here once the content is published."
    : "Policy details will appear here once the content is published.";

  return (
    <section className="mx-auto w-[92%] max-w-[1200px] py-16 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#f6821f]">{eyebrow}</p>
      <h1 className="mt-4 text-3xl font-semibold text-[#111111] sm:text-5xl">{resolvedTitle}</h1>

      {showContentCard ? (
        <div className="mt-10 rounded-[28px] border border-[#ece7df] bg-[#fffaf4] p-6 sm:p-8">
          {isLoading ? (
            <p className="text-base leading-7 text-[#111111]">Loading details...</p>
          ) : contentDescription ? (
            shouldRenderHtml ? (
              <div
                className="space-y-4 text-base leading-7 text-[#3f3a34] [&_a]:text-[#f6821f] [&_a]:underline [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:space-y-2"
                dangerouslySetInnerHTML={{ __html: contentDescription }}
              />
            ) : (
              <div className="whitespace-pre-line text-base leading-7 text-[#3f3a34]">
                {contentDescription}
              </div>
            )
          ) : (
            <p className="text-base leading-7 text-[#666666]">{emptyMessage}</p>
          )}
        </div>
      ) : (
        <p className="mt-4 max-w-[720px] text-base leading-7 text-[#666666]">{description}</p>
      )}
    </section>
  );
};

export default InfoPage;
