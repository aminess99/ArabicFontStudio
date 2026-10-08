import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: false,
});

/**
 * Render article Markdown with raw HTML disabled. The page renders its own
 * title as the only H1, so the leading Markdown title is omitted and any
 * remaining H1 headings are demoted to H2.
 */
export function renderMarkdownToHtml(content: string): string {
  const withoutLeadingTitle = content.replace(
    /^\uFEFF?(?:[ \t]*\r?\n)*[ \t]*#\s+[^\r\n]+(?:\r?\n){1,2}/,
    "",
  );

  return markdown
    .render(withoutLeadingTitle)
    .replace(/<h1>/g, "<h2>")
    .replace(/<\/h1>/g, "</h2>");
}
