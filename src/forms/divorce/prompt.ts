// src/forms/divorce/prompt.ts

const promptTemplate = `Divorce Details:
- Spouse 1: {{spouse1Name}}
- Spouse 2: {{spouse2Name}}
- Has children: {{hasChildren}}
- Children information: {{childrenInfo}}
- Client name: {{clientName}}
- Wants child custody: {{wantsChildren}}
- Assets: {{assets}}
- Desired assets: {{desiredAssets}}
- Spouse 1 Work Information: {{spouse1WorkInfo}}
- Spouse 2 Work Information: {{spouse2WorkInfo}}

Task: Based on the provided data, create a divorce document that complies with the legal requirements of the Republic of Lithuania. Include all necessary details about the spouses, child custody, asset division, and other relevant legal provisions. Ensure that the document accurately reflects the information from the specified fields.`;

export default promptTemplate;