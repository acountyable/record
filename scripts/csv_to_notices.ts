import { parse } from "jsr:@std/csv";
import { join } from "jsr:@std/path";
import { ensureDir } from "jsr:@std/fs";

interface NoticeData {
  DirectName: string;
  IndirectName: string;
  NumberOfPages: string;
  InstrumentNumber: string;
  DocTypeDescription: string;
  Comments2: string;
  RecordDate: string;
  ParcelNumber: string;
  DocLegalDescription: string;
  Consideration: string;
}

async function generateNoticesFromCsv(csvFilePath: string) {
  const csvContent = await Deno.readTextFile(csvFilePath);
  const records = parse(csvContent, { skipFirstRow: true, columns: true }) as NoticeData[];

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