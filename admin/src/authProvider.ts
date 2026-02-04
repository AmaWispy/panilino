import { AuthProvider } from "@refinedev/core";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (response.status === 200) {
            localStorage.setItem("token", data.token);
            return {
                success: true,
                redirectTo: "/",
            };
        }

        return {
            success: false,
            error: {
                name: "Login Error",
                message: data.message || "Invalid email or password",
            },
        };
    },
    logout: async () => {
        const token = localStorage.getItem("token");
        await fetch(`${API_URL}/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        localStorage.removeItem("token");
        return {
            success: true,
            redirectTo: "/login",
        };
    },
    check: async () => {
        const token = localStorage.getItem("token");
        if (token) {
            return {
                authenticated: true,
            };
        }

        return {
            authenticated: false,
            redirectTo: "/login",
        };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const response = await fetch(`${API_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                return data;
            }
        }
        return null;
    },
    onError: async (error) => {
        if (error.status === 401 || error.status === 403) {
            localStorage.removeItem("token");
            return {
                logout: true,
                redirectTo: "/login",
            };
        }
        return {};
    },
};
