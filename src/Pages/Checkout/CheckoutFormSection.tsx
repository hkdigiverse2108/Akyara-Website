import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { ErrorMessage } from "../../Attribute/Notification";
import { CommonInput, PhoneInputWithCountryCode } from "../../Components";
import { ROUTES } from "../../Constants";
import type { CheckoutFormSectionProps } from "../../Types";
import { setCartItems } from "../../Utils/commerceStorage";
import { getPrimarySettings } from "../../Utils/settings";
import { CheckoutSchema } from "../../Utils/ValidationSchemas";
import NewAddressFormSection from "./NewAddressFormSection";
import SavedAddressSection from "./SavedAddressSection";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
let razorpayLoader: Promise<boolean> | null = null;

const isObjectId = (value?: string) => /^[a-f0-9]{24}$/i.test(value ?? "");
const formatCurrency = (value: number) => `Rs ${value.toLocaleString("en-IN")}`;
const toNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return 0;
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const resolvePhonePeRedirectUrl = (value: any) =>
  String(
    value?.redirectUrl ||
      value?.paymentUrl ||
      value?.url ||
      value?.data?.instrumentResponse?.redirectInfo?.url ||
      value?.instrumentResponse?.redirectInfo?.url ||
      value?.redirectInfo?.url ||
      "",
  ).trim();

const loadRazorpayScript = async () => {
  const win = window as any;
  if (win.Razorpay) return true;

  if (!razorpayLoader) {
    razorpayLoader = new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  return razorpayLoader;
};

const CheckoutFormSection = ({
  initialValues,
  items,
  subtotal,
  isAuthenticated,
  userId,
}: CheckoutFormSectionProps) => {
  const navigate = useNavigate();
  const addOrderMutation = Mutations.useAddOrder();
  const createRazorpayPaymentMutation = Mutations.useCreateRazorpayPayment();
  const verifyRazorpayPaymentMutation = Mutations.useVerifyRazorpayPayment();
  const createPhonePePaymentMutation = Mutations.useCreatePhonePePayment();
  const settingsQuery = Queries.useGetSettings(true);

  const settings = getPrimarySettings(settingsQuery.data?.data);
  const isRazorpayEnabled = Boolean(settings?.isRazorpay);
  const isPhonePeEnabled = Boolean(settings?.isPhonePe);
  const razorpayKey = String(settings?.razorpayApiKey ?? import.meta.env.VITE_RAZORPAY_KEY_ID ?? "").trim();

  const isPaymentPending =
    addOrderMutation.isPending ||
    createRazorpayPaymentMutation.isPending ||
    verifyRazorpayPaymentMutation.isPending ||
    createPhonePePaymentMutation.isPending;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CheckoutSchema}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        setStatus(undefined);

        const invalid = items.find((item) => !isObjectId(item.productId));
        if (invalid) {
          setStatus({
            error:
              "Some cart items are not synced with the server. Please remove and add them again.",
          });
          setSubmitting(false);
          return;
        }

        const cleanDiscountCode = values.discountCode?.trim() ?? "";
        const payload: any = {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          phone: {
            countryCode: values.countryCode.trim(),
            number: values.phoneNumber.replace(/\D/g, ""),
          },
          ...(values.addressId
            ? { addressId: values.addressId }
            : {
                shippingAddress: {
                  country: values.country.trim(),
                  address1: values.address1.trim(),
                  address2: values.address2.trim() || "",
                  city: values.city.trim(),
                  state: values.state.trim(),
                  pinCode: values.zipCode.trim(),
                  default: Boolean(values.isDefault),
                },
              }),
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
          subtotal,
          total: subtotal,
          currency: "INR",
          ...(cleanDiscountCode ? { discountCode: cleanDiscountCode } : {}),
        };

        const shouldUsePhonePe = isAuthenticated && isPhonePeEnabled;
        const shouldUseRazorpay =
          isAuthenticated && !shouldUsePhonePe && (isRazorpayEnabled || !!razorpayKey);

        try {
          const orderResponse: any = await addOrderMutation.mutateAsync(payload);
          const responseData: any = orderResponse?.data ?? {};
          const createdOrder: any =
            responseData?.updatedOrder || responseData?.order || responseData || orderResponse?.updatedOrder;
          const createdOrderId = String(createdOrder?._id || createdOrder?.id || "").trim();
          const payableTotal = toNumber(createdOrder?.total || createdOrder?.subtotal || subtotal);
          const payableTotalInRupees = Math.max(1, Number(payableTotal.toFixed(2)));
          const amountInPaise = Math.max(1, Math.round(payableTotal * 100));

          if (shouldUsePhonePe) {
            const merchantRedirectUrl =
              typeof window !== "undefined"
                ? `${window.location.origin}${ROUTES.ACCOUNT.ORDERS}`
                : ROUTES.ACCOUNT.ORDERS;
            const phonePeInitResponse: any = await createPhonePePaymentMutation.mutateAsync({
              amount: payableTotalInRupees,
              redirectUrl: merchantRedirectUrl,
              orderId: createdOrderId || undefined,
            });
            const phonePeData: any = phonePeInitResponse?.data ?? phonePeInitResponse;
            const redirectUrl = resolvePhonePeRedirectUrl(phonePeData);

            if (!redirectUrl) {
              throw new Error("Unable to initiate PhonePe payment.");
            }

            setCartItems([]);
            window.location.assign(redirectUrl);
            return;
          }

          if (shouldUseRazorpay) {
            const sdkLoaded = await loadRazorpayScript();
            if (!sdkLoaded) {
              throw new Error("Unable to load Razorpay checkout. Please try again.");
            }

            let paymentData: any = responseData?.razorpayOrder || orderResponse?.razorpayOrder;
            const embeddedAmount = Number(paymentData?.amount);
            const hasMatchingEmbeddedOrder =
              !!paymentData?.id && Number.isFinite(embeddedAmount) && Math.abs(embeddedAmount - amountInPaise) <= 1;

            if (!hasMatchingEmbeddedOrder) {
              const paymentInitResponse: any = await createRazorpayPaymentMutation.mutateAsync({
                amount: amountInPaise,
                currency: "INR",
                receipt: createdOrderId || `order_${Date.now()}`,
              });
              paymentData = paymentInitResponse?.data ?? paymentInitResponse;
            }

            const razorpayOrderId = String(
              paymentData?.id || paymentData?.orderId || paymentData?.razorpayOrderId || "",
            ).trim();
            const razorpayAmountRaw = Number(paymentData?.amount);
            const razorpayAmount =
              Number.isFinite(razorpayAmountRaw) && razorpayAmountRaw > 0
                ? Math.round(razorpayAmountRaw)
                : amountInPaise;
            const razorpayCurrency = String(paymentData?.currency || "INR");
            const resolvedRazorpayKey = String(
              razorpayKey || paymentData?.key || paymentData?.key_id || paymentData?.keyId || "",
            ).trim();

            if (!razorpayOrderId) {
              throw new Error("Unable to initiate payment order.");
            }
            if (!resolvedRazorpayKey) {
              throw new Error("Razorpay key is missing in settings/pay response.");
            }

            const paymentResult = await new Promise<any>((resolve, reject) => {
              const RazorpayCtor = (window as any).Razorpay;
              if (!RazorpayCtor) {
                reject(new Error("Razorpay SDK is unavailable."));
                return;
              }

              const razorpay = new RazorpayCtor({
                key: resolvedRazorpayKey,
                amount: razorpayAmount,
                currency: razorpayCurrency,
                name: "Akyara",
                description: "Order Payment",
                order_id: razorpayOrderId,
                prefill: {
                  name: `${values.firstName} ${values.lastName}`.trim(),
                  email: values.email.trim(),
                  contact: values.phoneNumber.replace(/\D/g, ""),
                },
                theme: { color: "#111111" },
                modal: {
                  ondismiss: () => reject(new Error("Payment cancelled by user.")),
                },
                handler: (response: any) => resolve(response),
              });

              razorpay.open();
            });

            await verifyRazorpayPaymentMutation.mutateAsync({
              orderId: createdOrderId || undefined,
              razorpay_order_id: paymentResult?.razorpay_order_id,
              razorpay_payment_id: paymentResult?.razorpay_payment_id,
              razorpay_signature: paymentResult?.razorpay_signature,
            });
          }

          setCartItems([]);
          setStatus({ success: orderResponse?.message ?? "Order placed successfully" });
          navigate(isAuthenticated ? ROUTES.ACCOUNT.ORDERS : ROUTES.HOME);
        } catch (error) {
          setStatus({ error: ErrorMessage(error, "Unable to place order") });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, status }) => (
        <Form className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid gap-6">
            <section className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.04)] sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-[#0f172a]">Contact Details</h2>
                  <p className="mt-1 text-sm text-[#5b6472]">
                    We'll use these to send order updates.
                  </p>
                </div>
                {!isAuthenticated ? (
                  <Link
                    to={ROUTES.AUTH.LOGIN}
                    className="rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#111111]"
                  >
                    Login
                  </Link>
                ) : null}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <CommonInput label="First name" name="firstName" placeholder="Enter first name" />
                <CommonInput label="Last name" name="lastName" placeholder="Enter last name" />
              </div>
              <div className="mt-4 grid gap-4">
                <CommonInput label="Email" name="email" type="email" placeholder="you@example.com" />
                <PhoneInputWithCountryCode
                  label="Phone number"
                  countryCodeName="countryCode"
                  phoneNumberName="phoneNumber"
                  placeholder="Enter phone number"
                />
              </div>
            </section>

            <section className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.04)] sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-[#0f172a]">Shipping Address</h2>
                  <p className="mt-1 text-sm text-[#5b6472]">Enter the address for delivery.</p>
                </div>
                {isAuthenticated ? (
                  <Link
                    to={ROUTES.ACCOUNT.ADDRESSES}
                    className="text-xs font-semibold uppercase tracking-widest text-[#ef6b4a] transition hover:text-[#d64f31]"
                  >
                    Manage Addresses
                  </Link>
                ) : null}
              </div>

              <SavedAddressSection enabled={isAuthenticated} userId={userId} />
              <NewAddressFormSection isAuthenticated={isAuthenticated} />
            </section>

            {status?.error ? (
              <p className="rounded-[14px] border border-[#ffd6d6] bg-[#fff1f1] px-4 py-3 text-sm text-[#e53935]">
                {status.error}
              </p>
            ) : null}
            {status?.success ? (
              <p className="rounded-[14px] border border-[#c7f0d3] bg-[#ecfff0] px-4 py-3 text-sm text-[#1b7f3a]">
                {status.success}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end lg:hidden">
              <button
                type="submit"
                disabled={isSubmitting || isPaymentPending}
                className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[200px] sm:w-auto"
              >
                {isSubmitting || isPaymentPending
                  ? "Processing order..."
                  : `Place Order - ${formatCurrency(subtotal)}`}
              </button>
            </div>
          </div>

          <aside className="self-start rounded-[18px] border border-[#e7ecf3] bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
            <h2 className="text-base font-semibold text-[#0f172a]">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {items.map((item, idx) => (
                <div
                  key={`${item.productId}-${idx}`}
                  className="flex items-start justify-between gap-3 rounded-[14px] border border-[#eef2f8] bg-[#fbfdff] px-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="m-0 line-clamp-2 text-sm font-semibold text-[#0f172a]">{item.name}</p>
                    <p className="m-0 mt-1 text-xs text-[#6b7280]">
                      {formatCurrency(item.unitPrice)} x {item.quantity}
                    </p>
                  </div>
                  <p className="m-0 text-sm font-semibold text-[#111827]">
                    {formatCurrency(item.lineTotal)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-[#eef2f8] pt-4">
              <CommonInput
                label="Discount code"
                name="discountCode"
                placeholder="Enter discount code (optional)"
              />
            </div>

            <div className="mt-4 space-y-2 border-t border-[#eef2f8] pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">Subtotal</span>
                <span className="font-semibold text-[#111827]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#eef2f8] pt-2">
                <span className="font-semibold text-[#111827]">Total</span>
                <span className="text-base font-black text-[#111827]">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isPaymentPending}
              className="mt-5 hidden w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-70 lg:block"
            >
              {isSubmitting || isPaymentPending
                ? "Processing order..."
                : `Place Order - ${formatCurrency(subtotal)}`}
            </button>
          </aside>
        </Form>
      )}
    </Formik>
  );
};

export default CheckoutFormSection;
