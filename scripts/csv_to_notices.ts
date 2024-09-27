import { parse } from "jsr:@std/csv";
import { join } from "jsr:@std/path";
import { ensureDir } from "jsr:@std/fs";

/**
 * Interface representing the structure of notice data parsed from CSV.
 */
interface NoticeData {
  /** The name of the direct party involved in the notice. */
  DirectName: string;
  
  /** The name of the indirect party involved in the notice. */
  IndirectName: string;
  
  /** The number of pages in the document. */
  NumberOfPages: string;
  
  /** The unique identifier for the instrument associated with the notice. */
  InstrumentNumber: string;
  
  /** A description of the document type. */
  DocTypeDescription: string;
  
  /** Additional comments related to the notice. */
  Comments2: string;
  
  /** The date the document was recorded. */
  RecordDate: string;
  
  /** The parcel number associated with the property. */
  ParcelNumber: string;
  
  /** The legal description of the property. */
  DocLegalDescription: string;
  
  /** The consideration amount related to the notice. */
  Consideration: string;
}

/**
 * Generates notices from a CSV file and saves them as markdown files.
 * 
 * @param csvFilePath - The path to the CSV file containing notice data.
 */
async function generateNoticesFromCsv(csvFilePath: string) {
  const csvContent = await Deno.readTextFile(csvFilePath);
  const records = parse(csvContent, { skipFirstRow: true, columns: [
    "DirectName",
    "IndirectName",
    "NumberOfPages",
    "InstrumentNumber",
    "DocTypeDescription",
    "Comments2",
    "RecordDate",
    "ParcelNumber",
    "DocLegalDescription",
    "Consideration",
  ] }) as unknown as NoticeData[];

  for (const record of records) {
    const parcelDir = join("notices", record.ParcelNumber);
    await ensureDir(parcelDir);

    const recordDate = new Date(record.RecordDate);
    const formattedDate = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}-${String(recordDate.getDate()).padStart(2, '0')}`;
    const fileName = `${formattedDate}_${record.DocTypeDescription.replace(/\s+/g, '_')}.md`;
    const filePath = join(parcelDir, fileName);

    const noticeContent = `---
Direct Name: ${record.DirectName}
Indirect Name: ${record.IndirectName}
Number of Pages: ${record.NumberOfPages}
Instrument Number: ${record.InstrumentNumber}
Document Type: ${record.DocTypeDescription}
Comments: ${record.Comments2}
Record Date: ${record.RecordDate}
Parcel Number: ${record.ParcelNumber}
Legal Description: ${record.DocLegalDescription}
Consideration: ${record.Consideration}
---

## Notice Details

This notice was generated from CSV data for testing purposes.

### Document Type
${record.DocTypeDescription}

### Parties Involved
- Direct Name: ${record.DirectName}
- Indirect Name: ${record.IndirectName}

### Property Information
- Parcel Number: ${record.ParcelNumber}
- Legal Description: ${record.DocLegalDescription || "Not provided"}

### Recording Information
- Instrument Number: ${record.InstrumentNumber}
- Record Date: ${record.RecordDate}
- Number of Pages: ${record.NumberOfPages}

### Additional Information
- Comments: ${record.Comments2 || "None"}
- Consideration: ${record.Consideration}

---

This document is for testing and demonstration purposes only.
`;

    await Deno.writeTextFile(filePath, noticeContent);
  }

  console.log("Notices generated successfully!");
}

// Usage
const csvFilePath = "data/notices.csv";
generateNoticesFromCsv(csvFilePath);