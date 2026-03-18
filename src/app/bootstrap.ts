import { EcoClient } from "../modules/eco/client/EcoClient.js";
import { ConsoleLogger } from "../core/logging/ConsoleLogger.js";

export async function bootstrap(): Promise<EcoClient> {
  const logger = new ConsoleLogger();

  const client = new EcoClient(
    {
      baseUrl: "https://eservice.eco.loc.gov/eService_enu/?SWECmd=Start",
      headless: false,
      slowMo: 100,
    },
    logger,
  );

  await client.start();
  return client;
}
