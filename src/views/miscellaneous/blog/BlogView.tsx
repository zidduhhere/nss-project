import { useEffect, useState } from 'react';
import Navbar from '@/components/common/Navbar';
import { Footer } from '@/components/ui/Footer';
import { blogService, BlogPost } from '@/services/blogService';
import { Calendar, User, Tag, ArrowRight, Newspaper } from 'lucide-react';
import dayjs from 'dayjs';

export default function BlogView() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [postsResult, categoriesData] = await Promise.all([
                    blogService.getPublishedPosts({ pageSize: 100 }),
                    blogService.getCategories(),
                ]);
                setPosts(postsResult.items);
                setCategories(categoriesData);
            } catch (err: any) {
                setError(err.message || 'Failed to load blog posts');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredPosts = selectedCategory === 'all'
        ? posts
        : posts.filter(post => post.category === selectedCategory);

    return (
        <div className="min-h-screen bg-white font-isans">
            <Navbar />
            <main className="pt-32 max-w-6xl mx-auto px-6 pb-24">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-nss-50 border border-nss-200/50 text-nss-700 rounded-full text-sm font-semibold mb-4">
                        <Newspaper className="w-4 h-4" />
                        <span>NSS Blog</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
                        Updates & Stories
                    </h1>
                    <p className="text-secondary-600 leading-relaxed max-w-2xl text-lg">
                        Updates, highlights, and impact stories from NSS Kerala's community of volunteers.
                    </p>
                </div>

                {/* Category Filter */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-10">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedCategory === 'all'
                                    ? 'bg-nss-600 text-white shadow-md'
                                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                            }`}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedCategory === category
                                        ? 'bg-nss-600 text-white shadow-md'
                                        : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse rounded-2xl border border-secondary-100 overflow-hidden">
                                <div className="h-48 bg-secondary-100" />
                                <div className="p-6 space-y-3">
                                    <div className="h-4 bg-secondary-100 rounded w-1/4" />
                                    <div className="h-6 bg-secondary-100 rounded w-3/4" />
                                    <div className="h-4 bg-secondary-100 rounded w-full" />
                                    <div className="h-4 bg-secondary-100 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-16">
                        <p className="text-secondary-500 text-lg">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredPosts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-nss-50 flex items-center justify-center">
                            <Newspaper className="w-10 h-10 text-nss-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-secondary-800 mb-2">No posts yet</h3>
                        <p className="text-secondary-500 max-w-md mx-auto">
                            Updates, highlights, and impact stories will appear here. Check back soon!
                        </p>
                    </div>
                )}

                {/* Blog Grid */}
                {!loading && !error && filteredPosts.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <article
                                key={post.id}
                                className="group rounded-2xl border border-secondary-100 overflow-hidden bg-white hover:shadow-xl hover:border-nss-200/50 transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Cover Image */}
                                {post.cover_image_url ? (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={post.cover_image_url}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-48 bg-gradient-to-br from-nss-100 to-nss-50 flex items-center justify-center">
                                        <Newspaper className="w-12 h-12 text-nss-300" />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-6">
                                    {/* Category Badge */}
                                    {post.category && (
                                        <div className="flex items-center gap-1.5 mb-3">
                                            <Tag className="w-3.5 h-3.5 text-nss-500" />
                                            <span className="text-xs font-semibold text-nss-600 uppercase tracking-wide">
                                                {post.category}
                                            </span>
                                        </div>
                                    )}

                                    <h2 className="text-lg font-bold text-secondary-900 mb-2 line-clamp-2 group-hover:text-nss-700 transition-colors">
                                        {post.title}
                                    </h2>

                                    <p className="text-secondary-500 text-sm leading-relaxed line-clamp-3 mb-4">
                                        {post.excerpt}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                                        <div className="flex items-center gap-3 text-xs text-secondary-400">
                                            <span className="flex items-center gap-1">
                                                <User className="w-3.5 h-3.5" />
                                                {post.author_name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {dayjs(post.published_at || post.created_at).format('MMM D, YYYY')}
                                            </span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-nss-400 group-hover:text-nss-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
