import { Link, useNavigate } from "react-router-dom";
import { EmptyState } from "../../Components";
import { ROUTES } from "../../Constants";
import { useCart } from "../../Hooks/useCart";
import { useAppSelector } from "../../Store/Hooks";
import type { CheckoutFormValues } from "../../Types";
import CheckoutFormSection from "./CheckoutFormSection";

const parsePrice = (value: unknown) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const cleanValue = String(value).replace(/[^0-9.]/g, "");
  const parsed = parseFloat(cleanValue);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { cartList } = useCart();

  const userId = typeof user?._id === "string" ? user._id : typeof user?.id === "string" ? user.id : "";

  const items = cartList.map((item: any) => {
    const productId =typeof item.productId === "string"? item.productId: String(item.productId?._id || item.productId?.id || "");

    const quantity = Number(item.quantity || 1);
    const unitPrice = parsePrice(item.price || item.productId?.sellingPrice);

    return {productId,quantity,unitPrice,lineTotal: unitPrice * quantity,name: item.name || item.productId?.title || "Product",};
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  if (cartList.length === 0) {
    return (
      <div className="bg-[#f8fafc] pb-16 pt-8 sm:pt-10 lg:pb-24">
        <section className="site-container">
          <div className="overflow-hidden rounded-[18px] border border-gray-100 bg-white shadow-sm">
            <EmptyState title="Your bag is empty" description="Add some products to your bag to proceed with checkout." buttonText="Explore Products" onButtonClick={() => navigate(ROUTES.PRODUCTS)}/>
          </div>
        </section>
      </div>
    );
  }

  const initialValues: CheckoutFormValues = {firstName: String(user?.firstName ?? "").trim(),lastName: String(user?.lastName ?? "").trim(),email: String(user?.email ?? "").trim(),countryCode: String(user?.contact?.countryCode ?? "+91").trim() || "+91",phoneNumber: String(user?.contact?.phoneNo ?? user?.phoneNumber ?? "").trim(),discountCode: "",addressId: "",address1: "",address2: "",city: "",state: "",zipCode: "",country: "",isDefault: false,};

  return (
    <div className="bg-[#f8fafc] pb-16 pt-8 sm:pt-10 lg:pb-24">
      <section className="site-container">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#ef6b4a]">Checkout</p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-[#0f172a] sm:text-3xl">Shipping & Payment</h1>
            <p className="mt-2 text-sm text-[#5b6472]">Confirm your details and place the order.</p>
          </div>
          <Link to={ROUTES.PRODUCTS} className="inline-flex items-center gap-2 rounded-full border border-[#dde4ee] bg-white px-4 py-2 text-sm font-semibold text-[#0f172a] transition hover:border-[#0f172a]">Continue Shopping</Link>
        </div>

        <CheckoutFormSection initialValues={initialValues} items={items} subtotal={subtotal} isAuthenticated={isAuthenticated} userId={userId}/>
      </section>
    </div>
  );
};

export default CheckoutPage;
