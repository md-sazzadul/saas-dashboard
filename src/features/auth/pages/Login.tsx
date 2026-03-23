const Login = () => {
  return (
    <div>
      <div>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
        />

        <button className="w-full bg-indigo-500 text-white py-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
