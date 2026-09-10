const Login = () => {
    return (
        <>
            {/* <h1>Login Page</h1> */}
            <div className="flex justify-center items-center my-20">
                <div className="card bg-base-200 w-96 shadow-sm ">
                    {/* <figure>
                        <img
                        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                        alt="Shoes" />
                    </figure> */}
                    <div className="card-body">
                        <h2 className="card-title flex justify-center">
                            LOGIN @DevTinder
                        </h2>

                        <form className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                            <fieldset className="fieldset">
                                <label className="label">Email</label>
                                <input type="email" className="input validator" placeholder="Email" required />
                                <p className="validator-hint hidden">
                                    Required
                                </p>
                            </fieldset>

                            <label className="fieldset">
                                <span className="label">Password</span>
                                <input type="password" className="input validator" placeholder="Password" required />
                                <span className="validator-hint hidden">Required</span>
                            </label>

                            <button className="btn btn-neutral mt-4" type="submit">Login</button>
                            <button className="btn btn-ghost mt-1" type="reset">Reset</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Login;