import skinsConfig from "../../../config/skins.config.json";
import { useSettings } from "../../../state/settings/settings.context";

export default function SkinsTab() {
	const { settings, setSettings } = useSettings();

	const selectSkin = (side: "x" | "o", id: string) => {
		setSettings((prev) => ({
			...prev,
			skins: {
				...prev.skins,
				[side]: id,
			},
		}));
	};

	const handleUpload = (side: "x" | "o", file?: File) => {
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			const result = typeof reader.result === "string" ? reader.result : "";
			setSettings((prev) => ({
				...prev,
				skins: {
					...prev.skins,
					[side]: "custom",
					custom: {
						...prev.skins.custom,
						[side]: result,
					},
				},
			}));
		};
		reader.readAsDataURL(file);
	};

	return (
		<div className="tab-shell">
			<div className="tab-section">
				<h2>X Skins</h2>
				<div className="option-grid">
					{skinsConfig.xSkins.map((skin) => (
						<button
							key={skin.id}
							type="button"
							className={settings.skins.x === skin.id ? "option-card selected" : "option-card"}
							onClick={() => selectSkin("x", skin.id)}
						>
							<span className="option-title">{skin.label}</span>
							<span className="option-meta">ID: {skin.id}</span>
						</button>
					))}
					<label className={settings.skins.x === "custom" ? "option-card selected" : "option-card"}>
						<span className="option-title">Custom X</span>
						<span className="option-meta">Upload a PNG or SVG</span>
						<input
							className="option-upload"
							type="file"
							accept="image/png,image/svg+xml"
							onChange={(event) => handleUpload("x", event.target.files?.[0])}
						/>
					</label>
				</div>
			</div>

			<div className="tab-section">
				<h2>O Skins</h2>
				<div className="option-grid">
					{skinsConfig.oSkins.map((skin) => (
						<button
							key={skin.id}
							type="button"
							className={settings.skins.o === skin.id ? "option-card selected" : "option-card"}
							onClick={() => selectSkin("o", skin.id)}
						>
							<span className="option-title">{skin.label}</span>
							<span className="option-meta">ID: {skin.id}</span>
						</button>
					))}
					<label className={settings.skins.o === "custom" ? "option-card selected" : "option-card"}>
						<span className="option-title">Custom O</span>
						<span className="option-meta">Upload a PNG or SVG</span>
						<input
							className="option-upload"
							type="file"
							accept="image/png,image/svg+xml"
							onChange={(event) => handleUpload("o", event.target.files?.[0])}
						/>
					</label>
				</div>
			</div>
		</div>
	);
}
