import soundsConfig from "../../../config/sounds.config.json";
import { useSettings } from "../../../state/settings/settings.context";

export default function SoundTab() {
	const { settings, setSettings } = useSettings();

	const playPreview = (id: string) => {
		if (!settings.sound.enabled) {
			return;
		}

		const src = new URL(`../../../assets/sounds/${id}.wav`, import.meta.url).href;
		const audio = new Audio(src);
		audio.volume = settings.sound.volume;
		void audio.play();
	};

	const toggleSound = () => {
		setSettings((prev) => ({
			...prev,
			sound: {
				...prev.sound,
				enabled: !prev.sound.enabled,
			},
		}));
	};

	const updateVolume = (value: number) => {
		setSettings((prev) => ({
			...prev,
			sound: {
				...prev.sound,
				volume: value,
			},
		}));
	};

	const selectSound = (id: string) => {
		setSettings((prev) => ({
			...prev,
			sound: {
				...prev.sound,
				selected: id,
			},
		}));
		playPreview(id);
	};

	return (
		<div className="tab-shell">
			<div className="tab-section">
				<h2>Sound</h2>
				<div className="sound-controls">
					<button
						type="button"
						className={settings.sound.enabled ? "toggle active" : "toggle"}
						onClick={toggleSound}
					>
						{settings.sound.enabled ? "Sound On" : "Sound Off"}
					</button>
					<div className="option-grid">
						{soundsConfig.sounds.map((sound) => (
							<button
								key={sound.id}
								type="button"
								className={
									settings.sound.selected === sound.id
										? "option-card selected"
										: "option-card"
								}
								onClick={() => selectSound(sound.id)}
							>
								<span className="option-title">{sound.label}</span>
								<span className="option-meta">Tap to preview</span>
							</button>
						))}
					</div>

					<label className="slider-row">
						<span>Volume</span>
						<input
							type="range"
							min="0"
							max="1"
							step="0.05"
							value={settings.sound.volume}
							onChange={(event) => updateVolume(Number(event.target.value))}
							disabled={!settings.sound.enabled}
						/>
						<span className="slider-value">{Math.round(settings.sound.volume * 100)}%</span>
					</label>
				</div>
			</div>
		</div>
	);
}
