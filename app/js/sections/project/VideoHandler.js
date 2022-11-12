export default class VideoHandler {
	constructor(container, videoId) {
		this.videoId = videoId;
		this.container = container;
		this.settings = {
			playsinline: 1,
			autoplay: 1,
			controls: 0,
			disablekb: 1,
			enablejsapi: 1,
			loop: 1,
			rel: 0,
		};
		window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
		if (!window.YT) {
			this.loadYTAPI();
		}
	}
	loadYTAPI() {
		const tag = document.createElement("script");
		tag.src = "https://www.youtube.com/iframe_api";
		const firstScriptTag = document.getElementsByTagName("script")[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}
	onYouTubeIframeAPIReady = () => {
		this.player = new window.YT.Player(this.container, {
			height: window.innerHeight,
			width: window.innerWidth,
			videoId: this.videoId,
			playerVars: this.settings,
			events: {
				onReady: this.onVideoReady,
				onStateChange: this.onPlayerStateChange.bind(this),
			},
		});
	};
	onVideoReady(e) {
		e.target.mute();
		e.target.playVideo();
	}
	onPlayerStateChange(e) {
		if (e.data == YT.PlayerState.ENDED) {
			this.player.playVideo();
		}
	}
}
