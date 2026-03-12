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

  const fetchAllFriendsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [friendsRes, incomingRes, outgoingRes] =
        await Promise.all([
          apiRequest("/friends", {method: "GET"}),
          apiRequest("/requests/incoming", {method: "GET"}),
          apiRequest("/requests/outgoing", {method: "GET"}),
        ]);

      setFriendList(friendsRes?.data || []);
      setIncomingFriendRequests(incomingRes?.data || []);
      setOutgoingFriendRequests(outgoingRes?.data || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllFriendsData();
  }, [fetchAllFriendsData]);

  const summaryCards = [
    { label: "Friends", value: friendList.length, tone: "friends" },
    { label: "Incoming", value: incomingFriendRequests.length, tone: "incoming" },
    { label: "Outgoing", value: outgoingFriendRequests.length, tone: "outgoing" },
  ];

  return (
    <section className="friends">
      <div className="friends-container">
        <header className="friends-hero">
          <div className="friends-hero-copy">
            <span className="friends-kicker">Social Hub</span>
            <h1>Manage your player network.</h1>
            <p>
              Search players, track pending requests, and keep your active friends list ready for private matches.
            </p>
          </div>

          <div className="friends-summary-grid">
            {summaryCards.map((card) => (
              <article key={card.label} className={`friends-summary-card friends-summary-${card.tone}`}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </article>
            ))}
          </div>
        </header>

        {errorMessage && <p className="error">{errorMessage}</p>}
        {isLoading && <p className="loading">Syncing your social graph...</p>}

        <div className="friends-grid">
          <div className="friends-column friends-column-primary">
            <SearchUsers
              friendList={friendList}
              incomingRequests={incomingFriendRequests}
              outgoingRequests={outgoingFriendRequests}
              setOutgoingRequests={setOutgoingFriendRequests}
            />

            <FriendsList
              friendList={friendList}
              setFriendList={setFriendList}
            />
          </div>

          <div className="friends-column">
            <IncomingRequests
              incomingRequests={incomingFriendRequests}
              setIncomingRequests={setIncomingFriendRequests}
              fetchAllFriendsData={fetchAllFriendsData}
            />

            <OutgoingRequests
              outgoingRequests={outgoingFriendRequests}
              setOutgoingRequests={setOutgoingFriendRequests}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
