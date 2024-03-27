import React from "react";
import { QuestionCard } from "@/components/cards/QuestionCard";
import { NoResult } from "@/components/shared/NoResult";
import { getQuestions } from "@/lib/actions/question.action";

export const QuestionsList = async () => {
  const result = await getQuestions({});

  return (
    <>
      {result?.questions?.length > 0 ? (
        result?.questions?.map((question) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
          />
        ))
      ) : (
        <NoResult
          title="There's no question to show"
          description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. Our query could be the next big thing others learn from. Get
        involved!💡"
          link="/ask-question"
          linkTitle="Ask a Question"
        />
      )}
    </>
  );
};
