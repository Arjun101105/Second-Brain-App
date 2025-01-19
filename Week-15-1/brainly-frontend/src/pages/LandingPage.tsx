import { Button } from "../components/Buttons"

export const LandingPage = () => {
  return (<div>
    <div className="flex justify-end gap-4 p-2">
        <Button variant="primary" size="md" text="Login" onClick={() => window.location.href = "/signin"}></Button>
        <Button variant="primary" size="md" text="Sign Up" onClick={() => window.location.href = "/signup"}></Button>
        </div>
    <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-center">Welcome to</h1>
        <div className="flex justify-center items-center">
            <img src="/public/brainly-icon.png" alt="logo" className="w-20 h-20" />
        <h1 className="text-6xl font-bold text-center">Second Brain</h1>
        </div>
        <h2 className="text-2xl font-bold text-center">Save Now, Think Later !!</h2>
        </div>
    </div>)}