var ControlBaseItemView = require( 'elementor-views/controls/base' ),
	RepeaterRowView = require( 'elementor-views/controls/repeater-row' ),
	ControlRepeaterItemView;

ControlRepeaterItemView = ControlBaseItemView.extend( {
	ui: {
		btnAddRow: '.elementor-repeater-add',
		fieldContainer: '.elementor-repeater-fields'
	},

	events: {
		'click @ui.btnAddRow': 'onButtonAddRowClick',
		'sortstart @ui.fieldContainer': 'onSortStart',
		'sortupdate @ui.fieldContainer': 'onSortUpdate',
		'sortstop @ui.fieldContainer': 'onSortStop'
	},

	childView: RepeaterRowView,

	childViewContainer: '.elementor-repeater-fields',

	templateHelpers: function() {
		return {
			data: _.extend( {}, this.model.toJSON(), { controlValue: [] } )
		};
	},

	childViewOptions: function() {
		return {
			controlFields: this.model.get( 'fields' ),
			titleField: this.model.get( 'title_field' ),
			parentModel: this.elementSettingsModel // For parentConditions in repeaterRow
		};
	},

	initialize: function( options ) {
		ControlBaseItemView.prototype.initialize.apply( this, arguments );

		this.collection = this.elementSettingsModel.get( this.model.get( 'name' ) );

		this.listenTo( this.collection, 'change', this.onRowControlChange );
		this.listenTo( this.collection, 'update', this.onRowUpdate, this );
	},

	addRow: function( data, options ) {
		var id = elementor.helpers.getUniqueID();

		if ( data instanceof Backbone.Model ) {
			data.set( '_id', id );
		} else {
			data._id = id;
		}

		return this.collection.add( data, options );
	},

	editRow: function( rowView ) {
		if ( this.currentEditableChild ) {
			var currentEditable = this.currentEditableChild.getChildViewContainer( this.currentEditableChild );
			currentEditable.removeClass( 'editable' );

			// If the repeater contains TinyMCE editors, fire the `hide` trigger to hide floated toolbars
			currentEditable.find( '.elementor-wp-editor' ).each( function() {
				tinymce.get( this.id ).fire( 'hide' );
			} );
		}

		if ( this.currentEditableChild === rowView ) {
			delete this.currentEditableChild;
			return;
		}

		rowView.getChildViewContainer( rowView ).addClass( 'editable' );

		this.currentEditableChild = rowView;

		this.updateActiveRow();
	},

	toggleMinRowsClass: function() {
		if ( ! this.model.get( 'prevent_empty' ) ) {
			return;
		}

		this.$el.toggleClass( 'elementor-repeater-has-minimum-rows', 1 >= this.collection.length );
	},

	updateActiveRow: function() {
		var activeItemIndex = 0;

		if ( this.currentEditableChild ) {
			activeItemIndex = this.currentEditableChild.itemIndex;
		}

		this.setEditSetting( 'activeItemIndex', activeItemIndex );
	},

	updateChildIndexes: function() {
		this.children.each( _.bind( function( view ) {
			view.updateIndex( this.collection.indexOf( view.model ) + 1 );
		}, this ) );
	},

	onRender: function() {
		ControlBaseItemView.prototype.onRender.apply( this, arguments );

		this.ui.fieldContainer.sortable( { axis: 'y', handle: '.elementor-repeater-row-tools' } );

		this.toggleMinRowsClass();
	},

	onAfterExternalChange: function() {
		this.render();
	},

	onSortStart: function( event, ui ) {
		ui.item.data( 'oldIndex', ui.item.index() );
	},

	onSortStop: function( event, ui ) {
		// Reload TinyMCE editors (if exist), it's a bug that TinyMCE content is missing after stop dragging
		ui.item.find( '.elementor-wp-editor' ).each( function() {
			var editor = tinymce.get( this.id ),
				settings = editor.settings;

			settings.height = Backbone.$( editor.getContainer() ).height();
			tinymce.execCommand( 'mceRemoveEditor', true, this.id );
			tinymce.init( settings );
		} );
	},

	onSortUpdate: function( event, ui ) {
		var oldIndex = ui.item.data( 'oldIndex' ),
			model = this.collection.at( oldIndex ),
			newIndex = ui.item.index();

		this.collection.remove( model );

		this.addRow( model, { at: newIndex } );
	},

	onAddChild: function() {
		this.updateChildIndexes();
		this.updateActiveRow();
	},

	onRemoveChild: function( childView ) {
		if ( childView === this.currentEditableChild ) {
			delete this.currentEditableChild;
		}

		this.updateChildIndexes();
		this.updateActiveRow();
	},

	onRowUpdate: function( collection, event ) {
		var settings = this.elementSettingsModel;

		var collectionCloned = collection.clone();

		if ( event.add ) {
			collectionCloned.remove( event.changes.added[0] );
		} else {
			collectionCloned.add( event.changes.removed[0], { at: event.index } );
		}

		settings.changed = {};

		settings.changed[ this.model.get( 'name' ) ] = collection;

		settings._previousAttributes = {};

		settings._previousAttributes[ this.model.get( 'name' ) ] = collectionCloned;

		settings.trigger( 'change', settings,  settings._pending );

		delete settings.changed;
		delete settings._previousAttributes;

		this.toggleMinRowsClass();
	},

	onRowControlChange: function( model ) {
		var changed = Object.keys( model.changed );

		if ( ! changed.length ) {
			return;
		}

		var collectionCloned = model.collection.clone(),
			modelIndex = collectionCloned.findIndex( model ),
			modelCloned = collectionCloned.find( model ),
			_previousAttributes = modelCloned._previousAttributes;

		// Replace the referenced model
		modelCloned = modelCloned.clone();

		// Save it with old values
		modelCloned.set( _previousAttributes );

		collectionCloned.remove( model );
		collectionCloned.add( modelCloned, { at: modelIndex } );

		var element = this._parent.model,
			settings = element.get( 'settings' );

		settings.changed = {};
		settings.changed[ this.model.get( 'name' ) ] =  model.collection;

		settings._previousAttributes = {};
		settings._previousAttributes[ this.model.get( 'name' ) ] = collectionCloned;

		settings.trigger( 'change', settings );

		delete settings.changed;
		delete settings._previousAttributes;
	},

	onButtonAddRowClick: function() {
		var defaults = {};
		_.each( this.model.get( 'fields' ), function( field ) {
			defaults[ field.name ] = field['default'];
		} );

		var newModel = this.addRow( defaults ),
			newChildView = this.children.findByModel( newModel );

		this.editRow( newChildView );
	},

	onChildviewClickRemove: function( childView ) {
		childView.model.destroy();
	},

	onChildviewClickDuplicate: function( childView ) {
		this.addRow( childView.model.clone(), { at: childView.itemIndex } );
	},

	onChildviewClickEdit: function( childView ) {
		this.editRow( childView );
	}
} );

module.exports = ControlRepeaterItemView;
