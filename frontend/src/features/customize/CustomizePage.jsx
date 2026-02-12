import { useMemo, useState } from "react";
import PreviewBoard from "./preview/PreviewBoard";
import SkinsTab from "./tabs/SkinsTab";
import BoardTab from "./tabs/BoardTab";
import SoundTab from "./tabs/SoundTab";
import EffectsTab from "./tabs/EffectsTab";
import { useSettings } from "../../state/settings/settings.context";
import { saveSettings } from "../../state/settings/settings.storage";
import "../../styles/customize.css";

const TAB_DEFS = [
	{ id: "skins", label: "Skins" },
	{ id: "board", label: "Board" },
	{ id: "sound", label: "Sound" },
	{ id: "effects", label: "Effects" },
];

const TAB_COMPONENTS = {
	skins: SkinsTab,
	board: BoardTab,
	sound: SoundTab,
	effects: EffectsTab,
};

export default function CustomizePage() {
	const [activeTab, setActiveTab] = useState("skins");
	const { resetSettings, settings } = useSettings();

	const ActiveTab = useMemo(() => TAB_COMPONENTS[activeTab], [activeTab]);

	return (
		<section className="customize-page">
			<header className="customize-header">
				<div>
					<p className="customize-eyebrow">Personalize your board</p>
					<h1>Customize</h1>
					<p className="customize-subtitle">
						Dial in skins, board themes, effects, and sound. Changes apply instantly.
					</p>
				</div>
				<div className="customize-actions">
					<button
						className="customize-save"
						type="button"
						onClick={() => {
							saveSettings(settings);
							console.log(JSON.stringify(settings, null, 2));
						}}
					>
						Save settings
					</button>
					<button className="customize-reset" type="button" onClick={resetSettings}>
						Reset to defaults
					</button>
				</div>
			</header>

			<div className="customize-body">
				<nav className="customize-nav">
					{TAB_DEFS.map((tab) => (
						<button
							key={tab.id}
							type="button"
							className={activeTab === tab.id ? "active" : ""}
							onClick={() => setActiveTab(tab.id)}
						>
							{tab.label}
						</button>
					))}
				</nav>

				<div className="customize-content">
					<PreviewBoard />
					<div className="customize-panel">
						<ActiveTab />
					</div>
				</div>
			</div>
		</section>
	);
}
