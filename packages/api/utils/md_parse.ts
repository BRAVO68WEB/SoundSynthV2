import * as marked from "marked";

export const markdownToHtml = async (markdown: string) => {
  const html = await marked.parse(markdown);
  return html;
};