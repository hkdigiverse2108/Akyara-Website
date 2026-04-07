import type { ProductReview, ReviewFormValues } from "../../../Types";

export const initialReviewEntries: ProductReview[] = [
  {
    id: "review-1",
    name: "Daniel Rajdesh",
    date: "30 Jul 2021",
    rating: 5,
    comment:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum.",
    avatarLabel: "DR",
    avatarBackground: "linear-gradient(135deg, #d8e6d4 0%, #8eb38a 100%)",
  },
  {
    id: "review-2",
    name: "Seema Gupta",
    date: "30 Aug 2021",
    rating: 5,
    comment:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum.",
    avatarLabel: "SG",
    avatarBackground: "linear-gradient(135deg, #f4d8dd 0%, #d7a0a9 100%)",
  },
  {
    id: "review-3",
    name: "Mark Jugermi",
    date: "10 Oct 2021",
    rating: 5,
    comment:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum.",
    avatarLabel: "MJ",
    avatarBackground: "linear-gradient(135deg, #d7e5f5 0%, #8fb4db 100%)",
  },
  {
    id: "review-4",
    name: "Meena Rajpoot",
    date: "17 Dec 2021",
    rating: 5,
    comment:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum.",
    avatarLabel: "MR",
    avatarBackground: "linear-gradient(135deg, #f7d9cb 0%, #dd9e80 100%)",
  },
];

export const initialReviewFormValues: ReviewFormValues = {
  rating: 4,
  fullName: "",
  email: "",
  description: "",
};