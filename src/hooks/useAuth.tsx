import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService, User, AuthResponse } from "../services/authService";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, rememberMe: boolean) => Promise<AuthResponse>;
    logout: () => Promise<AuthResponse>;
    checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const checkSession = async () => {
        setIsLoading(true);
        try {
            const response = await authService.checkSession();
            if (response.success && response.authenticated && response.user) {
                setUser(response.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Failed to check auth session:", error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    const login = async (email: string, password: string, rememberMe: boolean): Promise<AuthResponse> => {
        setIsLoading(true);
        try {
            const response = await authService.login(email, password, rememberMe);
            if (response.success && response.user) {
                setUser(response.user);
                setIsAuthenticated(true);
            }
            return response;
        } catch (error) {
            console.error("Login hook error:", error);
            return {
                success: false,
                error: "An unexpected error occurred during login.",
            };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<AuthResponse> => {
        setIsLoading(true);
        try {
            const response = await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
            return response;
        } catch (error) {
            console.error("Logout hook error:", error);
            setUser(null);
            setIsAuthenticated(false);
            return { success: true }; // Force client-side logout
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, checkSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
