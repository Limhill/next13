import React from "react";
import Link from "next/link";
import { RenderTag } from "@/components/shared/RenderTag";
import { Metric } from "@/components/shared/Metric";
import { formatAndDivideNumber, getTimeStamp } from "@/lib/utils";

interface Tag {
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  name: string;
  picture: string;
}

interface QuestionCardProps {
  _id: string;
  title: string;
  tags: Tag[];
  author: Author;
  upvotes: number;
  views: number;
  answers: object[];
  createdAt: Date;
}

export const QuestionCard = (props: QuestionCardProps) => {
  const { _id, title, tags, author, upvotes, views, answers, createdAt } =
    props;
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
          {getTimeStamp(createdAt)}
        </span>
        <Link href={`/question/${_id}`}>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {title}
          </h3>
        </Link>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag _id={tag._id} name={tag.name} key={tag._id} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl="/assets/icons/avatar.svg"
          alt="user"
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          textStyles="body-medium text-dark400_light700"
          href={`/profile/${author._id}`}
          isAuthor
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="upvotes"
          value={formatAndDivideNumber(upvotes)}
          title=" Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};
