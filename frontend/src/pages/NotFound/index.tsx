export default function NotFound() {
    console.error("Rendering NotFound: Route not found or root element failed.");
    
    return <>
        <section className="min-h-screen w-full flex flex-col justify-center items-center">
            <div>Opss, Not Found</div>
        </section>
    </>
}