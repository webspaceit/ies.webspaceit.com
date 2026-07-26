import { HTMLAttributes } from 'react';

function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`rounded-xl border bg-white text-card-foreground shadow ${className}`}
            {...props}
        />
    );
}

function CardHeader({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
    );
}

function CardTitle({ className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
            {...props}
        />
    );
}

function CardContent({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={`p-6 pt-0 ${className}`} {...props} />;
}

export { Card, CardHeader, CardTitle, CardContent };
