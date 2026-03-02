import { useState, useEffect } from "react";
import "../../styles/user/friends.css";
import { apiRequest } from "../../services/api";

import SearchUsers from "./SearchUsers";
import OutgoingRequests from "./OutgoingRequests";
import IncomingRequests from "./IncomingRequests";
import FriendsList from "./FriendsList";

export default function Friends() {
  const [friendList, setFriendList] = useState([]);
  const [incomingFriendRequests, setIncomingFriendRequests] = useState([]);
  const [outgoingFriendRequests, setOutgoingFriendRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  async function fetchAllFriendsData() {
    setIsLoading(true);
    try {
      const [friendsData, incomingRequestsData, outgoingRequestsData] =
        await Promise.all([
          apiRequest("/friends", { method: "GET" }),
          apiRequest("/requests/incoming", { method: "GET" }),
          apiRequest("/requests/outgoing", { method: "GET" }),
        ]);

      setFriendList(friendsData || []);
      setIncomingFriendRequests(incomingRequestsData || []);
      setOutgoingFriendRequests(outgoingRequestsData || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAllFriendsData();
  }, []);

  return (
    <section className="friends" aria-labelledby="friends-title">
      <div className="friends-container">
        <h1 id="friends-title" className="sr-only">Friends Page</h1>

        {errorMessage && <p className="error" role="alert">{errorMessage}</p>}
        {isLoading && <p className="loading" role="status">Loading...</p>}

        <SearchUsers
          friendList={friendList}
          incomingRequests={incomingFriendRequests}
          outgoingRequests={outgoingFriendRequests}
          setOutgoingRequests={setOutgoingFriendRequests}
        />

        <OutgoingRequests
          outgoingRequests={outgoingFriendRequests}
          setOutgoingRequests={setOutgoingFriendRequests}
        />

        <IncomingRequests
          incomingRequests={incomingFriendRequests}
          setIncomingRequests={setIncomingFriendRequests}
          fetchAllFriendsData={fetchAllFriendsData}
        />

        <FriendsList
          friendList={friendList}
          setFriendList={setFriendList}
        />
      </div>
    </section>
  );
}
