export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card shadow-sm">
          <div className="card-body p-5">
            <h2 className="text-center mb-4">Admin Login</h2>
            {searchParams.error && <div className="alert alert-danger">{searchParams.error}</div>}
            
            <form action="/api/auth/login" method="POST">
              <input type="hidden" name="type" value="admin" />
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="email"
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-dark w-100 py-2">
                Login to Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
