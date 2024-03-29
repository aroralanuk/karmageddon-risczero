import React from "react";
import axios, { Axios } from "axios";
import querystring from "querystring";

import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";

export default function Profile({ user }) {
  return user ? (
    <>
      <div className="profile">
        <h3>Welcome </h3>
        {user.data.map((item, index) => (
          <div key={index}>
            <p>sr: {item.sr}</p>
            <p>comment_karma: {item.comment_karma}</p>
            <p>link_karma: {item.link_karma}</p>
          </div>
        ))}
      </div>
    </>
  ) : (
    <p>Please login</p>
  );
}

const REDIRECT_URI = "http://localhost:3000/profile";
const RANDOM_STRING = "randomestringhere";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const getToken = async (body) => {
  const data = await axios.post(
    "https://www.reddit.com/api/v1/access_token",
    querystring.stringify(body),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
        "content-type": "application/x-www-form-urlencoded",
      },
    }
  );
  return data.data;
};

export const getServerSideProps = async ({ query, req, res }) => {
  const refresh_token = getCookie("refresh_token", { req, res });
  const access_token = getCookie("access_token", { req, res });

  if (refresh_token) {
    if (access_token) {
      const user = await getUserKarma(access_token);
      return { props: { user } };
    } else {
      const token = await getToken({
        refresh_token: refresh_token,
        grant_type: "refresh_token",
      });
      setCookie("refresh_token", token.refresh_token, {
        req,
        res,
        maxAge: 60 * 60,
      });
      setCookie("access_token", token.access_token, {
        req,
        res,
        maxAge: 60 * 60 * 24,
      });
      const user = await getUserKarma(token.access_token);
      return { props: { user } };
    }
  } else if (query.code && query.state === RANDOM_STRING) {
    try {
      const token = await getToken({
        code: query.code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      });
      setCookie("refresh_token", token.refresh_token, {
        req,
        res,
        maxAge: 60 * 60,
      });
      setCookie("access_token", token.access_token, {
        req,
        res,
        maxAge: 60 * 60 * 24,
      });
      const user = await getUserKarma(token.access_token);
      return { props: { user } };
    } catch (e) {
      console.log(e);
      return { props: { user: null } };
    }
  } else {
    return { props: { user: null } };
  }
};

const getUserKarma = async (access_token) => {
  const data = await axios.get("https://oauth.reddit.com/api/v1/me/karma", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      content_type: "application/json",
    },
  });

  return data.data;
};
