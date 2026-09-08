'use client';
import parse, { domToReact, type HTMLReactParserOptions, type DOMNode } from 'html-react-parser';
import { Element } from 'html-react-parser';
import BlogLayout, { BlogCTA, BlogFAQ } from './BlogLayout';
import AIReadinessChecklist from '../components/AIReadinessChecklist';
import type { CmsPost } from '../lib/blog-cms';

/**
 * Render a post whose body comes from the CMS.
 *
 * The body is parsed into React elements rather than injected with
 * dangerouslySetInnerHTML. Two reasons, both load-bearing:
 *
 *   1. innerHTML would need a wrapper element to hang it off, and that extra block box
 *      changes how margins collapse against the FAQ and CTA that follow it. This page
 *      is held to zero differing pixels, so an extra div is not free.
 *   2. Parsing lets a `data-component` slot become the real interactive component.
 *      Stored markup of a widget is a dead screenshot of it; the checklist has to be
 *      the actual React component or it does nothing when clicked.
 */

/** Interactive components a post body may slot in by name. */
const COMPONENTS: Record<string, () => React.ReactElement> = {
  'ai-readiness-checklist': () => <AIReadinessChecklist />,
};

const options: HTMLReactParserOptions = {
  replace: (node) => {
    if (!(node instanceof Element)) return undefined;

    const componentName = node.attribs?.['data-component'];
    if (componentName) {
      const render = COMPONENTS[componentName];
      if (!render) {
        // Loud in development, harmless in production: a missing component should be
        // noticed while editing, not silently render an empty gap on a live post.
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(`CmsBlogPost: unknown data-component "${componentName}"`);
        }
        return <></>;
      }
      return render();
    }

    return undefined;
  },
};

export default function CmsBlogPost({ post }: { post: CmsPost }) {
  return (
    <BlogLayout
      title={post.heading}
      subtitle={post.subtitle || undefined}
      datePublished={post.datePublished}
      readTime={post.readTime}
      tags={post.tags}
      image={post.heroImage}
      canonicalPath={post.slug}
      category={post.category}
      faq={post.faq ?? undefined}
      contentClass="blog-content"
      cta={
        post.cta ? (
          <BlogCTA
            heading={post.cta.heading}
            body={post.cta.body}
            primaryLabel={post.cta.primaryLabel}
            primaryHref={post.cta.primaryHref}
            // BlogCTA always renders both buttons, so every stored CTA has a secondary
            // pair; the fallbacks are here to satisfy the types, not to paper over a gap.
            secondaryLabel={post.cta.secondaryLabel ?? ''}
            secondaryHref={post.cta.secondaryHref ?? ''}
          />
        ) : undefined
      }
    >
      {parse(post.html, options)}
      {post.faq && post.faq.length > 0 && <BlogFAQ items={post.faq} />}
    </BlogLayout>
  );
}
