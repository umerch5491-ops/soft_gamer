'use client';

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  // Detect if content is HTML (from rich text editor) or plain markdown
  const isHTML = /<[a-z][\s\S]*>/i.test(content);

  if (isHTML) {
    // Render raw HTML from the rich text editor directly
    return (
      <div
        className="prose prose-invert max-w-none text-[#F8FAFC]/90 leading-relaxed text-base sm:text-lg
          prose-headings:text-[#F8FAFC] prose-headings:font-extrabold
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
          prose-h2:pt-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-[#272B3A]
          prose-h3:pt-4 prose-h3:pb-1 prose-h3:border-b prose-h3:border-[#272B3A]
          prose-p:text-[#A1A1AA] prose-p:leading-relaxed prose-p:my-4
          prose-strong:text-[#F8FAFC] prose-em:text-[#A1A1AA]
          prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:text-[#A1A1AA]
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2 prose-ol:text-[#A1A1AA]
          prose-li:leading-relaxed
          prose-a:text-[#38BDF8] prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-4 prose-blockquote:border-[#8B5CF6] prose-blockquote:bg-[#171C2B] prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:text-[#A1A1AA] prose-blockquote:italic
          prose-code:text-[#38BDF8] prose-code:bg-[#111522] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-pre:bg-[#111522] prose-pre:border prose-pre:border-[#272B3A] prose-pre:rounded-xl prose-pre:overflow-x-auto
          prose-img:rounded-xl prose-img:border prose-img:border-[#272B3A]
          prose-hr:border-[#272B3A]"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Fallback: parse simple markdown-style plain text
  const paragraphs = content.trim().split('\n\n');

  return (
    <div className="prose prose-invert max-w-none text-[#F8FAFC]/90 leading-relaxed space-y-6 text-base sm:text-lg">
      {paragraphs.map((block, idx) => {
        const trimmed = block.trim();

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-xl sm:text-2xl font-bold text-[#F8FAFC] pt-4 pb-1 border-b border-[#272B3A]">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] pt-6 pb-2 border-b border-[#272B3A]">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        if (trimmed.startsWith('```')) {
          const code = trimmed.replace(/```[a-z]*\n?/g, '').replace(/```$/g, '');
          return (
            <pre key={idx} className="bg-[#111522] border border-[#272B3A] rounded-xl p-4 overflow-x-auto text-xs sm:text-sm text-[#38BDF8] font-mono">
              <code>{code}</code>
            </pre>
          );
        }

        if (trimmed.startsWith('- ')) {
          const listItems = trimmed.split('\n').map((li) => li.replace(/^[-\*]\s+/, ''));
          return (
            <ul key={idx} className="list-disc pl-6 space-y-2 text-[#A1A1AA]">
              {listItems.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        if (trimmed.startsWith('*Editorial Note:')) {
          return (
            <div key={idx} className="p-4 rounded-xl bg-[#171C2B] border-l-4 border-[#8B5CF6] text-sm text-[#A1A1AA] italic">
              {trimmed.replace(/\*/g, '')}
            </div>
          );
        }

        return (
          <p key={idx} className="text-[#A1A1AA] leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
