import { type ReactNode, Suspense } from "react";
import { Tweet, getTweet } from "react-tweet/api";
import {
  EmbeddedTweet,
  TweetNotFound,
  TweetSkeleton,
  type TweetProps,
} from "react-tweet";
import { Caption } from "./caption";
import "./tweet.css";

interface TweetArgs {
  id: string;
  caption: ReactNode;
}

async function getAndCacheTweet(id: string): Promise<Tweet | undefined> {
  try {
    const tweet = await getTweet(id);
    
    // Validate tweet data structure
    if (tweet && typeof tweet === 'object') {
      // Ensure user data exists
      if (!tweet.user) {
        console.warn(`Tweet ${id} is missing user data`);
        return undefined;
      }
      return tweet;
    }
    
    return undefined;
  } catch (error) {
    console.error(`Failed to fetch tweet ${id}:`, error);
    return undefined;
  }
}

const TweetContent = async ({ id, components }: TweetProps) => {
  if (!id) {
    return <TweetNotFound />;
  }

  try {
    const tweet = await getAndCacheTweet(id);

    if (!tweet) {
      return <TweetNotFound />;
    }

    return <EmbeddedTweet tweet={tweet} components={components} />;
  } catch (error) {
    console.error(`Error rendering tweet ${id}:`, error);
    return <TweetNotFound />;
  }
};

export const ReactTweet = (props: TweetProps) => (
  <Suspense fallback={<TweetSkeleton />}>
    {/* @ts-ignore: Async components are valid in the app directory */}
    <TweetContent {...props} />
  </Suspense>
);

export async function Tweet({ id, caption }: TweetArgs) {
  return (
    <div className="tweet my-6">
      <div className={`flex justify-center`}>
        <ReactTweet id={id} />
      </div>
      {caption && <Caption>{caption}</Caption>}
    </div>
  );
}
