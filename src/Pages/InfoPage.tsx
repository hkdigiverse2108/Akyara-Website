import { Queries } from "../Api/Queries";
import type { InfoPageProps, PolicyCollection, PolicyItem, PolicyValue } from "../Types";

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

const pickFirstPolicy = (items: PolicyItem[], policyType?: string) =>
  items.find((item) => item?.type === policyType && item?.isActive !== false) ??
  items.find((item) => item?.type === policyType) ??
  items.find((item) => item?.isActive !== false) ??
  items[0];

const isPolicyItem = (value: PolicyItem | PolicyCollection): value is PolicyItem =>
  "description" in value || "title" in value || "type" in value;

const normalizePolicy = (value: PolicyValue, policyType?: string): PolicyItem | undefined => {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return pickFirstPolicy(value, policyType);
  }

  if (isPolicyItem(value)) {
    return !policyType || value.type === policyType ? value : undefined;
  }

  return normalizePolicy(value.data ?? value.docs ?? value.items ?? value.rows, policyType);
};

const InfoPage = ({ eyebrow, policyType }: InfoPageProps) => {
  const { data: policyResponse, isLoading } = Queries.useGetPolicyByType(policyType, !!policyType);
  const policy = normalizePolicy(policyResponse?.data as PolicyValue, policyType);
  const policyDescription = policy?.description?.trim();
  const shouldRenderHtml = !!policyDescription && HTML_TAG_PATTERN.test(policyDescription);

  return (
    <section className="mx-auto w-[92%] max-w-[1200px] py-16 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#f6821f]">{eyebrow}</p>

      {policyType ? (
        <div className="mt-10 rounded-[28px] border border-[#ece7df] bg-[#fffaf4] p-6 sm:p-8">
          {isLoading ? (<p className="text-base leading-7 text-[#111111]">Loading policy details...</p>
          ) : policyDescription ? (
            shouldRenderHtml ? (
              <div
                className="space-y-4 text-base leading-7 text-[#3f3a34] [&_a]:text-[#f6821f] [&_a]:underline [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:space-y-2"
                dangerouslySetInnerHTML={{ __html: policyDescription }}
              />
            ) : (
              <div className="whitespace-pre-line text-base leading-7 text-[#3f3a34]">{policyDescription}</div>
            )
          ) : (
            <p className="text-base leading-7 text-[#666666]">Policy details will appear here once the content is published.</p>
          )}
        </div>
      ) : null}
    </section>
  );
};

export default InfoPage;
