from __future__ import annotations

from pathlib import Path

from tictactoe_model import (
    save_model,
    train_model,
)

ROOT = Path(__file__).resolve().parent
MODELS_DIR = ROOT / "models"
FINAL_MODEL_PATH = MODELS_DIR / "final_model.pkl"


def main() -> None:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    print("Training RL model (Q-learning with minimax guidance)...")
    model = train_model(
        episodes=300_000,
        alpha=0.35,
        gamma=0.99,
        epsilon_start=1.0,
        epsilon_end=0.02,
        teacher_start=0.70,
        teacher_end=0.05,
        seed=7,
        log_every=50_000,
    )

    save_model(model, str(FINAL_MODEL_PATH))
    print("\nSaved final model to training/models/final_model.pkl")


if __name__ == "__main__":
    main()
