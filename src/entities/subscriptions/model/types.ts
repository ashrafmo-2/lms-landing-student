export type SubscriptionStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "CANCELLED"
  | "IN_ACTIVE"
  | "PENDING"
  | string;

export type SubscriptionCategory = {
  categoryId: number;
  title: string;
  priceBeforeDiscount: number;
  priceAfterDiscount: number | null;
};

export type SubscriptionSubject = {
  subjectId: number;
  title: string;
} | null;

export type StudentSubscription = {
  subscriptionId: number;
  status: SubscriptionStatus;
  paid: number;
  startAt: string;
  endAt: string;
  createdAt: string;
  category: SubscriptionCategory;
  subject: SubscriptionSubject;
};

export type SubscriptionsPagination = {
  total: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
};

export type SubscriptionsResponse = {
  success: boolean;
  message: string;
  data: {
    subscriptions: StudentSubscription[];
    pagination: SubscriptionsPagination;
  };
};
