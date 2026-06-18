/**
 * Authentication Service
 * Handles API integration for the admin authentication flow.
 */

export interface User {
    id: number;
    email: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    user?: User;
    csrf_token?: string;
    error?: string;
    code?: string;
    field?: string;
    retry_after?: number;
}

export interface SessionResponse {
    success: boolean;
    authenticated: boolean;
    user?: User;
}

class AuthService {
    private csrfToken: string | null = null;
    private apiBase = "https://savannahdrinks.co.uk/api";

    /**
     * Fetches and stores a new CSRF token from the server
     */
    async fetchCsrfToken(): Promise<string> {
        try {
            const response = await fetch(`${this.apiBase}/csrf-token.php`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch CSRF token");
            }

            const data: AuthResponse = await response.json();

            if (data.success && data.csrf_token) {
                this.csrfToken = data.csrf_token;
                return data.csrf_token;
            }

            throw new Error("CSRF token not returned by server");

        } catch (error) {
            console.error("CSRF Token Fetch Error:", error);
            throw error;
        }
    }

    /**
     * Helper to perform authenticated/CSRF-protected fetch requests
     */
    public async secureFetch(
        url: string,
        options: RequestInit = {}
    ): Promise<Response> {

        const headers = new Headers(options.headers || {});

        if (!headers.has("Content-Type") && options.body) {
            headers.set("Content-Type", "application/json");
        }

        headers.set("Accept", "application/json");

        const method = (options.method || "GET").toUpperCase();

        if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {

            if (!this.csrfToken) {
                await this.fetchCsrfToken();
            }

            if (this.csrfToken) {
                headers.set("X-CSRF-Token", this.csrfToken);
            }
        }

        const secureOptions: RequestInit = {
            ...options,
            headers,
            credentials: "include",
        };

        try {
            return await fetch(url, secureOptions);
        } catch (error) {
            console.error("Network Fetch Error:", error);
            throw new Error("SERVER_UNAVAILABLE");
        }
    }

    /**
     * Authenticate admin user
     */
    async login(
        email: string,
        password: string,
        rememberMe: boolean
    ): Promise<AuthResponse> {

        try {

            // Get token tied to current session
            await this.fetchCsrfToken();

            const response = await this.secureFetch(
                `${this.apiBase}/login.php`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        password,
                        remember_me: rememberMe
                    }),
                }
            );

            const data: AuthResponse = await response.json();

            // Refresh token after successful login
            if (response.ok && data.success) {
                try {
                    await this.fetchCsrfToken();
                } catch (e) {
                    console.warn(
                        "Failed to refresh CSRF token after login",
                        e
                    );
                }
            }

            return data;

        } catch (error: any) {

            if (error.message === "SERVER_UNAVAILABLE") {
                return {
                    success: false,
                    error:
                        "The authentication server is currently unavailable. Please check your connection and try again.",
                    code: "SERVER_UNAVAILABLE",
                };
            }

            return {
                success: false,
                error:
                    "An unexpected error occurred. Please try again.",
                code: "UNKNOWN_ERROR",
            };
        }
    }

    /**
     * Check if current session is authenticated
     */
    async checkSession(): Promise<SessionResponse> {

        try {

            const response = await this.secureFetch(
                `${this.apiBase}/check-session.php`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                return {
                    success: false,
                    authenticated: false
                };
            }

            return await response.json();

        } catch (error) {

            console.error("Check Session Error:", error);

            return {
                success: false,
                authenticated: false
            };
        }
    }

    /**
     * Log out current session
     */
    async logout(): Promise<AuthResponse> {

        try {

            const response = await this.secureFetch(
                `${this.apiBase}/logout.php`,
                {
                    method: "POST",
                }
            );

            this.csrfToken = null;

            if (!response.ok) {
                return {
                    success: false,
                    error: "Logout failed on server"
                };
            }

            return await response.json();

        } catch (error) {

            console.error("Logout Error:", error);

            this.csrfToken = null;

            return {
                success: true
            };
        }
    }
}

export const authService = new AuthService();
