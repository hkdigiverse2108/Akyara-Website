import { StarFilled } from "@ant-design/icons";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import type { ProductItem, ProductReview, ProductTab, ReviewFormValues } from "../../Types";

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

interface ProductTabsProps {product: ProductItem;activeTab: ProductTab;setActiveTab: (tab: ProductTab) => void;reviews: ProductReview[];isReviewsLoading: boolean;reviewForm: ReviewFormValues;reviewFormMessage: string | null;isReviewSubmitting: boolean;handleReviewFieldChange: (field: Exclude<keyof ReviewFormValues, "rating">, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;handleReviewRatingChange: (rating: number) => void;handleReviewSubmit: (event: FormEvent<HTMLFormElement>) => void;}
export const ProductTabs = ({product,activeTab,setActiveTab,reviews,isReviewsLoading,reviewForm,reviewFormMessage,isReviewSubmitting,handleReviewFieldChange,handleReviewRatingChange,handleReviewSubmit,}: ProductTabsProps) => {
  const productReferenceId = `#${product.sku.replace(/[^0-9]/g, "").padStart(7, "0").slice(-7)}`;
  const primaryColor = product.colors[0]?.name || "-";
  const sizeLabel = product.sizes.length > 0 ? product.sizes.slice(0, 2).join(", ") : "-";
  const productWeight =
    product.category === "Jeans" ? "450 Gr" : product.category === "Shirts" ? "320 Gr" : "220 Gr";
  const additionalInfoRows = [{ label: "ID", value: productReferenceId },{ label: "SKU", value: product.sku },{ label: "Color", value: primaryColor },{ label: "Size", value: sizeLabel },{ label: "Weight", value: productWeight },];
  const reviewLabel = `${reviewForm.rating} Star${reviewForm.rating > 1 ? "s" : ""}`;

  const getHtmlText = (value: string) => {
    if (typeof window === "undefined" || typeof DOMParser === "undefined") return value.trim();
    const parsed = new DOMParser().parseFromString(value, "text/html");
    return (parsed.body.textContent ?? "").replace(/\u00A0/g, " ").trim();
  };

  const descriptionCandidates = [product.longDescription, product.description].filter(Boolean) as string[];
  const selectedDescription = descriptionCandidates.find((candidate) => {
    const trimmed = candidate.trim();
    if (!trimmed) return false;
    if (!HTML_TAG_PATTERN.test(trimmed)) return true;
    return Boolean(getHtmlText(trimmed));
  });
  const descriptionContent = selectedDescription?.trim() || "No product description available.";
  const shouldRenderHtml = HTML_TAG_PATTERN.test(descriptionContent);

  const tabCopy: Record<ProductTab, ReactNode> = {
    description: (
      shouldRenderHtml ? (
        <div
          className="space-y-4 [&_a]:text-[#111827] [&_a]:underline [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-[#111827] sm:[&_h1]:text-3xl [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#111827] sm:[&_h2]:text-2xl [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#111827] sm:[&_h3]:text-xl [&_li]:ml-5 [&_li]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:space-y-2"
          dangerouslySetInnerHTML={{ __html: descriptionContent }}
        />
      ) : (
        <div className="whitespace-pre-line">{descriptionContent}</div>
      )
    ),
    additional: (
      <div className="overflow-hidden border-y border-[#e9edf3]">
        {additionalInfoRows.map((row) => (
          <div key={row.label} className="grid grid-cols-[minmax(100px,160px)_1fr] items-center gap-5 border-b border-[#e9edf3] px-4 py-4 text-sm text-[#111827] last:border-b-0 sm:px-6">
            <span className="font-semibold">{row.label}</span>
            <span className="text-[#374151]">{row.value}</span>
          </div>
        ))}
      </div>
    ),
    reviews: (
      <div className="space-y-12">
        <div className="overflow-hidden border-y border-[#edf1f5]">
          {isReviewsLoading ? (
            <div className="grid min-h-[140px] place-items-center px-4 py-10 text-sm text-[#8b96a8] sm:px-6">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="grid min-h-[140px] place-items-center px-4 py-10 text-sm text-[#8b96a8] sm:px-6">
              No reviews yet.
            </div>
          ) : (
            reviews.map((review) => (
            <article
              key={review.id}
              className="flex flex-col gap-5 border-b border-[#edf1f5] py-7 last:border-b-0 sm:py-8 lg:flex-row lg:items-start lg:justify-between"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div
                  className="inline-flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                  style={{ background: review.avatarBackground }}
                >
                  {review.avatarLabel}
                </div>

                <div className="min-w-0">
                  <h3 className="text-[1.08rem] font-semibold text-[#111827]">{review.name}</h3>
                  <p className="mt-0.5 text-[0.88rem] text-[#8b96a8]">{review.date}</p>
                  <p className="mt-2.5 max-w-[920px] text-[0.98rem] leading-8 text-[#667085]">{review.comment}</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1 text-[0.9rem] text-[#ff9f0a] lg:mt-1 lg:shrink-0">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarFilled key={`${review.id}-${index}`} className={index < review.rating ? "" : "opacity-20"} />
                ))}
              </div>
            </article>
            ))
          )}
        </div>

        <div>
          <h3 className="text-[1.9rem] font-semibold text-[#111827]">Submit Rating</h3>

          <form className="mt-6 space-y-6" onSubmit={handleReviewSubmit}>
            <div className="flex flex-col gap-3 rounded-[8px] bg-[#f5f7fb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-2 text-[1rem]">
                {Array.from({ length: 5 }).map((_, index) => {
                  const starValue = index + 1;
                  const isActive = starValue <= reviewForm.rating;

                  return (
                    <button key={starValue} type="button" onClick={() => handleReviewRatingChange(starValue)} className={`transition ${isActive ? "text-[#ff9f0a]" : "text-[#b7bec8] hover:text-[#ff9f0a]"}`} aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}>
                      {isActive ? <StarFilled /> : <StarFilled className="opacity-20" />}
                    </button>
                  );
                })}
              </div>

              <span className="text-[0.98rem] font-medium text-[#111827]">{reviewLabel}</span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-[#111827]">
                <span>Full Name</span>
                <input type="text" value={reviewForm.fullName} onChange={(event) => handleReviewFieldChange("fullName", event)} className="h-11 w-full rounded-[6px] border border-[#d8dde6] bg-white px-4 text-[0.95rem] text-[#111827] outline-none transition focus:border-black"/>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-[#111827]">
                <span>Email Address</span>
                <input type="email" value={reviewForm.email} onChange={(event) => handleReviewFieldChange("email", event)} className="h-11 w-full rounded-[6px] border border-[#d8dde6] bg-white px-4 text-[0.95rem] text-[#111827] outline-none transition focus:border-black"/>
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-[#111827]">
              <span>Description</span>
              <textarea rows={7} value={reviewForm.description} onChange={(event) => handleReviewFieldChange("description", event)} className="w-full resize-y rounded-[6px] border border-[#d8dde6] bg-white px-4 py-2 text-[0.95rem] leading-7 text-[#111827] outline-none transition focus:border-black"/>
            </label>

            {reviewFormMessage ? (
              <p className={`rounded-[10px] px-4 py-3 text-sm ${   reviewFormMessage === "Review submitted successfully."     ? "bg-[#ecfff0] text-[#1b7f3a]"     : "bg-[#ffecec] text-[#e53935]" }`}>{reviewFormMessage}</p>
            ) : null}

            <button type="submit" disabled={isReviewSubmitting} className="inline-flex h-[56px] items-center justify-center gap-3 rounded-[6px] bg-[#111111] px-8 text-[1rem] font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70">
              {isReviewSubmitting ? "Submitting..." : "Submit Review"}
              <span aria-hidden="true">&rarr;</span>
            </button>
          </form>
        </div>
      </div>
    ),
  };

  return (
    <section className="mt-16 border-t border-[#eef1f5] pt-14">
      <div className="site-container">
        <div className="hide-scrollbar flex items-center justify-start gap-7 overflow-x-auto whitespace-nowrap px-4 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[#8b96a8] sm:justify-center sm:gap-10 sm:px-0">
          {([{ key: "description", label: "Description" },{ key: "additional", label: "Additional Information" },{ key: "reviews", label: "Reviews" },] as Array<{ key: ProductTab; label: string }>).map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={`border-b pb-3 transition ${   isActive ? "border-[#111827] text-[#111827]" : "border-transparent text-[#8b96a8] hover:text-[#111827]" }`}>
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-[980px] text-sm leading-8 text-[#5f6774]">{tabCopy[activeTab]}</div>
      </div>
    </section>
  );
};
