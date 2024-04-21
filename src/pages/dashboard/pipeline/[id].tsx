/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { z } from "zod";
import { DashboardHeader } from "~/components/DashboardHeader";
import { Loading } from "~/components/Loading";
import { api } from "~/utils/api";

import { Trash, UploadSimple } from "@phosphor-icons/react";
import axios from "axios";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

const Pipeline: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const parse = z.string().safeParse(id);
  const parsedId = parse.success ? parse.data : "";

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleStartUpload,
    accept: { "image/jpeg": [], "image/png": [] },
    multiple: false,
  });

  function handleStartUpload(acceptedFiles: File[]) {
    setFiles(acceptedFiles);
  }

  function handleRemoveImage(file: File) {
    const filteredFiles = files.filter((item) => item !== file);
    setFiles(filteredFiles);
  }

  function handleSkip() {
    void router.push(`/dashboard/management/${parsedId}`);
  }

  const {
    data: presentation,
    isSuccess,
    isLoading,
  } = api.presentation.getOneSimple.useQuery({
    id: parsedId,
  });

  const getSignedUrlMutation = api.assets.getSignedUrl.useMutation();
  const addPipelineMutation = api.assets.addPipeline.useMutation();

  async function handleSubmit() {
    const pipeline = files[0];
    if (pipeline) {
      setLoading(true);
      const { signedUrl, storageKey } = await getSignedUrlMutation.mutateAsync({
        contentType: pipeline.type,
        name: pipeline.name,
      });
      try {
        await axios.put(signedUrl, pipeline, {
          headers: { "Content-Type": pipeline.type },
        });

        await addPipelineMutation.mutateAsync({
          storageKey,
          presentationId: parsedId,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        void router.push(`/dashboard/management/${parsedId}`);
      }
    } else {
      void router.push(`/dashboard/management/${parsedId}`);
    }
  }

  if (presentation === null) {
    void router.push("/dashboard");
  }

  if (!!presentation?.pipeline) {
    void router.push(`/dashboard/management/${parsedId}`);
  }

  if (status === "loading") {
    return (
      <>
        <DashboardHeader />
        <Loading />
      </>
    );
  }
  if (status === "unauthenticated") {
    void router.push("/");
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Product Image</title>
      </Head>
      <DashboardHeader />
      <main className="flex justify-center px-6">
        {isLoading && <Loading />}
        {isSuccess && (
          <div className="mx-6 max-w-lg">
            <p className="mb-6 text-2xl font-semibold text-white">
              Do you want to add a product pipeline image?
            </p>

            <div
              {...getRootProps()}
              data-status={status}
              className="flex cursor-pointer flex-col rounded-md border border-neutral-400 bg-gray-700 p-10 text-sm font-thin text-white"
            >
              <input {...getInputProps()} />

              <div className="flex h-fit flex-1 items-center justify-center gap-2 self-center">
                <UploadSimple size={24} className=" text-white " />
                <span>
                  {isDragActive
                    ? "Drop the files here ..."
                    : "Drag and drop your .jpg or .png image here"}
                </span>
              </div>
            </div>
            {files.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {files.map((file, index) => (
                  <button
                    type="button"
                    key={index}
                    className="relative"
                    onClick={() => handleRemoveImage(file)}
                  >
                    <Trash
                      size={24}
                      weight="bold"
                      className="absolute right-2 top-2 text-gray-800"
                    />
                    <img
                      src={URL.createObjectURL(file)}
                      className="h-28"
                      alt={file.name}
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="mt-6 flex flex-col justify-center gap-4">
              <button
                onClick={handleSubmit}
                type="button"
                className="rounded-lg bg-fuchsia-600 px-10 py-3 font-semibold text-white transition hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:opacity-80 disabled:hover:bg-gray-500"
                disabled={loading}
              >
                {loading && "Adding image..."}
                {!loading && "Add image"}
              </button>
              <button
                onClick={handleSkip}
                type="button"
                className="rounded-lg bg-gray-400 px-10 py-3 font-semibold text-white transition hover:bg-gray-300 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Skip
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Pipeline;
