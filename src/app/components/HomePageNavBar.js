import Image from "next/image";

export default function HomePageNavbar() {
  let defaultProfile = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
  return (
    <nav className="flex justify-center items-center z-50 fixed top-0 bg-gray-900 w-full h-[95px]">
      <div className="ml-auto mr-10 bg-white w-[50px] h-[50px] rounded-full ">
        <img className="object-cover rounded-full" alt="Profile" src={defaultProfile} />
      <div className="cursor-pointer inset-0 text-sm text-black flex justify-center items-center absolute bg-opacity-0 hover:bg-opacity-50 inset-0 w-[50px] h-[50px] ml-auto mr-10 mt-5 rounded-full" >
        <span className="opacity-0 hover:opacity-100">Edit</span>
      </div>
      </div>
    </nav>
  );
}
