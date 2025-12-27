// OrcaSlicer Gcode Parser
// This parser is based on VERIFIED system profile structures from OrcaSlicer
// Each setting is mapped based on actual system profile files, not assumptions

// MACHINE (Printer) Settings - from fdm_klipper_common.json and fdm_machine_common.json
const MACHINE_KEYS = new Set([
    // Core machine settings
    'gcode_flavor', 'printer_model', 'printer_variant', 'printer_technology',
    'printer_settings_id', 'printer_structure', 'nozzle_type', 'auxiliary_fan',

    // Build volume
    'printable_area', 'printable_height', 'extruder_clearance_radius',
    'extruder_clearance_height_to_rod', 'extruder_clearance_height_to_lid',

    // Machine limits - acceleration
    'machine_max_acceleration_e', 'machine_max_acceleration_extruding',
    'machine_max_acceleration_retracting', 'machine_max_acceleration_travel',
    'machine_max_acceleration_x', 'machine_max_acceleration_y', 'machine_max_acceleration_z',

    // Machine limits - speed
    'machine_max_speed_e', 'machine_max_speed_x', 'machine_max_speed_y', 'machine_max_speed_z',

    // Machine limits - jerk
    'machine_max_jerk_e', 'machine_max_jerk_x', 'machine_max_jerk_y', 'machine_max_jerk_z',
    'machine_max_junction_deviation',

    // Machine limits - rates
    'machine_min_extruding_rate', 'machine_min_travel_rate',

    // Layer heights
    'max_layer_height', 'min_layer_height',

    // Nozzle
    'nozzle_diameter', 'nozzle_volume', 'nozzle_hrc',

    // Retraction (in machine profile)
    'retraction_minimum_travel', 'retract_before_wipe', 'retract_when_changing_layer',
    'retraction_length', 'retract_length_toolchange', 'z_hop', 'z_hop_types',
    'retract_restart_extra', 'retract_restart_extra_toolchange',
    'retraction_speed', 'deretraction_speed', 'retract_lift_above', 'retract_lift_below',
    'retract_lift_enforce', 'retraction_distances_when_cut', 'z_offset',

    // Wipe
    'wipe', 'wipe_distance', 'wipe_speed',

    // Multi-material
    'single_extruder_multi_material', 'extruder_colour', 'extruder_offset',

    // Timing
    'machine_load_filament_time', 'machine_unload_filament_time', 'machine_tool_change_time',

    // Gcode
    'machine_start_gcode', 'machine_end_gcode', 'machine_pause_gcode',
    'layer_change_gcode', 'before_layer_change_gcode', 'change_filament_gcode',
    'change_extrusion_role_gcode', 'template_custom_gcode', 'time_lapse_gcode',

    // Defaults
    'default_filament_profile', 'default_print_profile',

    // Bed
    'bed_exclude_area', 'bed_custom_model', 'bed_custom_texture',

    // Display
    'thumbnails', 'thumbnails_format',

    // Misc
    'silent_mode', 'scan_first_layer', 'manual_filament_change',
    'emit_machine_limits_to_gcode', 'use_firmware_retraction', 'use_relative_e_distances',
    'disable_m73', 'support_multi_bed_types', 'support_air_filtration', 'support_chamber_temp_control',
    'cooling_tube_length', 'cooling_tube_retraction', 'extra_loading_move',
    'parking_pos_retraction', 'long_retractions_when_cut',
    'host_type', 'print_host', 'printhost_authorization_type', 'printhost_ssl_ignore_revoke',
    'head_wrap_detect_zone', 'upward_compatible_machine', 'fan_kickstart', 'fan_speedup_time',
    'high_current_on_filament_swap', 'enable_long_retraction_when_cut',
    'enable_filament_ramming', 'start_end_points'
]);

// FILAMENT Settings - from fdm_filament_common.json and fdm_filament_pla.json
const FILAMENT_KEYS = new Set([
    // Filament identity
    'filament_type', 'filament_vendor', 'filament_settings_id', 'filament_colour',
    'filament_ids', 'filament_is_support',

    // Physical properties
    'filament_diameter', 'filament_density', 'filament_cost',
    'filament_max_volumetric_speed', 'filament_shrink', 'filament_shrinkage_compensation_z',
    'filament_soluble',

    // Temperature - nozzle
    'nozzle_temperature', 'nozzle_temperature_initial_layer',
    'nozzle_temperature_range_low', 'nozzle_temperature_range_high',
    'idle_temperature', 'temperature_vitrification',

    // Temperature - bed (all plate types)
    'cool_plate_temp', 'cool_plate_temp_initial_layer',
    'eng_plate_temp', 'eng_plate_temp_initial_layer',
    'hot_plate_temp', 'hot_plate_temp_initial_layer',
    'textured_plate_temp', 'textured_plate_temp_initial_layer',
    'textured_cool_plate_temp', 'textured_cool_plate_temp_initial_layer',
    'supertack_plate_temp', 'supertack_plate_temp_initial_layer',

    // Chamber
    'chamber_temperature',

    // Cooling/Fans
    'fan_min_speed', 'fan_max_speed', 'fan_cooling_layer_time',
    'overhang_fan_speed', 'overhang_fan_threshold',
    'close_fan_the_first_x_layers', 'full_fan_speed_layer',
    'reduce_fan_stop_start_freq', 'slow_down_for_layer_cooling',
    'slow_down_layer_time', 'slow_down_min_speed',
    'additional_cooling_fan_speed', 'complete_print_exhaust_fan_speed',
    'during_print_exhaust_fan_speed', 'support_material_interface_fan_speed',
    'internal_bridge_fan_speed', 'ironing_fan_speed',

    // Flow
    'filament_flow_ratio',

    // Pressure advance
    'enable_pressure_advance', 'pressure_advance',
    'adaptive_pressure_advance', 'adaptive_pressure_advance_model',
    'adaptive_pressure_advance_overhangs', 'adaptive_pressure_advance_bridges',

    // Filament-specific retraction overrides
    'filament_retraction_minimum_travel', 'filament_retract_before_wipe',
    'filament_retract_when_changing_layer', 'filament_retraction_length',
    'filament_z_hop', 'filament_retract_restart_extra',
    'filament_retraction_speed', 'filament_deretraction_speed',
    'filament_wipe', 'filament_wipe_distance',

    // Multi-material
    'filament_minimal_purge_on_wipe_tower', 'filament_multitool_ramming',
    'filament_multitool_ramming_flow', 'filament_multitool_ramming_volume',
    'flush_multiplier',

    // Filament handling
    'filament_loading_speed', 'filament_loading_speed_start',
    'filament_unloading_speed', 'filament_unloading_speed_start',
    'filament_toolchange_delay', 'filament_cooling_moves',
    'filament_cooling_initial_speed', 'filament_cooling_final_speed',
    'filament_ramming_parameters', 'filament_long_retractions_when_cut',
    'filament_retraction_distances_when_cut',

    // Gcode
    'filament_start_gcode', 'filament_end_gcode',

    // Stamping
    'filament_stamping_distance', 'filament_stamping_loading_speed',

    // Misc
    'filament_notes', 'required_nozzle_HRC', 'bed_type',

    // Activation
    'activate_air_filtration', 'activate_chamber_temp_control',

    // Preheating
    'preheat_steps', 'preheat_time'
]);

// PROCESS (Print) Settings - from fdm_process_common.json
const PROCESS_KEYS = new Set([
    // Print settings identity
    'print_settings_id',

    // Layer
    'layer_height', 'initial_layer_print_height', 'adaptive_layer_height',

    // Line width
    'line_width', 'outer_wall_line_width', 'inner_wall_line_width',
    'initial_layer_line_width', 'sparse_infill_line_width',
    'internal_solid_infill_line_width', 'top_surface_line_width',
    'support_line_width', 'min_bead_width', 'initial_layer_min_bead_width',

    // Walls
    'wall_loops', 'wall_sequence', 'wall_direction', 'wall_filament',
    'wall_transition_angle', 'wall_transition_filter_deviation', 'wall_transition_length',
    'wall_distribution_count', 'wall_generator', 'detect_thin_wall',
    'only_one_wall_first_layer', 'only_one_wall_top', 'extra_perimeters_on_overhangs',
    'precise_outer_wall', 'alternate_extra_wall',

    // Top/Bottom
    'top_shell_layers', 'top_shell_thickness', 'bottom_shell_layers', 'bottom_shell_thickness',
    'ensure_vertical_shell_thickness',

    // Infill
    'sparse_infill_density', 'sparse_infill_pattern', 'sparse_infill_filament',
    'infill_direction', 'infill_anchor', 'infill_anchor_max',
    'infill_combination', 'infill_combination_max_layer_height',
    'infill_wall_overlap', 'top_bottom_infill_wall_overlap',
    'bridge_density', 'bridge_angle', 'internal_bridge_angle',
    'solid_infill_filament', 'solid_infill_direction', 'solid_infill_rotate_template',
    'sparse_infill_rotate_template', 'infill_jerk', 'minimum_sparse_infill_area',
    'infill_lock_depth', 'infill_overhang_angle', 'infill_shift_step',
    'reduce_infill_retraction', 'is_infill_first', 'align_infill_direction_to_model',
    'symmetric_infill_y_axis',

    // Internal solid infill
    'internal_solid_infill_pattern', 'detect_narrow_internal_solid_infill',

    // Top surface
    'top_surface_pattern', 'top_surface_density', 'min_width_top_surface',

    // Bottom surface
    'bottom_surface_pattern', 'bottom_surface_density',

    // Ironing
    'ironing_type', 'ironing_pattern', 'ironing_flow', 'ironing_speed',
    'ironing_spacing', 'ironing_angle', 'ironing_inset',

    // Speeds
    'outer_wall_speed', 'inner_wall_speed', 'sparse_infill_speed',
    'internal_solid_infill_speed', 'top_surface_speed',
    'initial_layer_speed', 'initial_layer_infill_speed', 'initial_layer_travel_speed',
    'travel_speed', 'travel_speed_z',
    'bridge_speed', 'internal_bridge_speed', 'internal_bridge_flow', 'internal_bridge_density',
    'gap_infill_speed', 'small_perimeter_speed', 'small_perimeter_threshold',
    'support_speed', 'support_interface_speed',
    'skirt_speed',

    // Overhang speeds
    'enable_overhang_speed', 'overhang_1_4_speed', 'overhang_2_4_speed',
    'overhang_3_4_speed', 'overhang_4_4_speed',
    'overhang_reverse', 'overhang_reverse_threshold', 'overhang_reverse_internal_only',

    // Acceleration
    'default_acceleration', 'outer_wall_acceleration', 'inner_wall_acceleration',
    'bridge_acceleration', 'sparse_infill_acceleration', 'internal_solid_infill_acceleration',
    'top_surface_acceleration', 'initial_layer_acceleration', 'travel_acceleration',

    // Jerk
    'default_jerk', 'outer_wall_jerk', 'inner_wall_jerk', 'infill_jerk',
    'top_surface_jerk', 'initial_layer_jerk', 'travel_jerk', 'default_junction_deviation',

    // First layer
    'first_layer_print_sequence',

    // Brim
    'brim_width', 'brim_type', 'brim_object_gap',
    'brim_ears_max_angle', 'brim_ears_detection_length',

    // Skirt
    'skirt_loops', 'skirt_distance', 'skirt_height', 'min_skirt_length',
    'skirt_type', 'skirt_start_angle',

    // Raft
    'raft_layers', 'raft_contact_distance', 'raft_expansion',
    'raft_first_layer_density', 'raft_first_layer_expansion',

    // Support
    'enable_support', 'support_type', 'support_style', 'support_threshold_angle',
    'support_on_build_plate_only', 'support_top_z_distance', 'support_bottom_z_distance',
    'support_object_xy_distance', 'support_angle', 'support_interface_top_layers',
    'support_interface_bottom_layers', 'support_interface_pattern', 'support_interface_spacing',
    'support_interface_loop_pattern', 'support_interface_filament',
    'support_base_pattern', 'support_base_pattern_spacing',
    'enforce_support_layers', 'support_filament',
    'support_object_first_layer_gap', 'support_threshold_overlap',
    'support_expansion', 'support_remove_small_overhang',
    'support_critical_regions_only', 'support_interface_not_for_body',

    // Tree support
    'tree_support_angle_slow', 'tree_support_branch_angle', 'tree_support_branch_angle_organic',
    'tree_support_branch_diameter', 'tree_support_branch_diameter_angle',
    'tree_support_branch_diameter_organic', 'tree_support_branch_distance',
    'tree_support_branch_distance_organic', 'tree_support_tip_diameter',
    'tree_support_top_rate', 'tree_support_wall_count', 'tree_support_brim_width',
    'tree_support_auto_brim', 'tree_support_adaptive_layer_height',

    // Support ironing
    'support_ironing', 'support_ironing_pattern', 'support_ironing_flow', 'support_ironing_spacing',

    // Prime tower
    'enable_prime_tower', 'prime_tower_width', 'prime_tower_brim_width', 'prime_volume',
    'purge_in_prime_tower',

    // Wipe tower
    'wipe_tower_x', 'wipe_tower_y', 'wipe_tower_rotation_angle',
    'wipe_tower_bridging', 'wipe_tower_cone_angle', 'wipe_tower_extra_flow',
    'wipe_tower_extra_spacing', 'wipe_tower_no_sparse_layers',
    'wipe_tower_filament', 'wipe_tower_fillet_wall', 'wipe_tower_max_purge_speed',
    'wipe_tower_rib_width', 'wipe_tower_extra_rib_length', 'wipe_tower_wall_type',

    // Flow ratios
    'print_flow_ratio', 'top_solid_infill_flow_ratio', 'bottom_solid_infill_flow_ratio',
    'bridge_flow',

    // Bridge
    'bridge_no_support', 'max_bridge_length', 'thick_bridges', 'thick_internal_bridges',
    'enable_extra_bridge_layer', 'dont_filter_internal_bridges', 'counterbore_hole_bridging',
    'enable_overhang_bridge_fan',

    // Gap fill
    'filter_out_gap_fill', 'gap_fill_target',

    // Seam
    'seam_position', 'seam_gap', 'seam_slope_type', 'seam_slope_conditional',
    'seam_slope_inner_walls', 'seam_slope_entire_loop', 'seam_slope_start_height',
    'seam_slope_steps', 'seam_slope_min_length', 'staggered_inner_seams',
    'has_scarf_joint_seam', 'scarf_joint_flow_ratio', 'scarf_joint_speed',
    'scarf_angle_threshold', 'scarf_overhang_threshold',

    // Travel
    'reduce_crossing_wall', 'max_travel_detour_distance', 'travel_slope',

    // Other
    'interface_shells', 'detect_overhang_wall',
    'filename_format', 'print_sequence', 'print_order',
    'compatible_printers', 'inherits', 'inherits_group',

    // Compensation
    'xy_hole_compensation', 'xy_contour_compensation',
    'elefant_foot_compensation', 'elefant_foot_compensation_layers',

    // Spiral vase
    'spiral_mode', 'spiral_mode_smooth', 'spiral_mode_max_xy_smoothing',
    'spiral_starting_flow_ratio', 'spiral_finishing_flow_ratio',

    // Fuzzy skin
    'fuzzy_skin', 'fuzzy_skin_thickness', 'fuzzy_skin_point_distance',
    'fuzzy_skin_first_layer', 'fuzzy_skin_mode', 'fuzzy_skin_noise_type',
    'fuzzy_skin_scale', 'fuzzy_skin_octaves', 'fuzzy_skin_persistence',

    // Draft shield
    'draft_shield', 'single_loop_draft_shield',

    // Interlocking
    'interlocking_beam', 'interlocking_orientation', 'interlocking_beam_width',
    'interlocking_depth', 'interlocking_beam_layer_count', 'interlocking_boundary_avoidance',

    // MMU
    'mmu_segmented_region_max_width', 'mmu_segmented_region_interlocking_depth',
    'flush_into_infill', 'flush_into_objects', 'flush_into_support',
    'flush_volumes_matrix', 'flush_volumes_vector', 'wiping_volumes_extruders',
    'single_extruder_multi_material_priming',

    // Ooze prevention
    'ooze_prevention', 'standby_temperature_delta',

    // Misc
    'resolution', 'slice_closing_radius', 'slicing_mode',
    'gcode_comments', 'gcode_label_objects', 'gcode_add_line_number',
    'exclude_object', 'make_overhang_printable', 'make_overhang_printable_angle',
    'make_overhang_printable_hole_size', 'precise_z_height',
    'wipe', 'wipe_on_loops', 'wipe_before_external_loop',
    'role_based_wipe_speed', 'dont_slow_down_outer_wall',
    'bed_mesh_min', 'bed_mesh_max', 'bed_mesh_probe_distance',
    'best_object_pos', 'accel_to_decel_enable', 'accel_to_decel_factor',
    'slowdown_for_curled_perimeters', 'independent_support_layer_height',
    'other_layers_print_sequence', 'other_layers_print_sequence_nums',
    'printing_by_object_gcode', 'slow_down_layers',
    'extrusion_rate_smoothing_external_perimeter_only',
    'fill_multiline', 'preferred_orientation', 'min_feature_size', 'min_length_factor',
    'resonance_avoidance', 'max_resonance_avoidance_speed', 'min_resonance_avoidance_speed',
    'small_area_infill_flow_compensation', 'small_area_infill_flow_compensation_model',
    'hole_to_polyhole', 'hole_to_polyhole_threshold', 'hole_to_polyhole_twisted',

    // Skin
    'skeleton_infill_density', 'skeleton_infill_line_width',
    'skin_infill_density', 'skin_infill_depth', 'skin_infill_line_width',

    // Lateral lattice
    'lateral_lattice_angle_1', 'lateral_lattice_angle_2',

    // Extra solid infills
    'extra_solid_infills'
]);

function parseGcode(gcodeText) {
    const lines = gcodeText.split('\n');
    const config = {};
    let inConfigBlock = false;

    for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed === '; CONFIG_BLOCK_START') {
            inConfigBlock = true;
            continue;
        }

        if (trimmed === '; CONFIG_BLOCK_END') {
            break;
        }

        if (inConfigBlock && trimmed.startsWith(';')) {
            // Parse config line: ; key = value
            const match = trimmed.match(/^;\s*([^=]+?)\s*=\s*(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();

                // Remove quotes from value
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }

                config[key] = value;
            }
        }
    }

    return config;
}

function categorizeSettings(config) {
    const machine = { type: "machine", from: "User", is_custom_defined: "0" };
    const filament = { type: "filament", from: "User", is_custom_defined: "0" };
    const process = { type: "process", from: "User", is_custom_defined: "0" };

    // Extract metadata first
    const printerSettingsId = config['printer_settings_id'] || 'Recovered Printer';
    const filamentSettingsId = config['filament_settings_id'] || 'Recovered Filament';
    const printSettingsId = config['print_settings_id'] || 'Recovered Process';

    machine.name = printerSettingsId;
    machine.printer_settings_id = printerSettingsId;

    filament.name = filamentSettingsId;
    filament.filament_settings_id = filamentSettingsId;

    process.name = printSettingsId;
    process.print_settings_id = printSettingsId;

    // Categorize all settings
    for (const [key, value] of Object.entries(config)) {
        // Skip metadata keys we already handled
        if (key === 'printer_settings_id' || key === 'filament_settings_id' || key === 'print_settings_id') {
            continue;
        }

        // Skip non-setting keys
        if (key === 'different_settings_to_system' || key === 'inherits_group' || key === 'inherits' ||
            key === 'curr_bed_type' || key === 'default_bed_type' || key === 'time_cost' ||
            key === 'timelapse_type' || key === 'notes' || key === 'bbl_calib_mark_logo' ||
            key === 'bbl_use_printhost' || key === 'printer_notes' || key === 'bed_shape' ||
            key === 'first_layer_bed_temperature' || key === 'first_layer_temperature' ||
            key === 'first_layer_height' || key === 'version') {
            continue;
        }

        // Convert value to appropriate format
        let convertedValue = convertValue(key, value);

        // Categorize based on verified mappings
        if (MACHINE_KEYS.has(key)) {
            machine[key] = convertedValue;
        } else if (FILAMENT_KEYS.has(key)) {
            filament[key] = convertedValue;
        } else if (PROCESS_KEYS.has(key)) {
            process[key] = convertedValue;
        } else {
            // Unknown key - log it for debugging but add to process as fallback
            console.warn(`Unknown key: ${key} - adding to process profile as fallback`);
            process[key] = convertedValue;
        }
    }

    return { machine, filament, process };
}

function convertValue(key, value) {
    // Keys that should be arrays
    const arrayKeys = new Set([
        // Machine arrays
        'machine_max_acceleration_e', 'machine_max_acceleration_extruding',
        'machine_max_acceleration_retracting', 'machine_max_acceleration_travel',
        'machine_max_acceleration_x', 'machine_max_acceleration_y', 'machine_max_acceleration_z',
        'machine_max_speed_e', 'machine_max_speed_x', 'machine_max_speed_y', 'machine_max_speed_z',
        'machine_max_jerk_e', 'machine_max_jerk_x', 'machine_max_jerk_y', 'machine_max_jerk_z',
        'machine_max_junction_deviation', 'machine_min_extruding_rate', 'machine_min_travel_rate',
        'nozzle_diameter', 'max_layer_height', 'min_layer_height',
        'retraction_minimum_travel', 'retract_before_wipe', 'retract_when_changing_layer',
        'retraction_length', 'retract_length_toolchange', 'z_hop', 'retract_restart_extra',
        'retract_restart_extra_toolchange', 'retraction_speed', 'deretraction_speed',
        'wipe', 'extruder_colour', 'extruder_offset', 'default_filament_profile',
        'retract_lift_above', 'retract_lift_below', 'retract_lift_enforce',
        'retraction_distances_when_cut', 'z_hop_types', 'z_offset',
        'long_retractions_when_cut', 'thumbnails', 'start_end_points',

        // Filament arrays
        'nozzle_temperature', 'nozzle_temperature_initial_layer',
        'nozzle_temperature_range_low', 'nozzle_temperature_range_high',
        'cool_plate_temp', 'cool_plate_temp_initial_layer',
        'eng_plate_temp', 'eng_plate_temp_initial_layer',
        'hot_plate_temp', 'hot_plate_temp_initial_layer',
        'textured_plate_temp', 'textured_plate_temp_initial_layer',
        'textured_cool_plate_temp', 'textured_cool_plate_temp_initial_layer',
        'supertack_plate_temp', 'supertack_plate_temp_initial_layer',
        'fan_min_speed', 'fan_max_speed', 'fan_cooling_layer_time',
        'overhang_fan_speed', 'overhang_fan_threshold',
        'close_fan_the_first_x_layers', 'full_fan_speed_layer',
        'reduce_fan_stop_start_freq', 'slow_down_for_layer_cooling',
        'slow_down_layer_time', 'slow_down_min_speed',
        'filament_flow_ratio', 'enable_pressure_advance', 'pressure_advance',
        'filament_cost', 'filament_density', 'filament_diameter',
        'filament_max_volumetric_speed', 'filament_type', 'filament_vendor',
        'filament_start_gcode', 'filament_end_gcode', 'filament_notes',
        'filament_colour', 'filament_is_support', 'filament_soluble',
        'additional_cooling_fan_speed', 'complete_print_exhaust_fan_speed',
        'during_print_exhaust_fan_speed', 'idle_temperature', 'temperature_vitrification',
        'activate_air_filtration', 'activate_chamber_temp_control',
        'filament_cooling_moves', 'filament_cooling_initial_speed', 'filament_cooling_final_speed',
        'filament_loading_speed', 'filament_loading_speed_start',
        'filament_unloading_speed', 'filament_unloading_speed_start',
        'filament_toolchange_delay', 'filament_minimal_purge_on_wipe_tower',
        'filament_multitool_ramming', 'filament_multitool_ramming_flow',
        'filament_multitool_ramming_volume', 'flush_multiplier',
        'filament_ramming_parameters', 'filament_long_retractions_when_cut',
        'filament_retraction_distances_when_cut', 'required_nozzle_HRC',
        'filament_ids', 'support_material_interface_fan_speed',
        'internal_bridge_fan_speed', 'ironing_fan_speed',

        // Other arrays
        'printable_area', 'bed_exclude_area', 'compatible_printers',
        'upward_compatible_machine', 'head_wrap_detect_zone', 'support_air_filtration',
        'support_chamber_temp_control', 'post_process'
    ]);

    if (arrayKeys.has(key)) {
        // Check if value contains comma-separated values or 'x' separated (for coordinates)
        if (value.includes(',') || value.includes('x')) {
            return value.split(/[,;]/).map(v => v.trim());
        }
        return [value];
    }

    // Return as-is for other keys
    return value;
}

function downloadJSON(data, filename) {
    const jsonString = JSON.stringify(data, null, 4);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Export for use in HTML
if (typeof window !== 'undefined') {
    window.GcodeParser = {
        parseGcode,
        categorizeSettings,
        downloadJSON
    };
}
