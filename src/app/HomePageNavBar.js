import Image from "next/image";

export default function HomePageNavbar() {
  return (
    <nav className="items-center justify between pt-6 mx-auto">
      <div className="">
        <ul className="justify-center flex gap-6">
          <li><a href="/" className="text-white relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px]">Logo</a></li>
          <li><a href="/" className="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-blue-500 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">Home</a></li>
          <li><a href="/" className="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-blue-500 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">Showing Now</a></li>
          <li><a href="/" className="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-blue-500 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">Coming Soon</a></li>
          <li><a href="/" className="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-blue-500 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">Register Now</a></li>
          <li><a href="/" className="relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-blue-500 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">Login</a></li>
        </ul>
      </div>
    </nav>
  );
}
