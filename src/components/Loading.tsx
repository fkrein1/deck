import { ClipLoader } from "react-spinners";

export const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <ClipLoader size={60} color="gray" />
    </div>
  );
};
