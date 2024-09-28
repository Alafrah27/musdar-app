// import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white   w-full">
      {/* <Navbar /> */}
      <main className="max-w-8xl mx-auto lg:px-4 py-6">{children}</main>
    </div>
  );
}

export default Layout;
