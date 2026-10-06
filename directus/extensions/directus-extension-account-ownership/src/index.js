function forbidden() {
  const error = new Error("Yalnızca kendi yönetici hesabınızı değiştirebilirsiniz.");
  error.name = "DirectusError"; error.code = "FORBIDDEN"; error.status = 403; error.extensions = {};
  return error;
}
export function assertOwnUser(keys, accountability) {
  // Internal auth bookkeeping has null accountability, unlike an API user request.
  if (accountability == null) return;
  const targets = Array.isArray(keys) ? keys : [keys];
  if (!accountability.user || !targets.length || targets.some(id => id !== accountability.user)) throw forbidden();
}
export default ({ filter }) => {
  filter("users.update", (payload, meta, context) => { assertOwnUser(meta.keys, context.accountability); return payload; });
  filter("users.delete", (keys, _meta, context) => { assertOwnUser(keys, context.accountability); return keys; });
};
