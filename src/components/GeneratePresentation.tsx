import { ArrowCircleLeft, WarningCircle, X } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ProgressBar } from "~/components/ProgressBar";
import { api } from "~/utils/api";

import {
  presentationQuestions,
  type presentationKeys,
} from "~/utils/presentationSchema";

type FormSchema = {
  [key: string]: string;
};

interface GeneratePresentationProps {
  presentationType: (typeof presentationKeys)[number];
}
export const GeneratePresentation = ({
  presentationType,
}: GeneratePresentationProps) => {
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const formMutation = api.presentation.create.useMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormSchema>();

  const questions = presentationQuestions[presentationType].questions;
  const answersPlaceholder = presentationQuestions[presentationType].answers;

  const isFistQuestion = currentQuestion === 0;

  const isMiddleQuestion =
    !isFistQuestion &&
    currentQuestion <
      presentationQuestions[presentationType].questions.length - 1;

  const isLastQuestion =
    currentQuestion ===
    presentationQuestions[presentationType].questions.length - 1;

  const submitForm: SubmitHandler<FormSchema> = async (data) => {
    const answers = Object.values(data);
    let prompt = "";

    answers.forEach((answer, index) => {
      prompt += `${questions[index] || ""}\n`;
      prompt += `${answer}\n`;
    });

    let retryCount = 0;
    const maxRetries = 3;
    let success = false;

    while (retryCount < maxRetries && !success) {
      try {
        await formMutation.mutateAsync(
          {
            type: presentationType,
            description: prompt,
            isPublic: false,
          },
          {
            onSuccess: (id) => {
              success = true;
              void router.push(`/dashboard/logo/${id}`);
            },
          }
        );
      } catch (err) {
        retryCount++;
      }
    }

    if (!success) {
      setOpen(true);
    }
  };

  function handleNextQuestion() {
    setCurrentQuestion((prev) => prev + 1);
  }

  function handlePreviuosQuestion() {
    setCurrentQuestion((prev) => prev - 1);
  }

  function ErrorModal() {
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-gray-800 opacity-30" />
          <Dialog.Content className="fixed left-1/2 top-1/2 h-80 w-64 -translate-x-1/2 -translate-y-1/2 rounded bg-gray-800 px-6	py-8 shadow-xl ">
            <div className="flex flex-col items-center justify-center">
              <p className="text-center text-2xl font-bold text-white">
                Oh, no :(
              </p>
              <p className="my-3 text-center text-sm font-light text-white">
                An error has occurred with your presentation. Please provide
                more detailed answers.
              </p>
              <Image
                src="/sad-face.svg"
                width={96}
                height={120}
                alt=""
                className="mt-4"
              />
            </div>

            <Dialog.Close asChild>
              <button className="absolute right-4 top-4">
                <X size={20} className="text-white" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  function PopOver({ text }: { text: string }) {
    return (
      <Popover.Root>
        <Popover.Trigger asChild>
          <button>
            <WarningCircle
              size={22}
              className="shrink-0 cursor-pointer text-fuchsia-300 hover:text-fuchsia-400"
            />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="mx-2 w-64 bg-white px-6 py-4 text-sm transition"
            sideOffset={10}
          >
            {`Example: ${text}`}
            <Popover.Arrow className="fill-white" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }

  return (
    <main className="mb-10 flex flex-col items-center">
      <ErrorModal />
      <div className="mx-6 max-w-lg">
        <p className="mb-6 text-center text-3xl font-semibold text-white">
          Let&apos;s create your {presentationQuestions[presentationType].title}{" "}
          {presentationType === "company_overview" ? "" : "Presentation"}
        </p>

        <ProgressBar current={currentQuestion + 1} total={questions.length} />

        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-col items-center"
        >
          {questions.map((question, index) => {
            const isCurrentQuestion = currentQuestion === index;
            return (
              isCurrentQuestion && (
                <div
                  key={question}
                  className="flex w-full flex-col items-center"
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <label className="mb-6 mt-4 block w-full font-light text-white">
                      {question}
                    </label>
                    <PopOver text={answersPlaceholder[index] || ""} />
                  </div>
                  <textarea
                    className="block h-52 w-full rounded-2xl border border-sky-200 bg-gray-600 p-3 text-sm text-white placeholder-gray-300"
                    {...register(`answer-${index}`)}
                    placeholder={`Please type your response here, for example: "${
                      answersPlaceholder[index] || ""
                    }"`}
                  />

                  {!isLastQuestion && (isFistQuestion || isMiddleQuestion) && (
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className=" mt-6 rounded-lg bg-fuchsia-600 px-10 py-3 font-semibold text-white transition hover:bg-fuchsia-600"
                    >
                      Next Question
                    </button>
                  )}

                  {isLastQuestion && (
                    <>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-6 rounded-lg bg-fuchsia-600 px-10 py-3 font-semibold text-white transition hover:bg-fuchsia-600 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:opacity-80 disabled:hover:bg-gray-500"
                      >
                        {!isSubmitting && "Create Presentation"}
                        {isSubmitting && "Creating..."}
                      </button>
                    </>
                  )}

                  <div className="mt-4 flex justify-center gap-8">
                    {!isFistQuestion && (
                      <button
                        className="flex items-center justify-center gap-1 text-sky-200 transition hover:text-sky-100"
                        onClick={handlePreviuosQuestion}
                        disabled={isSubmitting}
                      >
                        <ArrowCircleLeft size={20} />
                        Back
                      </button>
                    )}
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center gap-1 text-sky-200 transition hover:text-sky-100 "
                    >
                      <X size={20} />
                      Cancel
                    </Link>
                  </div>
                </div>
              )
            );
          })}
        </form>
      </div>
    </main>
  );
};
