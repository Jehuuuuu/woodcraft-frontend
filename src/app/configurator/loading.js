import { SyncLoader } from "react-spinners"
export default function Loading(){
    return(
        <div className="flex justify-center items-center h-screen bg-[var(--background)]">
            <SyncLoader color="#8B4513" size={12} />
        </div>
    )
}