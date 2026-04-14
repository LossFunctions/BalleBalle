import "server-only";

import {
  doDateRangesOverlap,
  formatDateInputValue,
  type DholResolvedCartItem,
} from "@/lib/dhol-checkout";
import { listDholOrders, type DholOrderRecord } from "@/lib/dhol-order-store";
import { listDholProducts } from "@/lib/dhol-product-store";

export type DholInventoryOverviewItem = {
  active: boolean;
  availableTodayQuantity: number;
  bookedTodayQuantity: number;
  checkoutCreatedQuantity: number;
  id: string;
  inventoryCount: number;
  title: string;
  unitAmount: number;
};

export type DholInventoryRecentOrder = {
  customerEmail: string;
  dateRange: string;
  id: string;
  items: Array<Pick<DholResolvedCartItem, "id" | "quantity" | "title">>;
  status: DholOrderRecord["status"];
  total: number;
};

export type DholInventoryDashboard = {
  items: DholInventoryOverviewItem[];
  recentOrders: DholInventoryRecentOrder[];
  referenceDate: string;
};

const overlapsReferenceDate = (
  referenceDate: string,
  pickupDate: string,
  returnDate: string,
) =>
  doDateRangesOverlap(referenceDate, referenceDate, pickupDate, returnDate);

export const getDholInventoryDashboard = async (
  referenceDate = formatDateInputValue(new Date()),
): Promise<DholInventoryDashboard> => {
  const [products, orders] = await Promise.all([
    listDholProducts(),
    listDholOrders(),
  ]);

  const items = products.map<DholInventoryOverviewItem>((product) => {
    let bookedTodayQuantity = 0;
    let checkoutCreatedQuantity = 0;

    for (const order of orders) {
      if (
        !overlapsReferenceDate(referenceDate, order.pickupDate, order.returnDate)
      ) {
        continue;
      }

      const matchingItem = order.items.find((item) => item.id === product.id);

      if (!matchingItem) {
        continue;
      }

      if (order.status === "paid") {
        bookedTodayQuantity += matchingItem.quantity;
      }

      if (
        order.status === "checkout_created" ||
        order.status === "checkout_pending"
      ) {
        checkoutCreatedQuantity += matchingItem.quantity;
      }
    }

    return {
      active: product.active,
      availableTodayQuantity: Math.max(
        0,
        product.inventoryCount - bookedTodayQuantity,
      ),
      bookedTodayQuantity,
      checkoutCreatedQuantity,
      id: product.id,
      inventoryCount: product.inventoryCount,
      title: product.title,
      unitAmount: product.unitAmount,
    };
  });

  return {
    items,
    recentOrders: orders.slice(0, 12).map((order) => ({
      customerEmail: order.customer.emailAddress,
      dateRange: `${order.pickupDate} to ${order.returnDate}`,
      id: order.id,
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        title: item.title,
      })),
      status: order.status,
      total: order.quote.total,
    })),
    referenceDate,
  };
};
