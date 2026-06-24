/**
 * Blog CMS Service
 * Handles fetching and updating blog posts and categories.
 */

import { authService } from "./authService";

export interface BlogCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

export interface BlogPost {
    id: number;
    slug: string;
    title: string;
    category_id: number;
    excerpt: string;
    body_content: string;
    featured_image_id: number | null;
    featured_image_url?: string | null;
    featured_image_alt?: string | null;
    file_path?: string | null; // Legacy/Admin backward compatibility
    alt_text?: string | null;   // Legacy/Admin backward compatibility
    author: string;
    publish_date: string;
    status: "published" | "draft" | "scheduled";
    seo_title: string;
    seo_description: string;
    category_name?: string;     // From joined categories table
}

export interface BlogPostsResponse {
    success: boolean;
    posts: BlogPost[];
    message?: string;
}

export interface BlogPostResponse {
    success: boolean;
    post: BlogPost;
    message?: string;
}

export interface BlogCategoriesResponse {
    success: boolean;
    categories: BlogCategory[];
    message?: string;
}

export interface GenericResponse {
    success: boolean;
    message: string;
    id?: number;
}

class BlogCmsService {
    private apiBase = "https://savannahdrinks.co.uk/api/blog";

    /**
     * Fetch all blog posts
     */
    async getPosts(): Promise<BlogPostsResponse> {
        try {
            const response = await fetch(`${this.apiBase}/get-blog-posts.php`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching blog posts:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Fetch a specific blog post by slug or ID
     */
    async getPost(slug: string): Promise<BlogPostResponse> {
        try {
            const response = await fetch(`${this.apiBase}/get-blog-post.php?slug=${slug}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching blog post ${slug}:`, error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Fetch all blog categories
     */
    async getCategories(): Promise<BlogCategoriesResponse> {
        try {
            const response = await fetch(`${this.apiBase}/get-blog-categories.php`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching blog categories:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Create a new blog post
     */
    async createPost(data: Partial<BlogPost>): Promise<BlogPostResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/create-blog-post.php`, {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error creating blog post:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Update an existing blog post
     */
    async updatePost(id: number, data: Partial<BlogPost>): Promise<BlogPostResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/update-blog-post.php`, {
                method: "POST",
                body: JSON.stringify({ ...data, id }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error updating blog post ${id}:`, error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Delete a blog post
     */
    async deletePost(id: number): Promise<GenericResponse> {
        try {
            const response = await authService.secureFetch(`${this.apiBase}/delete-blog-post.php`, {
                method: "POST",
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error deleting blog post ${id}:`, error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }
}

export const blogCmsService = new BlogCmsService();
