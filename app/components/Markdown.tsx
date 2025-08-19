import markdownit from "markdown-it";
import DOMPurify from "dompurify";

type Prop = {
  text: string;
};

const md = markdownit({ html: true });

export default function Markdown({ text }: Prop) {
  const htmlcomponent = md.render(text);
  // const sanitizeHTML = DOMPurify.sanitize(htmlcomponent);
  // return <div dangerouslySetInnerHTML={{ __html: sanitizeHTML }} />;
  return <div dangerouslySetInnerHTML={{ __html: htmlcomponent }} />;
}
