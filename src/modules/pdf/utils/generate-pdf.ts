import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import * as puppeteer from "puppeteer";
import { PDFOptions } from "puppeteer";
import { Logger } from "@nestjs/common";

function getPath(filename?: string) {
  const publicDir = path.join(__dirname, "..", "..", "..", "..", "public", "pdfs");

  filename = `${filename || uuidv4()}.pdf`;
  const filePath = path.join(publicDir, filename);

  const dirPath = path.dirname(filePath);

  return { filename, dirPath, filePath };
}

/**
 * Converts HTML content to a PDF file.
 * @param htmlContent The HTML string to convert.
 * @param filePath The path where the PDF will be saved.
 * @param pdfOptions Optional PDF generation options.
 */
export async function generatePdfFromHtml(
  htmlContent: string,
  filename?: string,
  pdfOptions: PDFOptions = {},
): Promise<string> {
  const logger = new Logger(generatePdfFromHtml.name);

  let browser: puppeteer.Browser | undefined;
  try {
    const { dirPath, filename: _filename, filePath } = getPath(filename);

    if (!fs.existsSync(dirPath)) {
      logger.log(`Directory '${dirPath}' does not exist. Creating it...`);
      fs.mkdirSync(dirPath, { recursive: true });
    }

    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const defaultPdfOptions: PDFOptions = {
      path: filePath,
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "10mm", right: "10mm" },
    };
    const finalPdfOptions = { ...defaultPdfOptions, ...pdfOptions };

    await page.pdf(finalPdfOptions);

    logger.log(`PDF generated successfully at ${filePath}`);

    return _filename;
  } catch (error) {
    logger.error("Error generating PDF:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Generates a PDF from a specific section of a web page and saves it.
 * @param url The URL of the page to visit.
 * @param selector The CSS selector of the element to convert to PDF.
 * @returns The filename of the generated PDF.
 */
export async function generatePdfFromSection(url: string, selector: string, filename?: string): Promise<string> {
  const { dirPath, filename: _filename, filePath } = getPath(filename);

  let browser: puppeteer.Browser | undefined;
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the URL and wait for the page to load
    await page.goto(url, { waitUntil: "networkidle0" });

    // // Find the element to be converted
    // const element = await page.$(selector);

    // if (!element) {
    //   throw new Error(`Element with selector "${selector}" not found on the page.`);
    // }

    // const boundingBox = await element.boundingBox();

    // if (!boundingBox) {
    //   throw new Error("Could not get bounding box for the selected element.");
    // }

    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
      width: 780,
    });

    console.log(`PDF of element "${selector}" saved to ${filePath}`);
    return _filename;
  } catch (error) {
    console.error("Error generating PDF from section:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
