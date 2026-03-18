import { bootstrap } from "./bootstrap.js";
import { LoginWorkflow } from "../modules/eco/workflows/LoginWorkflow.js";
import { OpenTemplateFromHomeWorkflow } from "../modules/eco/workflows/OpenTemplateFromHomeWorkflow.js";
import { EditFirstTitleWorkflow } from "../modules/eco/workflows/EditFirstTitleWorkflow.js";

export async function run(): Promise<void> {
  const client = await bootstrap();

  try {
    const loginWorkflow = new LoginWorkflow(client);
    await loginWorkflow.execute({
      username: process.env.ECO_USERNAME ?? "",
      password: process.env.ECO_PASSWORD ?? "",
    });

    const openTemplateWorkflow = new OpenTemplateFromHomeWorkflow(client);
    await openTemplateWorkflow.execute("STANDARD");

    const editFirstTitleWorkflow = new EditFirstTitleWorkflow(client);
    await editFirstTitleWorkflow.execute();
  } catch (error) {
    console.error("Application run failed:", error);
    process.exitCode = 1;
  } finally {
    // await client.close();
  }
}
