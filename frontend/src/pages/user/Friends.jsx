import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../../services/api";
import SearchUsers from "./SearchUsers";
import FriendsList from "./FriendsList";
import OutgoingRequests from "./OutgoingRequests";
import IncomingRequests from "./IncomingRequests";
import { cn } from "../../lib/cn";
import { friendsPageStyle, userContainer, userPageShell } from "./userUi";
import { alertError, alertInfo, frostedPanel, goldPill, slabHeading } from "../../lib/ui";

const summaryCardClass = "grid gap-1 rounded-[18px] border border-white/10 bg-white/[0.04] px-[1.1rem] py-4";

export default function Friends() {
  const [friendList, setFriendList] = useState([]);
  const [incomingFriendRequests, setIncomingFriendRequests] = useState([]);
  const [outgoingFriendRequests, setOutgoingFriendRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchAllFriendsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [friendsRes, incomingRes, outgoingRes] = await Promise.all([
        apiRequest("/friends", { method: "GET" }),
        apiRequest("/requests/incoming", { method: "GET" }),
        apiRequest("/requests/outgoing", { method: "GET" }),
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
    document.title = "ft_transcendence - Friends";
  }, []);

  useEffect(() => {
    fetchAllFriendsData();
  }, [fetchAllFriendsData]);

  const summaryCards = [
    { label: "Friends", value: friendList.length, valueClass: "text-sky-300" },
    { label: "Incoming", value: incomingFriendRequests.length, valueClass: "text-green-400" },
    { label: "Outgoing", value: outgoingFriendRequests.length, valueClass: "text-amber-300" },
  ];

  return (
    <section className={userPageShell} style={friendsPageStyle}>
      <div className={userContainer}>
        <header className="grid items-stretch gap-[clamp(1rem,2.4vw,1.5rem)] min-[981px]:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div className={`${frostedPanel} grid content-center gap-3 p-[clamp(1.35rem,3vw,2.2rem)]`}>
            <span className={goldPill}>Social Hub</span>
            <h1 className={cn(slabHeading, "m-0 text-[clamp(2rem,4vw,3.5rem)] leading-[1.04] text-slate-50")}>
              Manage your player network.
            </h1>
            <p className="m-0 max-w-[56ch] leading-[1.7] text-slate-400">
              Search players, track pending requests, and keep your active friends list ready for private matches.
            </p>
          </div>

          <div className={`${frostedPanel} grid gap-[0.85rem] p-[clamp(1rem,2.4vw,1.4rem)]`}>
            {summaryCards.map((card) => (
              <article key={card.label} className={summaryCardClass}>
                <span className="text-[0.82rem] uppercase tracking-[0.05em] text-slate-400">{card.label}</span>
                <strong className={`text-[clamp(1.5rem,3vw,2rem)] ${card.valueClass}`}>{card.value}</strong>
              </article>
            ))}
          </div>
        </header>

        {errorMessage ? <p className={alertError}>{errorMessage}</p> : null}
        {isLoading ? <p className={alertInfo}>Syncing your social graph...</p> : null}

        <div className="grid gap-[clamp(1rem,2.4vw,1.5rem)] min-[981px]:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
          <div className="grid content-start gap-[clamp(1rem,2vw,1.25rem)]">
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

          <div className="grid content-start gap-[clamp(1rem,2vw,1.25rem)]">
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
