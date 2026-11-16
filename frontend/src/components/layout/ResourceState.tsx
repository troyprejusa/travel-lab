export function ResourceState({
  loading,
  error,
}: {
  loading: boolean;
  error: string;
}) {
  return (
    <>
      {loading && <p role="status">Loading…</p>}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
