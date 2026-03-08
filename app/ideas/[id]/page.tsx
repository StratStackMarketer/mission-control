'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Edit, Save } from 'lucide-react';

// --- TYPES ---
interface Idea {
  id: string;
  name: string;
  description: string;
  status: string;
  confidence: number;
  tags: string | null;
  content: string | null;
  createdAt: string;
}

// --- API FUNCTIONS ---
async function fetchIdea(id: string): Promise<Idea> {
  const res = await fetch(`/api/ideas/${id}`);
  if (!res.ok) throw new Error('Failed to fetch idea');
  return res.json();
}

async function updateIdeaContent(id: string, content: string): Promise<Idea> {
  const res = await fetch(`/api/ideas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Failed to update idea content');
  return res.json();
}


// --- MAIN PAGE COMPONENT ---
export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (id) {
      const loadIdea = async () => {
        setIsLoading(true);
        try {
          const data = await fetchIdea(id);
          setIdea(data);
          setContent(data.content || '');
        } catch (error) {
          console.error(error);
          // Handle not found error, maybe redirect
        } finally {
          setIsLoading(false);
        }
      };
      loadIdea();
    }
  }, [id]);

  const handleSave = async () => {
    if (!idea) return;
    try {
        await updateIdeaContent(idea.id, content);
        setIdea({ ...idea, content });
        setIsEditing(false);
    } catch (error) {
        console.error('Failed to save content', error);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading idea details...</div>;
  }

  if (!idea) {
    return <div className="p-8">Idea not found.</div>;
  }

  return (
    <div>
        {/* Header */}
        <div className="bg-white border-b border-[#EEEEEE] sticky top-0 z-10">
            <div className="h-14 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/ideas" className="text-gray-500 hover:text-gray-800">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-[#1A1A2E] leading-none">{idea.name}</h1>
                        <p className="text-xs text-gray-500">{idea.description}</p>
                    </div>
                </div>
                <div>
                    {isEditing ? (
                        <button className="btn btn-primary" onClick={handleSave}>
                            <Save size={16} className="mr-1" /> Save
                        </button>
                    ) : (
                        <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                            <Edit size={16} className="mr-1" /> Edit
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-6">
            <div className="grid grid-cols-4 gap-6">
                {/* Left Panel: Metadata */}
                <div className="col-span-1">
                    <div className="card">
                        <h3 className="font-semibold mb-4">Details</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <p className="font-medium">{idea.status}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Confidence</p>
                                <p className="font-medium">{idea.confidence}/10</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Tags</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {idea.tags && JSON.parse(idea.tags).map((tag: string) => (
                                        <span key={tag} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Business Plan Content */}
                <div className="col-span-3">
                    <div className="card">
                        {isEditing ? (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="input w-full h-[70vh] font-mono text-sm"
                                placeholder="Write your business plan here using Markdown..."
                            />
                        ) : (
                            <article className="prose prose-sm max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content || '*No business plan has been written yet. Click "Edit" to start.*'}
                                </ReactMarkdown>
                            </article>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
