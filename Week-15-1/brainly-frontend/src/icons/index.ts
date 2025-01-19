export interface IconProps {
    size: "sm" | "md" | "lg";
    type?: "youtube" | "twitter" | "project";
}

export const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
} 