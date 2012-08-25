
define([
	'gamegrid/model/game-collection'
], function(GameCollection) {

	var ControlsView = Backbone.View.extend({
		events: {
			'click .add-profile': 'onAddProfile'
		},

		initialize: function() {
			var self = this;

			this.inputContainer = this.$('.input-container');
			this.inputEl        = $('.add-profile-input', this.inputContainer);

			this.progressContainer = this.$('.progress-container');
			this.neutralBar        = $('.bar-neutral', this.progressContainer);
			this.successBar        = $('.bar-success', this.progressContainer);
			this.errorBar          = $('.bar-error', this.progressContainer);
			this.progressCaptionEl = $('.progress-caption', this.progressContainer);

			// DEBUG
			//this.model.games.on('all', function(){ console.log('games event', arguments); });

			this.model.games.on('addgames:begin', this.addGamesBegin, this);
			this.model.games.on('addgames:end', this.addGamesEnd, this);
			this.model.games.on('addgames:tick', this.addGamesTick, this);
			this.model.on('addprofile:error', this.endProgress, this);
		},

		onAddProfile: function() {
			var match = this.inputEl.val().match(/[a-zA-Z0-9]+$/);
			if (match.length === 1) {
				this.startProgress({
					neutralPercent: 100,
					message: 'Loading profile...'
				});
				this.model.addProfile(match[0]);
			}
		},

		startProgress: function(progress) {
			var self = this;
			this.updateProgress(progress);
			this.inputEl.attr('disabled', true);
			this.inputContainer.fadeOut('medium', function() {
				self.progressContainer.fadeIn('medium');
			})
		},

		endProgress: function(progress) {
			var self = this;
			this.updateProgress(progress);
			this.inputEl.val('').removeAttr('disabled');
			this.progressContainer.fadeOut('medium', function(){
				self.inputContainer.fadeIn('medium');
			})
		},

		addGamesBegin: function(status) {
			console.log('addGamesBegin');
			this.updateProgress({
				message: 'Loading games: 0/' + status.loadedCount()
			});
		},

		addGamesEnd: function(status) {
			this.endProgress({
				message: 'Loading games: done!'
			});
		},

		addGamesTick: function(status) {
			this.updateProgress({
				message: 'Loading games: ' + status.loadedCount() + '/' + status.totalCount(),
				successPercent: status.successPercent(),
				errorPercent:   status.errorPercent()
			});
		},

		updateProgress: function(progress) {
			this.progressCaptionEl.html(progress.message || '');
			this.neutralBar.css('width', (progress.neutralPercent || 0) + '%');
			this.successBar.css('width', (progress.successPercent || 0) + '%');
			this.errorBar.css('width', (progress.errorPercent || 0) + '%');
		},
	});

	return ControlsView;
});
