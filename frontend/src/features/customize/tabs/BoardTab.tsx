import boardsConfig from "../../../config/boards.config.json";
import { useSettings } from "../../../state/settings/settings.context";

export default function BoardTab() {
	const { settings, setSettings } = useSettings();

	const selectTheme = (id: string) => {
		setSettings((prev) => ({
			...prev,
			board: {
				...prev.board,
				theme: id,
			},
		}));
	};

	return (
		<div className="tab-shell">
			<div className="tab-section">
				<h2>Board Themes</h2>
				<div className="option-grid">
					{boardsConfig.themes.map((theme) => (
						<button
							key={theme.id}
							type="button"
							className={settings.board.theme === theme.id ? "option-card selected" : "option-card"}
							onClick={() => selectTheme(theme.id)}
						>
							<span className="option-title">{theme.label}</span>
							<span className="option-meta">ID: {theme.id}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
