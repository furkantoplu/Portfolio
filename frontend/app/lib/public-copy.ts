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
const retiredArchiveExamples=new Set([
  'Yeni içerikler yayınlandıkça bu alan otomatik olarak genişleyecek.',
  'This section grows as new articles are published.',
  'Dieser Bereich wächst mit jedem neuen Beitrag.',
]);
export function archiveIntroText(value:unknown):string {
  if(typeof value!=='string')return '';
  const text=value.trim();return retiredArchiveExamples.has(text)?'':text;
}
