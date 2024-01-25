import { notFound, useRouter } from "next/navigation";
import ErrorPage from "next/error";
import Container from "../../_components/container";
import { PostBody } from "../../_components/post-body";
import Header from "../../_components/header";
import { PostHeader } from "../../_components/post-header";
import { getPostBySlug, getAllPosts } from "../../../lib/api";
import { PostTitle } from "../../_components/post-title";
import Head from "next/head";
import { CMS_NAME } from "../../../lib/constants";
import markdownToHtml from "../../../lib/markdownToHtml";
import { type PostType } from "../../../interfaces/post";
import Layout from "../../layout";
import Alert from "../../_components/alert";
import { Metadata } from "next";

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
