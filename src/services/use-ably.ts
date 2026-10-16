import * as Ably from "ably";
import { useCallback, useEffect, useRef } from "react";
import { useGetDriversUser } from "../http/generated/drivers/drivers";
import { createAblyToken } from "../http/generated/radio/radio";

export default function useAbly({
  events,
  handleMessageReceived,
}: {
  events?: string[];
  handleMessageReceived?: (message: Ably.InboundMessage) => void;
}) {
  const { data: user } = useGetDriversUser();
  const clientRef = useRef<Ably.Realtime | null>(null);

  // 1️⃣ Create client ONLY when user exists
  useEffect(() => {
    if (!user || clientRef.current || !user.companyGroup.id) return;

    clientRef.current = new Ably.Realtime({
      autoConnect: true,
      authCallback: async (_, callback) => {
        const tokenRequest = await createAblyToken({
          channel: `ambulance-fleet-${user.companyGroup.id}`,
        });
        callback(null, tokenRequest.tokenRequest as string);
      },
      disconnectedRetryTimeout: 4000,
      suspendedRetryTimeout: 10000,
    });

    return () => {
      clientRef.current?.close();
      clientRef.current = null;
    };
  }, [user?.id, user?.companyGroup.id]);

  useEffect(() => {
    if (!user || !clientRef.current || !events || !handleMessageReceived)
      return;

    const client = clientRef.current;
    const channelName = `ambulance-fleet-${user.companyGroup.id}`;
    const channel = client.channels.get(channelName);

    const subscribe = () => {
      channel.subscribe(events, handleMessageReceived);
    };

    if (client.connection.state === "connected") {
      subscribe();
    } else {
      client.connection.once("connected", subscribe);
    }

    return () => {
      channel.unsubscribe(events, handleMessageReceived);
    };
  }, [user?.id, user?.companyGroup.id, events, handleMessageReceived]);

  // 3️⃣ SAFE publish helper
  const publish = useCallback(
    async (event: string, payload: unknown) => {
      if (!clientRef.current || !user) {
        throw new Error("Ably not ready");
      }

      const channelName = `ambulance-fleet-${user.companyGroup.id}`;
      const channel = clientRef.current.channels.get(channelName);

      // Ensure connection
      if (clientRef.current.connection.state !== "connected") {
        await new Promise<void>((resolve) => {
          clientRef.current!.connection.once("connected", () => resolve());
        });
      }

      channel.publish(event, payload);
    },
    [user?.id, user?.companyGroup.id],
  );

  return {
    user,
    publish,
  };
}
