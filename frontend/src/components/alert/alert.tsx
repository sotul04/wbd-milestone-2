import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

export function Validation({ trigger, actionDesc, classTrigger = "", classAction = "", title = "Are you sure?", description = "This action cannot be undone.", action = () => { } }: { trigger: string, actionDesc: string, classTrigger?: string, classAction?: string, title?: string, description?: string, action?: () => void }) {
    return <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button className={`${classTrigger} rounded-full h-8`}>
                {trigger}
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full h-8">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => action()} className={`${classAction} rounded-full h-8`}>{actionDesc}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}
