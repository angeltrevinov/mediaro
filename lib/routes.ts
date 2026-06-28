export const routes = {
    home: "/",
    auth: {
        login: "/login",
        register: "/register",
    },
    dashboard: {
        library: "/library",
        search: "/search",
        settingsAccount: "/settings/account",
    },
} as const;

export const apiRoutes = {
    auth: {
        login: "/api/auth/login",
        register: "/api/auth/register",
        logout: "/api/auth/logout",
        account: "/api/auth/account",
        resetPassword: "/api/auth/reset-password",
    },
    movie: {
        search: "/api/movie/search",
        byId: (id: string) => `/api/movie/${id}`,
    },
    tracking: {
        root: "/api/tracking",
        byExternalId: (externalId: string) => `/api/tracking/${externalId}`,
    },
} as const;
