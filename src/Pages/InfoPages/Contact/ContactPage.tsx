import { ErrorMessage as FormikErrorMessage, Field, Form, Formik } from "formik";
import { Mutations } from "../../../Api/Mutations";
import { Queries } from "../../../Api/Queries";
import { ErrorMessage as AppErrorMessage } from "../../../Attribute/Notification";
import type { ContactFormValues, ContactPayload } from "../../../Types";
import { getPrimarySettings } from "../../../Utils/settings";
import { ContactSchema } from "../../../Utils/ValidationSchemas";

const ContactPage = () => {
  const contactMutation = Mutations.useAddContact();
  const settingsQuery = Queries.useGetSettings(true);
  const settings = getPrimarySettings(settingsQuery.data?.data);
  const address = settings?.address?.trim();
  const contact = settings?.contact?.trim();
  const email = settings?.email?.trim();

  return (
    <section className="bg-[#f8f9fb] py-10 sm:py-12 lg:py-16">
      <div className="mx-auto w-[92%] max-w-[1260px] rounded-[12px] bg-white p-5 shadow-sm sm:p-8 lg:p-10">
        <div className="relative mb-8 text-center sm:mb-10">
          <p className="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 -translate-y-[35%] whitespace-nowrap text-[clamp(2.5rem,6vw,4.5rem)] font-semibold italic leading-none text-[#d9dde4]/60 md:block">Contact Us</p>
          <h1 className="relative z-10 text-2xl font-semibold text-[#0b0b0b] sm:text-3xl">Get In Touch</h1>
        </div>
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-10">
          <aside className="space-y-6">
            <div className="rounded-[10px] border border-[#e5e9ef] p-5">
              <h2 className="text-[1.4rem] font-semibold text-[#ef4444]">Address</h2>
              <p className="mt-3 text-[0.95rem] leading-7 text-[#5f6774]">{address || "Address not available"}</p>
              <p className="mt-3 text-[0.95rem] text-[#1f2937]">
                <span className="font-semibold">Email:</span>{" "}
                {email ? (<a href={`mailto:${email}`} className="transition hover:text-black">  {email}</a>) : (
                  <span>Not available</span>
                )}
              </p>
            </div>

            <div className="rounded-[10px] border border-[#e5e9ef] p-5">
              <h2 className="text-[1.4rem] font-semibold text-[#ef4444]">Make a Call</h2>
              <p className="mt-3 text-[1rem] font-semibold text-[#0b0b0b]">Customer Care:</p>
              {contact ? (<a href={`tel:${contact}`} className="mt-1 block text-[0.95rem] text-[#5f6774] transition hover:text-black">  {contact}</a>
              ) : (<p className="mt-1 text-[0.95rem] text-[#5f6774]">Not available</p>)}
            </div>

            <div className="rounded-[10px] border border-[#e5e9ef] p-5">
              <h2 className="text-[1.4rem] font-semibold text-[#ef4444]">Drop A Mail</h2>
              <p className="mt-3 text-[0.95rem] leading-7 text-[#5f6774]">
                Fill out our form and we will contact you within 24 hours.
              </p>
              {email ? (<a href={`mailto:${email}`} className="mt-3 block text-[0.95rem] text-[#111827] transition hover:text-black">  {email}</a>) : (
                <p className="mt-3 text-[0.95rem] text-[#111827]">Not available</p>
              )}
            </div>
          </aside>

          <div>
            <Formik<ContactFormValues> initialValues={{ name: "", email: "", mobileNumber: "", subject: "", message: "" }}validationSchema={ContactSchema}onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
                setStatus(undefined);
                try {
                  const payload: ContactPayload = {name: values.name.trim(),email: values.email.trim(),mobileNumber: values.mobileNumber.trim(),message: values.message.trim(),...(values.subject.trim() ? { subject: values.subject.trim() } : {}),};

                  const data = await contactMutation.mutateAsync(payload);
                  setStatus({ success: data?.message ?? "Message sent successfully." });
                  resetForm();
                } catch (error) {
                  setStatus({ error: AppErrorMessage(error, "Unable to send message.") });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, status }) => (
                <Form className="grid gap-4 sm:gap-5">
                  {[{ label: "Your Name *", name: "name", type: "text" },{ label: "Your Email *", name: "email", type: "email" },{ label: "Mobile Number *", name: "mobileNumber", type: "text" },{ label: "Subject", name: "subject", type: "text" },].map((field) => (
                    <label key={field.name} className="grid gap-2 text-sm font-semibold text-[#111111]">
                      <span>{field.label}</span>
                      <Field name={field.name} type={field.type} placeholder={field.label} className="w-full rounded-[6px] border border-[#d8dde6] bg-white px-4 py-3 text-[0.95rem] text-[#111827] outline-none transition focus:border-black focus:shadow-[0_0_0_1px_rgba(0,0,0,0.05)]"/>
                      <FormikErrorMessage name={field.name} component="span" className="text-xs text-[#e53935]" />
                    </label>
                  ))}

                  <label className="grid gap-2 text-sm font-semibold text-[#111111]">
                    <span>Message *</span>
                    <Field as="textarea" name="message" rows={6} placeholder="Write your message..." className="w-full resize-y rounded-[6px] border border-[#d8dde6] bg-white px-4 py-3 text-[0.95rem] leading-7 text-[#111827] outline-none transition focus:border-black focus:shadow-[0_0_0_1px_rgba(0,0,0,0.05)]"/>
                    <FormikErrorMessage name="message" component="span" className="text-xs text-[#e53935]" />
                  </label>

                  {status?.error ? (<p className="rounded-[10px] bg-[#ffecec] px-4 py-3 text-sm text-[#e53935]">{status.error}</p>) : null}

                  {status?.success ? (<p className="rounded-[10px] bg-[#ecfff0] px-4 py-3 text-sm text-[#1b7f3a]">{status.success}</p>) : null}

                  <button type="submit" disabled={isSubmitting || contactMutation.isPending} className="mt-2 inline-flex h-[50px] items-center justify-center rounded-[4px] bg-[#111111] px-7 text-[0.95rem] font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit">
                    {isSubmitting || contactMutation.isPending ? "Sending..." : "Send Message"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
