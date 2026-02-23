import { useState, useEffect, useCallback } from "react";
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

//   // mock data
// const [friendList, setFriendList] = useState([ 
//   { id: 1, username: "Alice", online: true }, 
//   { id: 2, username: "Bob", online: false },
//   { id: 3, username: "Charlie", online: true }, ]);
// const [incomingFriendRequests, setIncomingFriendRequests] = useState([ 
//   { id: 1, username: "Alice", online: true }, 
//   { id: 2, username: "Bob", online: false },
//   { id: 3, username: "Charlie", online: true }, ]);
// const [outgoingFriendRequests, setOutgoingFriendRequests] = useState([ 
//   { id: 1, username: "Alice", online: true }, 
//   { id: 2, username: "Bob", online: false },
//   { id: 3, username: "Charlie", online: true }, ]);

  const fetchAllFriendsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [friendsData, incomingRequestsData, outgoingRequestsData] =
        await Promise.all([
          apiRequest("/friends", {method: "GET"}),
          apiRequest("/requests/incoming", {method: "GET"}),
          apiRequest("/requests/outgoing", {method: "GET"}),
        ]);

      setFriendList(friendsData);
      setIncomingFriendRequests(incomingRequestsData);
      setOutgoingFriendRequests(outgoingRequestsData);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllFriendsData();
  }, [fetchAllFriendsData]);

  // useEffect(() => {
  //   socket.on("friendAccepted", (newFriend) => {
  //     setFriendList(prev => [...prev, newFriend]);
  //   });
  
  //   return () => {
  //     socket.off("friendAccepted");
  //   };
  // }, []);

  return (
    <section className="friends">
      <div className="friends-container">
        {errorMessage && <p className="error">{errorMessage}</p>}
        {isLoading && <p className="loading">Loading...</p>}

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
