import { ReactElement } from "react";


type ButtonVariant = "primary" | "secondary";

export interface ButtonProps {
    variant: ButtonVariant;
    size: "sm" | "md" | "lg";
    text: string;
    startIcon?:ReactElement;
    endIcon?:ReactElement;
    onClick?:()=>void;
    loading?:boolean;
}

const variantStyles = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-200 text-gray-900",
};

const defaultStyles = {
    rounded: "rounded-md flex items-center"
};

const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
}


export const Button = ({variant, text, startIcon, endIcon,size, onClick,loading}: ButtonProps) => {
    return <button onClick={onClick} className={`${variantStyles[variant]} ${defaultStyles.rounded} ${sizeStyles[size]} mt-4 ${loading? "opacity-45" :""}`} disabled = {loading}>
        {startIcon ? <div className="pr-2">{startIcon}</div> : null}
        {text}
        {endIcon} 
        </button>
}


