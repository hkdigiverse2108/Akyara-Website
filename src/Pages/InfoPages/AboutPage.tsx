import { Queries } from "../../Api/Queries";
import type { AboutSection, AboutValue } from "../../Types";

type AboutRecord = Record<string, unknown>;

const COLLECTION_KEYS = ["data", "docs", "items", "rows", "results", "records"] as const;

const isRecord = (value: unknown): value is AboutRecord => typeof value === "object" && value !== null;

const toAboutSection = (value: unknown): AboutSection | undefined => {
  if (!isRecord(value)) { return undefined; }

  const title = typeof value.title === "string" ? value.title.trim() : undefined;
  const subtitle = typeof value.subtitle === "string" ? value.subtitle.trim() : undefined;
  const description = typeof value.description === "string" ? value.description.trim() : undefined;
  const image = typeof value.image === "string" ? value.image.trim() : undefined;

  if (!title && !subtitle && !description && !image) { return undefined; }

  return { _id: typeof value._id === "string" ? value._id : undefined, title, subtitle, description, image, priority: typeof value.priority === "number" ? value.priority : 0, isActive: typeof value.isActive === "boolean" ? value.isActive : undefined, isDeleted: typeof value.isDeleted === "boolean" ? value.isDeleted : undefined, };
};

const normalizeAboutSections = (value: unknown, visited = new WeakSet<object>()): AboutSection[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap((item) => normalizeAboutSections(item, visited));
  if (!isRecord(value)) return [];
  if (visited.has(value)) return [];

  visited.add(value);

  const directSection = toAboutSection(value);
  if (directSection) return [directSection];
  const fromCollectionKeys = COLLECTION_KEYS.flatMap((key) => normalizeAboutSections(value[key], visited),);

  if (fromCollectionKeys.length) return fromCollectionKeys;
  return Object.values(value).flatMap((nestedValue) => normalizeAboutSections(nestedValue, visited));
};

const AboutPage = () => {
  const aboutQuery = Queries.useGetAboutSections(undefined, true);
  const sections = normalizeAboutSections(aboutQuery.data?.data as AboutValue).filter((item) => item.isDeleted !== true && item.isActive !== false).sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

  return (
    <section className="mx-auto w-[92%] max-w-[1300px] py-10 sm:py-14 lg:py-20">
      <div className="space-y-6 sm:space-y-10 lg:space-y-12">
        {aboutQuery.isLoading ? (
          <>
            {[0, 1].map((index) => (<div key={index} className="h-[260px] animate-pulse rounded-[14px] border border-[#e3e3e3] bg-[#f1f2f4] sm:h-[360px] lg:h-[420px]" />))}
          </>
        ) : sections.length ? (
          sections.map((section, index) => {
            const title = section.title || section.subtitle || "About Section";
            const subtitle = section.subtitle && section.subtitle !== title ? section.subtitle : undefined;
            const isTextFirst = index % 2 === 0;

            return (
              <article key={section._id ?? `${section.title ?? "about"}-${index}`} className="p-3 sm:p-6 lg:p-8">
                <div className={`grid items-center gap-5 sm:gap-7 lg:gap-12 ${section.image ? "lg:grid-cols-2" : ""}`}>
                  <div className={`${isTextFirst ? "lg:order-1 lg:px-5" : "lg:order-2 lg:px-5"}`}>
                    {subtitle && (<p className="text-xs font-medium uppercase tracking-[0.16em] text-[#4b5563] sm:text-sm">{subtitle}</p>
                    )}
                    <h2 className="mt-2 text-[1.8rem] font-semibold leading-[1.1] text-[#0b0b0b] sm:text-[2.2rem] lg:text-[2.8rem]"> {title}</h2>

                    {section.description && (<p className="mt-5 max-w-[650px] whitespace-pre-line text-[0.98rem] leading-7 text-[#5f6774] sm:mt-7 sm:text-[1.08rem] sm:leading-8">  {section.description}</p>)}

                    <button type="button" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-[#070b14] px-8 text-[0.95rem] font-medium text-white transition-all hover:bg-[#00060f] sm:mt-8 sm:h-12 sm:w-auto">See More Info</button>
                  </div>

                  {section.image && (
                    <div className={`relative ${isTextFirst ? "lg:order-2" : "lg:order-1"}`}>
                      <div aria-hidden="true" className="absolute -left-6 top-6 hidden h-[calc(100%-12px)] w-[calc(100%-12px)] rounded-[10px] bg-[#eceff2] xl:block" />
                      <img src={section.image} alt={section.title || "About section image"} className="relative h-[260px] w-full rounded-[10px] object-cover sm:h-[360px] lg:h-[460px] xl:h-[500px]" />
                    </div>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-[14px] border border-dashed border-[#d9d9d9] bg-[#f3f4f6] px-5 py-8 text-center sm:px-8 sm:py-10">
            <p className="text-base leading-7 text-[#666666]"> About page content will appear here once the content is published. </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutPage;
