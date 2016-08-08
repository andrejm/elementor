<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<script type="text/template" id="tmpl-elementor-template-library-header">
	<div id="elementor-template-library-header-logo-area"></div>
	<div id="elementor-template-library-header-menu-area"></div>
	<div id="elementor-template-library-header-items-area">
		<div id="elementor-template-library-header-close-modal" class="elementor-template-library-header-item" title="<?php _e( 'Close', 'elementor' ); ?>">
			<i class="fa fa-times"></i>
		</div>
		<div id="elementor-template-library-header-tools"></div>
	</div>
</script>

<script type="text/template" id="tmpl-elementor-template-library-header-logo">
	<i class="eicon-elementor-square"></i><?php _e( 'Library', 'elementor' ); ?>
</script>

<script type="text/template" id="tmpl-elementor-template-library-header-save">
	<i class="fa fa-floppy-o" title="<?php _e( 'Save', 'elementor' ); ?>"></i>
</script>

<script type="text/template" id="tmpl-elementor-template-library-header-menu">
	<div id="elementor-template-library-menu-pre-made-templates" class="elementor-template-library-menu-item" data-template-type="remote"><?php _e( 'Predesigned Templates', 'elementor' ); ?></div>
	<div id="elementor-template-library-menu-my-templates" class="elementor-template-library-menu-item" data-template-type="local"><?php _e( 'My Templates', 'elementor' ); ?></div>
</script>

<script type="text/template" id="tmpl-elementor-template-library-header-preview">
	<div id="elementor-template-library-header-preview-insert-wrapper" class="elementor-template-library-header-item">
		<button id="elementor-template-library-header-preview-insert" class="elementor-template-library-template-insert elementor-button elementor-button-success">
			<i class="fa fa-download"></i><span class="elementor-button-title"><?php _e( 'Insert', 'elementor' ); ?></span>
		</button>
	</div>
</script>

<script type="text/template" id="tmpl-elementor-template-library-header-back">
	<i class="eicon-"></i><span><?php _e( 'Back To library', 'elementor' ); ?></span>
</script>

<script type="text/template" id="tmpl-elementor-template-library-loading">
	<i class="fa fa-spin fa-refresh"></i>
</script>

<script type="text/template" id="tmpl-elementor-template-library-template-remote">
	<div class="elementor-template-library-template-body">
		<div class="elementor-template-library-template-screenshot" style="background-image: url(<%- thumbnail %>);"></div>
		<div class="elementor-template-library-template-controls">
			<div class="elementor-template-library-template-preview">
				<i class="fa fa-search-plus"></i>
			</div>
			<button class="elementor-template-library-template-insert elementor-button elementor-button-success">
				<i class="fa fa-download"></i>
				<?php _e( 'Insert', 'elementor' ); ?>
			</button>
		</div>
	</div>
	<div class="elementor-template-library-template-name"><%= title %></div>
</script>

<script type="text/template" id="tmpl-elementor-template-library-template-local">
	<div class="elementor-template-library-template-icon">
		<i class="fa fa-<%- 'page' === kind ? 'file-text-o' : 'columns' %>"></i>
	</div>
	<div class="elementor-template-library-template-name"><%= title %></div>
	<div class="elementor-template-library-template-kind"><%= elementor.translate( kind ) %></div>
	<div class="elementor-template-library-template-controls">
		<div class="elementor-template-library-template-preview">
			<i class="fa fa-pencil"></i><span class="elementor-template-library-template-control-title"><?php echo __( 'Preview', 'elementor' ); ?></span>
		</div>
		<div class="elementor-template-library-template-delete">
			<i class="fa fa-trash-o"></i><span class="elementor-template-library-template-control-title"><?php echo __( 'Delete', 'elementor' ); ?></span>
		</div>
		<div class="elementor-template-library-template-export">
			<a href="<%- export_link %>">
				<i class="fa fa-sign-out"></i><span class="elementor-template-library-template-control-title"><?php echo __( 'Export', 'elementor' ); ?></span>
			</a>
		</div>
		<button class="elementor-template-library-template-insert elementor-button elementor-button-success">
			<i class="fa fa-download"></i><span class="elementor-button-title"><?php _e( 'Insert', 'elementor' ); ?></span>
		</button>
	</div>
</script>

<script type="text/template" id="tmpl-elementor-template-library-save-template">
	<div id="elementor-template-library-save-template-title"><%= elementor.translate( 'save_your_template', [ elementor.translate( sectionID ? 'section' : 'page' ) ] ) %></div>
	<div id="elementor-template-library-save-template-excerpt"><?php _e( 'Save and reuse your page designs with the Elementor Library', 'elementor' ); ?></div>
	<form id="elementor-template-library-save-template-form">
		<input id="elementor-template-library-save-template-name" name="title" placeholder="<?php _e( 'Enter Template Name', 'elementor' ); ?>">
		<input id="elementor-template-library-save-template-submit" class="elementor-button elementor-button-success" type="submit" value="<?php _e( 'Save', 'elementor' ); ?>">
	</form>
	<div id="elementor-template-library-save-template-footer"><?php _e( 'Learn how to use the Elementor Library in our tutorial section.', 'elementor' ); ?></div>
</script>

<script type="text/template" id="tmpl-elementor-template-library-import">
	<form id="elementor-template-library-import-form">
		<input type="file" name="file" />
		<input type="submit">
	</form>
</script>
