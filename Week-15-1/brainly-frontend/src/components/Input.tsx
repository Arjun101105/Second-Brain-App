interface InputProps{
    placeholder: string;
    reference?: any;
    type?: string;
}


export function Input({placeholder, reference, type}: InputProps) {
    return <div>
        <input ref={reference} type={type} placeholder={placeholder} className="w-full p-2 border-2 border-slate-100 rounded-md"/>
    </div>
}