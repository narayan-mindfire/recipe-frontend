const Unauthenticated = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-3xl font-bold mb-2">Unauthorized Access</h1>
      <p className="text-muted">You must be logged in to view this page.</p>
    </div>
  );
};

export default Unauthenticated;
