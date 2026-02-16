export default function MarkdownContent({ html }: { html: string }) {
  return (
    <div
      className="markdown-content max-w-none text-neutral-600 [&_h1]:font-heading [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-medium [&_h1]:text-neutral-900 [&_h2]:font-heading [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-neutral-900 [&_h3]:font-heading [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-neutral-900 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-1.5 [&_a]:text-neutral-800 [&_a]:underline [&_a]:decoration-neutral-300 [&_a]:transition-colors [&_a]:duration-200 hover:[&_a]:text-neutral-600 [&_a]:focus-visible:outline [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-2 [&_a]:focus-visible:outline-neutral-400 [&_strong]:font-medium [&_strong]:text-neutral-800"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
