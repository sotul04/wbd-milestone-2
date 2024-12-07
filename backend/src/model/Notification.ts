import { PushSubscription } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";


export type PushSubs = {
    user_id: bigint | null;
    endpoint: string;
    keys: InputJsonValue
}