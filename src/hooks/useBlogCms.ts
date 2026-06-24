import { useState, useEffect, useCallback } from "react";
import { blogCmsService, BlogPost, BlogCategory } from "../services/blogCmsService";

export const useBlogCms = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await blogCmsService.getPosts();
            if (response.success) {
                setPosts(response.posts);
            } else {
                setError(response.message || "Failed to load blog posts.");
            }
        } catch (err: any) {
            console.error("Hook fetch posts error:", err);
            setError("The CMS server is currently offline or unavailable.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await blogCmsService.getCategories();
            if (response.success) {
                setCategories(response.categories);
            }
        } catch (err: any) {
            console.error("Hook fetch categories error:", err);
        }
    }, []);

    const refresh = useCallback(async () => {
        await Promise.all([fetchPosts(), fetchCategories()]);
    }, [fetchPosts, fetchCategories]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const createPost = async (data: Partial<BlogPost>) => {
        setSaving(true);
        try {
            const response = await blogCmsService.createPost(data);
            if (response.success) {
                await fetchPosts();
            }
            return response;
        } catch (err) {
            console.error("Error creating post:", err);
            throw err;
        } finally {
            setSaving(false);
        }
    };

    const updatePost = async (id: number, data: Partial<BlogPost>) => {
        setSaving(true);
        try {
            const response = await blogCmsService.updatePost(id, data);
            if (response.success) {
                // Optimistic update or just refetch
                setPosts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
            }
            return response;
        } catch (err) {
            console.error(`Error updating post ${id}:`, err);
            throw err;
        } finally {
            setSaving(false);
        }
    };

    const deletePost = async (id: number) => {
        setSaving(true);
        try {
            const response = await blogCmsService.deletePost(id);
            if (response.success) {
                setPosts(prev => prev.filter(p => p.id !== id));
            }
            return response;
        } catch (err) {
            console.error(`Error deleting post ${id}:`, err);
            throw err;
        } finally {
            setSaving(false);
        }
    };

    return {
        posts,
        categories,
        loading,
        error,
        saving,
        refresh,
        createPost,
        updatePost,
        deletePost
    };
};
