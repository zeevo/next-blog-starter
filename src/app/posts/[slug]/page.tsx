import { Metadata } from "next";
import Head from "next/head";
import { notFound } from "next/navigation";
import { type PostType } from "../../../interfaces/post";
import { getAllPosts, getPostBySlug } from "../../../lib/api";
import { CMS_NAME } from "../../../lib/constants";
import markdownToHtml from "../../../lib/markdownToHtml";
import Alert from "../../_components/alert";
import Container from "../../_components/container";
import Header from "../../_components/header";
import { PostBody } from "../../_components/post-body";
import { PostHeader } from "../../_components/post-header";

type Props = {
  post: PostType;
  morePosts: PostType[];
  preview?: boolean;
};

export default async function Post({ params }: Params) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }
  const content = await markdownToHtml(post.content || "");

  const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`;

  return (
    <main>
      <Alert preview={post.preview} />
      <Container>
        <Header />
        <article className="mb-32">
          <Head>
            <title>{title}</title>
            <meta property="og:image" content={post.ogImage.url} />
          </Head>
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  return {
    openGraph: {
      title: post.title,
      images: [post.ogImage.url],
    },
  };
}

export async function generateStaticParams({ params }: Params) {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
