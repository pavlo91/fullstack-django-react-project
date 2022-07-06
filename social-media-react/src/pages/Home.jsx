import React from "react";
import Layout from "../components/Layout";
import {
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { RANDOM_AVATAR } from "../utils";
import useSWR from "swr";
import { fetcher } from "../helpers/axios";
import { getUser } from "../hooks/user.actions";
import { Post } from "../components/posts";
import CreatePost from "../components/posts/CreatePost";
import Profile from "../components/Profile"


function Home() {
  const posts = useSWR("/post/", fetcher, {
    refreshInterval: 20000,
  });
  const profiles = useSWR('/user/?limit=5', fetcher)

  const user = getUser();

  if (!user) {
    return <div>Loading!</div>;
  }

  return (
    <Layout>
      <Row className="justify-content-evenly">
        <Col sm={7}>
          <Row className="border rounded  align-items-center">
            <Col className="flex-shrink-1">
              <Image
                src={RANDOM_AVATAR}
                roundedCircle
                width={65}
                height={65}
                className="my-2"
              />
            </Col>
            <Col sm={9} className="flex-grow-1">
              <CreatePost />
            </Col>
          </Row>
          <hr />
          <Row className="my-2">
            {posts.data?.results.map(post => (
              <Post key={post.id} post={post} refresh={posts.mutate} />
            ))}
          </Row>
        </Col>
        <Col sm={3} className="border rounded py-4">
          <h4 className="font-weight-bold text-center">Suggested people</h4>
          <div className="d-flex flex-column">
            {profiles.data &&
              profiles.data.results.map((profile) => (
                <Profile key={profile.id} user={profile} />
              ))}
          </div>
        </Col>
      </Row>
    </Layout>
  );
}

export default Home;
