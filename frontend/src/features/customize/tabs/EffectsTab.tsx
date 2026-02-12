import effectsConfig from "../../../config/effects.config.json";
import { useSettings } from "../../../state/settings/settings.context";

export default function EffectsTab() {
	const { settings, setSettings } = useSettings();

	const toggleEffects = () => {
		setSettings((prev) => ({
			...prev,
			effects: {
				...prev.effects,
				enabled: !prev.effects.enabled,
			},
		}));
	};

	const toggleEffect = (id: string) => {
		setSettings((prev) => {
			const active = prev.effects.active.includes(id)
				? prev.effects.active.filter((effectId) => effectId !== id)
				: [...prev.effects.active, id];

			return {
				...prev,
				effects: {
					...prev.effects,
					active,
				},
			};
		});
	};

	return (
		<div className="tab-shell">
			<div className="tab-section">
				<h2>Visual Effects</h2>
				<button
					type="button"
					className={settings.effects.enabled ? "toggle active" : "toggle"}
					onClick={toggleEffects}
				>
					{settings.effects.enabled ? "Effects On" : "Effects Off"}
				</button>
				<div className="option-grid">
					{effectsConfig.effects.map((effect) => (
						<label key={effect.id} className="option-card checkbox">
							<input
								type="checkbox"
								checked={settings.effects.active.includes(effect.id)}
								onChange={() => toggleEffect(effect.id)}
								disabled={!settings.effects.enabled}
							/>
							<span>
								<strong>{effect.label}</strong>
								<span className="option-meta">{effect.description}</span>
							</span>
						</label>
					))}
				</div>
			</div>
		</div>
	);
}
