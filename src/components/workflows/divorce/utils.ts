import { DivorceFormData } from './types';

export function generateDivorcePrompt(formData: DivorceFormData): string {
  const childrenInfo = formData.hasChildren && formData.children?.length > 0
    ? formData.children
        .map((child, index) => {
          const custodialParent = child.custodialParent === 'spouse1' 
            ? formData.spouse1Name 
            : formData.spouse2Name;
          
          return `Child ${index + 1}: Age ${child.age}, Custody: ${custodialParent}${
            child.custodyReason ? `, Reason: ${child.custodyReason}` : ''
          }`;
        })
        .join('\n')
    : 'No children';

  const assetsInfo = formData.assets?.length > 0
    ? formData.assets
        .map((asset, index) => {
          const desiredOwner = asset.desiredOwner === 'spouse1'
            ? formData.spouse1Name
            : formData.spouse2Name;
          
          return `Asset ${index + 1}: ${asset.name}, Desired Owner: ${desiredOwner}${
            asset.reason ? `, Reason: ${asset.reason}` : ''
          }`;
        })
        .join('\n')
    : 'No assets';

  return `Divorce Details:
    - Spouse 1: ${formData.spouse1Name}
    - Spouse 2: ${formData.spouse2Name}
    - Client: ${formData.clientName === 'spouse1' ? formData.spouse1Name : formData.spouse2Name}
    - Has children: ${formData.hasChildren}
    - Children information:
      ${childrenInfo}
    - Assets:
      ${assetsInfo}
    - Spouse 1 Work Information: ${formData.spouse1WorkInfo || 'Not provided'}
    - Spouse 2 Work Information: ${formData.spouse2WorkInfo || 'Not provided'}

    Task: Based on the provided data,
    create a divorce document
    that complies with the legal requirements of the Republic of Lithuania.
    Include all necessary details about the spouses,
    child custody, asset division, and other relevant legal provisions.
    Ensure that the document accurately reflects the information from the specified fields.`;
}