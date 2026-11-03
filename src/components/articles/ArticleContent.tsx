'use client';

interface ArticleContentProps {
  content: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractTocItems(html: string): TocItem[] {
  const headingRegex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
  const items: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if (text) {
      items.push({ id: slugify(text), text, level });
    }
  }
  return items;
}

function addHeadingIds(html: string, tocItems: TocItem[]): string {
  let result = html;
  tocItems.forEach((item) => {
    // Add id to each h2/h3 that matches — simple replacement
    const escaped = item.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(
      new RegExp(`(<h[23][^>]*)>(${escaped})<\/h[23]>`, 'i'),
      `$1 id="${item.id}">$2</h${item.level}>`
    );
  });
  return result;
}

export function ArticleContent({ content }: ArticleContentProps) {
  const isHTML = /<[a-z][\s\S]*>/i.test(content);

  if (isHTML) {
    const tocItems = extractTocItems(content);
    const showToc = tocItems.length >= 3;
    const contentWithIds = showToc ? addHeadingIds(content, tocItems) : content;

    return (
      <div>
        {showToc && (
          <nav className="mb-8 p-5 rounded-xl bg-[#111522] border border-[#272B3A]" aria-label="Table of Contents">
            <p className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] mb-3">Table of Contents</p>
            <ol className="space-y-1.5">
              {tocItems.map((item, idx) => (
                <li key={idx} style={{ paddingLeft: item.level === 3 ? '1rem' : '0' }}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-[#38BDF8] hover:text-[#F8FAFC] transition-colors"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div
          className="prose prose-invert max-w-none text-[#F8FAFC]/90 leading-relaxed text-base sm:text-lg
            prose-headings:text-[#F8FAFC] prose-headings:font-extrabold
            prose-h2:text-3xl prose-h2:pt-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-[#272B3A]
            prose-h3:text-2xl prose-h3:pt-4 prose-h3:pb-1
            prose-p:text-[#A1A1AA] prose-p:leading-relaxed prose-p:my-4
            prose-strong:text-[#F8FAFC]
            prose-ul:list-disc prose-ul:pl-6 prose-ul:text-[#A1A1AA]
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-[#A1A1AA]
            prose-li:leading-relaxed
            prose-a:text-[#38BDF8] prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-[#8B5CF6] prose-blockquote:bg-[#171C2B] prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:italic
            prose-code:text-[#38BDF8] prose-code:bg-[#111522] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-[#111522] prose-pre:border prose-pre:border-[#272B3A] prose-pre:rounded-xl
            prose-img:rounded-xl prose-img:border prose-img:border-[#272B3A]
            prose-hr:border-[#272B3A]"
          dangerouslySetInnerHTML={{ __html: contentWithIds }}
        />
      </div>
    );
  }

  // Fallback: plain text / markdown-style
  const paragraphs = content.trim().split('\n\n');
  return (
    <div className="prose prose-invert max-w-none text-[#F8FAFC]/90 leading-relaxed space-y-6 text-base sm:text-lg">
      {paragraphs.map((block, idx) => {
        const trimmed = block.trim();
        if (trimmed.startsWith('### ')) {
          return <h3 key={idx} className="text-xl sm:text-2xl font-bold text-[#F8FAFC] pt-4 pb-1 border-b border-[#272B3A]">{trimmed.replace('### ', '')}</h3>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] pt-6 pb-2 border-b border-[#272B3A]">{trimmed.replace('## ', '')}</h2>;
        }
        if (trimmed.startsWith('```')) {
          const code = trimmed.replace(/```[a-z]*\n?/g, '').replace(/```$/g, '');
          return <pre key={idx} className="bg-[#111522] border border-[#272B3A] rounded-xl p-4 overflow-x-auto text-xs sm:text-sm text-[#38BDF8] font-mono"><code>{code}</code></pre>;
        }
        if (trimmed.startsWith('- ')) {
          const listItems = trimmed.split('\n').map((li) => li.replace(/^[-*]\s+/, ''));
          return <ul key={idx} className="list-disc pl-6 space-y-2 text-[#A1A1AA]">{listItems.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)}</ul>;
        }
        return <p key={idx} className="text-[#A1A1AA] leading-relaxed">{trimmed}</p>;
      })}
    </div>
  );
}
