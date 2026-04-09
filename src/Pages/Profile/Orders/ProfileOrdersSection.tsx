import { CheckCircleFilled, ClockCircleOutlined, CloseCircleFilled, ShoppingOutlined, TruckOutlined } from "@ant-design/icons";
import { useMemo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../Constants";
import { Queries } from "../../../Api";
import { Spin, Empty } from "antd";
import { useAppSelector } from "../../../Store/Hooks";
import { getApiBaseUrl } from "../../../Utils";

type NormalizedOrderStatus = "delivered" | "processing" | "shipped" | "cancelled" | "pending";

const statusBadgeClass: Record<NormalizedOrderStatus, string> = {delivered: "border border-[#b7e7c8] bg-[#eafaf0] text-[#0f9d58]",processing: "border border-[#ffe1ad] bg-[#fff7e7] text-[#b26800]",shipped: "border border-[#d8e6ff] bg-[#eef4ff] text-[#2f5fc6]",cancelled: "border border-[#ffcfd2] bg-[#ffecee] text-[#c62828]",pending: "border border-[#e6dbff] bg-[#f5f1ff] text-[#6b46c1]",};

const statusIcon: Record<NormalizedOrderStatus, ReactNode> = {delivered: <CheckCircleFilled />,processing: <ClockCircleOutlined />,shipped: <TruckOutlined />,cancelled: <CloseCircleFilled />,pending: <ClockCircleOutlined />,};

const statusLabel: Record<NormalizedOrderStatus, string> = {delivered: "Delivered",processing: "Processing",shipped: "Shipped",cancelled: "Cancelled",pending: "Pending",};

const formatPrice = (amount: number) => `Rs ${amount.toLocaleString("en-IN")}`;

const toNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return 0;
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const fallbackProductImage = assetUrl("assets/1.jpg");

const isAbsoluteUrl = (value: string) => /^(https?:\/\/|data:image\/|blob:)/i.test(value);

const resolveImageUrl = (value: unknown) => {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "";
  if (isAbsoluteUrl(raw)) return raw;

  const normalized = raw.replace(/^\/+/, "");
  if (normalized.startsWith("assets/")) return assetUrl(normalized);

  const apiBase = getApiBaseUrl();
  if (raw.startsWith("/")) return apiBase ? `${apiBase}${raw}` : raw;
  if (apiBase) return `${apiBase}/${normalized}`;
  return `/${normalized}`;
};

const normalizeOrderStatus = (value: unknown): NormalizedOrderStatus => {
  const raw = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (raw === "delivered") return "delivered";
  if (raw === "processing") return "processing";
  if (raw === "shipped") return "shipped";
  if (raw === "cancelled" || raw === "canceled") return "cancelled";
  return "pending";
};

const formatLabel = (value: unknown, fallback: string) => {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return fallback;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const ProfileOrdersSection = () => {
  const { user } = useAppSelector((state) => state.auth);
  const userId =typeof user?._id === "string"? user._id  : typeof user?.id === "string"? user.id    : "";
  const orderQueryParams = userId ? { userId } : undefined;
  const { data, isLoading } = Queries.useGetAllOrders(orderQueryParams);
  const { data: productsData } = Queries.useGetAllProducts(undefined, true);
  const orders = data?.data?.order_data || [];

  const { imageById, imageByTitle } = useMemo(() => {
    const byId = new Map<string, string>();
    const byTitle = new Map<string, string>();
    const source = productsData?.data;
    const allProducts = Array.isArray(source)? source: ((source as any)?.product_data || (source as any)?.products || []);

    allProducts.forEach((product: any) => {
      const id = String(product?._id || product?.id || "").trim();
      const title = String(product?.title || product?.name || "").trim().toLowerCase();
      const image = resolveImageUrl(product?.thumbnail || product?.images?.[0] || product?.image);
      if (!image) return;
      if (id) byId.set(id, image);
      if (title) byTitle.set(title, image);
    });

    return { imageById: byId, imageByTitle: byTitle };
  }, [productsData]);

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((order: any) => normalizeOrderStatus(order.orderStatus) === "delivered").length;
  const processingOrders = orders.filter((order: any) => {
    const status = normalizeOrderStatus(order.orderStatus);
    return status === "processing" || status === "shipped" || status === "pending";}).length;
  const cancelledOrders = orders.filter((order: any) => normalizeOrderStatus(order.orderStatus) === "cancelled").length;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center"><Spin size="large" /></div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#dde6f2] bg-[#f8fbff] shadow-[0_24px_56px_rgba(15,23,42,0.08)] sm:rounded-[16px]">
      <div className="border-b border-[#dfe7f3] bg-gradient-to-r from-white to-[#f5f9ff] px-4 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#ef6b4a]">My Order</p>
            <h2 className="mt-2 text-lg font-semibold text-[#0f172a] sm:mt-2.5 sm:text-2xl lg:text-[2rem]">Order Summary</h2>
            <p className="mt-2 text-sm text-[#5b6472]">Track deliveries, review purchases, and check order status updates.</p>
          </div>
          <Link to={ROUTES.INFO.TRACKING} className="inline-flex items-center gap-2 rounded-full border border-[#dde4ee] bg-white px-4 py-2 text-sm font-semibold text-[#0f172a] transition hover:border-[#0f172a]">
            <ShoppingOutlined />
            Track Order
          </Link>
        </div>
      </div>

      <div className="grid gap-4 border-b border-[#e6ebf1] p-4 sm:grid-cols-2 lg:grid-cols-4 lg:p-6 xl:p-8">
        {[{ label: "Total Orders", value: totalOrders },{ label: "Delivered", value: deliveredOrders },{ label: "In Progress", value: processingOrders },{ label: "Cancelled", value: cancelledOrders },].map((summary) => (
          <div key={summary.label} className="rounded-[12px] border border-[#dde6f2] bg-gradient-to-b from-white to-[#f7fbff] p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">{summary.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#111827]">{summary.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 p-4 lg:p-6 xl:p-8">
        {orders.length === 0 ? (
          <Empty description="No orders found" />
        ) : (
          orders.map((order: any, orderIndex: number) => {
            const orderStatus = normalizeOrderStatus(order.orderStatus);
            const orderKey = String(order._id || order.orderId || `order-${orderIndex}`);
            return (
            <article key={orderKey} className="rounded-[12px] border border-[#dfe7f3] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#eef2f8] pb-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">Order ID</p>
                  <h3 className="mt-1 text-base font-semibold text-[#0f172a]">{order.orderId || order._id}</h3>
                  <p className="mt-1 text-sm text-[#5b6472]">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass[orderStatus]}`}>
                    {statusIcon[orderStatus]}
                    {statusLabel[orderStatus]}
                  </span>
                  <p className="text-sm font-semibold text-[#111827]">{formatPrice(order.total)}</p>
                </div>
              </div>

              <div className="grid gap-4 pt-4 md:grid-cols-[minmax(0,1fr)_240px]">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">Items</p>
                  <ul className="mt-2 space-y-2">
                    {Array.isArray(order.items) ? (
                      order.items.map((item: any, idx: number) => {
                        const name = item.productId?.title || item.productName || "Product";
                        const itemProductId = String(item.productId?._id || item.productId?.id || item.productId || "").trim();
                        const directImage = resolveImageUrl(item.image || item.thumbnail || item.productId?.thumbnail || item.productId?.images?.[0] || item.productId?.image);
                        const catalogImage =
                          (itemProductId ? imageById.get(itemProductId) : undefined) ||
                          imageByTitle.get(String(name).trim().toLowerCase()) ||
                          "";
                        const image = directImage || catalogImage || fallbackProductImage;
                        const quantity = Number(item.quantity) || 1;
                        const lineTotal = toNumber(item.total || item.subtotal || item.lineTotal || item.price) * (item.lineTotal || item.total ? 1 : quantity);
                        return (
                          <li key={`${orderKey}-${idx}`} className="flex items-center gap-3 rounded-[10px] border border-[#e6edf8] bg-[#f9fbff] px-3 py-2 text-sm text-[#374151]">
                            <div className="h-14 w-14 overflow-hidden rounded-[10px] border border-[#dbe7f7] bg-white">
                              <img src={image} alt={name} className="h-full w-full object-cover" onError={(event) => {   event.currentTarget.src = fallbackProductImage; }}/>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="m-0 truncate font-semibold text-[#111827]">{name}</p>
                              <p className="m-0 mt-1 text-xs text-[#5b6472]">
                                Qty: {quantity}{item.sizeId?.name ? ` | Size ${item.sizeId.name}` : ""}{item.colorId?.name ? ` | ${item.colorId.name}` : ""}
                              </p>
                            </div>
                            {lineTotal > 0 ? <p className="m-0 text-sm font-semibold text-[#111827]">{formatPrice(lineTotal)}</p> : null}
                          </li>
                        );
                      })
                    ) : null}
                  </ul>
                </div>

                <div className="rounded-[10px] border border-[#dde7f4] bg-gradient-to-b from-[#f8fbff] to-[#f2f7ff] p-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">Delivery</p>
                  <p className="mt-2 text-sm text-[#374151]">
                    {order.shippingAddress?.address1}, {order.shippingAddress?.city}, {order.shippingAddress?.state}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#111827]">Payment: {formatLabel(order.paymentStatus, "Pending")}</p>
                  {order.eta ? <p className="mt-1 text-xs text-[#2f5fc6]">{order.eta}</p> : null}
                </div>
              </div>
            </article>
          )})
        )}
      </div>
    </div>
  );
};

export default ProfileOrdersSection;
