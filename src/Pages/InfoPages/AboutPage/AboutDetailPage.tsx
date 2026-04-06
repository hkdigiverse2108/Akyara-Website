import { ArrowLeftOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Queries } from "../../../Api/Queries";
import { ROUTES } from "../../../Constants";
import { normalizeAboutSections } from "./AboutData";

const AboutDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const aboutDetailQuery = Queries.useGetAboutSectionById(id, !!id);

  const section = useMemo(() => {
    const normalized = normalizeAboutSections(aboutDetailQuery.data?.data);
    return normalized[0];
  }, [aboutDetailQuery.data?.data]);

  if (aboutDetailQuery.isLoading) {
    return (
      <section className="site-container py-10 sm:py-14 lg:py-20">
        <div className="h-[420px] animate-pulse rounded-[14px] border border-[#e3e3e3] bg-[#f1f2f4]" />
      </section>
    );
  }

  if (!section) {
    return (
      <section className="site-container py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-[900px] rounded-[14px] border border-dashed border-[#d9d9d9] bg-[#f3f4f6] px-5 py-10 text-center sm:px-8">
          <h1 className="text-2xl font-semibold text-[#0b0b0b] sm:text-3xl">About section not found</h1>
          <p className="mt-3 text-base leading-7 text-[#666666]">This section is unavailable right now.</p>
          <Link
            to={ROUTES.INFO.ABOUT}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#070b14] px-6 py-3 text-sm font-medium text-white transition hover:bg-black"
          >
            <ArrowLeftOutlined />
            Back to About
          </Link>
        </div>
      </section>
    );
  }

  const title = section.title || section.subtitle || "About Section";
  const subtitle = section.subtitle && section.subtitle !== title ? section.subtitle : undefined;

  return (
      <section className="site-container py-10 sm:py-14 lg:py-20">
      <div className="rounded-[14px] bg-white p-3 sm:p-6 lg:p-8">
        <Link
          to={ROUTES.INFO.ABOUT}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4b5563] transition hover:text-black"
        >
          <ArrowLeftOutlined />
          Back to About
        </Link>

        <div className={`mt-6 grid items-center gap-5 sm:gap-7 lg:mt-8 lg:gap-12 ${section.image ? "lg:grid-cols-2" : ""}`}>
          <div className="lg:px-5">
            {subtitle ? (
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#4b5563] sm:text-sm">{subtitle}</p>
            ) : null}

            <h1 className="mt-2 text-[1.8rem] font-semibold leading-[1.1] text-[#0b0b0b] sm:text-[2.2rem] lg:text-[2.8rem]">
              {title}
            </h1>

            {section.description ? (
              <p className="mt-5 max-w-[650px] whitespace-pre-line text-[0.98rem] leading-7 text-[#5f6774] sm:mt-7 sm:text-[1.08rem] sm:leading-8">
                {section.description}
              </p>
            ) : null}
          </div>

          {section.image ? (
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -left-6 top-6 hidden h-[calc(100%-12px)] w-[calc(100%-12px)] rounded-[10px] bg-[#eceff2] xl:block"
              />
              <img
                src={section.image}
                alt={section.title || "About section image"}
                className="relative h-[260px] w-full rounded-[10px] object-cover sm:h-[360px] lg:h-[460px] xl:h-[500px]"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default AboutDetailPage;
