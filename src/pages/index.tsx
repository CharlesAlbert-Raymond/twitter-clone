import Head from "next/head";
import type { RouterOutputs } from "@/utils/api";
import { api } from "@/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage } from "@/components/loading";
import React from "react";

dayjs.extend(relativeTime);

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Fetch asap
  api.posts.getAll.useQuery();

  if (!userLoaded) {
    return <div />;
  }

  return (
    <>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="Un clone de Twitter." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {isSignedIn && <CreatePostWizard />}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) {
    return <LoadingPage />;
  }

  if (!data) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.imageUrl}
        className="aspect-square self-center rounded-full"
        width={56}
        height={56}
        alt={`@${author.username}'s profile picture`}
      />
      <div className="flex flex-col">
        <div className=" flex text-slate-200">
          <span>{`@${author.username}`}&nbsp;</span>
          <span className="font-thin">{`· ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = React.useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.imageUrl}
        className="aspect-square rounded-full"
        width={56}
        height={56}
        alt="Profile Image"
      />
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      <button onClick={() => mutate({ content: input })}>Post</button>
    </div>
  );
};
