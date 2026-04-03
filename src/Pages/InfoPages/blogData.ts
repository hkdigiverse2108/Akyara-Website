import { ROUTES } from "../../Constants";

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export type BlogPost = {
  slug: string;
  image: string;
  date: string;
  title: string;
  excerpt: string;
  content: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "summer-vacation-sale-2021",
    image: assetUrl("assets/9.jpg"),
    date: "26 Jan 2021",
    title: "Let's start bring sale on this saummer vacation.",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis",
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    ],
  },
  {
    slug: "new-home-style-and-comfort",
    image: assetUrl("assets/7.jpg"),
    date: "17 July 2021",
    title: "Let's start bring sale on this saummer vacation.",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis",
    content: [
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
    ],
  },
  {
    slug: "beach-essentials-fashion-collection",
    image: assetUrl("assets/8.jpg"),
    date: "10 Aug 2021",
    title: "Let's start bring sale on this saummer vacation.",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis",
    content: [
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.",
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
      "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    ],
  },
];

export const getBlogDetailPath = (slug: string) => `${ROUTES.INFO.BLOG}/${slug}`;

export const getBlogPostBySlug = (slug?: string) => BLOG_POSTS.find((post) => post.slug === slug);

