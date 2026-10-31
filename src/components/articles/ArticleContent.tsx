interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  // Parse simple markdown headings, lists, code blocks and paragraphs safely
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

