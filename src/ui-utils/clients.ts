import { CosmWasmClient as LaunchpadClient } from "@cosmjs/cosmwasm";
import { CosmWasmClient as StargateClient } from "@cosmjs/cosmwasm-stargate";

export { LaunchpadClient, StargateClient };

export function isStargateClient(client: LaunchpadClient | StargateClient | null): client is StargateClient {
  return client instanceof StargateClient;
}

export function isLaunchpadClient(
  client: LaunchpadClient | StargateClient | null,
): client is LaunchpadClient {
  return client instanceof LaunchpadClient;
}
