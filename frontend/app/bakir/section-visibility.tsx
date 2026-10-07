"use client";
import { Children, Fragment, cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import definitions from "../lib/section-config.json";
import { isSectionVisible, type SectionVisibility } from "../lib/section-visibility";
export type SectionScope = keyof typeof definitions;
type Controls = { visibility: SectionVisibility; onChange: (value: SectionVisibility) => void; disabled?: boolean };
export function VisibilitySwitch({ section, label, visibility, onChange, disabled = false }: Controls & { section: string; label: string }) {
  const shown = isSectionVisible(visibility, section);
  return <button type="button" role="switch" aria-checked={shown} aria-label={`${label} görünürlüğü`} title="İçerik silinmez. Üst bölüm gizliyse alt bölümleri de görünmez." className={`admin-visibility-switch${shown ? " is-visible" : ""}`} disabled={disabled} onClick={() => onChange({ ...visibility, [section]: !shown })}>{shown ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}<span>{shown ? "Görünür" : "Gizli"}</span></button>;
}
export function VisibilityField({ label, section, className, children, ...controls }: Controls & { label: string; section: string; className?: string; children: ReactNode }) {
  const id = useId();
  const attachId = (nodes: ReactNode): ReactNode => Children.map(nodes, child => {
    if (!isValidElement(child)) return child;
    if (child.type === Fragment) { const fragment = child as ReactElement<{ children?: ReactNode }>; return cloneElement(fragment, { children: attachId(fragment.props.children) }); }
    return ["input", "textarea", "select"].includes(String(child.type)) ? cloneElement(child as ReactElement<{ id?: string }>, { id }) : child;
  });
  return <div className={`admin-visibility-field ${className || ""}`}><div className="admin-field-heading"><label htmlFor={id}>{label}</label><VisibilitySwitch label={label} section={section} {...controls} /></div>{attachId(children)}</div>;
}
export function sectionForField(scope: SectionScope, field: string) { return definitions[scope].find(section => section.field === field); }
export function ExtraSectionControls({ scope, availableFields, ...controls }: Controls & { scope: SectionScope; availableFields?: string[] }) {
  return <>{definitions[scope].filter(section => !section.field || availableFields && !availableFields.includes(section.field)).map(section => <div key={section.key} className="admin-extra-section admin-field--wide"><span>{section.label}</span><VisibilitySwitch section={section.key} label={section.label} {...controls} /></div>)}</>;
}
