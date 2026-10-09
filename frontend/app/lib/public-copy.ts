const retiredProfessionalExamples=new Set([
  'Diploma, eğitim ve sertifika bilgileri müşteriden alınacak gerçek içerikle yayın öncesinde bu alana eklenecektir.',
  'Verified qualifications, training and certificates will be added before the website is launched.',
  'Geprüfte Angaben zu Ausbildung, Fortbildungen und Zertifikaten werden vor Veröffentlichung der Website ergänzt.',
]);
// Hide only known starter copy, never user-written qualification information.
export function professionalNoteText(value:unknown):string {
  if(typeof value!=='string')return '';
  const text=value.trim();return retiredProfessionalExamples.has(text)?'':text;
}
