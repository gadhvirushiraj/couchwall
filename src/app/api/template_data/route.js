// app/api/template_data/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import config from "../../../../next.config.mjs";

export async function GET() {
  try {
    const templatesDir = path.join(
      process.cwd(),
      config.basePath,
      "public",
      "template"
    );

    if (!fs.existsSync(templatesDir)) {
      return NextResponse.json(
        { error: "Templates directory not found" },
        { status: 404 }
      );
    }

    const templateFolders = fs
      .readdirSync(templatesDir, {
        withFileTypes: true,
      })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const templatesData = [];

    for (const templateName of templateFolders) {
      const templateDirPath = path.join(templatesDir, templateName);
      const configFiles = fs
        .readdirSync(templateDirPath)
        .filter((file) => file.endsWith(".json"))
        .sort(); // Sort alphabetically

      const templateConfigs = [];

      for (const configFile of configFiles) {
        try {
          const filePath = path.join(templateDirPath, configFile);
          const fileContent = fs.readFileSync(filePath, "utf8");
          const configData = JSON.parse(fileContent);

          templateConfigs.push({
            id: path.parse(configFile).name, // Get filename without extension
            ...configData,
          });
        } catch (error) {
          console.error(`Error reading ${templateName}/${configFile}:`, error);
        }
      }

      if (templateConfigs.length > 0) {
        templatesData.push({
          template: templateName,
          configs: templateConfigs,
        });
      }
    }

    return NextResponse.json(templatesData);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
