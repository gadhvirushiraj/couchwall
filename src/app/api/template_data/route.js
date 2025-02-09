import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), "public", "template");
    if (!fs.existsSync(templatesDir)) {
      return NextResponse.json(
        { error: "Templates directory not found" },
        { status: 404 }
      );
    }

    const templateFolders = fs.readdirSync(templatesDir);
    const templatesData = templateFolders.map((templateFolder) => {
      const templatePath = path.join(templatesDir, templateFolder);
      const configFiles = fs
        .readdirSync(templatePath)
        .filter((file) => file.endsWith(".json"));

      const configs = configFiles.map((configFile) => {
        const configPath = path.join(templatePath, configFile);
        const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));
        return {
          id: path.parse(configFile).name,
          ...configData,
        };
      });

      return {
        template: templateFolder,
        configs: configs,
      };
    });

    return NextResponse.json(templatesData);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
