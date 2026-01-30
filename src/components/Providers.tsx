"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    // useEffect ensures we only render the provider on the client
    // This prevents the "Text content does not match server-rendered HTML" error
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </ThemeProvider>
    );
}