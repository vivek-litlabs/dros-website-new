import { blogPosts } from './BlogsPage';
import { BlogPostCard } from './BlogShared';

interface RelatedArticlesProps {
  tags: string[];
  currentRoute: string;
}

export default function RelatedArticles({ tags, currentRoute }: RelatedArticlesProps) {
  const scored = blogPosts
    .filter(post => post.slug !== currentRoute)
    .map(post => {
      const matchCount = (post.tags ?? []).filter(t => tags.includes(t)).length;
      return { post, matchCount };
    })
    .filter(({ matchCount }) => matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 3);

  if (scored.length === 0) return null;

  return (
    <section className="border-t border-[#E6E3E3] bg-white py-16">
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-[60px]">
        <h2 className="mb-8 font-saans text-2xl font-light tracking-[-0.03em] text-black">More Posts</h2>
        <div className="grid grid-cols-1 gap-x-[30px] gap-y-[50px] sm:grid-cols-2 lg:grid-cols-3">
          {scored.map(({ post }) => (
            <BlogPostCard key={post.slug || post.externalUrl} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
