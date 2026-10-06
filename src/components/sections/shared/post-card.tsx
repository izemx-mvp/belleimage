import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { staggerItem } from "@/components/brand";
import { SmartImage } from "@/components/smart-image";
import type { Post } from "@/data/posts";

export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  return `${d} ${months[(m ?? 1) - 1]} ${y}`;
};

export function PostCard({ post }: { post: Post }) {
  return (
    <motion.article variants={staggerItem} className="group flex flex-col overflow-hidden rounded-3xl border bg-card transition hover:shadow-lift">
      <Link to="/conseils/$slug" params={{ slug: post.slug }} tabIndex={-1} aria-hidden className="overflow-hidden">
        <SmartImage name={post.image} alt={post.title} icon={BookOpen} aspect="16 / 9" className="transition duration-500 group-hover:scale-[1.04]" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold text-muted-foreground"><span className="text-primary">{post.category}</span> · {formatDate(post.date)} · {post.readMinutes} min</p>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-ink">
          <Link to="/conseils/$slug" params={{ slug: post.slug }} className="hover:text-primary">{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
      </div>
    </motion.article>
  );
}
