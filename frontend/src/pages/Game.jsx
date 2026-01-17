import { useParams } from "react-router-dom";

function Game() {
  const { id } = useParams();

  return (
    <main>
      <h1>Chess Game</h1>
      <p>Start playing.{id}</p>
    </main>
  );
}

export default Game;
