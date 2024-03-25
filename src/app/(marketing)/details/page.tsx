import { getCurrentUser } from "@/lib/session";

interface pageProps {}

const page = async ({}: pageProps) => {
  const user = await getCurrentUser();
  console.log(user);
  return (
    <div className="container grid place-items-center w-full min-h-screen">
      <h1 className="text-8xl uppercase font-heading text-primary font-bold ">
        Med Data
      </h1>
    </div>
  );
};

export default page;
