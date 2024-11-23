import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Home() {

    const { toast } = useToast();

    return <>
        <div>
            Welcome Home
        </div>
        <div>
            <Button onClick={() => {
                toast({
                    title: "Demo",
                    description: "Demo description",
                })
            }}></Button>
        </div>
    </>
}